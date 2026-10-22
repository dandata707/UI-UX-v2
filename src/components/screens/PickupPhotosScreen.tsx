import React, { useState } from 'react';
import { ArrowLeft, Camera, Check, NotebookPen } from 'lucide-react';

interface PickupPhotosScreenProps {
  onBack: () => void;
  note: string;
  onNoteChange: (note: string) => void;
  onConfirm: (photos: string[]) => void;
}

const photoLabels = ['Trước', 'Sau', 'Trái', 'Phải', 'Đồng hồ / Kim xăng'];

export const PickupPhotosScreen: React.FC<PickupPhotosScreenProps> = ({ onBack, note, onNoteChange, onConfirm }) => {
  const [photos, setPhotos] = useState<Array<{ complete: boolean; url: string | null }>>([
    { complete: false, url: null },
    { complete: false, url: null },
    { complete: false, url: null },
    { complete: false, url: null },
    { complete: false, url: null },
  ]);
  const completedCount = photos.filter((photo) => photo.complete).length;

  const handlePhoto = (index: number, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setPhotos((current) => current.map((photo, photoIndex) => photoIndex === index ? { complete: true, url: reader.result as string } : photo));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 shadow-xs">
        <button type="button" onClick={onBack} className="flex h-8 items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)]" aria-label="Quay lại chi tiết đơn"><ArrowLeft size={17} /> Chi tiết</button>
        <h1 className="text-[11px] font-bold uppercase tracking-wide">Ảnh xe lúc nhận</h1>
        <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-[var(--color-primary)]">{completedCount}/5</span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2.5">
          {photoLabels.map((label, index) => {
            const photo = photos[index];
            return (
              <section key={label} className={`rounded-xl border bg-white p-2.5 shadow-xs ${index === 4 ? 'col-span-2' : ''} ${photo.complete ? 'border-slate-200' : 'border-dashed border-[var(--color-primary)]/45'}`} aria-label={`Ảnh ${label.toLowerCase()}`}>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase"><h2>{label}</h2>{photo.complete && <span className="flex items-center gap-0.5 text-[var(--color-success-green)]"><Check size={13} /> Đã có</span>}</div>
                <div className={`relative mt-2 flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-blue-50/40 ${index === 4 ? 'h-40' : 'h-24'}`}>
                  {photo.url ? (
                    <img src={photo.url} alt={`Ảnh xe góc ${label.toLowerCase()}`} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <svg aria-hidden="true" viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-blue-900/15"><path d="M0 0 100 60 M100 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
                      <div className="relative rounded-lg bg-white/90 px-2 py-1 text-center text-[9px] font-semibold text-[var(--color-primary)] shadow-xs"><Camera size={16} className="mx-auto mb-0.5" />Chưa có ảnh</div>
                    </>
                  )}
                </div>
                <div className="mt-2 flex justify-end">
                  <label htmlFor={`pickup-photo-${index}`} className={`flex min-h-8 cursor-pointer items-center gap-1 rounded-lg px-2.5 text-[10px] font-bold ${photo.complete ? 'border border-slate-200 bg-white text-[var(--color-primary)]' : 'bg-[var(--color-primary)] text-white'}`}><Camera size={12} />{photo.complete ? 'Chụp lại' : 'Chụp'}</label>
                  <input id={`pickup-photo-${index}`} type="file" accept="image/*" onChange={(event) => { handlePhoto(index, event.target.files?.[0]); event.currentTarget.value = ''; }} className="sr-only" />
                </div>
              </section>
            );
          })}
        </div>
        <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs" aria-label="Ghi chú khi nhận xe">
          <label htmlFor="pickup-note" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><NotebookPen size={16} /> Ghi chú khi nhận xe</label>
          <p className="mt-2 text-[10px] text-[var(--text-secondary)]">Ghi lại vết xước, mức xăng hoặc vật dụng bàn giao (nếu có).</p>
          <textarea
            id="pickup-note"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Ví dụ: Xe có vết xước nhỏ bên phải, kim xăng ở mức 3/4..."
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-1 text-right text-[10px] text-[var(--text-secondary)]">{note.length}/500</div>
        </section>
        <p className="mt-3 text-center text-[10px] text-[var(--text-secondary)]">Ảnh bạn chọn chỉ được xem trên thiết bị này, chưa được tải lên máy chủ.</p>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <p className="mb-2 text-center text-[10px] font-semibold text-[var(--text-secondary)]">{completedCount < 5 ? `Còn thiếu ${5 - completedCount} ảnh` : 'Đã đủ 5 ảnh'}</p>
        <button type="button" onClick={() => onConfirm(photos.map((photo) => photo.url).filter((url): url is string => Boolean(url)))} disabled={completedCount < 5} className="min-h-12 w-full rounded-xl bg-[var(--color-primary)] px-3 text-[11px] font-bold uppercase tracking-wide text-white shadow-md shadow-blue-900/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none">Xác nhận đã nhận xe</button>
      </div>
    </div>
  );
};
