'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
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

      // 1. Create a map for case-insensitive lookup
      const nameToIdMap = new Map<string, string>();
      const idToCategoryMap = new Map<string, Category>();
      
      categories.forEach(c => {
        nameToIdMap.set(c.name.toLowerCase().trim(), c.id);
        idToCategoryMap.set(c.id, c);
      });

      // 2. Helper to get all ancestor IDs (to ensure Main Category ID is included)
      const getAllAncestorIds = (categoryId: string): string[] => {
        const ancestors: string[] = [];
        let current = idToCategoryMap.get(categoryId);
        while (current && current.parentId) {
          ancestors.push(current.parentId);
          current = idToCategoryMap.get(current.parentId);
        }
        return ancestors;
      };

      const batch = writeBatch(firestore);
      const productsCollection = collection(firestore, 'products');
      let processedCount = 0;
      let skippedCount = 0;

      for (const row of jsonData) {
        const nameVN = row['Tên sản phẩm'] || row['Tên'];
        const priceStr = row['Giá'] || row['Giá bán'];

        if (!nameVN) {
          console.warn('Skipping row due to missing name:', row);
          skippedCount++;
          continue;
        }

        // Parse price: extract only numbers if string contains units like "/chai"
        let price = 0;
        if (priceStr != null) {
            const sanitizedPrice = String(priceStr).replace(/[^0-9]/g, '');
            price = parseInt(sanitizedPrice) || 0;
        }

        const productId = row['ID'] ? String(row['ID']) : null;
        const productRef = productId ? doc(productsCollection, productId) : doc(productsCollection);

        // 3. Process categories and map to IDs + ancestors
        const categoryColumnNames = [
            'Danh mục', 'Phân loại', 'Danh mục / Phân loại', 
            'Danh mục chung', 'Loại rượu', 'Quốc gia', 'Quốc Gia',
            'Vùng', 'Giống nho', 'Loại quà tặng', 'Thương hiệu'
        ];
        
        const foundTagIds = new Set<string>();
        const foundCategoryNames: string[] = [];

        categoryColumnNames.forEach(col => {
          if (row[col]) {
            const names = String(row[col]).split(',').map(s => s.trim()).filter(Boolean);
            names.forEach(name => {
              const id = nameToIdMap.get(name.toLowerCase());
              if (id) {
                foundTagIds.add(id);
                if (!foundCategoryNames.includes(name)) foundCategoryNames.push(name);
                
                // Add all ancestors to tags so the "Main Category" dropdown works correctly
                getAllAncestorIds(id).forEach(ancestorId => foundTagIds.add(ancestorId));
              }
            });
          }
        });

        const allTags = Array.from(foundTagIds);

        // 4. Prepare base data
        const productData: any = {
          nameVN: nameVN,
          slug: row['Đường dẫn (slug)'] || row['Slug'] || slugify(nameVN, { lower: true, strict: true, locale: 'vi' }),
          price: price,
          isFeatured: row['Nổi bật'] === 'Có' || row['Nổi bật'] === true,
          isGoodPrice: row['Giá tốt'] === 'Có' || row['Giá tốt'] === true,
          isNew: row['Sản phẩm mới'] === 'Có' || row['Sản phẩm mới'] === true || row['isNew'] === true,
          bestChoice: row['Lựa chọn tốt nhất'] === 'Có' || row['Lựa chọn tốt nhất'] === true || row['bestChoice'] === true,
          status: (row['Trạng thái'] === 'Đã xuất bản' || row['status'] === 'published') ? 'published' : 'draft',
          tags: allTags,
          updatedAt: serverTimestamp(),
        };

        // 5. Handle attributes - specifically adding the combined "Danh mục / Phân loại"
        const excludeKeys = [
            'ID', 'Tên sản phẩm', 'Tên', 'Đường dẫn (slug)', 'Slug', 'Giá', 'Giá bán',
            'Mô tả giá', 'Giá phụ', 'Giá gốc', 'Mô tả giá phụ', 'Trạng thái', 'status',
            'Nổi bật', 'Giá tốt', 'Sản phẩm mới', 'isNew', 'Lựa chọn tốt nhất', 'bestChoice',
            'Mô tả ngắn', 'Mô tả chi tiết', 'URL Ảnh bìa', 'URL Ảnh chi tiết', 'Ngày tạo', 'createdAt'
        ];

        // Also exclude all columns we used for category mapping to avoid duplication
        const allExcludeKeys = [...excludeKeys, ...categoryColumnNames];

        const attributes: { label: string, value: string }[] = [];

        // Add the special "Danh mục / Phân loại" attribute if we found categories
        if (foundCategoryNames.length > 0) {
            attributes.push({
                label: 'Danh mục / Phân loại',
                value: foundCategoryNames.join(', ')
            });
        }

        // Add other columns as generic attributes
        Object.keys(row).forEach(key => {
            if (!allExcludeKeys.includes(key) && row[key] != null && String(row[key]).trim() !== '') {
                attributes.push({ label: key, value: String(row[key]) });
            }
        });

        productData.attributes = attributes;

        // 6. Handle optional/meta fields
        if (row['Mô tả giá']) productData.priceDescription = row['Mô tả giá'];
        if (row['Mô tả ngắn']) productData.shortDescription = row['Mô tả ngắn'];
        if (row['Mô tả chi tiết']) productData.description = row['Mô tả chi tiết'];

        const secondaryPriceVal = row['Giá phụ'] || row['Giá gốc'];
        if (secondaryPriceVal != null) {
            const sanitized = String(secondaryPriceVal).replace(/[^0-9]/g, '');
            productData.secondaryPrice = parseInt(sanitized) || null;
        }

        if (row['Mô tả giá phụ']) productData.secondaryPriceDescription = row['Mô tả giá phụ'];
        
        productData.image = (row['URL Ảnh bìa'] || row['Ảnh']) ? { url: String(row['URL Ảnh bìa'] || row['Ảnh']), path: '' } : null;
        productData.detailImages = row['URL Ảnh chi tiết'] ? String(row['URL Ảnh chi tiết']).split(',').map((url: string) => ({ url: url.trim(), path: '' })) : [];

        if (!productId) {
            productData.id = productRef.id;
            productData.createdAt = serverTimestamp();
        } else if (row['Ngày tạo'] || row['createdAt']) {
            try {
                productData.createdAt = new Date(row['Ngày tạo'] || row['createdAt']);
            } catch (e) {}
        }

        batch.set(productRef, productData, { merge: true });
        processedCount++;
      }

      await batch.commit();

      toast({
        title: 'Nhập hoàn tất!',
        description: `${processedCount} sản phẩm đã được xử lý thành công.`,
      });

    } catch (error) {
      console.error("Error importing products:", error);
      toast({
        variant: 'destructive',
        title: 'Lỗi nhập dữ liệu',
        description: (error as Error).message || 'Không thể xử lý tệp Excel.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return { importProducts, isImporting };
}
