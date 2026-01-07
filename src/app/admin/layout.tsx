'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import Sidebar from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, isAuthLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Lottie animationData={loadingAnimation} className="h-32 w-32" />
        <p className="mt-4 text-muted-foreground">Đang tải và xác thực...</p>
      </div>
    );
  }
  
  if (!user) {
    // This is a temporary state while the router is redirecting.
    // You can show a minimal loader or nothing at all.
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Lottie animationData={loadingAnimation} className="h-32 w-32" />
        <p className="mt-4 text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <h1 className="mt-4 text-2xl font-bold">Truy cập bị từ chối</h1>
        <p className="text-muted-foreground">
          Bạn không có quyền truy cập vào trang này.
        </p>
        <Button onClick={() => router.push('/')} className="mt-6">
          Quay về trang chủ
        </Button>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-secondary p-8">{children}</main>
    </div>
  );
}
