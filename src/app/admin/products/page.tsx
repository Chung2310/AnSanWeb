
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
        <Package className="h-8 w-8" />
        Quản lý Sản phẩm
      </h1>
       <Card>
          <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>Xem và quản lý tất cả sản phẩm của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-muted-foreground">Tính năng đang được phát triển. Dữ liệu sản phẩm sẽ được hiển thị ở đây.</p>
          </CardContent>
      </Card>
    </div>
  );
}
