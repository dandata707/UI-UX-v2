import React, { useEffect, useRef } from 'react';
import { Bike, Check, House, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { BookingOrder } from '../../types/wireframe';
import { ProfileOrder } from './ProfileScreen';

interface PickupSuccessScreenProps {
  order: BookingOrder | ProfileOrder;
  onGoHome: () => void;
}

const confetti = [
  { x: 8, delay: 40, color: '#1a73e8' },
  { x: 18, delay: 320, color: '#fbbc04' },
  { x: 30, delay: 130, color: '#34a853' },
  { x: 43, delay: 450, color: '#4285f4' },
  { x: 58, delay: 200, color: '#fbbc04' },
  { x: 70, delay: 500, color: '#1a73e8' },
  { x: 82, delay: 90, color: '#34a853' },
  { x: 93, delay: 370, color: '#4285f4' },
];

export const PickupSuccessScreen: React.FC<PickupSuccessScreenProps> = ({ order, onGoHome }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  const bikeName = 'option' in order ? order.option.bikeName : order.bikeName;
  const shopName = 'shop' in order ? order.shop.name : order.shopName;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="shrink-0 border-b border-slate-200 bg-white px-3.5 py-3 text-center shadow-xs">
        <h1 ref={headingRef} tabIndex={-1} className="text-xs font-bold uppercase tracking-wide outline-none">Nhận xe thành công</h1>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 pt-5">
        <section className="pickup-success-card relative overflow-hidden rounded-3xl border border-blue-900/10 bg-gradient-to-b from-blue-50 via-white to-white px-5 pb-6 pt-8 text-center shadow-md shadow-blue-900/10" aria-label="Lời chúc nhận xe">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {confetti.map(({ x, delay, color }) => <span key={x} className="pickup-confetti absolute top-3 h-2 w-1.5 rounded-sm" style={{ left: `${x}%`, animationDelay: `${delay}ms`, backgroundColor: color }} />)}
            <Sparkles size={21} className="pickup-sparkle absolute left-5 top-24 text-amber-500" />
            <Sparkles size={17} className="pickup-sparkle absolute right-6 top-32 text-[var(--color-primary)]" style={{ animationDelay: '350ms' }} />
          </div>

          <div className="pickup-success-seal relative mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-blue-900/25 ring-8 ring-blue-100">
            <Check size={37} strokeWidth={3} />
          </div>
          <div className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-[var(--color-success-green)]"><Bike size={13} /> Đã nhận xe</div>
          <h2 className="relative mt-4 text-xl font-extrabold tracking-tight text-[var(--color-primary-deep)]">Cảm ơn bạn!</h2>
          <p className="relative mt-2 text-[17px] font-extrabold text-[var(--color-success-green)]">Thượng lộ bình an</p>
          <p className="relative mx-auto mt-3 max-w-[260px] text-[11px] leading-relaxed text-[var(--text-secondary)]">Chúc bạn có một hành trình an toàn, nhiều niềm vui và thật nhiều kỷ niệm đẹp tại Đà Lạt.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Chuyến đi của bạn">
          <h2 className="border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]">Chuyến đi của bạn</h2>
          <dl className="mt-3 space-y-2.5 text-[11px]">
            <div className="flex justify-between gap-3"><dt className="text-[var(--text-secondary)]">Mã đơn</dt><dd className="font-bold">{order.code}</dd></div>
            <div className="flex items-start gap-2"><Bike size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><span className="font-semibold">{bikeName}</span></div>
            <div className="flex items-start gap-2"><Store size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><span className="text-[var(--text-secondary)]">{shopName}</span></div>
          </dl>
        </section>

        <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[10px] leading-relaxed text-[var(--text-secondary)]"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /> Đội mũ bảo hiểm và kiểm tra phanh, đèn trước khi khởi hành. Trạng thái nhận xe đã được ghi nhận trong bản mẫu; việc bàn giao thực tế cần cửa hàng xác nhận.</p>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <button type="button" onClick={onGoHome} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-[var(--color-primary-hover)]"><House size={17} /> Trang chủ</button>
      </div>
    </div>
  );
};
