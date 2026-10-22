import React from 'react';
import { ArrowRight, Bike, CalendarDays, Check, ClipboardList, CreditCard, Store } from 'lucide-react';
import { BookingOrder } from '../../types/wireframe';

interface BookingSuccessScreenProps {
  order: BookingOrder;
  onBackToSearch: () => void;
  onViewDetails: () => void;
}

const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

export const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({ order, onBackToSearch, onViewDetails }) => {
  const { shop, option } = order;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="flex shrink-0 items-center justify-center border-b border-slate-200 bg-white px-3.5 py-3 shadow-xs">
        <h1 className="text-xs font-bold uppercase tracking-wide">ĐẶT XE THÀNH CÔNG</h1>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pt-6">
        <section className="booking-success-enter rounded-2xl border border-emerald-600/20 bg-white px-4 py-6 text-center shadow-sm" aria-label="Trạng thái đơn đặt xe">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-surface)] text-[var(--color-success-green)] ring-8 ring-emerald-50">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="mt-5 text-base font-extrabold text-[var(--color-success-green)]">Đặt xe thành công</h2>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">Mã đơn: <strong className="text-[var(--text-primary)]">{order.code}</strong></p>
          <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-primary)]">Đã đặt</span>
          <p className="mt-3 text-[10px] text-[var(--text-secondary)]">Bản mẫu giao diện · Chưa gửi yêu cầu đến cửa hàng</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Tóm tắt đơn thuê">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><ClipboardList size={16} /> Tóm tắt đơn thuê</h2>
          <dl className="mt-3 space-y-3 text-[11px]">
            <div className="flex items-start gap-2.5"><Bike size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><div><dt className="text-[10px] text-[var(--text-secondary)]">Xe · {order.quantity} chiếc</dt><dd className="mt-0.5 font-bold">{option.bikeName}</dd></div></div>
            <div className="flex items-start gap-2.5"><Store size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><div><dt className="text-[10px] text-[var(--text-secondary)]">Cửa hàng</dt><dd className="mt-0.5 font-bold">{shop.name}</dd></div></div>
            <div className="flex items-start gap-2.5"><CalendarDays size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><div><dt className="text-[10px] text-[var(--text-secondary)]">Thời gian</dt><dd className="mt-0.5 font-bold">{order.pickupTime} {order.pickupDate} → {order.returnTime} {order.returnDate}</dd></div></div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3"><dt className="flex items-center gap-2 font-semibold"><CreditCard size={16} className="text-[var(--color-primary)]" /> Tổng tiền</dt><dd className="text-sm font-extrabold text-[var(--color-primary)]">{money(order.total)}</dd></div>
          </dl>
        </section>

      </div>

      <div className="shrink-0 space-y-2 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <button type="button" onClick={onViewDetails} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-[var(--color-primary-hover)]"><ClipboardList size={15} /> Xem chi tiết đơn</button>
        <button type="button" onClick={onBackToSearch} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-[var(--color-primary)] transition-colors hover:bg-blue-50">Về tìm xe <ArrowRight size={15} /></button>
      </div>
    </div>
  );
};
