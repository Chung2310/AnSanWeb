
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function AdminContactsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
        <MessageSquare className="h-8 w-8" />
        Quản lý Tin nhắn
      </h1>
       <Card>
          <CardHeader>
              <CardTitle>Tin nhắn đã nhận</CardTitle>
              <CardDescription>Xem và quản lý các tin nhắn được gửi từ trang liên hệ.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-muted-foreground">Tính năng đang được phát triển. Dữ liệu tin nhắn sẽ được hiển thị ở đây.</p>
          </CardContent>
      </Card>
    </div>
  );
}
