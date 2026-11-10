import React, { useState } from 'react';
import { CanteenItem } from '../types/canteen';
import { X, Clock, Flame, Minus, Plus } from 'lucide-react';
import { sound } from '../utils/sound';

interface ItemDetailModalProps {
  item: CanteenItem | null;
  onClose: () => void;
  onAddToCart: (item: CanteenItem, quantity: number, side?: string, spice?: string, notes?: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSide, setSelectedSide] = useState<string>(item.customOptions?.sides?.[0] || '');
  const [selectedSpice, setSelectedSpice] = useState<string>(item.customOptions?.spiciness?.[0] || 'Mild');
  const [specialNotes, setSpecialNotes] = useState('');

  const totalPrice = item.priceRwf * quantity;

  const handleAdd = () => {
    onAddToCart(item, quantity, selectedSide, selectedSpice, specialNotes);
    sound.playCoin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-950/80 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center border border-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-16/9 bg-stone-950 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6">
            <span className="text-2xl font-bold text-amber-400 font-mono-numbers drop-shadow-md">
              {item.priceRwf.toLocaleString()} RWF
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium mb-1">
            <span className="capitalize">{item.category.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{item.prepTimeMins} mins prep</span>
            </span>
            {item.calories && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono-numbers">{item.calories} kcal</span>
              </>
            )}
            {item.dietary && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-stone-300">{item.dietary}</span>
              </>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-display">
            {item.name}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
            {item.description}
          </p>

          {/* Customization: Sides */}
          {item.customOptions?.sides && item.customOptions.sides.length > 0 && (
            <div className="mt-5 pt-4 border-t border-stone-800">
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Included Side or Garnish:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.customOptions.sides.map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setSelectedSide(side)}
                    className={`px-3 py-2 text-xs rounded-xl font-medium text-left border transition-all cursor-pointer ${
                      selectedSide === side
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization: Spice Level */}
          {item.customOptions?.spiciness && item.customOptions.spiciness.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Spice & Pili-Pili Preference:</span>
              </label>
              <div className="flex gap-2">
                {item.customOptions.spiciness.map((spice) => (
                  <button
                    key={spice}
                    type="button"
                    onClick={() => setSelectedSpice(spice)}
                    className={`flex-1 px-3 py-2 text-xs rounded-xl font-medium border transition-all cursor-pointer text-center ${
                      selectedSpice === spice
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {spice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Special Request for Kitchen:
            </label>
            <input
              type="text"
              placeholder="e.g. Extra chili sauce, pack in takeaway container, separate cup..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Footer Action Bar */}
          <div className="mt-6 pt-5 border-t border-stone-800 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-stone-950 border border-stone-800 rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-100 flex items-center justify-center cursor-pointer transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-stone-100 font-mono-numbers w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Tray Button */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className="flex-1 flex items-center justify-between px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-950/20 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Add to Tray</span>
              <span className="font-mono-numbers">{totalPrice.toLocaleString()} RWF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
