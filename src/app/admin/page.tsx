import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Package, Users, Mail } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Bảng điều khiển</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234,567,000₫</div>
            <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>
        <Link href="/admin/products">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">Tổng số sản phẩm trong kho</p>
            </CardContent>
            </Card>
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng đăng ký</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+128</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>
        <Link href="/admin/contacts">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tin nhắn liên hệ</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+5</div>
                <p className="text-xs text-muted-foreground">Các tin nhắn chưa đọc</p>
            </CardContent>
            </Card>
        </Link>
      </div>

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Các hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
                {/* TODO: Add a list of recent activities */}
                <p className="text-muted-foreground">Chưa có hoạt động nào gần đây.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
