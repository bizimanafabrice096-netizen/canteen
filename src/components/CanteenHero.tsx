import React, { useState } from 'react';
import { Smartphone, Banknote, Clock, CheckCircle2, Copy, Sparkles, ArrowRight } from 'lucide-react';
import { CANTEEN_MOMO_NUMBER, CANTEEN_RECIPIENT_NAME } from '../data/canteenData';
import { sound } from '../utils/sound';

interface CanteenHeroProps {
  onExploreMenu: () => void;
  onOpenBooking: () => void;
  onOpenWallView: () => void;
}

export const CanteenHero: React.FC<CanteenHeroProps> = ({
  onExploreMenu,
  onOpenBooking,
  onOpenWallView,
}) => {
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(CANTEEN_MOMO_NUMBER);
    setCopiedNumber(true);
    sound.playPop();
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  return (
    <section className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Kicker with Zero-Pill Unboxed Text */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mb-4 font-medium">
          <span className="text-amber-400">bizicanteen.com</span>
          <span aria-hidden="true">·</span>
          <span>Instant Counter Pickup & Pre-Booking</span>
          <span aria-hidden="true">·</span>
          <span>MTN MoMo & Cash Accepted</span>
        </div>

        {/* 2-Column Split: Editorial & Action left, Interactive MoMo & Canteen Card right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Headline and Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-100 font-display tracking-tight leading-[1.15] text-balance">
                Fresh Canteen Meals, <span className="text-amber-400">Ready on Time</span> or Book Ahead
              </h1>

              <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
                Skip the cafeteria line. Browse freshly grilled brochettes, authentic Rwandan buffet plates, hot African tea, and fresh juices. Pay smoothly using MTN MoMo to <strong className="text-stone-100 font-semibold">{CANTEEN_RECIPIENT_NAME}</strong> or pay in cash at the counter.
              </p>
            </div>

            {/* Action CTA Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreMenu}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-950/30 cursor-pointer"
              >
                <span>Order Food Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-200 bg-stone-900/90 hover:bg-stone-800 border border-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Pre-Book Pickup Slot</span>
              </button>

              <button
                onClick={onOpenWallView}
                className="flex items-center gap-2 px-3.5 py-3 text-sm font-medium text-amber-400/90 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>View All Items & Prices</span>
              </button>
            </div>

            {/* Unboxed Precision Facts Bar */}
            <div className="mt-8 pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-400">
              <div>
                <p className="text-stone-200 font-semibold text-sm font-mono-numbers">10 - 15 Mins</p>
                <p className="text-stone-400 mt-0.5">Kitchen prep speed</p>
              </div>
              <div>
                <p className="text-stone-200 font-semibold text-sm font-mono-numbers">0 RWF</p>
                <p className="text-stone-400 mt-0.5">Booking & service fee</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-stone-200 font-semibold text-sm font-mono-numbers">MTN MoMo + Cash</p>
                <p className="text-stone-400 mt-0.5">Direct merchant payment</p>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Canteen Payment & Identity Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Official Canteen Account</span>
                  </div>
                  <h2 className="text-lg font-bold text-stone-100 font-display mt-0.5">
                    {CANTEEN_RECIPIENT_NAME}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Registered Smart Canteen Operator
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              {/* MoMo Number Box */}
              <div className="my-5 bg-stone-950 border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span>MTN MoMo Pay Number</span>
                  <span className="text-amber-400 font-medium">Rwanda</span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-stone-100 font-mono-numbers tracking-wider">
                    {CANTEEN_MOMO_NUMBER}
                  </span>
                  
                  <button
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedNumber ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-stone-400 mt-2">
                  Dial string: <code className="text-amber-300 font-mono">*182*8*1*{CANTEEN_MOMO_NUMBER}#</code> or send money directly
                </p>
              </div>

              {/* Payment Methods Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-200">MTN MoMo</p>
                    <p className="text-[11px] text-stone-400">Instant SMS confirmation</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-200">Cash on Pickup</p>
                    <p className="text-[11px] text-stone-400">Pay at counter desk</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
