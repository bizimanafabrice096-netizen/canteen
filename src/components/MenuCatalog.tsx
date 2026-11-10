import React, { useState, useMemo } from 'react';
import { CanteenItem, CategoryType } from '../types/canteen';
import { Search, Plus, Utensils, Check, Clock, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

interface MenuCatalogProps {
  items: CanteenItem[];
  onAddToCart: (item: CanteenItem, side?: string, spice?: string, notes?: string) => void;
  onOpenItemModal: (item: CanteenItem) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  items,
  onAddToCart,
  onOpenItemModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'specials' | 'under2k' | 'fast'>('all');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'meals', label: 'Hot Meals' },
    { id: 'brochettes', label: 'Brochettes & Skewers' },
    { id: 'bakery_breakfast', label: 'Bakery & Breakfast' },
    { id: 'beverages', label: 'Drinks & Tea' },
    { id: 'combos', label: 'Combos & Deals' },
  ];

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category check
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesDiet = item.dietary?.toLowerCase().includes(query);
        const matchesTag = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesDiet && !matchesTag) {
          return false;
        }
      }
      // Quick filter
      if (quickFilter === 'specials' && !item.isSpecial) return false;
      if (quickFilter === 'under2k' && item.priceRwf > 2000) return false;
      if (quickFilter === 'fast' && item.prepTimeMins > 10) return false;

      return true;
    });
  }, [items, activeCategory, searchQuery, quickFilter]);

  const handleQuickAdd = (e: React.MouseEvent, item: CanteenItem) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    onAddToCart(item);
    sound.playPop();

    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  return (
    <section id="menu-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <span>Daily Kitchen Catalog</span>
            <span aria-hidden="true">·</span>
            <span>Transparent Pricing in RWF</span>
            <span aria-hidden="true">·</span>
            <span>Made Fresh to Order</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-display mt-1">
            Available Canteen Menu & Pricing
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brochette, tea, samosa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/70 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Interactive Category Tabs (Segmented Control) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'bg-stone-900/90 text-stone-300 hover:text-stone-100 hover:bg-stone-800 border border-stone-800/80'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Quick Filter Strip */}
      <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-stone-400">
        <span className="text-stone-500 mr-1 text-[11px]">Filter by:</span>
        <button
          onClick={() => setQuickFilter('all')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            quickFilter === 'all'
              ? 'bg-stone-800 text-stone-100 font-medium'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          All ({items.length})
        </button>
        <span aria-hidden="true" className="text-stone-700">·</span>
        <button
          onClick={() => setQuickFilter('specials')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            quickFilter === 'specials'
              ? 'bg-amber-500/20 text-amber-300 font-medium'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Chef Specials</span>
        </button>
        <span aria-hidden="true" className="text-stone-700">·</span>
        <button
          onClick={() => setQuickFilter('under2k')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            quickFilter === 'under2k'
              ? 'bg-stone-800 text-stone-100 font-medium'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Under 2,000 RWF
        </button>
        <span aria-hidden="true" className="text-stone-700">·</span>
        <button
          onClick={() => setQuickFilter('fast')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            quickFilter === 'fast'
              ? 'bg-stone-800 text-stone-100 font-medium'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Clock className="w-3 h-3 text-stone-400" />
          <span>Fast Grab (&lt; 10 min)</span>
        </button>
      </div>

      {/* Menu Grid: 3-column desktop baseline */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-stone-900/40 rounded-2xl border border-stone-800 p-8">
          <Utensils className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-200">No dishes match your filter</h3>
          <p className="text-xs text-stone-400 mt-1">Try resetting your search query or selecting &quot;All Items&quot;</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setQuickFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isJustAdded = addedItemIds[item.id];

            return (
              <div
                key={item.id}
                onClick={() => onOpenItemModal(item)}
                className="bg-stone-900/90 backdrop-blur-sm border border-stone-800/90 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer shadow-lg shadow-black/20"
              >
                {/* Product Imagery */}
                <div className="relative aspect-16/10 overflow-hidden bg-stone-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-transparent" />

                  {/* Price Tag Overlay in Clear High-Contrast Tabular Numbers */}
                  <div className="absolute top-3 right-3 bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-stone-800 shadow-md">
                    <span className="text-sm font-bold text-amber-400 font-mono-numbers">
                      {item.priceRwf.toLocaleString()} RWF
                    </span>
                  </div>

                  {/* Availability / Special Indicator */}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider bg-stone-900 px-3 py-1 rounded-md border border-rose-900/50">
                        Sold Out Today
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content & Zero-Pill Metadata */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Unboxed Metadata with Typographic Separators */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2 font-medium">
                      <span className="capitalize">{item.category.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.prepTimeMins} mins</span>
                      {item.dietary && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-300">{item.dietary}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom: Quick Actions */}
                  <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenItemModal(item);
                      }}
                      className="text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      Details & Sides &rarr;
                    </button>

                    <button
                      type="button"
                      disabled={!item.isAvailable}
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-500 text-stone-950'
                          : 'bg-amber-400 hover:bg-amber-300 text-stone-950 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Add to Tray</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
