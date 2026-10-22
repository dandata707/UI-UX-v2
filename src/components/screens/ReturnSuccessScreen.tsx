import React from 'react';
import { ArrowRight, Bike, Check, ClipboardList, Heart, Sparkles } from 'lucide-react';
import { ProfileOrder } from './ProfileScreen';

interface ReturnSuccessScreenProps {
  order: ProfileOrder;
  onViewHistory: () => void;
  onGoHome: () => void;
}

export const ReturnSuccessScreen: React.FC<ReturnSuccessScreenProps> = ({ order, onViewHistory, onGoHome }) => (
  <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
    <header className="shrink-0 border-b border-slate-200 bg-white px-3.5 py-3 text-center shadow-xs">
      <h1 className="text-xs font-bold uppercase tracking-wide">Trả xe thành công</h1>
    </header>

    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pt-6">
      <section className="booking-success-enter rounded-2xl border border-emerald-600/20 bg-white px-5 py-7 text-center shadow-sm" aria-label="Trạng thái trả xe">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-surface)] text-[var(--color-success-green)] ring-8 ring-emerald-50"><Check size={32} strokeWidth={3} /></div>
        <h2 className="mt-5 text-base font-extrabold text-[var(--color-success-green)]">Trả xe thành công!</h2>
        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">Cảm ơn bạn đã đồng hành cùng Đà Lạt Ride.</p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-[var(--color-primary)]"><Sparkles size={15} className="mr-1 inline-block" /> Chúc bạn thật nhiều may mắn và những chuyến đi vui vẻ phía trước!</p>
        <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-success-green)]">Đã trả xe</span>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Tóm tắt đơn đã trả">
        <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><ClipboardList size={16} /> Đơn đã trả</h2>
        <div className="mt-3 space-y-2.5 text-[11px]">
          <div className="flex justify-between gap-2"><span className="text-[var(--text-secondary)]">Mã đơn</span><strong>{order.code}</strong></div>
          <div className="flex items-start gap-2"><Bike size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><strong>{order.bikeName}</strong></div>
          <div className="border-t border-slate-100 pt-2.5 text-[var(--text-secondary)]">{order.shopName}</div>
        </div>
      </section>

      <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[10px] text-[var(--text-secondary)]"><Heart size={14} className="shrink-0 text-[var(--color-primary)]" /> Trạng thái này được ghi nhận trong prototype. Việc bàn giao và hoàn cọc thực tế cần cửa hàng xác nhận.</p>
    </div>

    <div className="shrink-0 space-y-2 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <button type="button" onClick={onViewHistory} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-3 text-xs font-bold text-white shadow-md shadow-blue-900/20 hover:bg-[var(--color-primary-hover)]">Xem đơn đã trả <ArrowRight size={15} /></button>
      <button type="button" onClick={onGoHome} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-[var(--color-primary)] hover:bg-blue-50">Về trang chủ</button>
    </div>
  </div>
);
