import React, { useState } from 'react';
import { ChevronRight, Clock3, LogOut, Pencil, Phone, UserRound } from 'lucide-react';
import { BookingOrder } from '../../types/wireframe';

export interface ProfileData {
  name: string;
  phone: string;
  identity: string;
  license: string;
  address: string;
}

export type OrderStatus = 'booked' | 'active' | 'returned';
export interface ProfileOrder {
  code: string;
  bikeName: string;
  shopName: string;
  dates: string;
  status: OrderStatus;
  total: number;
  timeRange?: string;
  pickupLocation?: string;
  deposit?: string;
  quantity?: number;
  shopPhone?: string;
  deliveryMode?: 'delivery' | 'pickup';
  bikeType?: string;
  bookedAt?: string;
  receivedAt?: string;
  returnedAt?: string;
  pickupPhotos?: string[];
}

interface ProfileScreenProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
  bookingOrders: BookingOrder[];
  receivedOrderCodes: string[];
  returnedOrderCodes: string[];
  receivedAtByCode: Record<string, string>;
  returnedAtByCode: Record<string, string>;
  pickupPhotosByCode: Record<string, string[]>;
  onOpenReturn: (order: ProfileOrder) => void;
  onOpenBookedDetail: (order: ProfileOrder) => void;
  onOpenReturnedDetail: (order: ProfileOrder) => void;
  initialFilter?: OrderStatus;
}

const demoOrders: ProfileOrder[] = [
  { code: 'DL-2026-8854', bikeName: 'Honda Lead 125cc (cốp siêu lớn)', bikeType: 'Tay ga', shopName: 'Cửa hàng Happy Day Motorbike', dates: '17/10/2026 → 19/10/2026', timeRange: '15:00 17/10/2026 → 15:00 19/10/2026', bookedAt: '10:30 15/10/2026', receivedAt: '15:00 17/10/2026', pickupLocation: 'Tại tiệm: 127 Phan Bội Châu, Đà Lạt', deposit: 'Chỉ cần CCCD chính chủ', status: 'active', total: 300000 },
  { code: 'DL-2026-4416', bikeName: 'Honda Vision 110cc', bikeType: 'Tay ga', shopName: 'Motorbike Đà Lạt 24H', shopPhone: '0912 345 678', dates: '18/10/2026 → 20/10/2026', timeRange: '08:00 18/10/2026 → 08:00 20/10/2026', bookedAt: '09:00 16/10/2026', pickupLocation: 'Khách sạn Colline, 10 Phan Bội Châu, Đà Lạt', deliveryMode: 'delivery', deposit: 'Giữ giấy tờ (không cọc tiền)', quantity: 1, status: 'booked', total: 280000 },
  { code: 'DL-2026-4372', bikeName: 'Yamaha Sirius Fi', bikeType: 'Xe số', shopName: 'Tiệm xe máy Như Hà', shopPhone: '0978 888 234', dates: '24/10/2026 → 26/10/2026', timeRange: '08:00 24/10/2026 → 08:00 26/10/2026', bookedAt: '11:10 21/10/2026', pickupLocation: '38 Bùi Thị Xuân, Đà Lạt', deliveryMode: 'pickup', deposit: 'CCCD + 300.000đ (hoàn khi trả xe)', quantity: 1, status: 'booked', total: 235000 },
  { code: 'DL-2026-4308', bikeName: 'Honda Wave Alpha', bikeType: 'Xe số', shopName: 'Motorbike Đà Lạt 24H', shopPhone: '0912 345 678', dates: '27/10/2026 → 29/10/2026', timeRange: '08:00 27/10/2026 → 08:00 29/10/2026', bookedAt: '16:45 20/10/2026', pickupLocation: '15 Nguyễn Thị Minh Khai, Đà Lạt', deliveryMode: 'pickup', deposit: 'Giữ giấy tờ', quantity: 1, status: 'booked', total: 200000 },
  { code: 'DL-2026-3911', bikeName: 'Yamaha Exciter 150', bikeType: 'Xe côn/Cào cào', shopName: 'Cửa hàng Happy Day Motorbike', dates: '02/10/2026 → 04/10/2026', bookedAt: '14:20 29/09/2026', receivedAt: '08:00 02/10/2026', returnedAt: '08:30 04/10/2026', quantity: 1, status: 'returned', total: 400000 },
];

const statusLabels: Record<OrderStatus, string> = { booked: 'Đã đặt', active: 'Đang thuê', returned: 'Đã trả' };

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, onProfileChange, bookingOrders, receivedOrderCodes, returnedOrderCodes, receivedAtByCode, returnedAtByCode, pickupPhotosByCode, onOpenReturn, onOpenBookedDetail, onOpenReturnedDetail, initialFilter = 'active' }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [filter, setFilter] = useState<OrderStatus>(initialFilter);
  const [showAll, setShowAll] = useState(false);
  const [showLogoutInfo, setShowLogoutInfo] = useState(false);

  const orders: ProfileOrder[] = [
    ...bookingOrders.map((order) => ({
      code: order.code,
      bikeName: order.option.bikeName,
      shopName: order.shop.name,
      bikeType: order.option.bikeType,
      bookedAt: order.bookedAt,
      receivedAt: receivedAtByCode[order.code],
      returnedAt: returnedAtByCode[order.code],
      pickupPhotos: pickupPhotosByCode[order.code],
      dates: `${order.pickupDate} → ${order.returnDate}`,
      status: returnedOrderCodes.includes(order.code) ? 'returned' as const : receivedOrderCodes.includes(order.code) ? 'active' as const : 'booked' as const,
      total: order.total,
      timeRange: `${order.pickupTime} ${order.pickupDate} → ${order.returnTime} ${order.returnDate}`,
      pickupLocation: order.deliveryMode === 'delivery' ? order.pickupLocation : order.shop.address,
      deposit: order.option.deposit,
      quantity: order.quantity,
      shopPhone: order.shop.phone,
      deliveryMode: order.deliveryMode,
    })),
    ...demoOrders.map((order) => ({
      ...order,
      status: returnedOrderCodes.includes(order.code) ? 'returned' as const : receivedOrderCodes.includes(order.code) ? 'active' as const : order.status,
      receivedAt: receivedAtByCode[order.code] ?? order.receivedAt,
      returnedAt: returnedAtByCode[order.code] ?? order.returnedAt,
      pickupPhotos: pickupPhotosByCode[order.code] ?? order.pickupPhotos,
    })),
  ];
  const listedOrders = showAll ? orders : filter === 'booked' ? orders.filter((order) => order.status === 'booked') : orders.filter((order) => order.status === filter).slice(0, 1);
  const saveProfile = () => {
    if (!draft.name.trim() || !draft.phone.trim()) return;
    onProfileChange({ ...draft, name: draft.name.trim(), phone: draft.phone.trim() });
    setEditing(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3.5 py-3 shadow-xs">
        <UserRound size={18} className="text-[var(--color-primary)]" />
        <h1 className="text-xs font-bold uppercase tracking-wide">Tài khoản</h1>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Hồ sơ cá nhân">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--color-primary)]"><UserRound size={28} /></div>
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold uppercase">{profile.name}</div><div className="mt-1 text-[11px] text-[var(--text-secondary)]">{profile.phone}</div></div>
            <button type="button" onClick={() => { setDraft(profile); setEditing((value) => !value); }} className="flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-[var(--color-primary)] hover:bg-blue-50"><Pencil size={13} /> Sửa</button>
          </div>
          {editing ? (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-[11px]">
              {(['name', 'phone', 'identity', 'license', 'address'] as const).map((field) => (
                <label key={field} className="block font-semibold">{{ name: 'Họ tên', phone: 'Số điện thoại', identity: 'CCCD', license: 'GPLX', address: 'Địa chỉ' }[field]}
                  <input value={draft[field]} onChange={(event) => setDraft((value) => ({ ...value, [field]: event.target.value }))} className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-normal outline-none focus:border-[var(--color-primary)]" />
                </label>
              ))}
              <button type="button" onClick={saveProfile} disabled={!draft.name.trim() || !draft.phone.trim()} className="min-h-9 rounded-lg bg-[var(--color-primary)] px-4 font-bold text-white disabled:opacity-50">Lưu thông tin</button>
            </div>
          ) : (
            <div className="mt-3 border-t border-slate-100 pt-2.5 text-[10px] leading-5 text-[var(--text-secondary)]">
              <div>CCCD: <strong className="text-[var(--text-primary)]">{profile.identity}</strong> · GPLX: <strong className="text-[var(--text-primary)]">{profile.license}</strong></div>
              <div>Địa chỉ: <strong className="text-[var(--text-primary)]">{profile.address}</strong></div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Đơn thuê xe">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><Clock3 size={16} /> Đơn thuê xe ({orders.length})</h2>
            <button type="button" onClick={() => setShowAll((value) => !value)} className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--color-primary)]">{showAll ? 'Thu gọn' : 'Xem tất cả'} <ChevronRight size={12} /></button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {(['booked', 'active', 'returned'] as const).map((status) => (
            <button key={status} type="button" onClick={() => { setFilter(status); setShowAll(false); }} aria-pressed={!showAll && filter === status} className={`min-h-12 rounded-xl border px-1 py-1.5 text-[9px] font-bold transition-colors ${!showAll && filter === status ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-slate-200 bg-slate-50 text-[var(--text-secondary)] hover:bg-blue-50'}`}>
                <span className="block">{statusLabels[status]}</span><span className="mt-0.5 block text-xs">{orders.filter((order) => order.status === status).length}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {listedOrders.map((order) => (
              <article key={order.code} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[10px]">
                <div className="flex items-center justify-between gap-2"><strong className="truncate text-[var(--text-primary)]">{order.code} · {order.bikeName}</strong><span className="shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-primary)]">{statusLabels[order.status]}</span></div>
                <p className="mt-1 truncate text-[var(--text-secondary)]">{order.shopName} · {order.dates}</p>
                <button type="button" onClick={() => order.status === 'active' ? onOpenReturn(order) : order.status === 'booked' ? onOpenBookedDetail(order) : onOpenReturnedDetail(order)} className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 rounded-lg bg-[var(--color-primary)] px-2 font-bold text-white hover:bg-[var(--color-primary-hover)]">{order.status === 'active' ? 'Đối chiếu & trả xe' : order.status === 'booked' ? 'Chi tiết' : 'Xem thông tin'} <ChevronRight size={12} /></button>
              </article>
            ))}
          </div>
        </section>

        <div className="flex min-h-11 items-center justify-between rounded-xl border border-blue-900/15 bg-white px-3 text-[11px] font-semibold text-[var(--color-primary)] shadow-xs"><span className="flex items-center gap-2"><Phone size={15} /> Hotline cứu hộ 24/7</span><strong>1900 6868</strong></div>
        <button type="button" onClick={() => setShowLogoutInfo((value) => !value)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-[var(--text-secondary)] hover:bg-slate-50"><LogOut size={15} /> Đăng xuất</button>
        {showLogoutInfo && <p role="status" className="rounded-xl bg-blue-50 p-3 text-[11px] text-[var(--color-primary)]">Đây là tài khoản mẫu. Chức năng đăng nhập và đăng xuất chưa được kết nối.</p>}
      </div>
    </div>
  );
};
