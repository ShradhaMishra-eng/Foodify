import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem, UserProfile } from '../types/canteen';
import { VegNonVegIndicator } from './VegNonVegIndicator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (cartDetails: {
    discountCode?: string;
    discountAmount: number;
    pickupTime: string;
    counterPreference: string;
  }) => void;
  currentUser: UserProfile;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  currentUser,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('MJPRU10');
  const [couponError, setCouponError] = useState('');
  const [pickupTime, setPickupTime] = useState('Immediate (~8 mins)');
  const [counterPreference, setCounterPreference] = useState('Auto-assigned by meal');

  if (!isOpen) return null;

  // Subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.food.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon === 'MJPRU10') {
    discountAmount = Math.round(subtotal * 0.1); // 10% student subsidy
  } else if (appliedCoupon === 'CAMPUS20' && subtotal >= 100) {
    discountAmount = 20;
  }

  // Canteen Tax (5% CGST + SGST)
  const canteenTax = Math.round((subtotal - discountAmount) * 0.05);
  const totalAmount = Math.max(0, subtotal - discountAmount + canteenTax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'MJPRU10' || code === 'CAMPUS20') {
      setAppliedCoupon(code);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon. Try MJPRU10 or CAMPUS20');
    }
  };

  const handleCheckout = () => {
    onProceedToCheckout({
      discountCode: appliedCoupon || undefined,
      discountAmount,
      pickupTime,
      counterPreference,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-slate-900 text-lg">
              Campus Canteen Order
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 tabular-nums">
              {cart.reduce((a, b) => a + b.quantity, 0)} items
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center text-2xl mb-4">
              🍱
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Your tray is empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mb-6">
              Explore the breakfast, lunch, or evening snacks menu to add freshly prepared dishes.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-800 transition-colors"
            >
              Browse Canteen Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.food.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  {/* Item Image */}
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <VegNonVegIndicator isVeg={item.food.isVeg} size="sm" />
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.food.name}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-900 tabular-nums shrink-0">
                        ₹{item.food.price * item.quantity}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ₹{item.food.price} each · {item.food.counter.split(' ')[0]}
                    </div>

                    {item.specialNote && (
                      <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 truncate">
                        Note: {item.specialNote}
                      </div>
                    )}

                    {/* Quantity Adjustment Bar */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.food.id)}
                        className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>

                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.food.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.food.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pickup Preferences */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-900" />
                  Pickup Timing
                </span>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="text-xs bg-white border border-slate-300 rounded px-2 py-1 font-medium text-slate-800 focus:outline-blue-600"
                >
                  <option value="Immediate (~8 mins)">Immediate (~8 mins)</option>
                  <option value="Next Lecture Break (1:15 PM)">Next Break (1:15 PM)</option>
                  <option value="Afternoon Recess (3:30 PM)">Afternoon Recess (3:30 PM)</option>
                  <option value="Evening Slot (5:00 PM)">Evening Slot (5:00 PM)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  Pickup Point
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  Main Canteen Dining Hall
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  Campus Discount Code
                </span>
                {appliedCoupon && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Applied: {appliedCoupon}
                  </span>
                )}
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter MJPRU10 or CAMPUS20"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 uppercase focus:outline-blue-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponError && (
                <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
              )}
            </div>

            {/* Bill Summary */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Student/Campus Subsidy</span>
                  <span className="tabular-nums">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Canteen GST & Maintenance (5%)</span>
                <span className="font-semibold text-slate-900 tabular-nums">₹{canteenTax}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-extrabold text-sm">
                <span>Total Payable</span>
                <span className="text-base text-blue-950 tabular-nums">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Ordering as: <strong className="text-slate-800">{currentUser.name}</strong></span>
              <span>Tokens issued instantly</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Pay ₹{totalAmount} & Generate Token</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
