import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock3, CreditCard, X } from 'lucide-react';
import { ProfileOrder } from './ProfileScreen';
import { OrderBikeSummary, OrderDetailHeader, OrderSchedule, OrderSection, OrderStatusHero, OrderTotal } from '../OrderDetailParts';

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
      <OrderDetailHeader title="Chi tiết đơn đã trả" onBack={onBack} />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pb-6">
        <OrderStatusHero code={order.code} completed bookedAt={order.bookedAt} />

        <OrderSection title="Xe & lịch trình" icon={<CalendarDays size={16} />}>
          <OrderBikeSummary name={order.bikeName} type={order.bikeType} quantity={order.quantity ?? 1} />
          <div className="mt-4 border-t border-slate-100 pt-4"><OrderSchedule range={order.timeRange ?? order.dates} place={order.pickupLocation} deliveryMode={order.deliveryMode} /></div>
          <div className="mt-4 border-t border-slate-100 pt-3"><p className="text-[10px] text-slate-500">Cửa hàng cho thuê</p><p className="mt-1 text-[11px] font-semibold leading-5">{order.shopName}</p></div>
        </OrderSection>

        <OrderSection title="Lịch sử hành trình" icon={<Clock3 size={16} />}>
          <ol>{[
            { label: 'Đặt xe', time: order.bookedAt },
            { label: 'Nhận xe', time: order.receivedAt },
            { label: 'Trả xe', time: order.returnedAt },
          ].map((event, index) => <li key={event.label} className="relative flex gap-3 pb-4 last:pb-0">
            {index < 2 && <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-6 w-px bg-slate-200" />}
            <span className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${event.time ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{event.time ? <CheckCircle2 size={14} /> : <Clock3 size={13} />}</span>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-0.5"><span className="text-[11px] font-semibold">{event.label}</span><span className="text-right text-[10px] leading-4 text-slate-500">{event.time ?? 'Chưa ghi nhận'}</span></div>
          </li>)}</ol>
        </OrderSection>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Thông tin nhận xe">
          <h2 className="flex items-center gap-2 text-[13px] font-bold"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[var(--color-primary)]"><Camera size={16} /></span>Ảnh bàn giao xe</h2>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">Hình ảnh lúc nhận để tham khảo và đối chiếu sau hành trình.</p>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <h3 className="text-[11px] font-semibold">Ảnh lúc nhận xe {photos.length > 0 && `· ${photos.length} ảnh`}</h3>
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

        <OrderSection title="Chi phí đơn thuê" icon={<CreditCard size={16} />}>
          <OrderTotal amount={order.total} completed />
          {order.deposit && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3"><p className="text-[10px] font-bold text-amber-800">Điều kiện cọc theo đơn</p><p className="mt-1 text-[11px] leading-5 text-amber-900">{order.deposit}</p></div>}
          <p className="mt-3 text-[10px] leading-5 text-slate-500">Trạng thái trả xe được ghi nhận trong bản mẫu. Thanh toán và hoàn cọc thực tế cần cửa hàng xác nhận.</p>
        </OrderSection>
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
