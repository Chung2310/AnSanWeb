'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter, redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Logo from '@/components/logo';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
});

export default function LoginPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@ansan.co',
      password: 'ansan@123',
    },
  });

  const { isSubmitting } = form.formState;
  
  useEffect(() => {
    if (!isUserLoading && user) {
        redirect('/admin');
    }
  }, [user, isUserLoading]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Đăng nhập thành công!',
        description: 'Chào mừng trở lại, quản trị viên.',
      });
      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Đăng nhập thất bại',
        description: error.message.includes('auth/invalid-credential') 
          ? 'Email hoặc mật khẩu không chính xác.'
          : 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      });
      console.error('Login error:', error);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Đăng Nhập Admin</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để truy cập bảng điều khiển.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng Nhập
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
