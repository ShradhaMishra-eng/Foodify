import React from 'react';
import { Ticket, Clock, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, MapPin, QrCode } from 'lucide-react';
import { OrderToken, FoodItem } from '../types/canteen';
import { VegNonVegIndicator } from './VegNonVegIndicator';

interface OrdersViewProps {
  orders: OrderToken[];
  onOpenOrderToken: (order: OrderToken) => void;
  onReorder: (items: { food: FoodItem; quantity: number }[]) => void;
  onExploreMenu: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenOrderToken,
  onReorder,
  onExploreMenu,
}) => {
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Collected' && o.orderStatus !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.orderStatus === 'Collected' || o.orderStatus === 'Cancelled');

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4 text-emerald-600" />
            <span>Digital Token Passbook</span>
          </div>
          <h2 className="font-heading font-extrabold text-slate-900 text-2xl sm:text-3xl">
            My Orders & Tokens
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Track real-time cooking progress and display your token at the canteen counter.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreMenu}
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          + Order More Food
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No active or past tokens yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Place an order from the canteen menu to receive your live digital token and bypass queue wait times.
          </p>
          <button
            type="button"
            onClick={onExploreMenu}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors"
          >
            Explore Today's Menu
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Orders Section */}
          {activeOrders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Active Food Tokens ({activeOrders.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border-2 border-blue-900/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase block leading-none">
                            Token No.
                          </span>
                          <span className="text-2xl font-extrabold text-blue-950 font-mono tracking-wider tabular-nums">
                            {order.id}
                          </span>
                        </div>

                        {/* Status Chip */}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                            order.orderStatus === 'Ready for Pickup'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-bounce'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {order.orderStatus === 'Ready for Pickup' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                          )}
                          <span>{order.orderStatus}</span>
                        </div>
                      </div>

                      {/* Location & Time */}
                      <div className="bg-slate-50 rounded-xl p-3 mb-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-900" />
                            Counter:
                          </span>
                          <strong className="text-slate-900">{order.pickupCounter}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-700" />
                            Placed at:
                          </span>
                          <span className="tabular-nums font-medium text-slate-900">
                            {order.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-1.5 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                            <div className="flex items-center gap-1.5 truncate">
                              <VegNonVegIndicator isVeg={item.food.isVeg} size="sm" />
                              <span className="truncate">{item.food.name}</span>
                            </div>
                            <span className="text-slate-500 font-bold tabular-nums shrink-0">
                              ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-xs">
                        <span className="text-slate-500 block leading-none text-[10px]">Total Paid</span>
                        <span className="font-extrabold text-blue-950 text-base tabular-nums">
                          ₹{order.total}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenOrderToken(order)}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show Token Ticket</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Orders Section */}
          {pastOrders.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                Completed Orders ({pastOrders.length})
              </h3>

              <div className="space-y-3">
                {pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">{order.timestamp}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs text-emerald-700 font-semibold">Collected</span>
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1">
                        {order.items.map((i) => `${i.food.name} (×${i.quantity})`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-bold text-slate-900 text-sm tabular-nums">
                        ₹{order.total}
                      </span>
                      <button
                        type="button"
                        onClick={() => onReorder(order.items)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
