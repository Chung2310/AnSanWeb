
'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useFirebase } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import slugify from 'slugify';

export function useImportCategories() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const importCategories = async (file: File) => {
    setIsImporting(true);
    toast({ title: 'Bắt đầu nhập danh mục...', description: 'Quá trình này có thể mất vài phút.' });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const batch = writeBatch(firestore);
      const categoriesCollection = collection(firestore, 'categories');
      let processedCount = 0;
      let skippedCount = 0;

      for (const row of jsonData) {
        const name = row['name'];
        if (!name) {
          console.warn('Skipping row due to missing name:', row);
          skippedCount++;
          continue;
        }

        const categoryId = row['id'] ? String(row['id']) : doc(categoriesCollection).id;
        const categoryRef = doc(categoriesCollection, categoryId);

        const categoryData: any = {
            id: categoryId,
            name: name,
            slug: row['slug'] || slugify(name, { lower: true, strict: true, locale: 'vi' }),
            parentId: row['parentId'] || null,
            description: row['description'] || '',
            tags: row['tags'] ? String(row['tags']).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        };
        
        batch.set(categoryRef, categoryData, { merge: true });
        processedCount++;
      }

      await batch.commit();

      toast({
        title: 'Nhập hoàn tất!',
        description: `${processedCount} danh mục đã được xử lý. ${skippedCount} danh mục bị bỏ qua.`,
      });

    } catch (error) {
      console.error("Error importing categories:", error);
      toast({
        variant: 'destructive',
        title: 'Lỗi nhập dữ liệu',
        description: (error as Error).message || 'Không thể xử lý tệp Excel. Vui lòng kiểm tra lại định dạng.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return { importCategories, isImporting };
}
