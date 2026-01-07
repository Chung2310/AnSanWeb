'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import Logo from '@/components/logo';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@ansan.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login, user } = useAuthStore();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!auth) {
        setError('Dịch vụ xác thực không khả dụng.');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        login(userCredential.user);
        router.push('/admin');
    } catch (error: any) {
        if (error.code === AuthErrorCodes.USER_NOT_FOUND || error.code === 'auth/invalid-credential') {
            // If user not found, try to create it. This is for easy setup.
            // In a real production app, you might want a separate sign-up flow.
            try {
                const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                login(newUserCredential.user);
                router.push('/admin');
            } catch (createError: any) {
                setError(createError.message || 'Không thể tạo tài khoản.');
            }
        } else {
            setError(error.message || 'Email hoặc mật khẩu không hợp lệ.');
        }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để truy cập trang quản trị.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
