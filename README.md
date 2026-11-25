# 🏰 Heritage Tours - Tour Cánh Cung Di Sản Miền Trung 5N4Đ

> **Website Thương Mại & Hệ Thống Quản Trị Trung Tâm (Admin Portal)**  
> Chuẩn 4 Sao Quốc Tế · Tích hợp Trợ Lý AI · Thanh Toán VietQR · Sao Lưu Firebase Cloud · Triển Khai Vercel

---

## 🌟 Tổng Quan Dự Án

Trang web giới thiệu và thương mại hóa sản phẩm du lịch chủ lực: **Tour Cánh Cung Di Sản Miền Trung: TP.HCM – Huế – Đà Nẵng – Hội An – Bà Nà Hills (5 Ngày 4 Đêm)**.

### ✨ Các Tính Năng Nổi Bật:
1. **Landing Page Chuyển Đổi Cao (Conversion Architecture):**
   - 5 khối chuyển đổi chuẩn quốc tế: Hero $\to$ Social Proof $\to$ Features & Itinerary $\to$ Pricing $\to$ CTA / FAQ.
   - Thư viện 13 hình ảnh di sản chụp thực tế độ nét cao.
   - Trợ lý AI Tour Concierge thông minh 24/7 (phản hồi < 1 giây, tính giá đoàn theo cơ cấu gia đình).
   - Bộ đổi giá VAT 10% linh hoạt theo thời gian thực.
2. **Cổng Quản Trị Trung Tâm (Admin Portal - `admin.html`):**
   - Đăng nhập bảo mật dành riêng cho **Main Admin** (`admin` / `Heritage@2026`).
   - Phân quyền RBAC: Main Admin có quyền **Tạo mới** và **Xóa** các tài khoản phụ (**Sub-Admin**).
   - Giám sát lưu lượng truy cập (Pageviews, Visitors, biểu đồ giờ cao điểm, thiết bị).
   - Quản lý phiếu đặt chỗ (Booking Leads): cập nhật trạng thái, tìm kiếm, xuất file Excel/CSV.
3. **Thanh Toán & Đặt Cọc VietQR Siêu Tốc (`#payment-qr`):**
   - Quét mã Napas247 Vietcombank tự động cập nhật số tiền cọc (50% hoặc 100%).
   - Nút 1-click sao chép Số tài khoản, Chủ tài khoản, Cú pháp chuyển khoản.
4. **Hệ Thống Kênh Liên Hệ Đa Nền Tảng:**
   - Cụm nút nổi Zalo, WhatsApp, Facebook Fanpage, Hotline `1900 888 668`.
   - Nút chia sẻ Web Share API & Popup Modal (Facebook, Zalo, WhatsApp, Copy Link).
5. **Sao Lưu Đám Mây Firebase (Firebase Cloud Backup):**
   - Tự động sao lưu booking online lên Firebase Realtime Database.
   - 1-Click Backup & Restore toàn bộ hệ thống từ Admin Portal.

---

## 🚀 Hướng Dẫn Triển Khai (Deployment Guide)

### 1. ☁️ Cấu Hình Sao Lưu Dữ Liệu Qua Google Firebase

Dự án đã được cấu hình và tích hợp sẵn thông tin Project Firebase chính thức của bạn trong `firebase-config.js`:
* **Project ID:** `hanhtrinhdisan-8d83a`
* **Auth Domain:** `hanhtrinhdisan-8d83a.firebaseapp.com`
* **Storage Bucket:** `hanhtrinhdisan-8d83a.firebasestorage.app`
* **Google Analytics:** `G-30XD4PW0QM`
* **Cơ chế sao lưu đa tầng (Dual-Engine):** Hỗ trợ tự động Cloud Firestore & Realtime Database, kèm bộ đệm an toàn Offline LocalStorage khi mất kết nối mạng.

> **Lưu ý kích hoạt trên Firebase Console:**
> 1. Truy cập [Firebase Console](https://console.firebase.google.com/project/hanhtrinhdisan-8d83a/overview).
> 2. Chọn **Build** $\to$ **Firestore Database** (hoặc **Realtime Database**) $\to$ bấm **Create Database**.
> 3. Chọn tab **Rules** và thiết lập quyền đọc/ghi cho ứng dụng web (ví dụ `allow read, write: if true;` trong giai đoạn chạy thử nghiệm).

---

### 2. 🐙 Đưa Mã Nguồn Lên GitHub

Mã nguồn đã được khởi tạo sẵn git và file cấu hình `.gitignore`, `package.json`.

Để đẩy code lên tài khoản GitHub của bạn, chạy các lệnh sau trong Terminal:

```bash
# 1. Di chuyển vào thư mục dự án (nếu chưa ở trong thư mục)
cd "/Users/tranngan/Desktop/Tour ĐÀ Nẵn"

# 2. Tạo repository mới trên github.com (ví dụ: tour-heritage-vietnam)
# 3. Liên kết và đẩy code lên GitHub:
git remote add origin https://github.com/<tai-khoan-github-cua-ban>/tour-heritage-vietnam.git
git branch -M main
git push -u origin main
```

---

### 3. ⚡ Triển Khai Lên Vercel (Hosting Website Online)

Dự án đã có sẵn file cấu hình `vercel.json` tối ưu URL sạch (`/` $\to$ `index.html`, `/admin` $\to$ `admin.html`) và thiết lập Cache hình ảnh tốc độ cao.

#### Cách 1: Triển khai 1-Click qua Giao Diện Vercel (Khuyên Dùng):
1. Đăng nhập vào [Vercel](https://vercel.com/) (đăng nhập bằng tài khoản GitHub).
2. Bấm **Add New...** $\to$ chọn **Project**.
3. Chọn repository `tour-heritage-vietnam` vừa đẩy lên GitHub và bấm **Import**.
4. Tại mục **Framework Preset**, chọn **Other** (hoặc để mặc định).
5. Bấm **Deploy**. Trong vòng 30 giây, website của bạn sẽ hoạt động trực tuyến với tên miền miễn phí dạng:  
   👉 `https://tour-heritage-vietnam.vercel.app`
6. (Tùy chọn) Bạn có thể gắn tên miền riêng của doanh nghiệp (ví dụ: `heritagetours.vn`) tại mục **Settings** $\to$ **Domains**.

#### Cách 2: Triển khai qua Vercel CLI (Dòng Lệnh):
```bash
# Cài đặt Vercel CLI (nếu có Node.js):
npm i -g vercel

# Đăng nhập và deploy:
vercel
```

---

## 🔐 Thông Tin Đăng Nhập Hệ Thống Quản Trị (Admin Portal)

Truy cập: `/admin` hoặc `admin.html`

* **👑 Main Administrator (Toàn quyền tối cao):**
  * Tên đăng nhập: `admin`
  * Mật khẩu: `Heritage@2026`
  * *Đặc quyền: Tạo và xóa tài khoản Sub-Admin, toàn quyền giám sát hệ thống.*

* **Tài khoản Sub-Admin tạo sẵn:**
  * **Điều Hành Tour:** `trang.dieuhanh` / `Tour4Sao@2026`
  * **Sales & CSKH:** `minh.sales` / `SalesHeritage@2026`
  * **Kế Toán & VietQR:** `ketoan.heritage` / `KeToan@2026`
  * **HDV Trưởng Tuyến:** `hdv.nam` / `HuongDanVien@2026`

---

## 📁 Cấu Trúc Thư Mục

```text
├── index.html            # Landing Page thương mại 5 khối chuẩn quốc tế
├── admin.html            # Cổng Quản trị Trung tâm (Quản lý Booking, Truy cập, Sub-admin)
├── firebase-config.js    # Module sao lưu & đồng bộ thời gian thực Firebase Cloud
├── vercel.json           # Cấu hình định tuyến và tối ưu hóa Vercel
├── package.json          # Thông tin dự án
├── .gitignore            # Danh sách loại trừ khi đẩy lên Git
├── images/               # Thư mục 13 hình ảnh di sản độ nét cao
└── README.md             # Tài liệu hướng dẫn sử dụng và triển khai
```

© 2026 Heritage Tours Vietnam. Mọi quyền được bảo lưu.
