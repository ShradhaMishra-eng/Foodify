import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FoodItem } from '../types/canteen';
import { FoodCard } from './FoodCard';

interface FeaturedDishesProps {
  items: FoodItem[];
  cartItemCounts: Record<string, number>;
  onAddToCart: (item: FoodItem, note?: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onViewAllMenu: () => void;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({
  items,
  cartItemCounts,
  onAddToCart,
  onUpdateQuantity,
  onViewAllMenu,
}) => {
  // Select top popular dishes across meal periods
  const popularDishes = items.filter((item) => item.isPopular).slice(0, 4);

  return (
    <section className="py-12 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Campus Bestsellers</span>
            </div>
            <h2 className="font-heading font-extrabold text-slate-900 text-2xl sm:text-3xl tracking-tight">
              Most Loved by Students & Faculty
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Freshly prepared daily with hygienic ingredients and authentic university canteen taste.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllMenu}
            className="self-start sm:self-auto text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 py-1 group transition-colors"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDishes.map((dish) => (
            <FoodCard
              key={dish.id}
              item={dish}
              quantityInCart={cartItemCounts[dish.id] || 0}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
