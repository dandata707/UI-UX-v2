import React from 'react';
import { ArrowLeft, ArrowRight, Bike, MapPin, Star, Store } from 'lucide-react';
import { MotorbikeOption, Shop } from '../../types/wireframe';
import { formatMoney, rentalDays, rentalTotal } from '../../utils/rental';

interface ShopBikesScreenProps {
  shop: Shop;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  quantity: number;
  deliveryMode: 'delivery' | 'pickup';
  onBack: () => void;
  onSelectOption: (option: MotorbikeOption) => void;
}

export const ShopBikesScreen: React.FC<ShopBikesScreenProps> = ({ shop, pickupDate, pickupTime, returnDate, returnTime, quantity, deliveryMode, onBack, onSelectOption }) => {
  const days = rentalDays(pickupDate, pickupTime, returnDate, returnTime);
  return (
  <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
    <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-3 shadow-xs">
      <button type="button" onClick={onBack} aria-label="Về trang chủ" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-blue-50"><ArrowLeft size={18} /></button>
      <div className="min-w-0"><p className="text-[10px] font-semibold text-[var(--text-secondary)]">Cửa hàng gần bạn</p><h1 className="truncate text-sm font-extrabold">Xe cho thuê</h1></div>
    </header>

    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3.5 pb-6">
      <section className="rounded-2xl bg-[var(--color-primary)] p-4 text-white shadow-md shadow-blue-900/10">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20"><Store size={20} /></div>
        <h2 className="text-sm font-extrabold leading-5">{shop.name}</h2>
        <p className="mt-2 flex items-start gap-1.5 text-[10px] text-white/90"><MapPin size={12} className="mt-0.5 shrink-0" />{shop.address}</p>
        <div className="mt-3 flex items-center gap-2 text-[10px]"><span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 font-bold"><Star size={11} fill="currentColor" /> {shop.rating} ({shop.reviewCount})</span><span className="rounded-full bg-white/20 px-2 py-1 font-semibold">Cách {shop.distanceKm} km</span></div>
      </section>

      <div className="flex items-end justify-between gap-2 px-0.5"><div><h2 className="text-sm font-extrabold">Chọn xe của shop</h2><p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">{shop.options.length} mẫu · {days} ngày · {quantity} xe</p></div><Bike size={20} className="text-[var(--color-primary)]" /></div>

      {[...shop.options].sort((a, b) => a.dailyRate - b.dailyRate).map((option) => (
        <button key={option.id} type="button" onClick={() => onSelectOption(option)} aria-label={`Xem chi tiết ${option.bikeName}, ${formatMoney(option.dailyRate)} một ngày`} className="block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-[0.99]">
          <div className="flex gap-3 p-3">
            <img src={option.imageUrl} alt={option.bikeName} className="h-24 w-24 shrink-0 rounded-xl bg-blue-50 object-cover" />
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
              <div><h3 className="line-clamp-2 text-[12px] font-bold leading-4">{option.bikeName}</h3><p className="mt-1 text-[10px] text-[var(--text-secondary)]">{option.bikeType} · {option.engine}</p></div>
              <div><p className="text-[9px] text-[var(--text-secondary)]">Giá thuê từ</p><p className="text-base font-extrabold text-[var(--color-primary)]">{formatMoney(option.dailyRate)}<span className="text-[10px] font-medium text-[var(--text-secondary)]">/ngày</span></p></div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-blue-50/50 px-3 py-2"><span className="min-w-0 truncate pr-2 text-[10px] text-[var(--text-secondary)]">Tổng dự kiến: <strong className="text-[var(--color-primary)]">{formatMoney(rentalTotal(option.dailyRate, days, quantity, option.deliveryFee, deliveryMode))}</strong></span><span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-[var(--color-primary)]">Xem chi tiết <ArrowRight size={12} /></span></div>
        </button>
      ))}
    </div>
  </div>
  );
};
