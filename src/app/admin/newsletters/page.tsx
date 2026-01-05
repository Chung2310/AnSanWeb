'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  generatePersonalizedNewsletterContent,
  type PersonalizedNewsletterOutput,
} from '@/ai/flows/personalized-newsletter-content';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  userPreferences: z.string().min(10, 'Sở thích người dùng phải có ít nhất 10 ký tự.'),
  availableWines: z.string().min(10, 'Danh sách rượu vang phải có ít nhất 10 ký tự.'),
  includeWineRecommendation: z.boolean().default(true),
});

export default function NewslettersPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<PersonalizedNewsletterOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPreferences: 'Thích rượu vang đỏ đậm, đặc biệt là từ vùng Bordeaux, Pháp. Gần đây đã xem các chai Château Margaux và Penfolds Grange.',
      availableWines: 'Château Margaux 2015, Domaine de la Romanée-Conti Montrachet 2018, Penfolds Grange Bin 95 2017, Krug Grande Cuvée Brut Champagne.',
      includeWineRecommendation: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generatePersonalizedNewsletterContent(values);
      setGeneratedContent(result);
      toast({
        title: 'Tạo nội dung thành công!',
        description: 'Nội dung bản tin đã được AI tạo ra.',
      });
    } catch (error) {
      console.error('Error generating newsletter content:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: 'Đã có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot /> Tạo Bản Tin Cá Nhân Hóa
            </CardTitle>
            <CardDescription>
              Sử dụng AI để tạo nội dung bản tin độc đáo dựa trên sở thích của người dùng và các sản phẩm hiện có.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sở thích & Lịch sử Người dùng</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả sở thích của người dùng, các sản phẩm đã xem..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableWines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rượu Vang Hiện Có</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Liệt kê các loại rượu vang nổi bật muốn giới thiệu..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeWineRecommendation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Thêm gợi ý rượu vang</FormLabel>
                        <FormDescription>
                          AI sẽ tự động gợi ý một chai vang phù hợp.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Đang tạo...' : 'Tạo Nội Dung'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle>Nội Dung Bản Tin</CardTitle>
            <CardDescription>Đây là kết quả do AI tạo ra. Bạn có thể sao chép và chỉnh sửa trước khi gửi.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-10 text-center h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg font-medium">AI đang sáng tạo...</p>
                <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát.</p>
              </div>
            )}
            {!isLoading && !generatedContent && (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-10 text-center h-[400px]">
                <Mail className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Nội dung sẽ xuất hiện ở đây</p>
                <p className="text-sm text-muted-foreground">Điền thông tin và nhấn "Tạo Nội Dung" để bắt đầu.</p>
              </div>
            )}
            {generatedContent && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Tiêu đề:</h3>
                  <div className="rounded-md border bg-muted p-3">
                    <p className="font-medium">{generatedContent.subject}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Nội dung:</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-muted p-4 whitespace-pre-wrap">
                    {generatedContent.content}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
