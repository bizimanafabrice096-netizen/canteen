import React, { useState } from 'react';
import { OrderBooking } from '../types/canteen';
import { QRCodeDisplay } from './QRCodeDisplay';
import { CANTEEN_MOMO_NUMBER, CANTEEN_RECIPIENT_NAME } from '../data/canteenData';
import { sound } from '../utils/sound';
import { 
  CheckCircle2, Clock, MapPin, Smartphone, Banknote, 
  X, Printer, Copy, PhoneCall, Check 
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: OrderBooking | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders,
}) => {
  if (!order) return null;

  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(CANTEEN_MOMO_NUMBER);
    setCopied(true);
    sound.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const ussdCode = `*182*8*1*${CANTEEN_MOMO_NUMBER}*${order.totalRwf}#`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500/20 via-stone-900 to-stone-900 p-6 border-b border-stone-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-950/40">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <span>Booking Confirmed</span>
            <span aria-hidden="true">·</span>
            <span>bizicanteen.com · Bizimana Fabrice</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-display mt-1">
            Canteen Token Issued
          </h2>

          {/* Token Box */}
          <div className="mt-4 inline-block bg-stone-950 border border-amber-500/40 rounded-2xl px-6 py-3 shadow-inner">
            <p className="text-[11px] text-stone-400 uppercase tracking-widest font-medium">Pickup Token Number</p>
            <p className="text-3xl font-extrabold text-amber-400 font-mono-numbers tracking-widest mt-0.5">
              {order.tokenNumber}
            </p>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-6 space-y-5 text-xs text-stone-300">
          
          {/* Direct MoMo Pay Action Box (When MoMo chosen) */}
          {order.paymentMethod === 'momo' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Pay Directly on MTN MoMo Now</span>
                </div>
                <span className="text-sm font-extrabold text-amber-400 font-mono-numbers">
                  {order.totalRwf.toLocaleString()} RWF
                </span>
              </div>

              <p className="text-stone-300 text-[11px] leading-relaxed">
                Registered Merchant: <strong className="text-white">{CANTEEN_RECIPIENT_NAME}</strong> (<span className="text-amber-400 font-mono-numbers">{CANTEEN_MOMO_NUMBER}</span>)
              </p>

              {/* Direct Dial Button */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`tel:${encodeURIComponent(ussdCode)}`}
                  className="flex-1 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-950/20"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Dial USSD ({CANTEEN_MOMO_NUMBER})</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied" : "Copy Number"}</span>
                </button>
              </div>

              <p className="text-[10px] text-stone-400 font-mono text-center pt-0.5">
                USSD Code: {ussdCode}
              </p>
            </div>
          )}

          {/* Pickup Timing Banner */}
          <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-stone-200">
                {order.orderType === 'immediate' ? 'Kitchen is Preparing' : 'Scheduled Meal Booking'}
              </p>
              <p className="text-amber-400 font-medium mt-0.5">
                {order.pickupTime}
              </p>
            </div>
          </div>

          {/* QR Code and Location */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-stone-950/60 rounded-2xl border border-stone-800">
            <div className="shrink-0">
              <QRCodeDisplay
                value={`CANTEEN-TOKEN:${order.tokenNumber}|CUSTOMER:${encodeURIComponent(order.customerName)}|TOTAL:${order.totalRwf}`}
                size={110}
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-stone-200 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">
                  {order.destinationType.replace('_', ' ')}
                  {order.tableOrRoomNumber ? ` (${order.tableOrRoomNumber})` : ''}
                </span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Show this QR code or token <strong className="text-amber-400 font-mono-numbers">{order.tokenNumber}</strong> to <strong>{CANTEEN_RECIPIENT_NAME}</strong> or staff at the counter.
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800/80">
              <span className="flex items-center gap-1.5 font-medium text-stone-200">
                {order.paymentMethod === 'momo' ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>MTN MoMo (0794513444)</span>
                  </>
                ) : (
                  <>
                    <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cash on Pickup</span>
                  </>
                )}
              </span>
              <span className="font-bold text-amber-400 font-mono-numbers text-sm">
                {order.totalRwf.toLocaleString()} RWF
              </span>
            </div>

            <div className="text-[11px] text-stone-400">
              Customer: <span className="text-stone-200 font-medium">{order.customerName}</span> · {order.customerPhone}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Ticket</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Track All Orders</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
