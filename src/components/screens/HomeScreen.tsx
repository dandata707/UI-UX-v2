import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronRight, MapPin, Search, Star, Store } from 'lucide-react';
import { Shop } from '../../types/wireframe';
import { AiAssistantEntry } from '../AiAssistant';
import dalatPineLake from '../../assets/bikes/9d115a42-3bda-4ea7-89a4-f81512029f8a.png';
import dalatWindmills from '../../assets/bikes/f17558ac-a70f-4e92-bcb5-4eb9fbc96407.png';
import dalatMist from '../../assets/bikes/660eba09-1009-4a93-8b88-c7996a385e84.png';
import dalatLake from '../../assets/bikes/0d2923f0-08c3-424b-984b-db04b7881562.png';

interface HomeScreenProps {
  shops: Shop[];
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  quantity: number;
  onOpenSearch: () => void;
  onOpenAssistant: () => void;
  onViewAll: () => void;
  onSelectShop: (shop: Shop) => void;
}

const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

export const HomeScreen: React.FC<HomeScreenProps> = ({ shops, pickupLocation, pickupDate, returnDate, quantity, onOpenSearch, onOpenAssistant, onViewAll, onSelectShop }) => {
  const nearbyShops = [...shops].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerSlides = [
    {
      eyebrow: 'TỰ DO KHÁM PHÁ',
      title: <>Vi vu Đà Lạt<br />trên chiếc xe<br />yêu thích</>,
      description: 'Chọn xe dễ dàng, khám phá thật vui.',
      location: 'Đà Lạt, Lâm Đồng',
      image: dalatPineLake,
      overlay: 'from-slate-950/85 via-slate-900/35 to-transparent',
    },
    {
      eyebrow: 'SẴN SÀNG LÊN ĐƯỜNG',
      title: <>Chạm vào<br />mùa sương Đà Lạt</>,
      description: 'Nhận xe nhanh, tự do đi theo cách của bạn.',
      location: 'Đà Lạt, Lâm Đồng',
      image: dalatWindmills,
      overlay: 'from-cyan-950/85 via-blue-900/35 to-transparent',
    },
    {
      eyebrow: 'HÀNH TRÌNH MỚI',
      title: <>Lên đồi ngắm mây,<br />xuống phố thưởng hoa</>,
      description: 'Một chiếc xe phù hợp cho mọi chuyến đi.',
      location: 'Đà Lạt, Lâm Đồng',
      image: dalatMist,
      overlay: 'from-emerald-950/85 via-teal-900/35 to-transparent',
    },
    {
      eyebrow: 'KHÁM PHÁ THEO CÁCH CỦA BẠN',
      title: <>Bắt đầu chuyến đi<br />ngay hôm nay</>,
      description: 'Nhiều lựa chọn xe, giá rõ ràng và tiện lợi.',
      location: 'Đà Lạt, Lâm Đồng',
      image: dalatLake,
      overlay: 'from-indigo-950/85 via-violet-900/35 to-transparent',
    },
  ] as const;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % bannerSlides.length);
    }, 2000);
    return () => window.clearInterval(intervalId);
  }, [bannerSlides.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <div className="text-sm font-extrabold tracking-tight text-[var(--color-primary)]">ĐÀ LẠT RIDE</div>
        <div className="mt-0.5 text-[10px] text-[var(--text-secondary)]">Khám phá Đà Lạt theo cách của bạn</div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3.5 pb-6">
        <section aria-label="Banner khám phá Đà Lạt" className="group relative h-40 overflow-hidden rounded-2xl bg-slate-950 shadow-md">
          <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeBanner * 100}%)` }}>
            {bannerSlides.map((slide, index) => (
              <article key={slide.eyebrow} aria-hidden={index !== activeBanner} className="relative h-full min-w-full overflow-hidden">
                <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
                <div className="relative flex h-full max-w-[72%] flex-col justify-center px-4 py-3 text-white">
                  <span className="mb-1.5 w-fit rounded-full border border-white/45 bg-white/10 px-2 py-0.5 text-[8px] font-bold tracking-wide backdrop-blur-sm">{slide.eyebrow}</span>
                  <h1 className="text-[19px] font-extrabold leading-[1.08] tracking-tight drop-shadow-sm">{slide.title}</h1>
                  <p className="mt-1.5 text-[10px] font-medium leading-[1.35] text-white/90">{slide.description}</p>
                </div>
                <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-white/30 bg-slate-950/45 px-2 py-1 text-[8px] font-semibold text-white backdrop-blur-sm"><MapPin size={10} />{slide.location}</span>
              </article>
            ))}
          </div>
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5" role="tablist" aria-label="Chọn slide banner">
            {bannerSlides.map((slide, index) => (
              <button key={slide.eyebrow} type="button" role="tab" aria-label={`Slide ${index + 1}`} aria-selected={index === activeBanner} onClick={() => setActiveBanner(index)} className={`h-1.5 rounded-full transition-all ${index === activeBanner ? 'w-5 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'}`} />
            ))}
          </div>
        </section>

        <AiAssistantEntry onClick={onOpenAssistant} />

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
