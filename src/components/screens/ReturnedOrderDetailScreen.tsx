import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bike, CalendarDays, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock3, CreditCard, X } from 'lucide-react';
import { ProfileOrder } from './ProfileScreen';
import { formatMoney } from '../../utils/rental';

interface ReturnedOrderDetailScreenProps {
  order: ProfileOrder;
  onBack: () => void;
}

const photoLabels = ['Trước', 'Sau', 'Trái', 'Phải', 'Đồng hồ / Kim xăng'];

export const ReturnedOrderDetailScreen: React.FC<ReturnedOrderDetailScreenProps> = ({ order, onBack }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const photoTriggerRef = useRef<HTMLButtonElement | null>(null);
  const photos = order.pickupPhotos ?? [];
  const openPhoto = (index: number, trigger: HTMLButtonElement) => {
    setSelectedPhoto(index);
    photoTriggerRef.current = trigger;
    setLightboxOpen(true);
  };
  const closePhoto = () => {
    setLightboxOpen(false);
    requestAnimationFrame(() => photoTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePhoto();
      if (event.key === 'ArrowLeft') setSelectedPhoto((index) => (index + photos.length - 1) % photos.length);
      if (event.key === 'ArrowRight') setSelectedPhoto((index) => (index + 1) % photos.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, photos.length]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5 shadow-xs">
        <button type="button" onClick={onBack} aria-label="Quay lại đơn đã trả" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-blue-50"><ArrowLeft size={18} /></button>
        <h1 className="min-w-0 flex-1 text-[11px] font-bold uppercase tracking-wide">Chi tiết đơn đã trả</h1>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-[var(--color-success-green)]">Đã trả</span>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pb-6">
        <div className="rounded-2xl bg-[var(--color-primary)] p-3.5 text-white shadow-sm">
          <p className="text-[10px] text-white/80">Mã đơn thuê</p>
          <p className="mt-0.5 text-sm font-extrabold">{order.code}</p>
          <p className="mt-2 text-[10px] text-white/85">{order.shopName}</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Thông tin đặt xe">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><CalendarDays size={16} /> 1. Thông tin đặt xe</h2>
          <dl className="mt-3 space-y-3 text-[11px]">
            <div className="flex justify-between gap-3"><dt className="text-[var(--text-secondary)]">Thời gian đặt</dt><dd className="text-right font-semibold">{order.bookedAt ?? 'Chưa ghi nhận'}</dd></div>
            <div className="flex items-start gap-2 border-t border-slate-100 pt-2.5"><Bike size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><div><dt className="text-[10px] text-[var(--text-secondary)]">Xe / loại xe</dt><dd className="mt-0.5 font-bold">{order.bikeName}</dd><dd className="mt-0.5 text-[var(--text-secondary)]">{order.bikeType ?? 'Chưa cập nhật loại xe'}</dd></div></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--text-secondary)]">Số lượng</dt><dd className="font-semibold">{order.quantity ?? 1} xe</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--text-secondary)]">Thời gian thuê dự kiến</dt><dd className="max-w-[58%] text-right font-semibold">{order.timeRange ?? order.dates}</dd></div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5"><dt className="flex items-center gap-1.5 font-semibold"><CreditCard size={15} className="text-[var(--color-primary)]" /> Giá đặt xe</dt><dd className="text-sm font-extrabold text-[var(--color-primary)]">{formatMoney(order.total)}</dd></div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Thông tin nhận xe">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><Camera size={16} /> 2. Nhận xe</h2>
          <p className="mt-3 flex items-center gap-1.5 text-[11px]"><Clock3 size={14} className="text-[var(--color-primary)]" /><span className="text-[var(--text-secondary)]">Thời gian nhận:</span> <strong>{order.receivedAt ?? 'Chưa ghi nhận'}</strong></p>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wide">Ảnh lúc nhận xe {photos.length > 0 && `(${photos.length})`}</h3>
            {photos.length > 0 ? (
              <>
                <button type="button" onClick={(event) => openPhoto(selectedPhoto, event.currentTarget)} aria-label={`Phóng to ảnh ${photoLabels[selectedPhoto] ?? selectedPhoto + 1}`} className="mt-2 block w-full overflow-hidden rounded-xl border border-slate-200 bg-blue-50"><img src={photos[selectedPhoto]} alt={`Ảnh xe lúc nhận: ${photoLabels[selectedPhoto] ?? `Ảnh ${selectedPhoto + 1}`}`} className="h-44 w-full object-contain" /></button>
                <div className="mt-2 grid grid-cols-5 gap-1.5">{photos.map((photo, index) => <button key={index} type="button" onClick={(event) => openPhoto(index, event.currentTarget)} aria-label={`Phóng to ảnh ${photoLabels[index] ?? index + 1}`} aria-pressed={selectedPhoto === index} className={`overflow-hidden rounded-lg border-2 ${selectedPhoto === index ? 'border-[var(--color-primary)]' : 'border-slate-200'}`}><img src={photo} alt="" className="h-12 w-full object-cover" /><span className="block truncate bg-white px-0.5 py-1 text-[8px] font-semibold">{photoLabels[index] ?? `Ảnh ${index + 1}`}</span></button>)}</div>
              </>
            ) : (
              <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3"><div className="grid grid-cols-5 gap-1.5">{photoLabels.map((label) => <div key={label} className="flex min-h-16 flex-col items-center justify-center rounded-lg bg-white px-1 text-center text-[8px] text-[var(--text-secondary)]"><Camera size={15} className="mb-1 text-slate-400" />{label}</div>)}</div><p className="mt-2 text-center text-[10px] text-[var(--text-secondary)]">Đơn mẫu này chưa có ảnh lúc nhận được lưu.</p></div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-600/20 bg-white p-3.5 shadow-xs" aria-label="Thông tin trả xe">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-success-green)]"><CheckCircle2 size={16} /> 3. Trả xe</h2>
          <div className="mt-3 flex justify-between gap-3 text-[11px]"><span className="text-[var(--text-secondary)]">Thời gian trả</span><strong className="text-right">{order.returnedAt ?? 'Chưa ghi nhận'}</strong></div>
        </section>
      </div>

      {lightboxOpen && photos.length > 0 && (
        <div role="dialog" aria-modal="true" aria-label="Ảnh xe lúc nhận phóng to" className="absolute inset-0 z-50 flex flex-col bg-slate-950/95 text-white">
          <div className="flex shrink-0 items-center justify-between p-3"><span className="text-xs font-bold">{photoLabels[selectedPhoto] ?? `Ảnh ${selectedPhoto + 1}`} · {selectedPhoto + 1}/{photos.length}</span><button type="button" autoFocus onClick={closePhoto} aria-label="Đóng ảnh phóng to" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"><X size={20} /></button></div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-6"><img src={photos[selectedPhoto]} alt={`Ảnh xe lúc nhận: ${photoLabels[selectedPhoto] ?? `Ảnh ${selectedPhoto + 1}`}`} className="max-h-full max-w-full object-contain" />{photos.length > 1 && <><button type="button" onClick={() => setSelectedPhoto((index) => (index + photos.length - 1) % photos.length)} aria-label="Ảnh trước" className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/70 text-white"><ChevronLeft size={20} /></button><button type="button" onClick={() => setSelectedPhoto((index) => (index + 1) % photos.length)} aria-label="Ảnh tiếp theo" className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/70 text-white"><ChevronRight size={20} /></button></>}</div>
        </div>
      )}
    </div>
  );
};
