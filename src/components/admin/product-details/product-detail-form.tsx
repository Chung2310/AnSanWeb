'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProductDetailDialog } from '@/components/admin/product-details/use-product-detail-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import FileUploader from '@/components/admin/products/file-uploader';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  description: z.string().optional(),
  detailImage: z.object({
      url: z.string(),
      path: z.string(),
      imageHint: z.string().optional(),
  }).nullable(),
  tastingNotes: z.object({
      brand: z.string().optional(),
      chillFiltered: z.string().optional(),
      region: z.string().optional(),
      caskType: z.string().optional(),
      nose: z.string().min(1, "Bắt buộc"),
      palate: z.string().min(1, "Bắt buộc"),
      finish: z.string().min(1, "Bắt buộc"),
      color: z.string().min(1, "Bắt buộc"),
  }).nullable(),
  // productDetails will be handled as a raw JSON string for simplicity
});

export function ProductDetailForm() {
  const { isOpen, onClose, defaultValues, id } = useProductDetailDialog();
  const firestore = useFirestore();
  const [uploadingStatus, setUploadingStatus] = useState({ detailImage: false });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      detailImage: null,
      tastingNotes: null,
    }
  });
  
  const { isSubmitting } = form.formState;

  const handleUploadStateChange = useCallback((uploading: boolean, fieldName: 'detailImage') => {
    setUploadingStatus(prev => ({ ...prev, [fieldName]: uploading }));
  }, []);

  const isAnyUploading = Object.values(uploadingStatus).some(status => status);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        description: defaultValues?.description || '',
        detailImage: defaultValues?.detailImage || null,
        tastingNotes: defaultValues?.tastingNotes || {
          brand: '',
          chillFiltered: '',
          region: '',
          caskType: '',
          nose: '',
          palate: '',
          finish: '',
          color: '',
        },
      });
    }
  }, [defaultValues, isOpen, form.reset]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore || !id) return;

    const detailDocRef = doc(firestore, 'product_details', id);
    
    const detailData = {
        id,
        description: values.description || '',
        detailImage: values.detailImage,
        tastingNotes: values.tastingNotes,
        // For now, we keep productDetails as it is, will add form fields later
        productDetails: defaultValues?.productDetails || null,
    };

    await setDocumentNonBlocking(detailDocRef, detailData, { merge: true });
    
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Chi tiết Sản phẩm</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin chi tiết cho sản phẩm "{defaultValues?.nameVN}".
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
              <FileUploader
                  fieldName="detailImage"
                  label="Ảnh trang chi tiết"
                  defaultUrl={form.getValues('detailImage.url')}
                  onUploadStateChange={(isUploading) => handleUploadStateChange(isUploading, 'detailImage')}
              />
              <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Mô tả ngắn</FormLabel>
                      <FormControl>
                          <Textarea
                          {...field}
                          placeholder="Mô tả ngắn gọn về sản phẩm cho trang chi tiết..."
                          className='min-h-[100px]'
                          />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
              />

              <div className="rounded-md border p-4">
                  <h3 className="mb-4 font-semibold">Ghi chú nếm thử (Tasting Notes)</h3>
                  <div className="grid grid-cols-2 gap-4">
                       <FormField control={form.control} name="tastingNotes.brand" render={({ field }) => (<FormItem><FormLabel>Thương hiệu</FormLabel><FormControl><Input {...field} placeholder="VD: The Macallan" /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="tastingNotes.region" render={({ field }) => (<FormItem><FormLabel>Vùng</FormLabel><FormControl><Input {...field} placeholder="VD: Speyside" /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="tastingNotes.caskType" render={({ field }) => (<FormItem><FormLabel>Loại thùng ủ</FormLabel><FormControl><Input {...field} placeholder="VD: Sherry Oak" /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="tastingNotes.chillFiltered" render={({ field }) => (<FormItem><FormLabel>Lọc lạnh</FormLabel><FormControl><Input {...field} placeholder="VD: Không" /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="tastingNotes.color" render={({ field }) => (<FormItem><FormLabel>Màu sắc</FormLabel><FormControl><Input {...field} placeholder="VD: Vàng hổ phách đậm" /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="tastingNotes.nose" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Mùi hương (Nose)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="tastingNotes.palate" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Hương vị (Palate)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="tastingNotes.finish" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Hậu vị (Finish)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
              </div>
              <div className="text-muted-foreground text-sm">
                <p><strong>Lưu ý:</strong> Mục "Thông tin cấu trúc" (Product Details) sẽ được triển khai sau. Hiện tại, bạn có thể quản lý qua Firestore.</p>
              </div>

              <DialogFooter className="pt-6">
                  <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting || isAnyUploading}>
                  {(isSubmitting || isAnyUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu Thay Đổi
                  </Button>
              </DialogFooter>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
