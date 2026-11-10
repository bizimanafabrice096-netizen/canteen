import React, { useState } from 'react';
import { Clock, Calendar, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { CANTEEN_RECIPIENT_NAME, CANTEEN_MOMO_NUMBER } from '../data/canteenData';

interface PreBookSectionProps {
  onStartBooking: (slot: string) => void;
}

export const PreBookSection: React.FC<PreBookSectionProps> = ({ onStartBooking }) => {
  const [selectedSlot, setSelectedSlot] = useState('12:30 PM (Lunch Break)');

  const timeSlots = [
    {
      time: '10:00 AM',
      title: 'Morning Break & Bakery',
      desc: 'Hot spiced African tea, warm samosas, mandazi & chapati.',
      badge: 'Breakfast Rush'
    },
    {
      time: '12:30 PM',
      title: 'Standard Lunch Break',
      desc: 'Rwandan buffet plates, tender beef brochettes & plantains.',
      badge: 'Most Popular'
    },
    {
      time: '01:15 PM',
      title: 'Afternoon Shift Lunch',
      desc: 'Freshly plated chicken brochettes, rice & salad combos.',
      badge: 'Quiet Table'
    },
    {
      time: '03:30 PM',
      title: 'Afternoon Tea & Fresh Juices',
      desc: 'Cold-pressed passion fruit juice, fresh snacks & coffee.',
      badge: 'Refreshment'
    },
    {
      time: '05:30 PM',
      title: 'Evening Dinner & Takeaway',
      desc: 'Grilled brochettes, chips mayai, and dinner platters.',
      badge: 'Dinner Pre-Order'
    }
  ];

  return (
    <section id="booking-section" className="py-12 border-t border-stone-800/80 bg-stone-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-2 text-xs text-stone-400 font-medium mb-1">
          <span>Smart Meal Reservation</span>
          <span aria-hidden="true">·</span>
          <span>Zero Wait Time</span>
          <span aria-hidden="true">·</span>
          <span>Pay via MoMo or Cash Counter</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-display">
              Pre-Book Canteen Meals for Your Schedule
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Don&apos;t wait in the lunch crowd. Select your arrival time slot below, choose your dishes, and your food will be fresh and hot at the counter the moment you arrive.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-950 px-3.5 py-2 rounded-xl border border-stone-800 shrink-0">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Guaranteed reserved kitchen slot</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === `${slot.time} (${slot.title.split(' ')[0]})`;
            return (
              <div
                key={slot.time}
                onClick={() => setSelectedSlot(`${slot.time} (${slot.title.split(' ')[0]})`)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-950/20'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="font-mono-numbers text-amber-400 font-bold text-sm">
                      {slot.time}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {slot.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-stone-100">
                    {slot.title}
                  </h3>

                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    {slot.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartBooking(`${slot.time} (${slot.title})`);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                    }`}
                  >
                    <span>Book This Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Booking Guarantee Strip */}
        <div className="mt-8 p-4 bg-stone-950 rounded-2xl border border-stone-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-stone-100">Planning a Group Meal or Corporate Meeting?</p>
              <p className="text-stone-400 text-[11px]">
                Pre-book multi-dish orders with payment via MTN MoMo to <strong>{CANTEEN_RECIPIENT_NAME}</strong> ({CANTEEN_MOMO_NUMBER}).
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartBooking(selectedSlot)}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 font-semibold rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer"
          >
            Start Pre-Booking Now &rarr;
          </button>
        </div>

      </div>
    </section>
  );
};
