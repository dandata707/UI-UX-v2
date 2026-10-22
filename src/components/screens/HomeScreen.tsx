import React from 'react';
import { ArrowRight, CalendarDays, ChevronRight, MapPin, Search, Star, Store } from 'lucide-react';
import { Shop } from '../../types/wireframe';
import brandBanner from '../../assets/dalat-ride-banner.png';

interface HomeScreenProps {
  shops: Shop[];
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  quantity: number;
  onOpenSearch: () => void;
  onViewAll: () => void;
  onSelectShop: (shop: Shop) => void;
}

const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

export const HomeScreen: React.FC<HomeScreenProps> = ({ shops, pickupLocation, pickupDate, returnDate, quantity, onOpenSearch, onViewAll, onSelectShop }) => {
  const nearbyShops = [...shops].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <div className="text-sm font-extrabold tracking-tight text-[var(--color-primary)]">ĐÀ LẠT RIDE</div>
        <div className="mt-0.5 text-[10px] text-[var(--text-secondary)]">Khám phá Đà Lạt theo cách của bạn</div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3.5 pb-6">
        <div className="relative h-28 overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-sm">
          <img src={brandBanner} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/80 via-[var(--color-primary)]/20 to-transparent" />
          <div className="relative flex h-full max-w-[70%] flex-col justify-center px-4 text-white">
            <h1 className="text-lg font-extrabold leading-tight">Vi vu Đà Lạt<br />trên chiếc xe bạn thích</h1>
            <p className="mt-1 text-[10px] font-medium text-white/90">Chọn xe dễ dàng, khám phá thật vui.</p>
          </div>
        </div>

        <section aria-label="Tìm xe thuê">
          <button type="button" onClick={onOpenSearch} className="w-full rounded-2xl border border-blue-900/15 bg-white p-4 text-left shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--color-primary)]"><Search size={21} /></div>
              <div className="min-w-0 flex-1"><h2 className="text-sm font-bold">Tìm xe cho chuyến đi</h2><p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">Chọn thời gian, điểm nhận và loại xe</p></div>
              <ChevronRight size={17} className="shrink-0 text-[var(--color-primary)]" />
            </div>
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-[11px]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]"><CalendarDays size={15} className="shrink-0 text-[var(--color-primary)]" /><span>{pickupDate} → {returnDate} · {quantity} xe</span></div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]"><MapPin size={15} className="shrink-0 text-[var(--color-primary)]" /><span className="truncate">{pickupLocation}</span></div>
            </div>
            <div className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-xs font-bold text-white">Bắt đầu tìm xe <ArrowRight size={15} /></div>
          </button>
        </section>

        <section aria-label="Shop thuê xe gần bạn">
          <div className="flex items-end justify-between gap-2">
            <div><h2 className="text-sm font-bold">Shop thuê xe gần bạn</h2><p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">Gợi ý từ danh sách cửa hàng mẫu tại Đà Lạt</p></div>
            <button type="button" onClick={onViewAll} className="shrink-0 text-[10px] font-bold text-[var(--color-primary)]">Xem tất cả</button>
          </div>
          <div className="mt-3 space-y-2.5">
            {nearbyShops.map((shop) => {
              const startingPrice = Math.min(...shop.options.map((option) => option.dailyRate));
              return (
                <button key={shop.id} type="button" onClick={() => onSelectShop(shop)} aria-label={`Xem ${shop.options.length} xe của ${shop.name}`} className="block w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xs transition-all hover:border-blue-300 hover:shadow-md active:scale-[0.99]">
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-blue-50"><img src={shop.options[0].imageUrl} alt="" className="h-full w-full object-cover" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1"><h3 className="line-clamp-2 text-[11px] font-bold leading-4">{shop.name}</h3><span className="shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-primary)]">{shop.distanceKm} km</span></div>
                      <div className="mt-1 flex items-center gap-1 text-[10px]"><Star size={12} className="fill-amber-400 text-amber-500" /><strong>{shop.rating}</strong><span className="text-[var(--text-secondary)]">({shop.reviewCount})</span></div>
                      <p className="mt-1 truncate text-[10px] text-[var(--text-secondary)]">{shop.address}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5"><span className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]"><Store size={13} className="text-[var(--color-primary)]" /> Từ <strong className="text-[var(--color-primary)]">{money(startingPrice)}/ngày</strong></span><span className="flex min-h-8 items-center gap-1 rounded-lg bg-blue-50 px-2.5 text-[10px] font-bold text-[var(--color-primary)]">Xem {shop.options.length} xe <ChevronRight size={12} /></span></div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
