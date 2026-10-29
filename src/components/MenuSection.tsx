import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sun, Utensils, Coffee, Sparkles, AlertCircle } from 'lucide-react';
import { FoodItem, MealCategory, DietType } from '../types/canteen';
import { FoodCard } from './FoodCard';
import { VegNonVegIndicator } from './VegNonVegIndicator';

interface MenuSectionProps {
  items: FoodItem[];
  cartItemCounts: Record<string, number>;
  onAddToCart: (item: FoodItem, note?: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  selectedCategory: MealCategory;
  onSelectCategory: (category: MealCategory) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  cartItemCounts,
  onAddToCart,
  onUpdateQuantity,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<DietType>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'prep-time'>('recommended');

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    return {
      all: items.length,
      breakfast: items.filter((i) => i.category === 'breakfast').length,
      lunch: items.filter((i) => i.category === 'lunch').length,
      snacks: items.filter((i) => i.category === 'snacks').length,
      beverages: items.filter((i) => i.category === 'beverages').length,
    };
  }, [items]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Dietary filter
        if (selectedDiet === 'veg' && !item.isVeg) return false;
        if (selectedDiet === 'non-veg' && item.isVeg) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchHindi = item.hindiName.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchDesc = item.description.toLowerCase().includes(q);
          if (!matchName && !matchHindi && !matchTags && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'prep-time') return a.prepTime - b.prepTime;
        // recommended: popular first, then rating
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return b.rating - a.rating;
      });
  }, [items, selectedCategory, selectedDiet, searchQuery, sortBy]);

  return (
    <section id="canteen-menu" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
            <span>Explore Campus Dining</span>
          </div>
          <h2 className="font-heading font-extrabold text-slate-900 text-3xl sm:text-4xl tracking-tight">
            MJPRU Daily Food Menu
          </h2>
          <p className="text-slate-600 text-sm mt-2 text-balance">
            Hot, hygienic, and affordable campus meals freshly prepared at university express counters.
          </p>
        </div>

        {/* Meal Category Tabs (Interactive Segmented Filter) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 mb-8 gap-2 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <span>All Items</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'all' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {categoryCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('breakfast')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              selectedCategory === 'breakfast'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Breakfast</span>
            <span className="text-[10px] text-slate-600 hidden md:inline">(7:30 – 11:30 AM)</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'breakfast' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {categoryCounts.breakfast}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('lunch')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              selectedCategory === 'lunch'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-blue-600" />
            <span>Lunch Menu</span>
            <span className="text-[10px] text-slate-600 hidden md:inline">(12:00 – 3:30 PM)</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'lunch' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {categoryCounts.lunch}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('snacks')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              selectedCategory === 'snacks'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Evening Snacks</span>
            <span className="text-[10px] text-slate-600 hidden md:inline">(3:30 – 8:00 PM)</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'snacks' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {categoryCounts.snacks}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('beverages')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              selectedCategory === 'beverages'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            <span>Chai & Drinks</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'beverages' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {categoryCounts.beverages}
            </span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 sm:p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Thali, Dosa, Biryani, Chai, Samosa, Maggi)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-blue-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800 p-1"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Dietary Toggle (Veg / Non-Veg / All) */}
            <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setSelectedDiet('all')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedDiet === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedDiet('veg')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  selectedDiet === 'veg'
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <VegNonVegIndicator isVeg={true} size="sm" />
                <span>Pure Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDiet('non-veg')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  selectedDiet === 'non-veg'
                    ? 'bg-amber-800 text-white'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <VegNonVegIndicator isVeg={false} size="sm" />
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort dishes by"
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="recommended">Sort: Popular First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="prep-time">Prep Time: Quickest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter / Category Title */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900 tabular-nums">{filteredItems.length}</strong> delicious items
            {selectedCategory !== 'all' && (
              <span> in <strong className="capitalize text-blue-900">{selectedCategory}</strong></span>
            )}
            {selectedDiet !== 'all' && (
              <span> ({selectedDiet === 'veg' ? 'Pure Vegetarian' : 'Non-Vegetarian'})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Counter Pickup:</span>
            <span className="font-semibold text-slate-700">1 (Meals) · 2 (Snacks) · 3 (South Indian)</span>
          </div>
        </div>

        {/* Food Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                quantityInCart={cartItemCounts[item.id] || 0}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No dishes match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try clearing your search query or selecting a different dietary preference.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDiet('all');
                onSelectCategory('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
