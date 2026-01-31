'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { FullProduct } from '@/lib/types';
import { useCategories } from './use-categories';
import { wineMegaMenuData, spiritsMegaMenuData } from '@/lib/mega-menu-data';
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

      const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
      const tagLabelToIdMap = new Map<string, string>();
      Object.values(wineMegaMenuData).flat().forEach(item => tagLabelToIdMap.set(item.label.toLowerCase(), item.category_id));
      Object.values(spiritsMegaMenuData).flat().forEach(item => tagLabelToIdMap.set(item.label.toLowerCase(), item.category_id));

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

        const tagsFromName = (columnName: string): string[] => {
            return row[columnName]?.toString().split(',').map((s: string) => s.trim().toLowerCase()).map((name: string) => tagLabelToIdMap.get(name)).filter(Boolean) || [];
        }
        
        const generalCategories: string[] = row['Danh mục chung']?.toString().split(',').map((s: string) => s.trim().toLowerCase()).map((name: string) => categoryMap.get(name)).filter(Boolean) || [];
        const wineLoai = tagsFromName('Loại rượu');
        const wineQuocGia = tagsFromName('Quốc gia');
        const wineVung = tagsFromName('Vùng');
        const wineGiongNho = tagsFromName('Giống nho');
        
        const allTags = [...new Set([...generalCategories, ...wineLoai, ...wineQuocGia, ...wineVung, ...wineGiongNho])];

        const allAttributeLabels = Object.keys(row).filter(key => 
            !['ID', 'Tên sản phẩm', 'Đường dẫn (slug)', 'Giá', 'Mô tả giá', 'Giá phụ', 'Mô tả giá phụ', 'Trạng thái', 'Nổi bật', 'Sản phẩm mới', 'Lựa chọn tốt nhất', 'Danh mục chung', 'Loại rượu', 'Quốc gia', 'Vùng', 'Giống nho', 'Mô tả ngắn', 'URL Ảnh bìa', 'URL Ảnh chi tiết', 'Ngày tạo'].includes(key)
        );

        const productData: any = {
          nameVN: nameVN,
          slug: row['Đường dẫn (slug)'] || slugify(nameVN, { lower: true, strict: true, locale: 'vi' }),
          price: Number(price),
          isFeatured: row['Nổi bật'] === 'Có',
          isNew: row['Sản phẩm mới'] === 'Có',
          bestChoice: row['Lựa chọn tốt nhất'] === 'Có',
          status: row['Trạng thái'] === 'Đã xuất bản' ? 'published' : 'draft',
          tags: allTags,
          updatedAt: serverTimestamp(),
        };

        // --- Handle Optional Fields ---
        if (row['Mô tả giá']) productData.priceDescription = row['Mô tả giá'];
        if (row['Mô tả ngắn']) productData.shortDescription = row['Mô tả ngắn'];

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
