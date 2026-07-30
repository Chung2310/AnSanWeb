'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import { useEffect, useState } from 'react';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Progress } from '@/components/ui/progress';
import { Upload, X, ImageIcon, LayoutTemplate } from 'lucide-react';
import Image from 'next/image';

const bannerSchema = z.object({
  imageUrl: z.string().url('URL hình ảnh không hợp lệ'),
  label: z.string().min(1, 'Nhãn nút là bắt buộc'),
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().optional(),
  href: z.string().min(1, 'Liên kết là bắt buộc'),
});

const formSchema = z.object({
  heroBanners: z.array(bannerSchema).length(5, 'Cần chính xác 5 banner'),
});

type BannersFormValues = z.infer<typeof formSchema>;

export default function BannersAdminPage() {
  const { toast } = useToast();
  const { startUpload, progress, isUploading } = useUploadStorage();
  const [isLoading, setIsLoading] = useState(true);
  const [existingSetting, setExistingSetting] = useState<any>(null);

  const defaultBanners = [
    { label: 'Master of Wine', title: 'Master of Wine', href: '/danh-muc/ruou-vang', description: 'Hơn 2000 sản phẩm nhập khẩu chính hãng\n\nGiao hàng toàn quốc\n\nHotline: 0933.333.313', imageUrl: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1770450627/Banner_5_ef3phq.png' },
    { label: 'Grande Alberone', title: 'Grande Alberone', href: '/search?q=Grande%20Alberone', description: 'Grande Alberone – Tinh hoa vang Ý từ vùng Puglia, được Rượu vang An San độc quyền phân phối tại Việt Nam.', imageUrl: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1768896911/Baner_r%C6%B0%E1%BB%A3u_web-01_1_nvownd.jpg' },
    { label: 'RƯỢU VANG CHÍNH HÃNG', title: 'RƯỢU VANG CHÍNH HÃNG', href: '/danh-muc/ruou-vang', description: 'Rượu vang nhập khẩu chính hãng\n\n Tinh tuyển từ các vùng vang danh tiếng thế giới, phân phối bởi Rượu vang An San', imageUrl: 'https://res.cloudinary.com/dqhgnzmtk/image/upload/v1768883382/R%C6%B0%E1%BB%A3u_bestchoise-01_d9hgxw.jpg' },
    { label: 'QUÀ TẾT', title: 'QUÀ TẾT', href: '/danh-muc/bo-qua-tang', description: 'Quà Tết An San – nơi mỗi món quà không chỉ trao gửi giá trị, mà còn thể hiện sự trân trọng, tinh tế và đẳng cấp của người tặng', imageUrl: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1768897093/Baner_r%C6%B0%E1%BB%A3u_web-02_1_v8fyad.jpg' },
    { label: 'RƯỢU MẠNH', title: 'RƯỢU MẠNH', href: '/danh-muc/ruou-manh', description: 'Những dòng rượu mạnh được An San tuyển chọn – dành cho khoảnh khắc nâng ly của người bản lĩnh, hiểu giá trị và trân trọng đẳng cấp', imageUrl: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1768897560/Baner_r%C6%B0%E1%BB%A3u_web-03_1_jpj1jv.jpg' },
  ];

  const form = useForm<BannersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroBanners: defaultBanners,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'heroBanners',
  });

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get('/settings/general')
      .then((res) => {
        if (res.data) {
          setExistingSetting(res.data.value || {});
          if (res.data.value?.heroBanners && res.data.value.heroBanners.length === 5) {
            form.reset({ heroBanners: res.data.value.heroBanners });
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [form]);

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await startUpload(file, 'settings/banners');
        if (result) {
          form.setValue(`heroBanners.${index}.imageUrl`, result.url, { shouldDirty: true });
          toast({ title: 'Tải ảnh thành công', description: `Banner ${index + 1} đã được cập nhật ảnh.` });
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Lỗi tải ảnh', description: 'Không thể tải ảnh lên storage.' });
      }
    }
  };

  const onSubmit = async (values: BannersFormValues) => {
    try {
      const mergedValue = {
        ...existingSetting,
        heroBanners: values.heroBanners,
      };

      await apiClient.post('/settings', {
        key: 'general',
        value: mergedValue,
      });

      toast({ title: 'Thành công', description: 'Đã cập nhật danh sách banner đầu trang.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể lưu cài đặt.' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Lottie animationData={loadingAnimation} className="h-32 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Quản lý Banner Đầu Trang</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Banner {index + 1}</span>
                    <span className="text-xs font-normal text-muted-foreground">Vị trí: {index + 1}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image Section */}
                    <div className="space-y-4">
                      <FormLabel>Hình ảnh</FormLabel>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={form.watch(`heroBanners.${index}.imageUrl`) || 'https://picsum.photos/seed/banner/800/450'}
                          alt={`Banner preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                           <label htmlFor={`banner-upload-${index}`} className="cursor-pointer bg-white/90 text-black px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Thay đổi ảnh
                           </label>
                        </div>
                        <input
                          id={`banner-upload-${index}`}
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          disabled={isUploading}
                        />
                      </div>
                      {isUploading && progress > 0 && <Progress value={progress} className="h-1" />}
                      <FormField
                        control={form.control}
                        name={`heroBanners.${index}.imageUrl`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="URL ảnh..." className="pl-9 text-xs" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Text Section */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`heroBanners.${index}.label`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nhãn hiển thị (Nút/Tab)</FormLabel>
                              <FormControl><Input placeholder="Vd: GIÁ TỐT" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`heroBanners.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tiêu đề chính</FormLabel>
                              <FormControl><Input placeholder="Vd: Ưu đãi đặc biệt" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`heroBanners.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả chi tiết</FormLabel>
                            <FormControl><Textarea rows={3} placeholder="Nội dung giới thiệu ngắn..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`heroBanners.${index}.href`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Đường dẫn liên kết (Link)</FormLabel>
                            <FormControl><Input placeholder="Vd: /danh-muc/ruou-vang" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="sticky bottom-8 flex justify-center pt-4">
            <Button type="submit" size="lg" className="w-full max-w-md shadow-2xl" disabled={form.formState.isSubmitting || isUploading}>
              {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu tất cả banner'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
