import React, { useState } from 'react';
import { Star, Clock, Plus, Minus, MessageSquare, Check } from 'lucide-react';
import { FoodItem } from '../types/canteen';
import { VegNonVegIndicator } from './VegNonVegIndicator';

interface FoodCardProps {
  item: FoodItem;
  quantityInCart: number;
  onAddToCart: (item: FoodItem, note?: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onOpenNotes?: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenNotes,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [customNote, setCustomNote] = useState('');

  const handleAdd = () => {
    if (!item.isAvailable) return;
    onAddToCart(item, customNote.trim() ? customNote.trim() : undefined);
    setShowNoteInput(false);
    setCustomNote('');
  };

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden ${
        !item.isAvailable ? 'opacity-70 bg-slate-50' : ''
      }`}
    >
      {/* Food Photo Container */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-2xl mb-1">🍽️</span>
            <span className="text-xs font-medium text-slate-500">{item.name}</span>
          </div>
        )}

        {/* Veg/Non-Veg Corner Badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs flex items-center gap-1.5">
          <VegNonVegIndicator isVeg={item.isVeg} size="sm" showLabel />
        </div>

        {/* Counter & Prep Time Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
          <span className="bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            {item.prepTime} mins
          </span>
          {item.isPopular && (
            <span className="bg-amber-600/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium">
              Popular
            </span>
          )}
        </div>

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-semibold text-xs px-3 py-1 rounded shadow-sm">
              Sold Out for this Slot
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name and Hindi Name */}
        <div className="mb-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors">
              {item.name}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium tracking-wide mt-0.5">
            {item.hindiName}
          </p>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Unboxed Metadata: Counter Location and Tag */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-3 mt-auto">
          <span className="truncate">{item.counter}</span>
          <span aria-hidden="true">·</span>
          <span>{item.tags[0]}</span>
        </div>

        {/* Note input preview if toggled */}
        {showNoteInput && (
          <div className="mb-3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Add note for kitchen (optional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Less spicy, extra chutney..."
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-blue-600"
              maxLength={60}
            />
          </div>
        )}

        {/* Price & Action Area */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-slate-600 line-through tabular-nums">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {item.isAvailable && quantityInCart === 0 && !showNoteInput && (
              <button
                type="button"
                onClick={() => setShowNoteInput(true)}
                title="Add cooking instructions"
                className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            )}

            {!item.isAvailable ? (
              <button
                disabled
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-200 rounded-lg cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : quantityInCart === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 rounded-lg shadow-xs transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 flex items-center justify-center text-blue-900 hover:bg-blue-200/60 rounded font-semibold transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-xs font-bold text-blue-900 tabular-nums">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  aria-label="Increase quantity"
                  className="w-6 h-6 flex items-center justify-center text-blue-900 hover:bg-blue-200/60 rounded font-semibold transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
