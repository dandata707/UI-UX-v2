import React, { useCallback, useState } from 'react';
import {
  INITIAL_SHOPS,
} from './data/mockData';
import {
  ScreenId,
  MotorbikeOption,
  Shop,
  SearchFilterState,
  BookingOrder,
} from './types/wireframe';
import { PhoneFrame } from './components/PhoneFrame';
import { ScreenPopup } from './components/ScreenPopup';
import { SearchScreen } from './components/screens/SearchScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ShopBikesScreen } from './components/screens/ShopBikesScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { LocationScreen } from './components/screens/LocationScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { DetailScreen } from './components/screens/DetailScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { BookingSuccessScreen } from './components/screens/BookingSuccessScreen';
import { BookedOrderDetailScreen } from './components/screens/BookedOrderDetailScreen';
import { PickupPhotosScreen } from './components/screens/PickupPhotosScreen';
import { PickupSuccessScreen } from './components/screens/PickupSuccessScreen';
import { ProfileScreen, ProfileData, ProfileOrder, OrderStatus } from './components/screens/ProfileScreen';
import { ReturnInspectionScreen } from './components/screens/ReturnInspectionScreen';
import { ReturnSuccessScreen } from './components/screens/ReturnSuccessScreen';
import { ReturnedOrderDetailScreen } from './components/screens/ReturnedOrderDetailScreen';
import { SingleBikeShareSheetScreen } from './components/screens/SingleBikeShareSheetScreen';
import { CompareScreen } from './components/screens/CompareScreen';
import { ShareSheetScreen } from './components/screens/ShareSheetScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { BottomNav } from './components/BottomNav';
import { defaultRentalDates, vietnamDateTime } from './utils/rental';
import {
  Smartphone,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [initialDates] = useState(defaultRentalDates);
  // Active Screen ID in interactive prototype
  const [activeScreenId, setActiveScreenId] = useState<ScreenId>('home');
  const [activePopup, setActivePopup] = useState<'calendar' | 'location' | 'share' | 'share-single' | null>(null);
  const closePopup = useCallback(() => setActivePopup(null), []);

  const navigateToScreen = (id: ScreenId) => {
    if (id === 'calendar' || id === 'location') {
      setActiveScreenId('search');
      setActivePopup(id);
    } else if (id === 'share' || id === 'share-single') {
      setActiveScreenId(id === 'share' ? 'compare-2' : 'detail');
      setActivePopup(id);
    } else {
      closePopup();
      setActiveScreenId(id);
    }
  };

  // Search & delivery preferences
  const [pickupDate, setPickupDate] = useState<string>(initialDates.pickupDate);
  const [pickupTime, setPickupTime] = useState<string>('08:00');
  const [returnDate, setReturnDate] = useState<string>(initialDates.returnDate);
  const [returnTime, setReturnTime] = useState<string>('08:00');
  const [pickupLocation, setPickupLocation] = useState<string>(
    'Khách sạn Colline, 10 Phan Bội Châu, Đà Lạt'
  );
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [isLocationChosen, setIsLocationChosen] = useState<boolean>(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilterState>({
    pickupDate: initialDates.pickupDate,
    pickupTime: '08:00',
    returnDate: initialDates.returnDate,
    returnTime: '08:00',
    bikeType: 'Tất cả xe',
    quantity: 1,
    pickupLocation: 'Khách sạn Colline, 10 Phan Bội Châu, Đà Lạt',
    deliveryMode: 'delivery',
  });

  // Rental comparison selection starts empty for each new search.
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);

  // Selected option for Detail view (Màn 3)
  const [selectedDetailOptionId, setSelectedDetailOptionId] = useState<string>('opt-1-1');
  const [selectedDetailShopId, setSelectedDetailShopId] = useState<string>('shop-1');
  const [detailReturnScreen, setDetailReturnScreen] = useState<'results' | 'shop-bikes' | 'compare-1' | 'compare-2' | 'compare-3'>('results');
  const [bookingOrder, setBookingOrder] = useState<BookingOrder | null>(null);
  const [bookingOrders, setBookingOrders] = useState<BookingOrder[]>([]);
  const [pickupNote, setPickupNote] = useState('');
  const [nextBookingNumber, setNextBookingNumber] = useState(4419);
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Nguyễn Văn An',
    phone: '0912 888 999',
    identity: '049098001234',
    license: 'A1 · Hạng xe máy dưới 175cc',
    address: '10 Phan Bội Châu, Phường 1, TP. Đà Lạt',
  });
  const [returnOrder, setReturnOrder] = useState<ProfileOrder | null>(null);
  const [returnedOrderCodes, setReturnedOrderCodes] = useState<string[]>([]);
  const [receivedOrderCodes, setReceivedOrderCodes] = useState<string[]>([]);
  const [receivedAtByCode, setReceivedAtByCode] = useState<Record<string, string>>({});
  const [returnedAtByCode, setReturnedAtByCode] = useState<Record<string, string>>({});
  const [pickupPhotosByCode, setPickupPhotosByCode] = useState<Record<string, string[]>>({});
  const [selectedBookedOrder, setSelectedBookedOrder] = useState<BookingOrder | ProfileOrder | null>(null);
  const [selectedReturnedOrder, setSelectedReturnedOrder] = useState<ProfileOrder | null>(null);
  const [profileInitialFilter, setProfileInitialFilter] = useState<OrderStatus>('active');

  const handleConfirmPickup = (photos: string[]) => {
    if (!selectedBookedOrder) return;
    setPickupPhotosByCode((current) => ({ ...current, [selectedBookedOrder.code]: photos }));
    setReceivedAtByCode((current) => ({ ...current, [selectedBookedOrder.code]: vietnamDateTime() }));
    setReceivedOrderCodes((codes) => codes.includes(selectedBookedOrder.code) ? codes : [...codes, selectedBookedOrder.code]);
    setProfileInitialFilter('active');
    setActiveScreenId('pickup-success');
  };

  const handleConfirmBooking = (details: Omit<BookingOrder, 'code'>) => {
    const order = { ...details, code: `DL-${details.pickupDate.split('/')[2]}-${nextBookingNumber}`, bookedAt: vietnamDateTime() };
    setBookingOrder(order);
    setSelectedBookedOrder(order);
    setBookingOrders((orders) => [order, ...orders]);
    setPickupNote('');
    setNextBookingNumber((value) => value + 1);
    setActiveScreenId('booking-success');
  };

  // Saved state for Màn 4 & Màn 5
  const [savedOptionIds, setSavedOptionIds] = useState<string[]>([]);

  // Compare selection toggling (Tối đa 3 phương án)
  const handleToggleCompare = (option: MotorbikeOption) => {
    setSelectedOptionIds((prev) => {
      if (prev.includes(option.id)) {
        return prev.filter((id) => id !== option.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), option.id];
      }
      return [...prev, option.id];
    });
  };

  const handleRemoveCompareOption = (optionId: string) => {
    setSelectedOptionIds((prev) => prev.filter((id) => id !== optionId));
  };

  // Detail item lookup
  const currentDetailShop =
    INITIAL_SHOPS.find((s) => s.id === selectedDetailShopId) || INITIAL_SHOPS[0];
  const currentDetailOption =
    currentDetailShop.options.find((o) => o.id === selectedDetailOptionId) ||
    currentDetailShop.options[0];

  // Options for comparison
  const allOptions: MotorbikeOption[] = INITIAL_SHOPS.flatMap((s) => s.options);
  const compareOptionsList: MotorbikeOption[] = selectedOptionIds
    .map((id) => allOptions.find((o) => o.id === id))
    .filter((o): o is MotorbikeOption => Boolean(o));

  const savedOptionsList: MotorbikeOption[] = savedOptionIds
    .map((id) => allOptions.find((o) => o.id === id))
    .filter((o): o is MotorbikeOption => Boolean(o));

  const isCurrentComparisonSaved =
    selectedOptionIds.length >= 2 &&
    selectedOptionIds.length === savedOptionIds.length &&
    selectedOptionIds.every((id) => savedOptionIds.includes(id));

  // Interactive flow handlers
  const handleLocationSubmit = (loc: string, mode: 'delivery' | 'pickup') => {
    setPickupLocation(loc);
    setDeliveryMode(mode);
    setIsLocationChosen(true);
    closePopup();
  };

  const handleCalendarConfirm = (dates: {
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
  }) => {
    setPickupDate(dates.pickupDate);
    setPickupTime(dates.pickupTime);
    setReturnDate(dates.returnDate);
    setReturnTime(dates.returnTime);
    closePopup();
  };

  const handleSearchSubmit = (params: SearchFilterState) => {
    setSearchFilters(params);
    setSelectedOptionIds([]);
    setActiveScreenId('results');
  };

  const handleSelectOptionForDetail = (option: MotorbikeOption, shop: Shop, returnScreen: 'results' | 'shop-bikes' | 'compare-1' | 'compare-2' | 'compare-3' = 'results') => {
    setSelectedDetailOptionId(option.id);
    setSelectedDetailShopId(shop.id);
    setDetailReturnScreen(returnScreen);
    setActiveScreenId('detail');
  };

  const handleSelectComparedOption = (option: MotorbikeOption, returnScreen: 'compare-1' | 'compare-2' | 'compare-3') => {
    const shop = INITIAL_SHOPS.find((item) => item.id === option.shopId);
    if (shop) handleSelectOptionForDetail(option, shop, returnScreen);
  };

  const handleGoToCompareScreen = () => {
    const count = selectedOptionIds.length;
    if (count <= 2) setActiveScreenId('compare-1');
    else if (count === 3) setActiveScreenId('compare-2');
    else setActiveScreenId('compare-3');
  };

  const handleToggleComparisonSaved = (nextSaved: boolean) => {
    setSavedOptionIds(nextSaved ? [...selectedOptionIds] : []);
  };

  const handleOpenSavedComparison = () => {
    if (savedOptionIds.length < 2) return;
    setSelectedOptionIds([...savedOptionIds]);
    setActiveScreenId(savedOptionIds.length === 2 ? 'compare-1' : 'compare-2');
  };

  const handleShareSavedComparison = () => {
    if (savedOptionIds.length < 2) return;
    setSelectedOptionIds([...savedOptionIds]);
    setActivePopup('share');
  };

  // Quick jump presets for easy navigation testing
  const screenPresets: { id: ScreenId; label: string }[] = [
    { id: 'home', label: '0. Trang chủ' },
    { id: 'shop-bikes', label: '0a. Xe của shop' },
    { id: 'search', label: '1. Tìm xe' },
    { id: 'calendar', label: '1a. Chọn ngày' },
    { id: 'location', label: '1b. Điểm nhận' },
    { id: 'results', label: '2. Danh sách xe' },
    { id: 'detail', label: '3. Chi tiết xe' },
    { id: 'booking', label: '3b. Đặt xe' },
    ...(bookingOrder ? [{ id: 'booking-success' as ScreenId, label: '3c. Đặt xe thành công' }] : []),
    ...(selectedBookedOrder ? [{ id: 'booked-order-detail' as ScreenId, label: '8b. Chi tiết đơn thuê' }] : []),
    ...(selectedBookedOrder ? [{ id: 'pickup-photos' as ScreenId, label: '8c. Ảnh xe lúc nhận' }] : []),
    ...(selectedBookedOrder && receivedOrderCodes.includes(selectedBookedOrder.code) ? [{ id: 'pickup-success' as ScreenId, label: '8c+. Nhận xe thành công' }] : []),
    { id: 'share-single', label: '3a. Chia sẻ xe' },
    { id: 'compare-2', label: '4. So sánh 3 xe' },
    { id: 'share', label: '4c. Chia sẻ so sánh' },
    { id: 'saved', label: '5. Đã lưu' },
    { id: 'profile', label: '8. Tài khoản' },
    ...(returnOrder ? [{ id: 'return-inspection' as ScreenId, label: '8d. Đối chiếu & trả xe' }] : []),
    ...(returnOrder && returnedOrderCodes.includes(returnOrder.code) ? [{ id: 'return-success' as ScreenId, label: '8e. Trả xe thành công' }] : []),
    ...(selectedReturnedOrder ? [{ id: 'returned-order-detail' as ScreenId, label: '8f. Chi tiết đơn đã trả' }] : []),
  ];

  // Render the active screen content inside the phone
  const renderScreenContent = () => {
    switch (activeScreenId) {
      case 'home':
        return (
          <HomeScreen
            shops={INITIAL_SHOPS}
            pickupLocation={pickupLocation}
            pickupDate={pickupDate}
            returnDate={returnDate}
            quantity={searchFilters.quantity}
            onOpenSearch={() => setActiveScreenId('search')}
            onViewAll={() => { setSearchFilters((filters) => ({ ...filters, bikeType: 'Tất cả xe' })); setSelectedOptionIds([]); setActiveScreenId('results'); }}
            onSelectShop={(shop) => { setSelectedDetailShopId(shop.id); setActiveScreenId('shop-bikes'); }}
          />
        );

      case 'shop-bikes':
        return (
          <ShopBikesScreen
            shop={currentDetailShop}
            pickupDate={pickupDate}
            pickupTime={pickupTime}
            returnDate={returnDate}
            returnTime={returnTime}
            quantity={searchFilters.quantity}
            deliveryMode={deliveryMode}
            onBack={() => setActiveScreenId('home')}
            onSelectOption={(option) => handleSelectOptionForDetail(option, currentDetailShop, 'shop-bikes')}
          />
        );

      case 'search':
        return (
          <SearchScreen
            isEditMode={false}
            editableTexts={{}}
            onTextChange={() => {}}
            onOpenCalendar={() => setActivePopup('calendar')}
            onOpenLocation={() => setActivePopup('location')}
            onSearchSubmit={handleSearchSubmit}
            isPlaceholderMode={false}
            pickupLocation={pickupLocation}
            deliveryMode={deliveryMode}
            isLocationChosen={isLocationChosen}
            pickupDateProp={pickupDate}
            pickupTimeProp={pickupTime}
            returnDateProp={returnDate}
            returnTimeProp={returnTime}
            initialBikeType={searchFilters.bikeType}
            initialQuantity={searchFilters.quantity}
          />
        );

      case 'results':
      case 'results-dropdown':
        return (
          <ResultsScreen
            shops={INITIAL_SHOPS}
            filters={{ ...searchFilters, pickupDate, pickupTime, returnDate, returnTime, pickupLocation, deliveryMode }}
            isEditMode={false}
            editableTexts={{}}
            onTextChange={() => {}}
            isPlaceholderMode={false}
            selectedOptionIds={selectedOptionIds}
            onToggleCompare={handleToggleCompare}
            onSelectOptionForDetail={handleSelectOptionForDetail}
            onGoToCompare={handleGoToCompareScreen}
            onBackToSearch={() => setActiveScreenId('search')}
            deliveryMode={deliveryMode}
            deliveryAddress={pickupLocation}
            onOpenLocation={() => setActivePopup('location')}
          />
        );

      case 'detail':
        return (
          <DetailScreen
            shop={currentDetailShop}
            option={currentDetailOption}
            pickupDate={pickupDate}
            pickupTime={pickupTime}
            returnDate={returnDate}
            returnTime={returnTime}
            quantity={searchFilters.quantity}
            deliveryMode={deliveryMode}
            isEditMode={false}
            editableTexts={{}}
            onTextChange={() => {}}
            isPlaceholderMode={false}
            onOpenShareSheet={() => setActivePopup('share-single')}
            onBack={() => setActiveScreenId(detailReturnScreen)}
            onBook={() => setActiveScreenId('booking')}
          />
        );

      case 'booking':
        return (
          <BookingScreen
            shop={currentDetailShop}
            option={currentDetailOption}
            pickupDate={pickupDate}
            pickupTime={pickupTime}
            returnDate={returnDate}
            returnTime={returnTime}
            pickupLocation={pickupLocation}
            deliveryMode={deliveryMode}
            initialQuantity={searchFilters.quantity}
            renter={{ name: profile.name, phone: profile.phone, identity: profile.identity }}
            onBack={() => setActiveScreenId('detail')}
            onConfirm={handleConfirmBooking}
          />
        );

      case 'booking-success':
        return bookingOrder ? (
          <BookingSuccessScreen
            order={bookingOrder}
            onBackToSearch={() => setActiveScreenId('search')}
            onViewDetails={() => { setSelectedBookedOrder(bookingOrder); setActiveScreenId('booked-order-detail'); }}
          />
        ) : null;

      case 'booked-order-detail':
        return selectedBookedOrder ? (
          <BookedOrderDetailScreen order={selectedBookedOrder} onBack={() => { setProfileInitialFilter('booked'); setActiveScreenId('profile'); }} onReceive={() => setActiveScreenId('pickup-photos')} />
        ) : null;

      case 'pickup-photos':
        return selectedBookedOrder ? <PickupPhotosScreen onBack={() => setActiveScreenId('booked-order-detail')} note={pickupNote} onNoteChange={setPickupNote} onConfirm={handleConfirmPickup} /> : null;

      case 'pickup-success':
        return selectedBookedOrder && receivedOrderCodes.includes(selectedBookedOrder.code) ? (
          <PickupSuccessScreen order={selectedBookedOrder} onGoHome={() => setActiveScreenId('home')} />
        ) : null;

      case 'compare-1':
        return (
          <CompareScreen
            options={compareOptionsList}
            shops={INITIAL_SHOPS}
            isEditMode={false}
            editableTexts={{}}
            onTextChange={() => {}}
            isPlaceholderMode={false}
            onRemoveOption={handleRemoveCompareOption}
            onSelectOption={(option) => handleSelectComparedOption(option, 'compare-1')}
            onOpenShareSheet={() => setActivePopup('share')}
            onBack={() => setActiveScreenId('results')}
            onAddMoreOptions={() => setActiveScreenId('search')}
            forcedMode="two"
            isSavedInitial={isCurrentComparisonSaved}
            onToggleSavedGlobal={handleToggleComparisonSaved}
          />
        );

      case 'compare-2':
      case 'compare-3':
        return (
          <CompareScreen
            options={compareOptionsList}
            shops={INITIAL_SHOPS}
            isEditMode={false}
            editableTexts={{}}
            onTextChange={() => {}}
            isPlaceholderMode={false}
            onRemoveOption={handleRemoveCompareOption}
            onSelectOption={(option) => handleSelectComparedOption(option, activeScreenId)}
            onOpenShareSheet={() => setActivePopup('share')}
            onBack={() => setActiveScreenId('results')}
            onAddMoreOptions={() => setActiveScreenId('search')}
            forcedMode="three"
            isSavedInitial={isCurrentComparisonSaved}
            onToggleSavedGlobal={handleToggleComparisonSaved}
          />
        );

      case 'saved':
        return (
          <SavedScreen
            isEditMode={false}
            editableTexts={{}}
            onTextChange={() => {}}
            isPlaceholderMode={false}
            savedOptions={savedOptionsList}
            pickupDate={pickupDate}
            returnDate={returnDate}
            onDeleteSaved={() => setSavedOptionIds([])}
            onGoToCompare={handleOpenSavedComparison}
            onOpenShare={handleShareSavedComparison}
            onGoToSearch={() => setActiveScreenId('search')}
            isSaved={savedOptionsList.length >= 2}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            onProfileChange={setProfile}
            bookingOrders={bookingOrders}
            receivedOrderCodes={receivedOrderCodes}
            returnedOrderCodes={returnedOrderCodes}
            receivedAtByCode={receivedAtByCode}
            returnedAtByCode={returnedAtByCode}
            pickupPhotosByCode={pickupPhotosByCode}
            initialFilter={profileInitialFilter}
            onOpenReturn={(order) => { setProfileInitialFilter('active'); setReturnOrder(order); setActiveScreenId('return-inspection'); }}
            onOpenBookedDetail={(order) => { setProfileInitialFilter('booked'); setSelectedBookedOrder(order); setPickupNote(''); setActiveScreenId('booked-order-detail'); }}
            onOpenReturnedDetail={(order) => { setProfileInitialFilter('returned'); setSelectedReturnedOrder(order); setActiveScreenId('returned-order-detail'); }}
          />
        );

      case 'return-inspection':
        return returnOrder ? (
          <ReturnInspectionScreen order={returnOrder} onBack={() => setActiveScreenId('profile')} onConfirmReturn={() => { setReturnedOrderCodes((codes) => codes.includes(returnOrder.code) ? codes : [...codes, returnOrder.code]); setReturnedAtByCode((current) => ({ ...current, [returnOrder.code]: vietnamDateTime() })); setProfileInitialFilter('returned'); setActiveScreenId('return-success'); }} />
        ) : null;

      case 'return-success':
        return returnOrder ? (
          <ReturnSuccessScreen order={returnOrder} onViewHistory={() => { setProfileInitialFilter('returned'); setActiveScreenId('profile'); }} onGoHome={() => setActiveScreenId('home')} />
        ) : null;

      case 'returned-order-detail':
        return selectedReturnedOrder ? (
          <ReturnedOrderDetailScreen order={selectedReturnedOrder} onBack={() => { setProfileInitialFilter('returned'); setActiveScreenId('profile'); }} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <main className="grid h-dvh min-h-[520px] w-full grid-rows-[auto_minmax(0,1fr)_auto] justify-items-center gap-3 overflow-y-auto bg-[var(--canvas-bg)] p-3 text-slate-100 antialiased selection:bg-orange-500 selection:text-white md:grid-cols-[248px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)_auto] md:gap-x-6 md:p-6">
      {/* Screen navigation on the left of the prototype */}
      <aside aria-label="Điều khiển các màn hình" className="prototype-switcher flex w-full max-w-2xl flex-nowrap items-center justify-start gap-1.5 overflow-x-auto rounded-2xl border border-blue-900/40 px-3 py-2 shadow-xl backdrop-blur-md md:row-span-2 md:max-w-none md:min-h-0 md:flex-col md:items-stretch md:overflow-x-hidden md:overflow-y-auto md:px-3 md:py-4">
        <div className="mr-2 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-blue-200 md:mb-2 md:mr-0 md:border-b md:border-white/20 md:px-2 md:pb-3">
          <Smartphone size={14} className="text-orange-400" />
          <span>Màn hình:</span>
        </div>
        {screenPresets.map((screen) => {
          const isActive = activePopup
            ? activePopup === screen.id
            : activeScreenId === screen.id ||
              (screen.id === 'compare-2' && (activeScreenId === 'compare-1' || activeScreenId === 'compare-3'));
          return (
            <button
              key={screen.id}
              onClick={() => navigateToScreen(screen.id)}
              type="button"
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer md:min-h-9 md:w-full md:text-left ${
                isActive
                  ? 'bg-white text-blue-800 font-bold shadow-md shadow-blue-950/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {screen.label}
            </button>
          );
        })}
      </aside>

      {/* Main Single Centered Mobile Phone Prototype */}
      <div className="relative flex min-h-0 w-full items-center justify-center md:col-start-2 md:row-start-1">
        <PhoneFrame
          screenId={activeScreenId}
          title="Đà Lạt Ride"
          bottomNav={
            <BottomNav
              activeScreenId={activeScreenId}
              onNavigate={navigateToScreen}
              compareCount={selectedOptionIds.length}
            />
          }
          overlay={activePopup ? (
            <ScreenPopup
              key={activePopup}
              label={
                activePopup === 'calendar' ? 'Chọn ngày' :
                activePopup === 'location' ? 'Chọn điểm nhận' :
                activePopup === 'share' ? 'Chia sẻ bảng so sánh' : 'Chia sẻ xe'
              }
              onClose={closePopup}
            >
              {activePopup === 'calendar' ? (
                <CalendarScreen
                  isEditMode={false}
                  editableTexts={{}}
                  onTextChange={() => {}}
                  onConfirm={handleCalendarConfirm}
                  initialPickupDate={pickupDate}
                  initialPickupTime={pickupTime}
                  initialReturnDate={returnDate}
                  initialReturnTime={returnTime}
                />
              ) : activePopup === 'location' ? (
                <LocationScreen
                  isEditMode={false}
                  editableTexts={{}}
                  onTextChange={() => {}}
                  onSubmit={handleLocationSubmit}
                  currentLocation={pickupLocation}
                  currentDeliveryMode={deliveryMode}
                />
              ) : activePopup === 'share' ? (
                <ShareSheetScreen
                  options={compareOptionsList}
                  shops={INITIAL_SHOPS}
                  isEditMode={false}
                  editableTexts={{}}
                  onTextChange={() => {}}
                  isPlaceholderMode={false}
                  pickupDate={pickupDate}
                  returnDate={returnDate}
                  onClose={closePopup}
                />
              ) : (
                <SingleBikeShareSheetScreen
                  shop={currentDetailShop}
                  option={currentDetailOption}
                  isEditMode={false}
                  editableTexts={{}}
                  onTextChange={() => {}}
                  isPlaceholderMode={false}
                  onClose={closePopup}
                />
              )}
            </ScreenPopup>
          ) : undefined}
        >
          {renderScreenContent()}
        </PhoneFrame>
      </div>

      {/* Bottom Hint */}
      <div className="flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-blue-200/60 md:col-start-2 md:row-start-2">
        <Sparkles size={12} className="text-orange-400" />
        <span>Tương tác trực tiếp trên màn hình điện thoại như ứng dụng mobile thật</span>
      </div>
    </main>
  );
}
