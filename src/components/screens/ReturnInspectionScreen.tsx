import React, { useState } from 'react';
import { ArrowLeft, Bike, CalendarDays, Camera, ChevronLeft, ChevronRight, CircleAlert, ClipboardCheck, MapPin, Store } from 'lucide-react';
import { ProfileOrder } from './ProfileScreen';

interface ReturnInspectionScreenProps {
  order: ProfileOrder;
  onBack: () => void;
  onConfirmReturn: () => void;
}

const photoLabels = ['Mặt trước', 'Mặt trái', 'Thân xe', 'Bình xăng'];
const receivedPhotoLabels = ['Trước', 'Sau', 'Trái', 'Phải', 'Đồng hồ / Kim xăng'];
const initialChecks = [true, true, false];
const checklist = [
  'Thân vỏ: Không xước mới (khớp ảnh nhận)',
  'Gương, còi, đèn: Hoạt động tốt',
  'Mũ bảo hiểm và áo mưa: Đã trả đủ',
];
const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

export const ReturnInspectionScreen: React.FC<ReturnInspectionScreenProps> = ({ order, onBack, onConfirmReturn }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [checks, setChecks] = useState(initialChecks);
  const [note, setNote] = useState('');
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const receivedPhotos = order.pickupPhotos ?? [];
  const galleryLabels = receivedPhotos.length ? receivedPhotoLabels.slice(0, receivedPhotos.length) : photoLabels;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="relative flex shrink-0 items-center justify-center border-b border-slate-200 bg-white px-3 py-2.5 shadow-xs">
        <button type="button" onClick={onBack} className="absolute left-3 flex h-8 items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)]" aria-label="Quay lại lịch sử đơn"><ArrowLeft size={17} /> Lịch sử đơn</button>
        <h1 className="text-[11px] font-bold uppercase tracking-wide">Chi tiết đơn thuê</h1>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Thông tin đơn thuê">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5"><strong className="text-[11px]">{order.code}</strong><span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase text-[var(--color-primary)]">Đang thuê</span></div>
          <div className="mt-3 flex items-start justify-between gap-2"><div className="flex min-w-0 items-start gap-2"><Bike size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><strong className="text-[11px]">{order.bikeName}</strong></div><strong className="shrink-0 text-[11px] text-[var(--color-primary)]">{money(order.total)}</strong></div>
          <div className="mt-3 space-y-2 text-[10px] text-[var(--text-secondary)]">
            <div className="flex items-start gap-2"><Store size={14} className="shrink-0 text-[var(--color-primary)]" /><span>Cửa hàng: <strong className="text-[var(--text-primary)]">{order.shopName}</strong></span></div>
            <div className="flex items-start gap-2"><CalendarDays size={14} className="shrink-0 text-[var(--color-primary)]" /><span>Thời gian thuê: <strong className="text-[var(--text-primary)]">{order.timeRange ?? order.dates}</strong></span></div>
            <div className="flex items-start gap-2"><MapPin size={14} className="shrink-0 text-[var(--color-primary)]" /><span>Điểm nhận: <strong className="text-[var(--text-primary)]">{order.pickupLocation ?? 'Tại cửa hàng'}</strong></span></div>
            <p className="border-t border-slate-100 pt-2">Tiền cọc: <strong className="text-[var(--text-primary)]">{order.deposit ?? 'Theo quy định của cửa hàng'}</strong></p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Ảnh nhận xe đã lưu">
          <h2 className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><span className="flex items-center gap-2"><Camera size={16} /> Ảnh lúc nhận xe {receivedPhotos.length > 0 && `(${receivedPhotos.length} ảnh)`}</span><span className="rounded-md bg-blue-50 px-1.5 py-1 text-[9px]">{photoIndex + 1}/{galleryLabels.length}</span></h2>
          <div className="relative mt-3 flex h-40 items-center justify-center rounded-xl border border-blue-900/15 bg-gradient-to-br from-blue-50 via-white to-slate-100">
            {receivedPhotos[photoIndex] ? <img src={receivedPhotos[photoIndex]} alt={`Ảnh xe lúc nhận: ${galleryLabels[photoIndex]}`} className="h-full w-full object-contain" /> : <div className="text-center text-[var(--text-secondary)]"><Camera size={28} className="mx-auto text-[var(--color-primary)]/50" /><div className="mt-2 text-[11px] font-semibold">{galleryLabels[photoIndex]}</div><div className="mt-0.5 text-[9px]">Đơn mẫu chưa có ảnh lúc nhận</div></div>}
            <button type="button" onClick={() => setPhotoIndex((index) => (index + galleryLabels.length - 1) % galleryLabels.length)} aria-label="Ảnh trước" className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--color-primary)] shadow-sm"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => setPhotoIndex((index) => (index + 1) % galleryLabels.length)} aria-label="Ảnh tiếp theo" className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--color-primary)] shadow-sm"><ChevronRight size={18} /></button>
          </div>
          <div className={`mt-2 grid gap-1.5 ${galleryLabels.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`}>{galleryLabels.map((label, index) => <button key={label} type="button" onClick={() => setPhotoIndex(index)} aria-pressed={photoIndex === index} className={`min-h-9 rounded-lg border px-1 text-[9px] font-semibold ${photoIndex === index ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>#{index + 1}<br />{label}</button>)}</div>
          {receivedPhotos.length === 0 && <p className="mt-2 rounded-lg bg-blue-50 p-2 text-[10px] text-[var(--text-secondary)]">Đơn mẫu chưa có ảnh hoặc ghi chú nhận xe được lưu.</p>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Đối chiếu tình trạng lúc trả">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><ClipboardCheck size={16} /> Đối chiếu tình trạng lúc trả</h2>
          <div className="mt-3 space-y-2">{checklist.map((item, index) => <label key={item} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-[10px] font-medium"><input type="checkbox" checked={checks[index]} onChange={() => setChecks((current) => current.map((checked, checkIndex) => checkIndex === index ? !checked : checked))} className="mt-0.5 accent-[var(--color-primary)]" /><span>{item}</span></label>)}</div>
          <label className="mt-3 block text-[10px] font-semibold">Ghi chú khi trả xe<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Thêm ghi chú nếu có..." rows={2} className="mt-1 block w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[11px] font-normal outline-none focus:border-[var(--color-primary)]" /></label>
        </section>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"><button type="button" onClick={() => setShowReturnConfirm(true)} className="min-h-12 w-full rounded-xl bg-[var(--color-primary)] px-4 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-blue-900/20 hover:bg-[var(--color-primary-hover)]">Đối chiếu &amp; trả xe</button></div>

      {showReturnConfirm && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div role="dialog" aria-modal="true" aria-labelledby="return-confirm-title" aria-describedby="return-confirm-description" className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <h2 id="return-confirm-title" className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]"><CircleAlert size={17} /> Xác nhận trả xe</h2>
            <p id="return-confirm-description" className="mt-3 text-xs leading-relaxed text-[var(--text-primary)]">Xác nhận đã đối chiếu xe <strong>{order.bikeName}</strong> và bàn giao chìa khóa, nhận lại giấy tờ hoặc tiền cọc (nếu có)?</p>
            <p className="mt-2 text-[10px] text-[var(--text-secondary)]">Mã đơn: <strong>{order.code}</strong> · Tiệm: <strong>{order.shopName}</strong></p>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <button type="button" autoFocus onClick={() => setShowReturnConfirm(false)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-2 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-slate-50">Hủy</button>
              <button type="button" onClick={onConfirmReturn} className="min-h-11 rounded-xl bg-[var(--color-primary)] px-2 text-[11px] font-bold text-white hover:bg-[var(--color-primary-hover)]">Xác nhận trả xe</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
