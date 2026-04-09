'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { FullProduct } from '@/lib/types';
import { useCategories } from './use-categories';
import slugify from 'slugify';

export function useImportProducts() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const { categories } = useCategories();

  const importProducts = async (file: File) => {
    setIsImporting(true);
    toast({ title: 'Bắt đầu nhập sản phẩm...', description: 'Quá trình này có thể mất vài phút.' });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!categories) {
          throw new Error("Danh mục chưa được tải. Vui lòng thử lại.");
      }

      // Create ONE unified map from any category/tag name to its unique ID.
      const unifiedNameToIdMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

      const batch = writeBatch(firestore);
      const productsCollection = collection(firestore, 'products');
      let processedCount = 0;
      let skippedCount = 0;

      for (const row of jsonData) {
        const nameVN = row['Tên sản phẩm'];
        const price = row['Giá'];

        if (!nameVN || price == null || isNaN(Number(price))) {
          console.warn('Skipping row due to missing name or price:', row);
          skippedCount++;
          continue;
        }

        const productId = row['ID'] ? String(row['ID']) : null;
        const productRef = productId ? doc(productsCollection, productId) : doc(productsCollection);

        // 1. Collect all potential category/tag names from all relevant columns
        const allNamesFromSheet: string[] = [];
        const columnsToProcess = ['Danh mục chung', 'Loại rượu', 'Quốc gia', 'Vùng', 'Giống nho', 'Loại quà tặng', 'Thương hiệu'];
        columnsToProcess.forEach(colName => {
          if (row[colName]) {
            const names = row[colName].toString().split(',').map((s: string) => s.trim());
            allNamesFromSheet.push(...names);
          }
        });

        // 2. Map all collected names to their unique IDs using the single unified map.
        const allTags = [...new Set(
            allNamesFromSheet
                .map(name => unifiedNameToIdMap.get(name.toLowerCase()))
                .filter((id): id is string => !!id) // Filter out any names that didn't map to an ID
        )];
        

        const allAttributeLabels = Object.keys(row).filter(key => 
            !['ID', 'Tên sản phẩm', 'Đường dẫn (slug)', 'Giá', 'Mô tả giá', 'Giá phụ', 'Mô tả giá phụ', 'Trạng thái', 'Nổi bật', 'Giá tốt', 'Sản phẩm mới', 'Lựa chọn tốt nhất', 'Danh mục chung', 'Loại rượu', 'Quốc gia', 'Vùng', 'Giống nho', 'Mô tả ngắn', 'Mô tả chi tiết', 'URL Ảnh bìa', 'URL Ảnh chi tiết', 'Ngày tạo', 'Loại quà tặng', 'Thương hiệu'].includes(key)
        );

        const productData: any = {
          nameVN: nameVN,
          slug: row['Đường dẫn (slug)'] || slugify(nameVN, { lower: true, strict: true, locale: 'vi' }),
          price: Number(price),
          isFeatured: row['Nổi bật'] === 'Có',
          isGoodPrice: row['Giá tốt'] === 'Có',
          isNew: row['Sản phẩm mới'] === 'Có',
          bestChoice: row['Lựa chọn tốt nhất'] === 'Có',
          status: row['Trạng thái'] === 'Đã xuất bản' ? 'published' : 'draft',
          tags: allTags,
          updatedAt: serverTimestamp(),
        };

        // --- Handle Optional Fields ---
        if (row['Mô tả giá']) productData.priceDescription = row['Mô tả giá'];
        if (row['Mô tả ngắn']) productData.shortDescription = row['Mô tả ngắn'];
        if (row['Mô tả chi tiết']) productData.description = row['Mô tả chi tiết'];

        const secondaryPrice = row['Giá phụ'];
        if (secondaryPrice != null && !isNaN(Number(secondaryPrice))) {
            productData.secondaryPrice = Number(secondaryPrice);
        }

        if (row['Mô tả giá phụ']) {
            productData.secondaryPriceDescription = row['Mô tả giá phụ'];
        }
        
        productData.image = row['URL Ảnh bìa'] ? { url: row['URL Ảnh bìa'], path: '' } : null;
        productData.detailImages = row['URL Ảnh chi tiết'] ? String(row['URL Ảnh chi tiết']).split(',').map((url: string) => ({ url: url.trim(), path: '' })) : [];
        
        productData.attributes = allAttributeLabels
          .map(label => ({ label, value: row[label] }))
          .filter(attr => attr.value != null && String(attr.value).trim() !== '');

        if (!productId) {
            productData.id = productRef.id;
            productData.createdAt = serverTimestamp();
        } else {
            // If ID is provided, we still need to ensure it has a createdAt if it's a new doc
            // But we use merge: true so we don't want to overwrite if it exists.
            // A simple way is to check if row has 'Ngày tạo'
            if (row['Ngày tạo']) {
                try {
                    productData.createdAt = new Date(row['Ngày tạo']);
                } catch (e) {}
            } else {
                // We fallback to updatedAt for display if createdAt is missing
                // productData.createdAt remains undefined to avoid overwriting existing docs
            }
        }

        batch.set(productRef, productData, { merge: true });
        processedCount++;
      }

      await batch.commit();

      toast({
        title: 'Nhập hoàn tất!',
        description: `${processedCount} sản phẩm đã được xử lý. ${skippedCount} sản phẩm bị bỏ qua do thiếu dữ liệu.`,
      });

    } catch (error) {
      console.error("Error importing products:", error);
      toast({
        variant: 'destructive',
        title: 'Lỗi nhập dữ liệu',
        description: (error as Error).message || 'Không thể xử lý tệp Excel. Vui lòng kiểm tra lại định dạng.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return { importProducts, isImporting };
}
