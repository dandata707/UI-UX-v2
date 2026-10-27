import React, { useRef } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { ScreenId } from '../types/wireframe';

interface PhoneFrameProps {
  screenId: ScreenId;
  screenNumber?: number | string;
  title: string;
  subtitle?: string;
  captionText?: string;
  children: React.ReactNode;
  activeScreenId?: ScreenId;
  onScreenFocus?: (screenId: ScreenId) => void;
  bottomNav?: React.ReactNode;
  overlay?: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  screenId,
  title,
  children,
  onScreenFocus,
  bottomNav,
  overlay,
}) => {
  const screenContentRef = useRef<HTMLDivElement>(null);

  const handleFrameClick = () => {
    if (onScreenFocus) {
      onScreenFocus(screenId);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center">
      {/* Mobile device frame */}
      <div
        className="relative h-[844px] w-[390px] shrink-0 select-none"
      >
        {/* Dynamic Island / Notch */}
        <div className="hidden">
          <div className="w-28 h-6 rounded-full bg-black/90 border border-slate-800 flex items-center justify-between px-3 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-500/70" />
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Inner Screen Viewport: 100% nội dung thực của app */}
        <div
          ref={screenContentRef}
          onClick={handleFrameClick}
          className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--surface-app-bg)] font-sans text-slate-900"
        >
          {/* iOS Status bar 09:41 (tinh gọn, sang trọng) */}
          <div className="hidden">
            <span className="text-[13px] font-semibold tracking-tight text-slate-900">09:41</span>
            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal size={13} strokeWidth={2.2} />
              <Wifi size={13} strokeWidth={2.2} />
              <Battery size={15} strokeWidth={2.2} />
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col">
            <div inert={overlay ? true : undefined} className="flex min-h-0 flex-1 flex-col">
              {/* Screen Body Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[var(--surface-app-bg)]">
                {children}
              </div>

              {/* Bottom Tab Bar */}
              {bottomNav}
            </div>
            {overlay}
          </div>

          {/* iOS Bottom Home Indicator Bar */}
          <div className="hidden">
            <div className="w-32 h-1 bg-slate-400/80 rounded-full hover:bg-slate-600 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};
