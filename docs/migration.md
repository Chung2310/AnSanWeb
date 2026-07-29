# Hướng dẫn chạy Script chuyển đổi dữ liệu từ Firebase sang MongoDB & Cloudinary

Tài liệu này hướng dẫn chi tiết các bước để cài đặt thư viện, cấu hình môi trường và thực thi script di trú dữ liệu cho dự án AnSanWeb.

---

## 📋 Bước 1: Cài đặt các gói phụ thuộc (Dependencies)

Để chạy được script di trú, bạn cần cài đặt thêm các thư viện kết nối tới MongoDB, Cloudinary và Firebase Admin:

Chạy lệnh sau tại thư mục gốc `AnSanWeb`:
```bash
npm install mongodb cloudinary firebase-admin dotenv
npm install -D tsx
```

*Lưu ý: `tsx` dùng để thực thi trực tiếp các tệp TypeScript (.ts) mà không cần biên dịch trước.*

---

## 🔑 Bước 2: Tải file chứng thực Firebase Service Account

Script di trú cần quyền Admin để đọc dữ liệu từ Firestore và tải ảnh từ Storage:

1. Truy cập vào **Firebase Console** (https://console.firebase.google.com).
2. Chọn dự án **AnSanWeb** của bạn.
3. Nhấp vào biểu tượng bánh răng ⚙️ ở góc trên bên trái ➔ **Project settings** (Cài đặt dự án).
4. Chọn tab **Service accounts** (Tài khoản dịch vụ).
5. Nhấp vào nút **Generate new private key** (Tạo khóa riêng mới) ở phía dưới cùng.
6. Xác nhận tạo và tải tệp JSON về máy.
7. Đổi tên tệp vừa tải về thành `service-account.json` và di chuyển tệp này vào thư mục gốc của dự án `AnSanWeb`.

---

## ⚙️ Bước 3: Cấu hình biến môi trường (`.env`)

Mở tệp `.env` của bạn ở thư mục gốc dự án và bổ sung các biến cấu hình sau (hoặc thay thế bằng thông tin thực tế của bạn):

```env
# MongoDB config
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DB_NAME="ansanweb"

# Cloudinary config (Lấy từ Dashboard của Cloudinary)
CLOUDINARY_CLOUD_NAME="tên_cloud_của_bạn"
CLOUDINARY_API_KEY="api_key_của_bạn"
CLOUDINARY_API_SECRET="api_secret_của_bạn"

# Tên Storage Bucket của Firebase (Ví dụ: ansanweb.appspot.com)
FIREBASE_STORAGE_BUCKET="tên_storage_bucket_của_bạn"
```

---

## 🚀 Bước 4: Chạy script di trú dữ liệu

Sau khi đã hoàn thành các bước thiết lập trên, bạn thực hiện chạy lệnh sau trong terminal để tiến hành di trú:

```bash
npx tsx scripts/migrate-to-mongodb.ts
```

### 📈 Quy trình hoạt động của Script:
1. Kết nối đồng thời tới MongoDB, Firebase Firestore, Firebase Storage và Cloudinary.
2. Tải toàn bộ tài liệu từ các collection Firestore về.
3. Nếu tài liệu chứa trường ảnh có liên kết đến Firebase Storage:
   - Tự động download file nhị phân ảnh về buffer bộ nhớ.
   - Upload buffer ảnh này lên Cloudinary trong thư mục `ansanweb/`.
   - Cập nhật liên kết ảnh mới từ Cloudinary (`secure_url`).
4. Lưu tài liệu đã cập nhật và chuẩn hóa vào MongoDB tương ứng.

Mọi tiến trình, thành công hay lỗi của từng bản ghi sẽ được ghi nhận chi tiết trên màn hình terminal của bạn.
