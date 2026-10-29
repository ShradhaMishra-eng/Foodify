import React, { useState } from 'react';
import { X, Monitor, ChefHat, CheckCircle2, Clock, Plus, Tag, ToggleLeft, ToggleRight, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { OrderToken, FoodItem, OrderStatus } from '../types/canteen';
import { VegNonVegIndicator } from './VegNonVegIndicator';

interface AdminKDSModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderToken[];
  menuItems: FoodItem[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onToggleItemAvailability: (itemId: string) => void;
  onUpdateItemPrice: (itemId: string, newPrice: number) => void;
  onAddNewDish: (newDish: FoodItem) => void;
}

export const AdminKDSModal: React.FC<AdminKDSModalProps> = ({
  isOpen,
  onClose,
  orders,
  menuItems,
  onUpdateOrderStatus,
  onToggleItemAvailability,
  onUpdateItemPrice,
  onAddNewDish,
}) => {
  const [activeTab, setActiveTab] = useState<'kds' | 'tv-screen' | 'menu-manager'>('kds');

  // Form for adding new dish
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishHindi, setNewDishHindi] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<'breakfast' | 'lunch' | 'snacks' | 'beverages'>('lunch');
  const [newDishPrice, setNewDishPrice] = useState(60);
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishCounter, setNewDishCounter] = useState('Counter 1 (Main Meals)');
  const [newDishPrepTime, setNewDishPrepTime] = useState(8);

  if (!isOpen) return null;

  const preparingOrders = orders.filter((o) => o.orderStatus === 'Kitchen Preparing' || o.orderStatus === 'Order Placed');
  const readyOrders = orders.filter((o) => o.orderStatus === 'Ready for Pickup');
  const completedOrders = orders.filter((o) => o.orderStatus === 'Collected');

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newDish: FoodItem = {
      id: `dish-custom-${Date.now()}`,
      name: newDishName.trim(),
      hindiName: newDishHindi.trim() || newDishName.trim(),
      description: 'Freshly added daily special dish prepared by central canteen staff.',
      category: newDishCategory,
      isVeg: newDishIsVeg,
      price: Number(newDishPrice),
      rating: 4.8,
      reviewCount: 1,
      prepTime: Number(newDishPrepTime),
      image: menuItems[0]?.image || '',
      isAvailable: true,
      counter: newDishCounter,
      tags: ['Chef Special', 'Daily Menu'],
    };

    onAddNewDish(newDish);
    setShowAddModal(false);
    setNewDishName('');
    setNewDishHindi('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[94vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-white text-lg">
                  MJPRU Canteen Management & KDS
                </h3>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                  Admin & Kitchen Terminal
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Live Kitchen Order Ticket Screen & Dining Hall TV Monitor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab('kds')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'kds' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Kitchen Orders ({preparingOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tv-screen')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  activeTab === 'tv-screen' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Hall TV Display</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('menu-manager')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'menu-manager' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Menu Admin
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Kitchen Orders Management */}
        {activeTab === 'kds' && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Placed / Queued */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>New / Placed ({orders.filter((o) => o.orderStatus === 'Order Placed').length})</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  {orders
                    .filter((o) => o.orderStatus === 'Order Placed')
                    .map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-amber-300 p-4 shadow-xs"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xl font-extrabold text-blue-950 font-mono">
                              {order.id}
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              {order.customerName} ({order.customerRole})
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {order.timestamp}
                          </span>
                        </div>

                        <div className="py-2 border-t border-slate-100 space-y-1 mb-3">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="font-medium text-slate-800 truncate">
                                {i.food.name}
                              </span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                ×{i.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.some((i) => i.specialNote) && (
                            <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1 font-medium">
                              Note: {order.items.find((i) => i.specialNote)?.specialNote}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(order.id, 'Kitchen Preparing')}
                          className="w-full py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Start Cooking</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column 2: Currently Cooking */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-blue-600">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                    <span>Kitchen Preparing ({orders.filter((o) => o.orderStatus === 'Kitchen Preparing').length})</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  {orders
                    .filter((o) => o.orderStatus === 'Kitchen Preparing')
                    .map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-blue-300 p-4 shadow-xs"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xl font-extrabold text-blue-950 font-mono">
                              {order.id}
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              {order.pickupCounter}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                            Prep ~{order.estimatedMinutes}m
                          </span>
                        </div>

                        <div className="py-2 border-t border-slate-100 space-y-1 mb-3">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="font-medium text-slate-800 truncate">
                                {i.food.name}
                              </span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                ×{i.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(order.id, 'Ready for Pickup')}
                          className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Ready for Pickup</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column 3: Ready for Pickup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-600">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Ready at Counter ({readyOrders.length})</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  {readyOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-emerald-50/50 rounded-xl border-2 border-emerald-500 p-4 shadow-xs"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-2xl font-extrabold text-emerald-950 font-mono">
                            {order.id}
                          </span>
                          <span className="block text-[11px] font-bold text-emerald-800">
                            {order.pickupCounter}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded">
                          Pin: #{order.pickupCode}
                        </span>
                      </div>

                      <div className="py-1 text-xs text-slate-700 mb-3">
                        Customer: <strong>{order.customerName}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Collected')}
                        className="w-full py-2 text-xs font-bold text-slate-800 bg-white hover:bg-emerald-100 border border-emerald-400 rounded-lg transition-colors"
                      >
                        Confirm Handover & Archive
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hall TV Display (Simulating Canteen Dining Room LED Screen) */}
        {activeTab === 'tv-screen' && (
          <div className="flex-1 bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
            {/* TV Screen Header */}
            <div className="text-center pb-6 border-b border-slate-800">
              <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
                Mahatma Jyotiba Phule Rohilkhand University · Central Dining Hall
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                Live Order Token Board
              </h2>
            </div>

            {/* TV Split Screen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
              {/* Preparing Column */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <span className="text-base font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                    <span>Preparing in Kitchen</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {preparingOrders.length} orders
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {preparingOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center"
                    >
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 block">
                        {o.id}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {o.pickupCounter.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                  {preparingOrders.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                      All caught up! No pending kitchen orders.
                    </div>
                  )}
                </div>
              </div>

              {/* Ready for Pickup Column */}
              <div className="bg-emerald-950/40 rounded-2xl border-2 border-emerald-500/80 p-6 flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800/50 mb-6">
                  <span className="text-base font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Ready for Collection!</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-300">
                    {readyOrders.length} ready
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {readyOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-emerald-900/60 border border-emerald-400 rounded-xl p-4 text-center animate-pulse"
                    >
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">
                        {o.id}
                      </span>
                      <span className="text-xs font-bold text-amber-300 mt-1 block">
                        {o.pickupCounter}
                      </span>
                    </div>
                  ))}
                  {readyOrders.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-400 text-sm">
                      Kitchen is preparing delicious food! Ready tokens will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TV Screen Footer Ticker */}
            <div className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">
                Please collect your tray immediately once your token flashes green.
              </span>
              <span>Express Counters 1, 2, 3 Active</span>
            </div>
          </div>
        )}

        {/* Tab 3: Menu Admin Management */}
        {activeTab === 'menu-manager' && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-heading font-extrabold text-slate-900 text-xl">
                  Canteen Menu & Item Availability
                </h4>
                <p className="text-xs text-slate-500">
                  Toggle items on/off during peak rush hours or update prices dynamically.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Add Daily Special Dish</span>
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Diet</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Counter</th>
                    <th className="py-3 px-4">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div>{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.hindiName}</div>
                      </td>
                      <td className="py-3 px-4 capitalize font-medium text-slate-600">
                        {item.category}
                      </td>
                      <td className="py-3 px-4">
                        <VegNonVegIndicator isVeg={item.isVeg} size="sm" showLabel />
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                        <div className="flex items-center gap-1">
                          <span>₹</span>
                          <input
                            type="number"
                            defaultValue={item.price}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val > 0) onUpdateItemPrice(item.id, val);
                            }}
                            className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-blue-600"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.counter}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onToggleItemAvailability(item.id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          <span>{item.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add New Dish Modal Sub-view */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
              <h4 className="font-heading font-extrabold text-slate-900 text-lg mb-4">
                Add Daily Special Canteen Dish
              </h4>
              <form onSubmit={handleCreateDish} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dish Name:</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Paneer Pulao, Gulab Jamun..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hindi Name (optional):</label>
                  <input
                    type="text"
                    value={newDishHindi}
                    onChange={(e) => setNewDishHindi(e.target.value)}
                    placeholder="e.g. पनीर पुलाव"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Meal Period:</label>
                    <select
                      value={newDishCategory}
                      onChange={(e) => setNewDishCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="snacks">Evening Snacks</option>
                      <option value="beverages">Beverages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (₹):</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={newDishPrice}
                      onChange={(e) => setNewDishPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 py-1">
                  <label className="font-semibold text-slate-700">Diet Type:</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={newDishIsVeg}
                        onChange={() => setNewDishIsVeg(true)}
                        name="dietType"
                      />
                      <span>Pure Veg</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!newDishIsVeg}
                        onChange={() => setNewDishIsVeg(false)}
                        name="dietType"
                      />
                      <span>Non-Veg</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                  >
                    Add to Canteen Menu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
