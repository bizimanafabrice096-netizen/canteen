import React, { useState } from 'react';
import { Smartphone, CheckCircle2, Copy, Shield, QrCode, PhoneCall } from 'lucide-react';
import { CANTEEN_MOMO_NUMBER, CANTEEN_RECIPIENT_NAME } from '../data/canteenData';
import { QRCodeDisplay } from './QRCodeDisplay';
import { sound } from '../utils/sound';

export const MomoPayGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('2500');

  const handleCopy = () => {
    navigator.clipboard.writeText(CANTEEN_MOMO_NUMBER);
    setCopied(true);
    sound.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const dialCode = `*182*8*1*${CANTEEN_MOMO_NUMBER}${customAmount ? `*${customAmount}` : ''}#`;

  return (
    <section id="momo-section" className="py-12 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs text-stone-400 font-medium mb-1">
          <span>Official Payment Channel</span>
          <span aria-hidden="true">·</span>
          <span>MTN MoMo Pay Rwanda</span>
          <span aria-hidden="true">·</span>
          <span>Zero Processing Fees</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-display">
              Pay via MTN MoMo Pay or Cash
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Pay securely from your phone anytime. All official transactions are registered to <strong className="text-stone-100">{CANTEEN_RECIPIENT_NAME}</strong> at <strong className="text-stone-100 font-mono-numbers">{CANTEEN_MOMO_NUMBER}</strong>.
            </p>
          </div>
        </div>

        {/* 2-Column MoMo Card Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Official MoMo Terminal (7 cols) */}
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Verified Merchant Recipient</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-100 font-display">
                      {CANTEEN_RECIPIENT_NAME}
                    </h3>
                  </div>
                </div>

                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-mono">
                  MTN MoMo
                </span>
              </div>

              {/* Number and Copy Box */}
              <div className="mt-6 p-4 sm:p-5 bg-stone-950 rounded-2xl border border-stone-800">
                <p className="text-xs text-stone-400 mb-1">Official Smart Canteen Phone Number</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-mono-numbers tracking-widest">
                    {CANTEEN_MOMO_NUMBER}
                  </span>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive USSD Simulator / Calculator */}
              <div className="mt-6 pt-5 border-t border-stone-800">
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Test / Quick USSD Dial with Amount (RWF):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-36 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono-numbers text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                  <a
                    href={`tel:${encodeURIComponent(dialCode)}`}
                    className="flex-1 py-2 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial {dialCode}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4 Steps Guide */}
            <div className="mt-6 pt-6 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-stone-400">
              <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <p className="font-bold text-stone-200 font-mono-numbers">1. Dial</p>
                <p className="mt-0.5 text-stone-400">*182*8*1#</p>
              </div>
              <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <p className="font-bold text-stone-200 font-mono-numbers">2. Enter</p>
                <p className="mt-0.5 text-stone-400">0794513444</p>
              </div>
              <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <p className="font-bold text-stone-200 font-mono-numbers">3. Confirm</p>
                <p className="mt-0.5 text-stone-400">Bizimana Fabrice</p>
              </div>
              <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <p className="font-bold text-stone-200 font-mono-numbers">4. Collect</p>
                <p className="mt-0.5 text-stone-400">Show SMS / Token</p>
              </div>
            </div>
          </div>

          {/* Card 2: MoMo QR Code & Cash Counter Policy (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* QR Card */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Quick Scan MoMo QR Code</span>
              </div>

              <QRCodeDisplay
                value={`momo://pay?phone=${CANTEEN_MOMO_NUMBER}&name=${encodeURIComponent(CANTEEN_RECIPIENT_NAME)}`}
                size={150}
                label={`Account: ${CANTEEN_RECIPIENT_NAME}`}
              />

              <p className="text-xs text-stone-400 mt-3 max-w-xs">
                Scan with your smartphone camera or mobile banking app to pre-fill merchant details.
              </p>
            </div>

            {/* Cash Policy Card */}
            <div className="p-5 bg-stone-900 border border-stone-800 rounded-2xl flex items-start gap-3 text-xs text-stone-300">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-100">Prefer Paying in Cash?</p>
                <p className="text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                  You can order or book items online and select &quot;Cash on Pickup&quot;. Your meal will be cooked and reserved; you pay in Rwandan Francs at the canteen counter when collecting your tray.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
