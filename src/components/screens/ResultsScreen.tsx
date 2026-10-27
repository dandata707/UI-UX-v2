import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowRightLeft, Check, ChevronDown, ChevronRight, Gauge, MapPin, Plus, Settings2, Sparkles, Star } from 'lucide-react';
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
  const lowestTotal = options.length ? Math.min(...options.map(({ option }) => totalFor(option))) : 0;
  // Mock AI labels use only the catalog and current search, not model predictions.
  const quickLabelFor = (option: MotorbikeOption, shop: Shop) => {
    const priceLabel = totalFor(option) === lowestTotal
      ? { text: 'Tiết kiệm nhất chuyến này', reason: `Chọn nếu ưu tiên ngân sách: tổng ${formatMoney(totalFor(option))} cho ${days} ngày · ${filters.quantity} xe, thấp nhất trong kết quả hiện tại.` }
      : option.dailyRate <= 120000
        ? { text: 'Hợp ngân sách tiết kiệm', reason: `Chọn nếu muốn giảm tiền thuê: ${formatMoney(option.dailyRate)}/ngày, tổng chuyến ${formatMoney(totalFor(option))}.` }
        : null;
    const ratingLabel = shop.rating >= 4.8 ? { text: 'Ưu tiên trải nghiệm được đánh giá cao', reason: `Cân nhắc nếu bạn coi trọng đánh giá cửa hàng: ${shop.rating}/5 từ ${shop.reviewCount} lượt. Tổng chuyến ${formatMoney(totalFor(option))}.` } : null;
    const distanceLabel = shop.distanceKm <= 1 ? { text: filters.deliveryMode === 'pickup' ? 'Tiện đến nhận xe gần' : 'Cửa hàng gần bạn', reason: `Cửa hàng cách vị trí mẫu ${shop.distanceKm} km; tiện cân nhắc nếu bạn muốn tự đến nhận hoặc trả xe. Giờ nhận: ${option.pickupHours}.` } : null;
    const deliveryLabel = filters.deliveryMode === 'delivery' && option.deliveryFee === 0 ? { text: 'Tiết kiệm phí giao xe', reason: `Chọn nếu cần giao tận nơi: phí giao nhận mẫu 0đ, tổng chuyến ${formatMoney(totalFor(option))}.` } : null;
    const depositLabel = { text: 'Cân nhắc điều kiện cọc', reason: `Trước khi chọn, kiểm tra khoản cần chuẩn bị: ${option.deposit}. Tiền cọc không nằm trong tổng tiền thuê hiển thị.` };
    const ordered = activeSort === 'rating' ? [ratingLabel, priceLabel, distanceLabel, deliveryLabel]
      : activeSort === 'distance' ? [distanceLabel, priceLabel, ratingLabel, deliveryLabel]
      : [priceLabel, ratingLabel, distanceLabel, deliveryLabel];
    return ordered.find((label) => label !== null) ?? depositLabel;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="shrink-0 border-b border-slate-200 bg-white px-3.5 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBackToSearch} aria-label="Đổi điều kiện tìm xe" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-blue-50"><ArrowLeft size={19} /></button>
          <div className="min-w-0 flex-1"><h1 className="text-sm font-extrabold">{options.length} xe phù hợp</h1><p className="truncate text-[10px] text-[var(--text-secondary)]">{filters.pickupDate} → {filters.returnDate} · {days} ngày · {filters.quantity} xe</p></div>
          <button type="button" onClick={onBackToSearch} className="min-h-10 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-bold text-[var(--color-primary)]">Sửa tìm kiếm</button>
        </div>
        <p className="mt-1 flex items-center gap-1 truncate px-1 text-[10px] text-[var(--text-secondary)]"><MapPin size={12} className="shrink-0" /> {filters.deliveryMode === 'delivery' ? filters.pickupLocation : 'Nhận tại cửa hàng'}</p>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pb-20">
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs" aria-label="Sắp xếp xe">
          <div className="flex items-center justify-between gap-2"><h2 className="text-xs font-bold">Sắp xếp theo</h2><div className="relative"><button type="button" onClick={() => setSortOpen(!sortOpen)} aria-expanded={sortOpen} className="flex min-h-10 items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-bold text-[var(--color-primary)]">{sortLabels[activeSort]} <ChevronDown size={15} /></button>{sortOpen && <div className="absolute right-0 top-full z-40 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">{(Object.keys(sortLabels) as SortKey[]).map((key) => <button key={key} type="button" onClick={() => { setActiveSort(key); setSortOpen(false); }} className={`block min-h-10 w-full rounded-lg px-3 py-2 text-left text-xs ${activeSort === key ? 'bg-blue-50 font-bold text-[var(--color-primary)]' : 'hover:bg-slate-50'}`}>{sortLabels[key]}</button>)}</div>}</div></div>
        </section>

        {options.length > 0 && <p className="flex items-center gap-1.5 px-1 text-[10px] leading-4 text-slate-500"><Sparkles size={12} className="shrink-0 text-emerald-600" />Chạm nhãn AI để xem lý do chọn · Dữ liệu minh họa.</p>}

        {options.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center"><h2 className="text-sm font-bold">Chưa có xe phù hợp</h2><p className="mt-1 text-[11px] text-[var(--text-secondary)]">Thử đổi loại xe để xem thêm lựa chọn.</p><button type="button" onClick={onBackToSearch} className="mt-4 min-h-11 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white">Đổi loại xe</button></section>
        ) : options.map(({ shop, option }) => {
          const compared = selectedOptionIds.includes(option.id);
          const compareDisabled = !compared && compareCount >= 3;
          const aiLabel = quickLabelFor(option, shop);
          return <article key={option.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <details className="group">
              <summary className="ml-auto flex min-h-8 w-fit max-w-full cursor-pointer list-none items-center justify-end gap-1.5 rounded-bl-xl border-b border-l border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-100 px-3 py-1.5 text-[10px] font-bold leading-4 text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-600 [&::-webkit-details-marker]:hidden">
                <Sparkles size={12} className="shrink-0" aria-hidden="true" />
                <span><span className="font-extrabold">AI · </span>{aiLabel.text}</span>
                <ChevronDown size={12} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mx-3 mt-2 rounded-xl border border-emerald-100 bg-emerald-50 p-2.5 text-[11px] leading-4 text-emerald-800">{aiLabel.reason}</p>
            </details>
            <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-3">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xs font-extrabold leading-4">{shop.name}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-[var(--text-secondary)]"><Star size={12} className="fill-amber-400 text-amber-500" /><span>{shop.rating} ({shop.reviewCount} đánh giá)</span><span className="mx-0.5">·</span><MapPin size={12} /><span>{shop.distanceKm} km</span></p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-slate-500" aria-hidden="true" />
            </div>
            <div className="flex items-start gap-3 px-3 pb-3">
              <img src={option.imageUrl} alt={option.bikeName} className="h-28 w-[42%] shrink-0 rounded-xl bg-slate-50 object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold leading-4">{option.bikeName}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-[var(--text-secondary)]"><span className="flex items-center gap-1"><Gauge size={11} />{option.engine}</span><span className="flex items-center gap-1"><Settings2 size={11} />{option.bikeType}</span></div>
                <p className="mt-2 text-base font-extrabold leading-5 text-[var(--color-primary)]">{formatMoney(option.dailyRate)}<span className="text-[11px] font-normal text-[var(--text-secondary)]">/ngày</span></p>
                <p className="mt-1 text-[10px] text-[var(--text-secondary)]">Phí giao: {filters.deliveryMode === 'delivery' ? formatMoney(option.deliveryFee) : '0đ'}</p>
              </div>
            </div>
            <div className="mx-3 flex items-center justify-between gap-2 border-t border-slate-100 py-2"><span className="text-[11px] text-[var(--text-secondary)]">Tổng {days} ngày · {filters.quantity} xe</span><strong className="text-base font-extrabold text-[var(--color-primary)]">{formatMoney(totalFor(option))}</strong></div>
            <div className="flex gap-2 px-3 pb-3"><button type="button" onClick={() => onToggleCompare(option)} disabled={compareDisabled} className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 text-sm font-bold ${compared ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]' : 'border-slate-200 text-slate-600 disabled:opacity-40'}`}>{compared ? <Check size={16} /> : <Plus size={16} />}{compared ? 'Đã chọn' : 'So sánh'}</button><button type="button" onClick={() => onSelectOptionForDetail(option, shop)} className="flex min-h-11 flex-[1.2] items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-2 text-sm font-bold text-white">Chi tiết <ArrowRight size={16} /></button></div>
          </article>;
        })}
      </div>

      {compareCount > 0 && <div className="shrink-0 border-t border-slate-200 bg-white p-2.5"><button type="button" disabled={compareCount < 2} onClick={onGoToCompare} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-sm font-bold text-white disabled:bg-blue-100 disabled:text-[var(--color-primary)]"><ArrowRightLeft size={17} /> So sánh {compareCount} xe {compareCount < 2 && '· chọn thêm 1 xe'}</button></div>}
    </div>
  );
};
