import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowRightLeft, Check, ChevronDown, MapPin, Plus, Star } from 'lucide-react';
import { EditableTextMap, MotorbikeOption, SearchFilterState, Shop } from '../../types/wireframe';
import { formatMoney, rentalDays, rentalTotal } from '../../utils/rental';

interface ResultsScreenProps {
  shops: Shop[];
  filters: SearchFilterState;
  isEditMode: boolean;
  editableTexts: EditableTextMap;
  onTextChange: (id: string, text: string) => void;
  isPlaceholderMode: boolean;
  selectedOptionIds: string[];
  onToggleCompare: (option: MotorbikeOption) => void;
  onSelectOptionForDetail: (option: MotorbikeOption, shop: Shop) => void;
  onGoToCompare: () => void;
  onBackToSearch: () => void;
  deliveryMode?: 'delivery' | 'pickup';
  deliveryAddress?: string;
  onOpenLocation?: () => void;
}

type SortKey = 'recommended' | 'price' | 'rating' | 'distance';
const sortLabels: Record<SortKey, string> = {
  recommended: 'Đề xuất',
  price: 'Tổng giá thấp nhất',
  rating: 'Đánh giá cao',
  distance: 'Gần nhất',
};
export const ResultsScreen: React.FC<ResultsScreenProps> = ({ shops, filters, selectedOptionIds, onToggleCompare, onSelectOptionForDetail, onGoToCompare, onBackToSearch }) => {
  const [activeSort, setActiveSort] = useState<SortKey>('recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const days = rentalDays(filters.pickupDate, filters.pickupTime, filters.returnDate, filters.returnTime);
  const totalFor = (option: MotorbikeOption) => rentalTotal(option.dailyRate, days, filters.quantity, option.deliveryFee, filters.deliveryMode);
  const matchesType = (option: MotorbikeOption) => {
    if (filters.bikeType === 'Xe tay ga') return option.bikeType === 'Tay ga';
    if (filters.bikeType === 'Xe số') return option.bikeType === 'Xe số';
    if (filters.bikeType === 'Xe côn – Cào cào') return option.bikeType === 'Xe côn/Cào cào';
    return true;
  };
  const options = shops.flatMap((shop) => shop.options.map((option) => ({ shop, option })))
    .filter(({ option }) => matchesType(option))
    .sort((a, b) => {
      if (activeSort === 'price') return totalFor(a.option) - totalFor(b.option);
      if (activeSort === 'rating') return b.shop.rating - a.shop.rating || totalFor(a.option) - totalFor(b.option);
      if (activeSort === 'distance') return a.shop.distanceKm - b.shop.distanceKm || totalFor(a.option) - totalFor(b.option);
      return Number(Boolean(b.option.isRecommended)) - Number(Boolean(a.option.isRecommended)) || b.shop.rating - a.shop.rating || totalFor(a.option) - totalFor(b.option);
    });
  const compareCount = selectedOptionIds.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="shrink-0 border-b border-slate-200 bg-white px-3.5 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBackToSearch} aria-label="Đổi điều kiện tìm xe" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-blue-50"><ArrowLeft size={19} /></button>
          <div className="min-w-0 flex-1"><h1 className="text-sm font-extrabold">{options.length} xe phù hợp</h1><p className="truncate text-[10px] text-[var(--text-secondary)]">{filters.pickupDate} → {filters.returnDate} · {days} ngày · {filters.quantity} xe</p></div>
          <button type="button" onClick={onBackToSearch} className="rounded-lg bg-blue-50 px-2.5 py-2 text-[10px] font-bold text-[var(--color-primary)]">Sửa tìm kiếm</button>
        </div>
        <p className="mt-1 flex items-center gap-1 truncate px-1 text-[10px] text-[var(--text-secondary)]"><MapPin size={12} className="shrink-0" /> {filters.deliveryMode === 'delivery' ? filters.pickupLocation : 'Nhận tại cửa hàng'}</p>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pb-20">
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs" aria-label="Sắp xếp xe">
          <div className="flex items-center justify-between gap-2"><h2 className="text-[11px] font-bold">Sắp xếp theo</h2><div className="relative"><button type="button" onClick={() => setSortOpen(!sortOpen)} aria-expanded={sortOpen} className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1.5 text-[10px] font-bold text-[var(--color-primary)]">{sortLabels[activeSort]} <ChevronDown size={12} /></button>{sortOpen && <div className="absolute right-0 top-full z-40 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">{(Object.keys(sortLabels) as SortKey[]).map((key) => <button key={key} type="button" onClick={() => { setActiveSort(key); setSortOpen(false); }} className={`block w-full rounded-lg px-2 py-2 text-left text-[10px] ${activeSort === key ? 'bg-blue-50 font-bold text-[var(--color-primary)]' : 'hover:bg-slate-50'}`}>{sortLabels[key]}</button>)}</div>}</div></div>
        </section>

        {options.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center"><h2 className="text-sm font-bold">Chưa có xe phù hợp</h2><p className="mt-1 text-[11px] text-[var(--text-secondary)]">Thử đổi loại xe để xem thêm lựa chọn.</p><button type="button" onClick={onBackToSearch} className="mt-4 rounded-xl bg-[var(--color-primary)] px-3 py-2 text-[11px] font-bold text-white">Đổi loại xe</button></section>
        ) : options.map(({ shop, option }) => {
          const compared = selectedOptionIds.includes(option.id);
          const compareDisabled = !compared && compareCount >= 3;
          return <article key={option.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-3 py-2"><div className="min-w-0"><p className="truncate text-[10px] font-bold">{shop.name}</p><p className="mt-0.5 flex items-center gap-1 text-[9px] text-[var(--text-secondary)]"><Star size={10} className="fill-amber-400 text-amber-500" /> {shop.rating} · {shop.distanceKm} km</p></div>{option.isRecommended && <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">Đề xuất</span>}</div>
            <div className="flex gap-3 p-3"><img src={option.imageUrl} alt={option.bikeName} className="h-24 w-24 shrink-0 rounded-xl bg-blue-50 object-cover" /><div className="min-w-0 flex-1"><h2 className="line-clamp-2 text-[12px] font-bold leading-4">{option.bikeName}</h2><p className="mt-1 text-[10px] text-[var(--text-secondary)]">{option.bikeType} · {option.engine}</p><p className="mt-2 text-[11px] font-semibold">{formatMoney(option.dailyRate)}<span className="font-normal text-[var(--text-secondary)]">/ngày</span></p><p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">Phí giao: {filters.deliveryMode === 'delivery' ? formatMoney(option.deliveryFee) : '0đ'}</p></div></div>
            <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2"><span className="text-[10px] text-[var(--text-secondary)]">Tổng {days} ngày · {filters.quantity} xe</span><strong className="text-sm text-[var(--color-primary)]">{formatMoney(totalFor(option))}</strong></div>
            <div className="flex gap-2 px-3 pb-3"><button type="button" onClick={() => onToggleCompare(option)} disabled={compareDisabled} className={`flex min-h-10 flex-1 items-center justify-center gap-1 rounded-xl border px-2 text-[10px] font-bold ${compared ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]' : 'border-slate-200 text-slate-600 disabled:opacity-40'}`}>{compared ? <Check size={13} /> : <Plus size={13} />}{compared ? 'Đã chọn' : 'So sánh'}</button><button type="button" onClick={() => onSelectOptionForDetail(option, shop)} className="flex min-h-10 flex-[1.4] items-center justify-center gap-1 rounded-xl bg-[var(--color-primary)] px-2 text-[10px] font-bold text-white">Chi tiết <ArrowRight size={13} /></button></div>
          </article>;
        })}
      </div>

      {compareCount > 0 && <div className="shrink-0 border-t border-slate-200 bg-white p-2.5"><button type="button" disabled={compareCount < 2} onClick={onGoToCompare} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-xs font-bold text-white disabled:bg-blue-100 disabled:text-[var(--color-primary)]"><ArrowRightLeft size={15} /> So sánh {compareCount} xe {compareCount < 2 && '· chọn thêm 1 xe'}</button></div>}
    </div>
  );
};
