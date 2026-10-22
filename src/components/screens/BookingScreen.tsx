import React, { useState } from 'react';
import { ArrowLeft, Bike, CalendarDays, MapPin, ReceiptText, UserRound } from 'lucide-react';
import { BookingOrder, MotorbikeOption, Shop } from '../../types/wireframe';
import { formatMoney, rentalDays, rentalTotal } from '../../utils/rental';

interface BookingScreenProps {
  shop: Shop;
  option: MotorbikeOption;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  deliveryMode: 'delivery' | 'pickup';
  initialQuantity: number;
  renter: { name: string; phone: string; identity: string };
  onBack: () => void;
  onConfirm: (order: Omit<BookingOrder, 'code'>) => void;
}

const MAX_BOOKING_QUANTITY = 20;
const money = formatMoney;

export const BookingScreen: React.FC<BookingScreenProps> = ({
  shop,
  option,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  pickupLocation,
  deliveryMode,
  initialQuantity,
  renter,
  onBack,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [renterName, setRenterName] = useState(renter.name);
  const [phone, setPhone] = useState(renter.phone);
  const [identity, setIdentity] = useState(renter.identity);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const days = rentalDays(pickupDate, pickupTime, returnDate, returnTime);
  const rentalCost = option.dailyRate * days * quantity;
  const deliveryCost = deliveryMode === 'delivery' ? option.deliveryFee : 0;
  const total = rentalTotal(option.dailyRate, days, quantity, option.deliveryFee, deliveryMode);
  const nameValid = renterName.trim().length >= 2;
  const phoneValid = /^0\d{9,10}$/.test(phone.replace(/\D/g, ''));
  const identityValid = /^\d{12}$/.test(identity.replace(/\D/g, ''));
  const changeQuantity = (change: number) => {
    setQuantity((value) => Math.min(MAX_BOOKING_QUANTITY, Math.max(1, value + change)));
  };
  const confirmBooking = () => {
    setAttemptedSubmit(true);
    if (!nameValid || !phoneValid || !identityValid) return;
    onConfirm({ shop, option, quantity, total, renterName: renterName.trim(), phone: phone.trim(), identity: identity.trim(), pickupDate, pickupTime, returnDate, returnTime, pickupLocation, deliveryMode });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3.5 py-2.5 shadow-xs">
        <button type="button" onClick={onBack} className="flex h-8 items-center gap-1 rounded-lg text-[var(--color-primary)] hover:bg-blue-50" aria-label="Quay lại chi tiết xe">
          <ArrowLeft size={18} strokeWidth={2.25} /> <span className="text-[11px] font-semibold">Chi tiết</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wide">ĐẶT XE</span>
        <div className="w-[62px]" aria-hidden="true" />
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pb-5 text-xs">
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs" aria-label="Xe được đặt">
          <div className="flex items-start gap-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-blue-50">
              <img src={option.imageUrl} alt={option.bikeName} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="text-[12px] font-bold leading-4">{option.bikeName}</div>
              <div className="text-[10px] text-[var(--text-secondary)]">{shop.name}</div>
              <div className="font-bold text-[var(--color-primary)]">{money(option.dailyRate)}<span className="font-medium text-slate-500">/ngày</span></div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 font-semibold">
            <span className="flex items-center gap-1.5"><Bike size={15} className="text-[var(--color-primary)]" /> Số lượng xe</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => changeQuantity(-1)} disabled={quantity === 1} aria-label="Giảm số lượng xe" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-[var(--color-primary)] disabled:opacity-40">−</button>
              <output aria-live="polite" className="min-w-5 text-center">{quantity}</output>
              <button type="button" onClick={() => changeQuantity(1)} disabled={quantity === MAX_BOOKING_QUANTITY} aria-label="Tăng số lượng xe" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-[var(--color-primary)] disabled:opacity-40">+</button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs" aria-label="Thời gian và điểm nhận">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><CalendarDays size={16} /> Thời gian &amp; điểm nhận</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-blue-50/70 p-2.5"><div className="text-[10px] font-semibold text-slate-500">NHẬN XE</div><strong className="mt-1 block text-[11px]">{pickupTime}<br />{pickupDate}</strong></div>
            <div className="rounded-xl bg-blue-50/70 p-2.5"><div className="text-[10px] font-semibold text-slate-500">TRẢ XE</div><strong className="mt-1 block text-[11px]">{returnTime}<br />{returnDate}</strong></div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-[11px]"><MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /><div><span className="font-semibold">{deliveryMode === 'delivery' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}</span><p className="mt-0.5 text-[var(--text-secondary)]">{deliveryMode === 'delivery' ? pickupLocation : shop.address}</p></div></div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs" aria-label="Thông tin người thuê">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><UserRound size={16} /> Thông tin người thuê</h2>
          <div className="mt-3 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <label className="min-w-0 text-[11px] font-semibold">Họ tên
                <input required autoComplete="name" value={renterName} onChange={(event) => setRenterName(event.target.value)} aria-invalid={attemptedSubmit && !nameValid} className="mt-1 block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-normal outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100" />
                {attemptedSubmit && !nameValid && <span className="mt-1 block text-[10px] text-red-600">Nhập họ tên ít nhất 2 ký tự</span>}
              </label>
              <label className="min-w-0 text-[11px] font-semibold">Số điện thoại
                <input required type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} aria-invalid={attemptedSubmit && !phoneValid} className="mt-1 block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-normal outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100" />
                {attemptedSubmit && !phoneValid && <span className="mt-1 block text-[10px] text-red-600">Nhập số điện thoại hợp lệ</span>}
              </label>
            </div>
            <label className="block text-[11px] font-semibold">CCCD
              <input required inputMode="numeric" value={identity} onChange={(event) => setIdentity(event.target.value)} aria-invalid={attemptedSubmit && !identityValid} className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-normal outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100" />
              {attemptedSubmit && !identityValid && <span className="mt-1 block text-[10px] text-red-600">CCCD cần đủ 12 chữ số</span>}
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs" aria-label="Chi phí dự kiến">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><ReceiptText size={16} /> Chi phí dự kiến</h2>
          <div className="mt-3 space-y-2.5 text-[11px]">
            <div className="flex justify-between gap-2"><span className="text-[var(--text-secondary)]">Tiền thuê ({days} ngày × {quantity} xe)</span><strong>{money(rentalCost)}</strong></div>
            <div className="flex justify-between gap-2"><span className="text-[var(--text-secondary)]">Phí giao xe</span><strong>{money(deliveryCost)}</strong></div>
            <div className="flex justify-between gap-2"><span className="shrink-0 text-[var(--text-secondary)]">Cọc xe</span><strong className="text-right">{option.deposit}</strong></div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs font-bold"><span>Tổng tiền thuê</span><span aria-live="polite" className="text-base text-[var(--color-primary)]">{money(total)}</span></div>
            <p className="text-[10px] text-[var(--text-secondary)]">Tiền cọc hoàn lại, nếu có, không nằm trong tổng tiền thuê.</p>
          </div>
        </section>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {attemptedSubmit && (!nameValid || !phoneValid || !identityValid) && <p role="alert" className="mb-2 text-center text-[11px] font-semibold text-red-600">Vui lòng kiểm tra thông tin người thuê ở phía trên.</p>}
        <button type="button" onClick={confirmBooking} className="min-h-12 w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-[var(--color-primary-hover)]">Xác nhận đặt xe · {money(total)}</button>
      </div>
    </div>
  );
};
