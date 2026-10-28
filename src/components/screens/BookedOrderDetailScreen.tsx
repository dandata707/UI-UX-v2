import React, { useState } from 'react';
import { CalendarDays, Camera, CheckCircle2, CreditCard, FileCheck2, Phone, Store, XCircle } from 'lucide-react';
import { BookingOrder } from '../../types/wireframe';
import { ProfileOrder } from './ProfileScreen';
import { formatMoney, rentalDays } from '../../utils/rental';
import { OrderBikeSummary, OrderDetailHeader, OrderSchedule, OrderSection, OrderStatusHero, OrderTotal } from '../OrderDetailParts';

interface BookedOrderDetailScreenProps {
  order: BookingOrder | ProfileOrder;
  onBack: () => void;
  onReceive: () => void;
}

export const BookedOrderDetailScreen: React.FC<BookedOrderDetailScreenProps> = ({ order, onBack, onReceive }) => {
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  const isFullOrder = 'option' in order;
  const bikeName = isFullOrder ? order.option.bikeName : order.bikeName;
  const shopName = isFullOrder ? order.shop.name : order.shopName;
  const shopPhone = isFullOrder ? order.shop.phone : order.shopPhone;
  const timeRange = isFullOrder ? `${order.pickupTime} ${order.pickupDate} → ${order.returnTime} ${order.returnDate}` : order.timeRange ?? order.dates;
  const pickupPlace = isFullOrder ? (order.deliveryMode === 'delivery' ? order.pickupLocation : order.shop.address) : order.pickupLocation;
  const deposit = isFullOrder ? order.option.deposit : order.deposit;
  const quantity = order.quantity ?? 1;
  const days = isFullOrder ? rentalDays(order.pickupDate, order.pickupTime, order.returnDate, order.returnTime) : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface-app-bg)] text-[var(--text-primary)]">
      <OrderDetailHeader title="Chi tiết đơn thuê" onBack={onBack} />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pb-5">
        <OrderStatusHero code={order.code} bookedAt={order.bookedAt} />

        <OrderSection title="Xe & lịch trình" icon={<CalendarDays size={16} />}>
          <OrderBikeSummary name={bikeName} type={isFullOrder ? order.option.bikeType : order.bikeType} quantity={quantity} image={isFullOrder ? order.option.imageUrl : undefined} />
          <div className="mt-4 border-t border-slate-100 pt-4"><OrderSchedule range={timeRange} place={pickupPlace} deliveryMode={order.deliveryMode} /></div>
        </OrderSection>

        <OrderSection title="Cửa hàng cho thuê" icon={<Store size={16} />}>
          <h3 className="text-xs font-bold leading-5">{shopName}</h3>
          {shopPhone ? <a href={`tel:${shopPhone.replace(/\s+/g, '')}`} className="mt-3 flex min-h-10 items-center justify-between gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 text-[11px] font-semibold text-[var(--color-primary)]"><span className="flex items-center gap-2"><Phone size={14} />{shopPhone}</span><span>Gọi cửa hàng</span></a> : <p className="mt-2 text-[11px] text-slate-500">Chưa cập nhật số điện thoại cửa hàng.</p>}
        </OrderSection>

        <OrderSection title="Chi phí đơn thuê" icon={<CreditCard size={16} />}>
          <OrderTotal amount={order.total}>
            {isFullOrder && <dl className="mb-3 space-y-2.5 text-[11px]"><div className="flex justify-between gap-3"><dt className="text-slate-500">Thuê xe · {days} ngày × {quantity} xe</dt><dd className="font-semibold">{formatMoney(order.option.dailyRate * days! * quantity)}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Phí giao nhận</dt><dd className="font-semibold">{formatMoney(order.deliveryMode === 'delivery' ? order.option.deliveryFee : 0)}</dd></div></dl>}
          </OrderTotal>
          {deposit && <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3"><FileCheck2 size={15} className="mt-0.5 shrink-0 text-amber-700" /><div><p className="text-[10px] font-bold text-amber-800">Giấy tờ & tiền cọc</p><p className="mt-1 text-[11px] leading-5 text-amber-900">{deposit}</p></div></div>}
        </OrderSection>

        <OrderSection title="Chuẩn bị nhận xe" icon={<Camera size={16} />}>
          <p className="mb-3 text-[11px] leading-5 text-slate-500">Kiểm tra cùng cửa hàng trước khi xác nhận bàn giao.</p>
          <ul className="space-y-2.5">{['Kiểm tra phanh, đèn, xi-nhan và còi', 'Chụp 5 ảnh: 4 góc xe và đồng hồ', 'Đối chiếu mũ bảo hiểm, giấy tờ theo đơn'].map((text, index) => <li key={text} className="flex items-start gap-2.5 text-[11px] leading-5"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[9px] font-bold text-[var(--color-primary)]">{index + 1}</span>{text}</li>)}</ul>
          <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] text-slate-500"><CheckCircle2 size={13} className="text-emerald-700" />Lưu ảnh để dễ đối chiếu khi trả xe.</div>
        </OrderSection>
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white p-3 shadow-[0_-4px_20px_rgba(15,23,42,0.04)]">
        {showCancelMessage && <p role="status" className="mb-3 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[11px] leading-5 text-[var(--color-primary)]"><XCircle size={16} className="mt-0.5 shrink-0" />Đây là đơn mẫu; việc hủy đặt chưa được gửi đến cửa hàng.</p>}
        <div className="mb-3 flex items-center justify-between px-1"><span className="text-[11px] text-slate-500">Tổng tiền thuê</span><strong className="text-lg font-extrabold text-[var(--color-primary)]">{formatMoney(order.total)}</strong></div>
        <div className="grid grid-cols-[1fr_1.8fr] gap-2"><button type="button" onClick={() => setShowCancelMessage(true)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50">Hủy đặt</button><button type="button" onClick={onReceive} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-3 text-[13px] font-bold text-white shadow-sm"><Camera size={17} />Tiếp tục nhận xe</button></div>
      </footer>
    </div>
  );
};
