import React from 'react';
import { CANTEEN_RECIPIENT_NAME, CANTEEN_MOMO_NUMBER, CANTEEN_LOCATION, CANTEEN_HOURS } from '../data/canteenData';

interface CanteenFooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenWallView: () => void;
}

export const CanteenFooter: React.FC<CanteenFooterProps> = ({
  onNavigateSection,
  onOpenWallView,
}) => {
  return (
    <footer className="border-t border-stone-800/80 bg-stone-950 py-12 text-xs text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-base font-bold text-stone-100 font-display">
                bizicanteen.com
              </span>
            </div>
            <p className="text-stone-400 max-w-md leading-relaxed text-xs">
              Order and pre-book fresh canteen dishes, brochettes, snacks, and beverages online. Fast counter pickup and table reservations with zero waiting line.
            </p>
            <div className="pt-2 text-stone-400 text-[11px] space-y-1">
              <p>📍 {CANTEEN_LOCATION}</p>
              <p>⏰ {CANTEEN_HOURS}</p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <p className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">Navigation</p>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateSection('menu')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Daily Canteen Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('booking')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Pre-Book Lunch & Break Slot
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWallView}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left text-amber-400/90"
                >
                  All Items & Cost Wall View
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('momo')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  MoMo Payment Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Merchant */}
          <div className="space-y-2">
            <p className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">Payment Contact</p>
            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-1 text-stone-300">
              <p className="font-bold text-stone-100">{CANTEEN_RECIPIENT_NAME}</p>
              <p className="text-amber-400 font-mono-numbers font-semibold">{CANTEEN_MOMO_NUMBER}</p>
              <p className="text-[10px] text-stone-400">MTN MoMo Rwanda Verified</p>
              <p className="text-[10px] text-stone-400">Cash also accepted at desk</p>
            </div>
          </div>

        </div>

        {/* Quiet Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} bizicanteen.com · Registered to {CANTEEN_RECIPIENT_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Prices in RWF (Rwandan Francs)</span>
            <span>·</span>
            <span>Fast Counter Pickup</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
