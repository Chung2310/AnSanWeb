import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AdminHeader from '@/components/admin/admin-header';
import SidebarNav from '@/components/admin/sidebar-nav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Sets the defaultOpen state of the sidebar based on a cookie.
  // const layout = cookies().get("react-resizable-panels:layout");
  // const collapsed = cookies().get("react-resizable-panels:collapsed");

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <Sidebar>
            <SidebarNav />
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 p-4 pt-6 sm:p-6">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
