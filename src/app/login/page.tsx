'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
});

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@ansan.com',
      password: '123456',
    },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      toast({
        title: 'Đăng nhập thành công!',
      });
      router.push('/admin');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' && values.email === 'admin@ansan.com') {
        try {
          await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
          toast({
            title: 'Tài khoản admin đã được tạo. Đăng nhập thành công.',
          });
          router.push('/admin'); 
        } catch (creationError: any) {
          toast({
            variant: 'destructive',
            title: 'Lỗi tạo tài khoản admin',
            description: creationError.message,
          });
        }
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast({
          variant: 'destructive',
          title: 'Đăng nhập thất bại',
          description: 'Sai mật khẩu hoặc tài khoản. Vui lòng thử lại.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi đăng nhập',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập Admin</CardTitle>
          <CardDescription>
            Chỉ dành cho quản trị viên.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@ansan.com"
                        {...field}
                        type="email"
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
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
