export type ScreenId =
  | 'home' // TRANG CHỦ
  | 'nemo' // TRỢ LÝ AI NEMO
  | 'shop-bikes' // XE CỦA CỬA HÀNG
  | 'search' // MÀN 1
  | 'calendar' // MÀN 1a
  | 'location' // MÀN 1b
  | 'results' // MÀN 2
  | 'results-dropdown' // MÀN 2a
  | 'detail' // MÀN 3
  | 'booking' // MÀN ĐẶT XE
  | 'booking-success' // MÀN ĐẶT XE THÀNH CÔNG
  | 'booked-order-detail' // MÀN CHI TIẾT ĐƠN ĐÃ ĐẶT
  | 'pickup-photos' // MÀN ẢNH XE LÚC NHẬN
  | 'pickup-success' // MÀN NHẬN XE THÀNH CÔNG
  | 'profile' // MÀN TÀI KHOẢN
  | 'return-inspection' // MÀN ĐỐI CHIẾU & TRẢ XE
  | 'return-success' // MÀN TRẢ XE THÀNH CÔNG
  | 'returned-order-detail' // MÀN CHI TIẾT ĐƠN ĐÃ TRẢ
  | 'share-single' // MÀN 3a
  | 'compare-1' // MÀN 4a
  | 'compare-2' // MÀN 4b
  | 'compare-3' // MÀN 4c
  | 'share' // MÀN 5
  | 'saved'; // MÀN 6

export interface CommentItem {
  id: string;
  screenId: ScreenId;
  xPercent: number; // 0 to 100 on the 390x844 frame
  yPercent: number;
  author: string;
  text: string;
  timestamp: string;
  resolved: boolean;
}

export interface MotorbikeOption {
  id: string;
  shopId: string;
  bikeName: string;
  bikeType: 'Xe số' | 'Tay ga' | 'Xe côn/Cào cào';
  engine: string;
  dailyRate: number; // e.g. 140000
  deliveryFee: number; // e.g. 0 or 15000
  totalEstimate: number;
  preparationTotal?: string; // Tổng cần chuẩn bị
  lastUpdated: string; // e.g. "5 phút trước"
  deposit: string; // e.g. "Giữ giấy tờ (không cọc tiền)"
  requirements: string[];
  pickupHours: string;
  returnHours: string;
  imageUrl: string;
  isRecommended?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  distance: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  highlight: string;
  options: MotorbikeOption[];
  phone: string;
  freeCancellation: boolean;
}

export interface BookingOrder {
  code: string;
  bookedAt?: string;
  shop: Shop;
  option: MotorbikeOption;
  quantity: number;
  total: number;
  renterName: string;
  phone: string;
  identity: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  deliveryMode: 'delivery' | 'pickup';
}

export interface SearchFilterState {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  bikeType: string;
  quantity: number;
  pickupLocation: string;
  deliveryMode: 'delivery' | 'pickup'; // Giao tận nơi hoặc Đến cửa hàng nhận
}

export interface EditableTextMap {
  [key: string]: string;
}
