import React, { useState } from 'react';
import { ArrowLeft, Bike, Camera, CheckCircle2, Clock3, MapPin, Store, XCircle } from 'lucide-react';
import { BookingOrder } from '../../types/wireframe';
import { ProfileOrder } from './ProfileScreen';

interface BookedOrderDetailScreenProps {
  order: BookingOrder | ProfileOrder;
  onBack: () => void;
  onReceive: () => void;
}

const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

export const BookedOrderDetailScreen: React.FC<BookedOrderDetailScreenProps> = ({ order, onBack, onReceive }) => {
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  const isFullOrder = 'option' in order;
  const bikeName = isFullOrder ? order.option.bikeName : order.bikeName;
  const shopName = isFullOrder ? order.shop.name : order.shopName;
  const shopPhone = isFullOrder ? order.shop.phone : order.shopPhone;
  const timeRange = isFullOrder ? `${order.pickupTime} ${order.pickupDate} → ${order.returnTime} ${order.returnDate}` : order.timeRange ?? order.dates;
  const pickupPlace = isFullOrder ? (order.deliveryMode === 'delivery' ? order.pickupLocation : order.shop.address) : order.pickupLocation;
  const deliveryMode = order.deliveryMode;
  const deposit = isFullOrder ? order.option.deposit : order.deposit;
  const quantity = order.quantity;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="flex shrink-0 items-center justify-between gap-1 border-b border-slate-200 bg-white px-3 py-2.5 shadow-xs">
        <button type="button" onClick={onBack} aria-label="Quay lại lịch sử đơn" className="flex h-8 shrink-0 items-center gap-1 text-[10px] font-semibold text-[var(--color-primary)]"><ArrowLeft size={16} /> Lịch sử đơn</button>
        <h1 className="min-w-0 text-center text-[10px] font-bold uppercase tracking-wide">Chi tiết đơn thuê</h1>
        <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-1 text-[9px] font-bold text-[var(--color-primary)]">Đã đặt</span>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Thông tin đơn thuê">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold"><span>{order.code}</span><span className="max-w-[58%] truncate text-right">{bikeName}</span></div>
          <div className="mt-3 flex items-start justify-between gap-2"><span className="flex min-w-0 items-start gap-2 text-[11px] font-bold"><Bike size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />{bikeName}{quantity ? ` · ${quantity} xe` : ''}</span><strong className="shrink-0 text-[11px] text-[var(--color-primary)]">{money(order.total)}</strong></div>
          <dl className="mt-3 space-y-2 text-[10px] text-[var(--text-secondary)]">
            <div className="flex items-start gap-2"><Store size={14} className="shrink-0 text-[var(--color-primary)]" /><div><dt className="inline">Tiệm xe: </dt><dd className="inline font-semibold text-[var(--text-primary)]">{shopName}{shopPhone ? ` (${shopPhone})` : ''}</dd></div></div>
            <div className="flex items-start gap-2"><Clock3 size={14} className="shrink-0 text-[var(--color-primary)]" /><div><dt className="inline">Thời gian: </dt><dd className="inline font-semibold text-[var(--text-primary)]">{timeRange}</dd></div></div>
            {pickupPlace && <div className="flex items-start gap-2"><MapPin size={14} className="shrink-0 text-[var(--color-primary)]" /><div><dt className="inline">Điểm nhận: </dt><dd className="inline font-semibold text-[var(--text-primary)]">{deliveryMode ? `[${deliveryMode === 'delivery' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}] ` : ''}{pickupPlace}</dd></div></div>}
            {deposit && <div className="border-t border-slate-100 pt-2"><dt className="inline">Cọc xe: </dt><dd className="inline font-semibold text-[var(--text-primary)]">{deposit}</dd></div>}
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Bàn giao và nhận xe">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><Camera size={16} /> Bàn giao &amp; nhận xe</h2>
          <ul className="mt-3 space-y-2 rounded-xl bg-blue-50/70 p-3 text-[11px] text-[var(--text-primary)]">
            <li className="flex items-start gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--color-success-green)]" /> Kiểm tra phanh, đèn, xi-nhan, còi</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--color-success-green)]" /> Chụp 5 ảnh xe (4 góc + đồng hồ)</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--color-success-green)]" /> Nhận đủ 2 mũ bảo hiểm, giấy tờ xe</li>
          </ul>
        </section>

        {showCancelMessage && <p role="status" className="flex items-start gap-2 rounded-xl border border-blue-900/15 bg-blue-50 p-3 text-[11px] font-medium text-[var(--color-primary)]"><XCircle size={16} className="shrink-0" /> Đây là đơn mẫu; việc hủy đặt chưa được gửi đến cửa hàng.</p>}
      </div>

      <div className="grid shrink-0 grid-cols-[1fr_1.8fr] gap-2 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <button type="button" onClick={() => setShowCancelMessage(true)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-2 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-slate-50">Hủy đặt</button>
        <button type="button" onClick={onReceive} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-2 text-[11px] font-bold text-white shadow-md shadow-blue-900/20 hover:bg-[var(--color-primary-hover)]"><Camera size={15} /> Nhận xe</button>
      </div>
    </div>
  );
};
