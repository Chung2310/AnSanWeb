'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import SidebarNav from '@/components/admin/sidebar-nav';
import AdminHeader from '@/components/admin/admin-header';
import { Toaster } from '@/components/ui/toaster';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, _isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // We only want to redirect if hydration is complete and the auth state is definitive.
    if (_isHydrated && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, _isHydrated, router]);

  // Show a loading UI until hydration is complete and we have a definitive auth state.
  if (!_isHydrated || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
      </div>
    );
  }
  
  // If we are hydrated and not loading, but there's still no user,
  // it means the redirect is in progress. We can render nothing or a minimal
  // placeholder to avoid a flash of the admin layout.
  if(!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <AdminHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
