import React from 'react';
import { ShoppingBag, ShieldCheck, Lock } from 'lucide-react';

interface TopBarProps {
  totalCartItems: number;
  totalCartAmount: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
  isStaffMode: boolean;
  isStaffAuthenticated: boolean;
  onStaffClick: () => void;
  activeOrdersCount: number;
  onOpenActiveOrders: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  totalCartItems,
  totalCartAmount,
  onOpenCart,
  onNavigateSection,
  isStaffMode,
  isStaffAuthenticated,
  onStaffClick,
  activeOrdersCount,
  onOpenActiveOrders,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('menu');
            }}
            className="text-lg font-bold tracking-tight text-stone-100 whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors font-display flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>bizicanteen.com</span>
          </a>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => onNavigateSection('menu')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Menu & Costs
          </button>
          <button
            onClick={() => onNavigateSection('booking')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Pre-Book Time
          </button>
          <button
            onClick={() => onNavigateSection('momo')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            MoMo 0794513444
          </button>
          {activeOrdersCount > 0 && (
            <button
              onClick={onOpenActiveOrders}
              className="text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer flex items-center gap-1.5"
            >
              <span>My Orders</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-mono-numbers">
                {activeOrdersCount}
              </span>
            </button>
          )}
          <button
            onClick={onStaffClick}
            className={`transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer flex items-center gap-1.5 ${
              isStaffMode
                ? "text-amber-400 font-semibold"
                : isStaffAuthenticated
                ? "text-emerald-400 hover:text-emerald-300"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {isStaffAuthenticated ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span>
              {isStaffAuthenticated
                ? (isStaffMode ? "Kitchen Active" : "Open Kitchen")
                : "Staff Login"}
            </span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="View food tray and checkout"
            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-950/20 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-stone-950" />
            <span>Tray</span>
            {totalCartItems > 0 && (
              <>
                <span className="bg-stone-950 text-amber-400 px-1.5 py-0.2 rounded-md font-mono-numbers text-[11px]">
                  {totalCartItems}
                </span>
                <span className="hidden sm:inline font-mono-numbers font-medium text-stone-900">
                  · {totalCartAmount.toLocaleString()} RWF
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
