import React, { useState } from 'react';
import { OrderBooking, CanteenItem, OrderStatus } from '../types/canteen';
import { CANTEEN_RECIPIENT_NAME, CANTEEN_MOMO_NUMBER } from '../data/canteenData';
import { sound } from '../utils/sound';
import { 
  CheckCircle2, Clock, Smartphone, Banknote, 
  MapPin, AlertCircle, ChefHat, LogOut, ShieldCheck 
} from 'lucide-react';

interface StaffDashboardProps {
  orders: OrderBooking[];
  items: CanteenItem[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onVerifyPayment: (orderId: string) => void;
  onToggleItemAvailability: (itemId: string) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  orders,
  items,
  onUpdateOrderStatus,
  onVerifyPayment,
  onToggleItemAvailability,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu_stock'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'ready' | 'completed'>('active');

  const filteredOrders = orders.filter(ord => {
    if (orderFilter === 'active') return ord.orderStatus !== 'collected' && ord.orderStatus !== 'cancelled';
    if (orderFilter === 'ready') return ord.orderStatus === 'ready';
    if (orderFilter === 'completed') return ord.orderStatus === 'collected';
    return true;
  });

  const handleAdvance = (order: OrderBooking) => {
    sound.playPop();
    if (order.orderStatus === 'placed' || order.orderStatus === 'confirmed') {
      onUpdateOrderStatus(order.id, 'cooking');
    } else if (order.orderStatus === 'cooking') {
      onUpdateOrderStatus(order.id, 'ready');
    } else if (order.orderStatus === 'ready') {
      onUpdateOrderStatus(order.id, 'collected');
    }
  };

  const pendingMomoCount = orders.filter(o => o.paymentMethod === 'momo' && o.paymentStatus === 'pending_verification').length;

  return (
    <section className="bg-stone-900 border-b border-stone-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Staff Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Smart Canteen Kitchen & Counter Manager</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-300">Logged in: <strong className="text-amber-400">bizimana</strong></span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-display mt-0.5">
              Live Order Flow & Kitchen Control
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Operator: <strong className="text-stone-200">{CANTEEN_RECIPIENT_NAME}</strong> · MoMo Pay: <span className="font-mono-numbers text-amber-400 font-medium">{CANTEEN_MOMO_NUMBER}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher */}
            <div className="flex items-center p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeTab === 'orders' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Incoming Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('menu_stock')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeTab === 'menu_stock' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Stock & Menu ({items.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Hide Panel
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onLogout();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
              title="Lock terminal and log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-4">
            
            {/* Sub-Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setOrderFilter('active')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'active' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Kitchen Queue ({orders.filter(o => o.orderStatus !== 'collected').length})
                </button>
                <button
                  onClick={() => setOrderFilter('ready')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'ready' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Ready at Counter ({orders.filter(o => o.orderStatus === 'ready').length})
                </button>
                <button
                  onClick={() => setOrderFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'completed' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Completed ({orders.filter(o => o.orderStatus === 'collected').length})
                </button>
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'all' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All ({orders.length})
                </button>
              </div>

              {pendingMomoCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pendingMomoCount} MoMo payment awaiting verification</span>
                </div>
              )}
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-stone-950/60 rounded-2xl border border-stone-800">
                <p className="text-xs text-stone-400">No orders in this queue right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-4 shadow-md"
                  >
                    <div>
                      {/* Token & Time */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                        <span className="text-base font-extrabold text-amber-400 font-mono-numbers">
                          {ord.tokenNumber}
                        </span>

                        <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold capitalize font-mono bg-stone-900 border border-stone-800 text-stone-300">
                          {ord.orderStatus}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="mt-3 text-xs space-y-1">
                        <p className="font-bold text-stone-100">{ord.customerName}</p>
                        <p className="text-stone-400 font-mono-numbers">{ord.customerPhone}</p>
                        
                        <div className="flex items-center gap-1.5 text-stone-300 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="capitalize">
                            {ord.destinationType.replace('_', ' ')}
                            {ord.tableOrRoomNumber ? ` (${ord.tableOrRoomNumber})` : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-stone-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{ord.pickupTime}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="mt-3 pt-3 border-t border-stone-900 space-y-1.5">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-stone-300">
                              {it.quantity}x {it.item.name}
                            </span>
                            <span className="font-mono-numbers text-stone-400">
                              {(it.item.priceRwf * it.quantity).toLocaleString()} RWF
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Payment info */}
                      <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-stone-400">
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
                        </span>
                        <span className="font-bold text-amber-400 font-mono-numbers">
                          {ord.totalRwf.toLocaleString()} RWF
                        </span>
                      </div>

                      {ord.momoTransactionRef && (
                        <p className="text-[10px] text-stone-400 font-mono mt-1 bg-stone-900 p-1.5 rounded-lg border border-stone-800/80">
                          Ref: {ord.momoTransactionRef}
                        </p>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-stone-800 space-y-2">
                      {ord.paymentMethod === 'momo' && ord.paymentStatus === 'pending_verification' && (
                        <button
                          onClick={() => onVerifyPayment(ord.id)}
                          className="w-full py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify MoMo Payment</span>
                        </button>
                      )}

                      {ord.orderStatus !== 'collected' && (
                        <button
                          onClick={() => handleAdvance(ord)}
                          className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {ord.orderStatus === 'placed' || ord.orderStatus === 'confirmed' ? (
                            <span>Start Kitchen Preparation &rarr;</span>
                          ) : ord.orderStatus === 'cooking' ? (
                            <span>Mark Ready for Pickup &rarr;</span>
                          ) : (
                            <span>Mark Collected / Served &check;</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Menu Stock & Availability Manager */}
        {activeTab === 'menu_stock' && (
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover bg-stone-900 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-100 truncate">{item.name}</p>
                    <p className="text-xs font-mono-numbers text-amber-400">
                      {item.priceRwf.toLocaleString()} RWF
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onToggleItemAvailability(item.id);
                      sound.playPop();
                    }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                      item.isAvailable
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
