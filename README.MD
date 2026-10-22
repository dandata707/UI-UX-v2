# Đà Lạt Ride — Thuê xe máy Đà Lạt

Prototype giao diện web mô phỏng ứng dụng thuê xe máy trên điện thoại, xây dựng bằng React và TypeScript. Dự án cho phép trải nghiệm trọn luồng tìm xe, đặt xe, ghi nhận lúc nhận xe, đối chiếu khi trả xe và xem lịch sử đơn thuê.

![Banner Đà Lạt Ride](src/assets/dalat-ride-banner.png)

## Chức năng chính

- **Trang chủ và shop:** tìm xe theo chuyến đi hoặc mở danh sách nhiều mẫu xe của từng cửa hàng gần bạn.
- **Tìm xe:** chọn ngày giờ nhận/trả, loại xe, số lượng, địa điểm nhận và hình thức giao xe; kết quả lọc theo loại xe đã chọn.
- **Danh sách xe:** xem từng mẫu xe và tổng chi phí dự kiến; sắp xếp theo đề xuất, giá, đánh giá hoặc khoảng cách.
- **Chi tiết và đặt xe:** xem thông tin xe, giá thuê, nhập thông tin người thuê, thay đổi số lượng tối đa 20 xe và xác nhận đơn mẫu.
- **Tài khoản và bàn giao:** xem đơn đã đặt/đang thuê/đã trả, tải năm ảnh lúc nhận xe, đối chiếu lúc trả và mở chi tiết đơn đã trả.
- **So sánh:** chọn tối đa 3 phương án, xem bảng so sánh 2 hoặc 3 xe; lựa chọn được đặt lại khi bắt đầu tìm kiếm mới.
- **Đã lưu:** lưu một bảng so sánh, mở lại, chia sẻ hoặc xóa trong phiên sử dụng.
- **Chia sẻ:** hiển thị bảng chia sẻ cho từng xe hoặc bảng so sánh, hỗ trợ sao chép đường dẫn mẫu.
- **Điều hướng demo:** chuyển nhanh giữa các màn hình bằng thanh chọn phía trên khung điện thoại.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Giao diện | React 19, TypeScript |
| Công cụ phát triển và build | Vite 8 |
| Kiểu dáng | Tailwind CSS 4, CSS variables |
| Biểu tượng | Lucide React |
| Dữ liệu demo | Dữ liệu mẫu trong `src/data/mockData.ts` |

## Chạy trên máy

### Yêu cầu

- Node.js `20.19+` thuộc nhánh 20, hoặc `22.12+` trở lên, theo yêu cầu của Vite đang dùng.
- npm và Git.

### Cài đặt

```bash
git clone https://github.com/dandata707/UI-UX-v2.git
cd UI-UX-v2
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Nếu cổng đã được sử dụng, xem địa chỉ thực tế Vite in trong terminal.

Giao diện hiện tại dùng dữ liệu mẫu và không cần API key để chạy. File `.env.example` chứa các biến mẫu từ AI Studio; chỉ cấu hình khi phát triển thêm tính năng cần đến chúng.

### Các lệnh thường dùng

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Chạy máy chủ phát triển, mặc định tại cổng 3000 |
| `npm run lint` | Kiểm tra kiểu TypeScript bằng `tsc --noEmit` |
| `npm run build` | Tạo bản build trong thư mục `dist/` |
| `npm run preview` | Xem thử bản build đã tạo |

Để kiểm tra bản build trên máy:

```bash
npm run lint
npm run build
npm run preview
```

Mở địa chỉ được in trong terminal. Có thể triển khai nội dung thư mục `dist/` lên dịch vụ lưu trữ website tĩnh.

## Trải nghiệm luồng demo

1. Tại **Trang chủ**, chọn một shop gần bạn hoặc mở **Tìm xe** để đặt điều kiện thuê.
2. Trong **Danh sách xe**, xem giá dự kiến, mở **Chi tiết** và chọn **Đặt xe**.
3. Xác nhận đơn, vào **Tài khoản → Đã đặt** để xem chi tiết và nhận xe.
4. Tải đủ năm ảnh xe lúc nhận, xác nhận nhận xe, rồi vào **Đang thuê** để đối chiếu và trả xe.
5. Trong **Đã trả**, chọn **Xem thông tin** để xem thời gian đặt, nhận, trả và ảnh lúc nhận.
6. Có thể chọn 2–3 xe để so sánh, lưu bảng và thử tính năng chia sẻ trong phiên sử dụng.

Thanh **Màn hình** phía trên cho phép chuyển nhanh đến từng màn hình để xem giao diện mà không cần đi hết luồng.

## Cấu trúc thư mục

```text
src/
├── assets/                  # Banner và ảnh xe
├── components/
│   ├── screens/             # Trang chủ, tìm xe, đặt xe, tài khoản, nhận/trả xe, so sánh và chia sẻ
│   ├── BottomNav.tsx        # Thanh điều hướng dưới
│   ├── PhoneFrame.tsx       # Khung điện thoại của prototype
│   └── ScreenPopup.tsx      # Lớp popup trong khung điện thoại
├── data/                    # Dữ liệu mẫu và ánh xạ ảnh xe
├── types/                   # Các kiểu dữ liệu TypeScript
├── utils/                   # Tính ngày thuê, giá thuê và định dạng thời gian
├── App.tsx                  # Trạng thái và điều hướng giữa các màn hình
├── index.css                # Kiểu dáng và biến giao diện
└── main.tsx                 # Điểm khởi chạy React
.agents/skills/              # Tài liệu và công cụ hỗ trợ thiết kế mobile
vite.config.ts               # Cấu hình Vite, React và Tailwind CSS
```

## Phạm vi hiện tại

- Đây là prototype dùng dữ liệu mẫu; chưa kết nối API tồn kho, hệ thống đặt xe, thanh toán hoặc tài khoản thật.
- Bộ lọc tìm kiếm áp dụng trên danh sách xe mẫu trong ứng dụng. Giá và trạng thái đơn là dữ liệu minh họa, chưa được cửa hàng xác nhận.
- Đơn thuê, ảnh tải lên lúc nhận xe, lựa chọn xe và bảng so sánh được giữ trong trạng thái React và sẽ mất khi tải lại trang.
- Đường dẫn chia sẻ là đường dẫn mẫu, chưa có dịch vụ tạo hoặc khôi phục nội dung chia sẻ. Nút **Lưu thành ảnh** hiện chỉ mô phỏng trạng thái thành công, chưa xuất file ảnh.
- Nút **Gửi Zalo / SMS** ở màn chia sẻ xe sử dụng menu chia sẻ của trình duyệt khi được hỗ trợ, nếu không sẽ sao chép đường dẫn; ở bảng so sánh, nút này hiện sao chép đường dẫn. Sao chép và chia sẻ phụ thuộc quyền và khả năng hỗ trợ của trình duyệt.

## Tùy chỉnh

- Sửa dữ liệu cửa hàng, xe và giá mẫu tại [`src/data/mockData.ts`](src/data/mockData.ts).
- Thay ảnh và ánh xạ hình ảnh tại [`src/assets/`](src/assets/) và [`src/data/bikeImages.ts`](src/data/bikeImages.ts).
- Điều chỉnh màu sắc và kiểu dáng chung tại [`src/index.css`](src/index.css).
- Chỉnh giao diện từng màn hình trong [`src/components/screens/`](src/components/screens/).
- Tham khảo hướng dẫn nền tảng mobile tại [platform-guidelines.md](.agents/skills/mobile-ui-designer/references/platform-guidelines.md).
