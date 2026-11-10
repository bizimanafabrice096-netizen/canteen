import React, { useState, useRef } from 'react';
import { CartItem, OrderBooking, DestinationType, OrderType, PaymentMethod } from '../types/canteen';
import { CANTEEN_MOMO_NUMBER, CANTEEN_RECIPIENT_NAME } from '../data/canteenData';
import { QRCodeDisplay } from './QRCodeDisplay';
import { sound } from '../utils/sound';
import { 
  X, Trash2, Plus, Minus, Smartphone, Banknote, Clock, 
  MapPin, CheckCircle2, Copy, AlertCircle, ArrowRight, PhoneCall 
} from 'lucide-react';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onOrderCreated: (order: OrderBooking) => void;
  presetOrderType?: OrderType;
  presetTimeSlot?: string;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOrderCreated,
  presetOrderType = 'immediate',
  presetTimeSlot = '',
}) => {
  if (!isOpen) return null;

  // Checkout Form State
  const [orderType, setOrderType] = useState<OrderType>(presetOrderType);
  const [scheduledSlot, setScheduledSlot] = useState<string>(presetTimeSlot || '12:30 PM (Lunch Break)');
  const [customTime, setCustomTime] = useState<string>('');
  const [destinationType, setDestinationType] = useState<DestinationType>('counter_pickup');
  const [tableOrRoom, setTableOrRoom] = useState<string>('Table 4');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [momoTxRef, setMomoTxRef] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input refs for auto-focus on error
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const subtotal = items.reduce((sum, ci) => sum + ci.item.priceRwf * ci.quantity, 0);
  const total = subtotal;

  const quickSlots = [
    '10:00 AM (Morning Break)',
    '12:30 PM (Lunch Rush)',
    '01:15 PM (Late Lunch)',
    '03:30 PM (Afternoon Tea)',
    '05:30 PM (Evening Bites)',
  ];

  const handleCopyMomoNumber = () => {
    navigator.clipboard.writeText(CANTEEN_MOMO_NUMBER);
    setCopiedNumber(true);
    sound.playPop();
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const ussdDialCode = `*182*8*1*${CANTEEN_MOMO_NUMBER}*${total}#`;

  const handleSubmitOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('Your tray is currently empty. Please add items to proceed.');
      return;
    }

    // Gentle validation: provide smart defaults if customer did not type name
    const finalName = customerName.trim() || 'Canteen Customer';
    
    // Validate phone number
    const cleanedPhone = customerPhone.trim();
    if (!cleanedPhone || cleanedPhone.length < 8) {
      setFormError('Please enter your phone number (e.g. 078..., 079...) so we can link your order.');
      phoneInputRef.current?.focus();
      phoneInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    // If customer selected MoMo, attempt to trigger direct dialing link on mobile
    if (paymentMethod === 'momo') {
      try {
        // Direct tel link for instant USSD dial on phones
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `tel:${encodeURIComponent(ussdDialCode)}`;
        }
      } catch {
        // ignore if iframe blocks tel protocol
      }
    }

    const tokenNum = `CAN-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectivePickupTime = orderType === 'immediate' 
      ? 'Ready in ~12-15 mins' 
      : (customTime ? `Today at ${customTime}` : scheduledSlot);

    const newOrder: OrderBooking = {
      id: `ord-${Date.now()}`,
      tokenNumber: tokenNum,
      items: [...items],
      totalRwf: total,
      orderType,
      pickupTime: effectivePickupTime,
      scheduledSlot: orderType === 'prebook' ? (customTime || scheduledSlot) : undefined,
      destinationType,
      tableOrRoomNumber: destinationType !== 'counter_pickup' ? tableOrRoom : undefined,
      customerName: finalName,
      customerPhone: cleanedPhone,
      notes: orderNotes.trim() || undefined,
      paymentMethod,
      momoNumber: CANTEEN_MOMO_NUMBER,
      momoReceiver: CANTEEN_RECIPIENT_NAME,
      momoTransactionRef: momoTxRef.trim() || undefined,
      paymentStatus: paymentMethod === 'momo' ? 'pending_verification' : 'cash_on_pickup',
      orderStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      sound.playSuccess();
      onOrderCreated(newOrder);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex justify-end">
      <div 
        className="w-full max-w-2xl bg-stone-900 border-l border-stone-800 h-full flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-stone-900/95 backdrop-blur-md px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
              <span>Smart Canteen Order</span>
              <span aria-hidden="true">·</span>
              <span>{items.reduce((s, i) => s + i.quantity, 0)} Items</span>
            </div>
            <h2 className="text-lg font-bold text-stone-100 font-display">
              Checkout & Direct Payment
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 space-y-6">
          
          {/* Section 1: Itemized Tray */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                1. Order Tray Summary
              </h3>
              <span className="text-xs font-mono-numbers text-amber-400 font-semibold">
                {subtotal.toLocaleString()} RWF
              </span>
            </div>

            {items.length === 0 ? (
              <div className="p-6 text-center bg-stone-950/60 rounded-xl border border-stone-800">
                <p className="text-xs text-stone-400">Your tray is empty.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((cartItem, idx) => (
                  <div
                    key={`${cartItem.item.id}-${idx}`}
                    className="p-3 bg-stone-950/80 rounded-xl border border-stone-800/90 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-stone-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-stone-100 truncate">
                          {cartItem.item.name}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {cartItem.selectedSide || 'Standard'}
                          {cartItem.spiceLevel ? ` · ${cartItem.spiceLevel}` : ''}
                        </p>
                        <p className="text-xs font-mono-numbers text-amber-400 font-bold">
                          {(cartItem.item.priceRwf * cartItem.quantity).toLocaleString()} RWF
                        </p>
                      </div>
                    </div>

                    {/* Stepper + Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                          className="w-5 h-5 rounded text-stone-400 hover:text-white flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono-numbers px-1 text-stone-200">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                          className="w-5 h-5 rounded text-stone-400 hover:text-white flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        className="text-stone-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Order & Pickup Scheduling */}
          <div className="pt-4 border-t border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>2. When do you want your food?</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setOrderType('immediate')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  orderType === 'immediate'
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100 shadow-xs'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Cook Right Now</span>
                  {orderType === 'immediate' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Ready in ~10–15 minutes</p>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('prebook')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  orderType === 'prebook'
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100 shadow-xs'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Pre-Book Meal Slot</span>
                  {orderType === 'prebook' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Scheduled pickup time</p>
              </button>
            </div>

            {/* Time Slot Picker for Pre-Book */}
            {orderType === 'prebook' && (
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
                <label className="block text-xs font-semibold text-stone-300">
                  Select Lunch / Break Slot:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setScheduledSlot(slot);
                        setCustomTime('');
                      }}
                      className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                        scheduledSlot === slot && !customTime
                          ? 'bg-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                  <span className="text-[11px] text-stone-400">Or custom time:</span>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="bg-stone-900 border border-stone-700 text-xs text-stone-200 px-2 py-1 rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Dining Spot */}
          <div className="pt-4 border-t border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Where will you eat?</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setDestinationType('counter_pickup')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  destinationType === 'counter_pickup'
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <p className="text-xs font-semibold">Counter Pickup</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Main desk</p>
              </button>

              <button
                type="button"
                onClick={() => setDestinationType('dine_in_table')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  destinationType === 'dine_in_table'
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <p className="text-xs font-semibold">Dine-In Table</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Serve to table</p>
              </button>

              <button
                type="button"
                onClick={() => setDestinationType('room_delivery')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  destinationType === 'room_delivery'
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <p className="text-xs font-semibold">Room / Office</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Direct delivery</p>
              </button>
            </div>

            {destinationType !== 'counter_pickup' && (
              <div className="mt-2">
                <label className="block text-xs text-stone-300 font-medium mb-1">
                  {destinationType === 'dine_in_table' ? 'Enter Table Number:' : 'Enter Office / Room details:'}
                </label>
                <input
                  type="text"
                  value={tableOrRoom}
                  onChange={(e) => setTableOrRoom(e.target.value)}
                  placeholder={destinationType === 'dine_in_table' ? 'e.g. Table 12' : 'e.g. Block B, Room 204'}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            )}
          </div>

          {/* Section 4: Customer Details */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
              4. Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Your Full Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="e.g. Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Your Phone Number *
                </label>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  required
                  placeholder="e.g. 078XXXXXXX or 079XXXXXXX"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className={`w-full bg-stone-950 border rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none ${
                    formError && (!customerPhone || customerPhone.length < 8)
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-stone-800 focus:border-amber-500/60'
                  }`}
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Used to confirm your canteen token
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Order Notes / Dietary Preference (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Please add extra lime, pack tight for travel..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          {/* Section 5: Payment Method (MoMo Pay to Bizimana Fabrice vs Cash) */}
          <div className="pt-4 border-t border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              5. Select Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* MoMo Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('momo')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'momo'
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100 shadow-md shadow-amber-950/20'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-stone-100">MTN MoMo Pay</span>
                  </div>
                  {paymentMethod === 'momo' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-stone-400">
                  Pay to: <span className="text-stone-200 font-semibold">{CANTEEN_RECIPIENT_NAME}</span>
                </p>
                <p className="text-[11px] font-mono-numbers text-amber-400 font-bold mt-0.5">
                  {CANTEEN_MOMO_NUMBER}
                </p>
              </button>

              {/* Cash Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-500/15 border-emerald-500 text-stone-100 shadow-md shadow-emerald-950/20'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-stone-100">Cash on Pickup</span>
                  </div>
                  {paymentMethod === 'cash' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-stone-400">
                  Pay at canteen counter
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Exact cash: {total.toLocaleString()} RWF
                </p>
              </button>
            </div>

            {/* Payment Method Details Box */}
            {paymentMethod === 'momo' ? (
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-4">
                
                {/* MTN Pay Banner */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-amber-400">Pay Directly to Registered Merchant</span>
                    <p className="text-xs text-stone-100 font-bold">
                      {CANTEEN_RECIPIENT_NAME} &middot; <span className="text-amber-400 font-mono-numbers">{CANTEEN_MOMO_NUMBER}</span>
                    </p>
                  </div>
                  <span className="text-sm font-bold text-amber-400 font-mono-numbers">
                    {total.toLocaleString()} RWF
                  </span>
                </div>

                {/* Direct Dialing & Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2 text-xs text-stone-300">
                    <p className="font-semibold text-stone-200">Direct Payment Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-400">
                      <li>Confirming below opens direct dial to <strong>{CANTEEN_MOMO_NUMBER}</strong></li>
                      <li>Dial string: <code className="text-amber-300 font-mono font-bold">*182*8*1*{CANTEEN_MOMO_NUMBER}*{total}#</code></li>
                      <li>Recipient displays: <strong>{CANTEEN_RECIPIENT_NAME}</strong></li>
                      <li>Enter your MTN PIN to approve {total.toLocaleString()} RWF</li>
                    </ol>

                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={`tel:${encodeURIComponent(ussdDialCode)}`}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial USSD Now</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyMomoNumber}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedNumber ? "Copied" : "Copy 0794513444"}</span>
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center p-2 bg-stone-900/60 rounded-xl border border-stone-800/80">
                    <QRCodeDisplay
                      value={`momo://pay?phone=${CANTEEN_MOMO_NUMBER}&name=${encodeURIComponent(CANTEEN_RECIPIENT_NAME)}&amount=${total}`}
                      size={120}
                      label={`MoMo: ${CANTEEN_MOMO_NUMBER}`}
                    />
                    <span className="text-[10px] text-stone-400 mt-1">Scan or Dial on Phone</span>
                  </div>
                </div>

                {/* Optional SMS Transaction Ref Field */}
                <div className="pt-2 border-t border-stone-800">
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    MTN SMS Reference Code (Optional or add after paying):
                  </label>
                  <input
                    type="text"
                    value={momoTxRef}
                    onChange={(e) => setMomoTxRef(e.target.value.toUpperCase())}
                    placeholder="e.g. MP261031.1402... (Optional)"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-400 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    You can also confirm now and show the SMS to Bizimana Fabrice at the counter.
                  </p>
                </div>

              </div>
            ) : (
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Banknote className="w-4 h-4" />
                  <span>Pay with Cash at Canteen Counter</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  Your order token will be generated instantly. Please walk up to the counter and show your token number to <strong>{CANTEEN_RECIPIENT_NAME}</strong> or the cashier to pay <strong className="text-stone-100 font-mono-numbers">{total.toLocaleString()} RWF</strong> in cash and collect your food.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Sticky Footer Action - ALWAYS VISIBLE WITH INLINE ERROR */}
        <div className="sticky bottom-0 z-30 bg-stone-950/98 backdrop-blur-md p-5 sm:p-6 border-t border-stone-800 shadow-2xl">
          
          {/* Prominent Visible Error directly above button */}
          {formError && (
            <div className="mb-3 p-3 bg-rose-950/80 border border-rose-700/80 rounded-xl flex items-center gap-2 text-xs text-rose-200 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-medium">{formError}</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-stone-400">Total amount:</span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono-numbers">
                {total.toLocaleString()} RWF
              </span>
              <p className="text-[10px] text-stone-400">
                {paymentMethod === 'momo' ? `Direct to ${CANTEEN_MOMO_NUMBER}` : 'Pay cash at counter'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={items.length === 0 || isSubmitting}
            onClick={() => handleSubmitOrder()}
            className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span>Connecting to Bizimana Fabrice...</span>
            ) : paymentMethod === 'momo' ? (
              <>
                <Smartphone className="w-5 h-5 text-stone-950" />
                <span>Confirm & Pay via MoMo (0794513444)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <Banknote className="w-5 h-5 text-stone-950" />
                <span>Confirm & Pay Cash at Counter</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
