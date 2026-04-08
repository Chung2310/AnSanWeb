
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
import { useEffect } from 'react';

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
  const settingsRef = useMemoFirebase(() => doc(firestore, 'settings', 'general'), [firestore]);
  const { data: settings, isLoading } = useDoc(settingsRef);

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
    }
  }, [settings, form]);

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

              <FormField
                control={form.control}
                name="popup.imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Hình ảnh Popup</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>Nhập link ảnh (Cloudinary, Firebase Storage, v.v.)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormDescription>Thời gian trễ trước khi hiện popup (1000ms = 1 giây).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
