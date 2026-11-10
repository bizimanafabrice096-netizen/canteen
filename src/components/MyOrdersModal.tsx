import React from 'react';
import { OrderBooking } from '../types/canteen';
import { QRCodeDisplay } from './QRCodeDisplay';
import { X, Clock, MapPin, CheckCircle2, Smartphone, Banknote } from 'lucide-react';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderBooking[];
  onSelectOrder: (order: OrderBooking) => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>Smart Canteen History</span>
              <span aria-hidden="true">·</span>
              <span>{orders.length} Orders Found</span>
            </div>
            <h2 className="text-xl font-bold text-stone-100 font-display mt-0.5">
              My Canteen Orders & Active Tokens
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-stone-950/60 rounded-2xl border border-stone-800">
              <p className="text-xs text-stone-400">You haven&apos;t placed any canteen orders yet.</p>
            </div>
          ) : (
            orders.map((ord) => {
              const statusStep = ord.orderStatus === 'placed' ? 1 
                : ord.orderStatus === 'confirmed' ? 2
                : ord.orderStatus === 'cooking' ? 3
                : ord.orderStatus === 'ready' ? 4
                : 5;

              return (
                <div
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="p-5 bg-stone-950 rounded-2xl border border-stone-800/90 hover:border-amber-500/50 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-amber-400 font-mono-numbers">
                          {ord.tokenNumber}
                        </span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs text-stone-300 capitalize font-medium">
                          {ord.orderType === 'immediate' ? 'Immediate' : 'Pre-booked'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{ord.pickupTime}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-stone-100 font-mono-numbers">
                        {ord.totalRwf.toLocaleString()} RWF
                      </span>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1 justify-end mt-0.5">
                        {ord.paymentMethod === 'momo' ? (
                          <>
                            <Smartphone className="w-3 h-3 text-amber-400" />
                            <span>MoMo</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="w-3 h-3 text-emerald-400" />
                            <span>Cash</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Stepper Bar */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5 font-medium">
                      <span className={statusStep >= 2 ? 'text-amber-400 font-semibold' : ''}>Confirmed</span>
                      <span className={statusStep >= 3 ? 'text-amber-400 font-semibold' : ''}>In Kitchen</span>
                      <span className={statusStep >= 4 ? 'text-emerald-400 font-bold' : ''}>Ready for Pickup</span>
                      <span className={statusStep >= 5 ? 'text-stone-400' : ''}>Collected</span>
                    </div>

                    <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(statusStep / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Item summary */}
                  <p className="text-xs text-stone-400 truncate pt-1">
                    {ord.items.map(i => `${i.quantity}x ${i.item.name}`).join(', ')}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
