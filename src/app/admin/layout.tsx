'use client';

import type { ReactNode } from 'react';
import AdminHeader from '@/components/admin/admin-header';
import SidebarNav from '@/components/admin/sidebar-nav';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user data has loaded and there is no user, redirect to login
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // While checking user auth, show a loading screen
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is logged in, show the admin layout
  if (user) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SidebarNav />
            <div className="flex flex-col">
                <AdminHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
  }

  // Return null or a fallback while redirecting
  return null;
}


export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
