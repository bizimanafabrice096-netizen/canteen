import React, { useState } from 'react';
import { CanteenItem } from '../types/canteen';
import { Eye, EyeOff, Sparkles, Utensils, Plus } from 'lucide-react';

interface AmbientCanteenBackdropProps {
  items: CanteenItem[];
  onSelectItem?: (item: CanteenItem) => void;
  isOpenWallMode: boolean;
  onToggleWallMode: () => void;
}

export const AmbientCanteenBackdrop: React.FC<AmbientCanteenBackdropProps> = ({
  items,
  onSelectItem,
  isOpenWallMode,
  onToggleWallMode,
}) => {
  const [opacityLevel, setOpacityLevel] = useState<number>(35); // 15 to 80%
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <>
      {/* Background Wall of All Canteen Items & Their Costs */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
        style={{ opacity: opacityLevel / 100 }}
        aria-hidden="true"
      >
        {/* Repeating responsive grid displaying all canteen items and costs in the background */}
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4 transform scale-105 filter saturate-110">
          {items.map((item) => {
            const hasError = imageErrors[item.id];
            return (
              <div
                key={`bg-${item.id}`}
                className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800/60 shadow-lg flex flex-col justify-end p-2.5 group"
              >
                {!hasError ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(item.id)}
                    className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-amber-950/80 via-stone-900 to-stone-950 flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-amber-500/50" />
                  </div>
                )}

                {/* Dark gradient scrim for legibility */}
                <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/60 to-transparent" />

                {/* Content & Clear Cost in Background */}
                <div className="relative z-10 flex flex-col justify-end">
                  <p className="text-[11px] font-medium text-stone-200 line-clamp-1 leading-tight drop-shadow-sm">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-amber-400 font-mono-numbers drop-shadow-md">
                      {item.priceRwf.toLocaleString()} RWF
                    </span>
                    <span className="text-[10px] text-stone-400 capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle radial vignette gradient to focus attention to center while keeping corners visible */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,10,9,0.75)_0%,rgba(12,10,9,0.92)_100%)] pointer-events-none" />
      </div>

      {/* Floating Backdrop Controls Bar */}
      <aside 
        aria-label="Canteen background display controls"
        className="fixed bottom-5 left-5 z-30 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-2xl px-3.5 py-2.5 shadow-2xl flex items-center gap-3 text-xs text-stone-300"
      >
        <button
          onClick={onToggleWallMode}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-medium transition-colors"
          title="Toggle Full Canteen Wall Display Mode"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isOpenWallMode ? "Exit Wall View" : "Canteen Wall View"}</span>
        </button>

        <div className="h-4 w-px bg-stone-800" />

        <div className="flex items-center gap-2">
          {opacityLevel > 0 ? (
            <Eye className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-stone-500" />
          )}
          <span className="text-[11px] text-stone-400 hidden sm:inline">Backdrop:</span>
          <input
            type="range"
            min="0"
            max="70"
            step="5"
            value={opacityLevel}
            onChange={(e) => setOpacityLevel(Number(e.target.value))}
            className="w-16 sm:w-20 accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
            title="Adjust background dishes visibility"
          />
          <span className="text-[10px] font-mono-numbers text-stone-400 w-7">
            {opacityLevel}%
          </span>
        </div>
      </aside>

      {/* Full Canteen Wall Modal / Interactive View */}
      {isOpenWallMode && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6 max-w-7xl mx-auto w-full">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                <span>Bizimana Fabrice</span>
                <span>·</span>
                <span>0794513444</span>
                <span>·</span>
                <span>All Canteen Items & Costs</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-display mt-1">
                Visual Canteen Menu Wall
              </h2>
            </div>
            <button
              onClick={onToggleWallMode}
              className="px-4 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors"
            >
              Close Wall View
            </button>
          </div>

          {/* Grid of All Available Dishes with Direct Order Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto w-full pb-12">
            {items.map((item) => (
              <div
                key={`wall-${item.id}`}
                className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col group"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-stone-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(item.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-stone-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-800 shadow-md">
                    <span className="text-sm font-bold text-amber-400 font-mono-numbers">
                      {item.priceRwf.toLocaleString()} RWF
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-1">
                      <span className="capitalize">{item.category.replace('_', ' ')}</span>
                      <span>·</span>
                      <span>{item.prepTimeMins} mins prep</span>
                    </div>
                    <h3 className="text-base font-semibold text-stone-100 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800/70 flex items-center justify-between">
                    <span className="text-xs text-amber-500/90 font-medium">
                      {item.isAvailable ? "Ready to prepare" : "Currently sold out"}
                    </span>
                    <button
                      disabled={!item.isAvailable}
                      onClick={() => {
                        if (onSelectItem) {
                          onSelectItem(item);
                          onToggleWallMode();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
