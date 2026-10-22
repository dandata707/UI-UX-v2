export const formatMoney = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

const dateTimeValue = (date: string, time: string) => {
  const [day, month, year] = date.split('/').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return Date.UTC(year, month - 1, day, hour, minute);
};

export const rentalDays = (pickupDate: string, pickupTime: string, returnDate: string, returnTime: string) => {
  const duration = dateTimeValue(returnDate, returnTime) - dateTimeValue(pickupDate, pickupTime);
  return Number.isFinite(duration) ? Math.max(1, Math.ceil(duration / 86400000)) : 1;
};

export const rentalTotal = (dailyRate: number, days: number, quantity: number, deliveryFee: number, deliveryMode: 'delivery' | 'pickup') =>
  dailyRate * days * quantity + (deliveryMode === 'delivery' ? deliveryFee : 0);

const vietnamDate = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('day')}/${value('month')}/${value('year')}`;
};

export const vietnamToday = () => vietnamDate(new Date());

export const vietnamDateTime = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('hour')}:${value('minute')} ${value('day')}/${value('month')}/${value('year')}`;
};

export const defaultRentalDates = () => {
  const today = new Date();
  return {
    pickupDate: vietnamDate(new Date(today.getTime() + 86400000)),
    returnDate: vietnamDate(new Date(today.getTime() + 3 * 86400000)),
  };
};
