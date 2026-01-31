'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { FullProduct } from '@/lib/types';
import { useCategories } from './use-categories';
import { wineMegaMenuData, spiritsMegaMenuData } from '@/lib/mega-menu-data';

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

      for (const row of jsonData) {
        const productId = row['ID'] ? String(row['ID']) : null;
        const productRef = productId ? doc(productsCollection, productId) : doc(productsCollection);

        const tagsFromName = (columnName: string): string[] => {
            return row[columnName]?.split(',').map((s: string) => s.trim().toLowerCase()).map((name: string) => tagLabelToIdMap.get(name)).filter(Boolean) || [];
        }
        
        const generalCategories: string[] = row['Danh mục chung']?.split(',').map((s: string) => s.trim().toLowerCase()).map((name: string) => categoryMap.get(name)).filter(Boolean) || [];
        const wineLoai = tagsFromName('Loại rượu');
        const wineQuocGia = tagsFromName('Quốc gia');
        const wineVung = tagsFromName('Vùng');
        const wineGiongNho = tagsFromName('Giống nho');
        
        const allTags = [...new Set([...generalCategories, ...wineLoai, ...wineQuocGia, ...wineVung, ...wineGiongNho])];

        const allAttributeLabels = Object.keys(row).filter(key => 
            !['ID', 'Tên sản phẩm', 'Đường dẫn (slug)', 'Giá', 'Mô tả giá', 'Giá phụ', 'Mô tả giá phụ', 'Trạng thái', 'Nổi bật', 'Sản phẩm mới', 'Lựa chọn tốt nhất', 'Danh mục chung', 'Loại rượu', 'Quốc gia', 'Vùng', 'Giống nho', 'Mô tả ngắn', 'URL Ảnh bìa', 'URL Ảnh chi tiết', 'Ngày tạo'].includes(key)
        );

        const productData: Partial<FullProduct> = {
          nameVN: row['Tên sản phẩm'],
          slug: row['Đường dẫn (slug)'],
          price: Number(row['Giá']),
          priceDescription: row['Mô tả giá'],
          secondaryPrice: row['Giá phụ'] ? Number(row['Giá phụ']) : undefined,
          secondaryPriceDescription: row['Mô tả giá phụ'],
          status: row['Trạng thái'] === 'Đã xuất bản' ? 'published' : 'draft',
          isFeatured: row['Nổi bật'] === 'Có',
          isNew: row['Sản phẩm mới'] === 'Có',
          bestChoice: row['Lựa chọn tốt nhất'] === 'Có',
          shortDescription: row['Mô tả ngắn'],
          image: row['URL Ảnh bìa'] ? { url: row['URL Ảnh bìa'], path: '' } : null,
          detailImages: row['URL Ảnh chi tiết']?.split(',').map((url: string) => ({ url: url.trim(), path: '' })) || [],
          tags: allTags,
          attributes: allAttributeLabels.map(label => ({ label, value: row[label] })).filter(attr => attr.value),
          updatedAt: serverTimestamp(),
        };

        if (!productId) {
            productData.id = productRef.id;
            productData.createdAt = serverTimestamp();
        }

        batch.set(productRef, productData, { merge: true });
      }

      await batch.commit();

      toast({
        title: 'Nhập thành công!',
        description: `${jsonData.length} sản phẩm đã được xử lý.`,
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
