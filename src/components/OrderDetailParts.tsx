import React, { useState } from 'react';
import { ArrowLeft, Bike, CalendarDays, Check, CheckCircle2, ClipboardList, Copy, MapPin } from 'lucide-react';
import { formatMoney } from '../utils/rental';

export function OrderDetailHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3"><button type="button" onClick={onBack} aria-label="Quay lại lịch sử đơn" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-[var(--color-primary)] hover:bg-blue-50"><ArrowLeft size={19} /></button><div className="min-w-0"><p className="text-[9px] font-semibold tracking-widest text-slate-500">ĐÀ LẠT RIDE</p><h1 className="mt-0.5 text-sm font-extrabold">{title}</h1></div></header>;
}

export function OrderStatusHero({ code, completed = false, bookedAt }: { code: string; completed?: boolean; bookedAt?: string }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyCode = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  };
  return <section aria-label="Trạng thái đơn thuê" className={`relative overflow-hidden rounded-3xl border p-4 ${completed ? 'border-emerald-600/15 bg-gradient-to-br from-emerald-50 to-white' : 'border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50'}`}>
    <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-7 h-28 w-28 rounded-full border-[18px] border-white/60" />
    <div className="relative flex items-center gap-3"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${completed ? 'text-emerald-700' : 'text-[var(--color-primary)]'}`}>{completed ? <CheckCircle2 size={25} /> : <ClipboardList size={25} />}</span><div><span className={`text-[10px] font-bold ${completed ? 'text-emerald-700' : 'text-[var(--color-primary)]'}`}>{completed ? 'HOÀN TẤT HÀNH TRÌNH' : 'SẴN SÀNG CHO CHUYẾN ĐI'}</span><h2 className="mt-1 text-xl font-extrabold tracking-tight">{completed ? 'Đã trả xe' : 'Đã đặt xe'}</h2></div></div>
    <p className="relative mt-3 text-[11px] leading-5 text-slate-600">{completed ? 'Thông tin hành trình và hình ảnh bàn giao được lưu tại đây.' : 'Xem lại lịch nhận xe và chuẩn bị trước khi lên đường.'}</p>
    <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-dashed border-slate-300 pt-3"><div><p className="text-[10px] text-slate-500">Mã đơn thuê</p><p className="mt-1 font-mono text-[13px] font-bold tracking-wide">{code}</p></div><button type="button" onClick={copyCode} aria-label="Sao chép mã đơn thuê" className="flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-600">{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Đã chép' : 'Sao chép'}</button></div>
    {bookedAt && <p className="mt-2 text-[10px] text-slate-500">Đặt lúc {bookedAt}</p>}
    <span role="status" className="sr-only">{copied ? 'Đã sao chép mã đơn' : ''}</span>
    {copyError && <p role="status" className="mt-2 text-[10px] text-slate-500">Không thể sao chép. Bạn có thể ghi lại mã đơn phía trên.</p>}
  </section>;
}

export function OrderSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs" aria-label={title}><h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[var(--color-primary)]">{icon}</span>{title}</h2>{children}</section>;
}

export function OrderBikeSummary({ name, type, quantity, image }: { name: string; type?: string; quantity: number; image?: string }) {
  return <div className="flex items-center gap-3"><div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">{image ? <img src={image} alt={name} className="h-full w-full object-cover" /> : <Bike size={34} strokeWidth={1.5} className="text-[var(--color-primary)]" />}</div><div className="min-w-0"><p className="text-[10px] text-slate-500">XE ĐÃ CHỌN</p><h3 className="mt-1 text-[13px] font-bold leading-5">{name}</h3><div className="mt-2 flex flex-wrap gap-1.5">{type && <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] text-slate-600">{type}</span>}<span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-semibold text-[var(--color-primary)]">{quantity} xe</span></div></div></div>;
}

export function OrderSchedule({ range, place, deliveryMode }: { range: string; place?: string; deliveryMode?: 'delivery' | 'pickup' }) {
  const [pickup, returned] = range.split('→').map((part) => part.trim());
  return <div className="space-y-3"><div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">{[{ label: 'NHẬN XE', value: pickup }, { label: 'TRẢ XE DỰ KIẾN', value: returned }].map((item) => <div key={item.label}><p className="flex items-center gap-1 text-[9px] font-semibold text-slate-500"><CalendarDays size={11} />{item.label}</p><p className="mt-2 text-[12px] font-bold leading-5">{item.value || 'Chưa cập nhật'}</p></div>)}</div>{place && <div className="flex items-start gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><div><p className="text-[10px] text-slate-500">{deliveryMode === 'delivery' ? 'Giao xe tận nơi' : deliveryMode === 'pickup' ? 'Nhận tại cửa hàng' : 'Địa điểm nhận xe'}</p><p className="mt-1 text-[11px] font-medium leading-5">{place}</p></div></div>}</div>;
}

export function OrderTotal({ amount, completed = false, children }: { amount: number; completed?: boolean; children?: React.ReactNode }) {
  return <div>{children}<div className="flex items-end justify-between gap-2 rounded-xl bg-blue-50 p-3"><div><p className="text-[11px] font-semibold">{completed ? 'Tổng tiền đặt xe' : 'Tổng tiền thuê'}</p><p className="mt-1 text-[9px] text-slate-500">Tiền cọc tính riêng theo cửa hàng</p></div><strong className="text-xl font-extrabold tracking-tight text-[var(--color-primary)]">{formatMoney(amount)}</strong></div></div>;
}
