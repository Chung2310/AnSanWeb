'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import { useEffect, useState } from 'react';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Progress } from '@/components/ui/progress';
import { Upload, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  popup: z.object({
    enabled: z.boolean(),
    imageUrl: z.string().url('URL hình ảnh không hợp lệ'),
    targetUrl: z.string().optional(),
    delay: z.number().min(0),
  }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsAdminPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { startUpload, progress, isUploading } = useUploadStorage();
  const settingsRef = useMemoFirebase(() => doc(firestore, 'settings', 'general'), [firestore]);
  const { data: settings, isLoading } = useDoc(settingsRef);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      popup: {
        enabled: false,
        imageUrl: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1774236454/Kh%C3%A1m_ph%C3%A1_axn4xt.jpg',
        targetUrl: '/danh-muc/bo-qua-tang',
        delay: 2000,
      },
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings as any);
      if (settings.popup?.imageUrl) {
        setImagePreview(settings.popup.imageUrl);
      }
    }
  }, [settings, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await startUpload(file, 'settings/popups');
        if (result) {
          form.setValue('popup.imageUrl', result.url, { shouldDirty: true });
          setImagePreview(result.url);
          toast({ title: 'Tải ảnh thành công', description: 'Ảnh đã được lưu vào bộ nhớ.' });
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Lỗi tải ảnh', description: 'Không thể tải ảnh lên storage.' });
      }
    }
  };

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      await setDoc(settingsRef, {
        ...values,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: 'Thành công', description: 'Đã cập nhật cài đặt ứng dụng.' });
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
      <h1 className="text-3xl font-bold">Cài đặt ứng dụng</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình Popup Trang chủ</CardTitle>
              <CardDescription>Điều chỉnh hình ảnh và liên kết của popup hiển thị khi người dùng vào trang chủ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="popup.enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Hiển thị Popup</FormLabel>
                      <FormDescription>Bật hoặc tắt hiển thị popup quảng cáo.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Hình ảnh Popup</FormLabel>
                
                {imagePreview && (
                  <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Popup preview"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => {
                        setImagePreview(null);
                        form.setValue('popup.imageUrl', '');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <label htmlFor="popup-image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Đang tải...' : 'Tải ảnh lên từ máy tính'}
                      </div>
                      <input
                        id="popup-image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <span className="text-xs text-muted-foreground italic">Hoặc nhập URL trực tiếp bên dưới</span>
                  </div>

                  {isUploading && (
                    <div className="space-y-1">
                      <Progress value={progress} className="h-1" />
                      <p className="text-[10px] text-muted-foreground text-right">{Math.round(progress)}%</p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="popup.imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                              placeholder="https://..." 
                              className="pl-9"
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                setImagePreview(e.target.value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>Đường dẫn hình ảnh (Cloudinary, Firebase, v.v.)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="popup.targetUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liên kết đích</FormLabel>
                    <FormControl>
                      <Input placeholder="/danh-muc/..." {...field} />
                    </FormControl>
                    <FormDescription>Đường dẫn khi người dùng nhấn vào popup.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="popup.delay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian chờ (ms)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormDescription>Thời gian trễ trước khi hiện popup (1000ms = 1 giây).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
            {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
