import React from 'react';
import { CheckCircle2, Clock, MapPin, QrCode, Printer, X, ChefHat, Bell, ArrowRight } from 'lucide-react';
import { OrderToken } from '../types/canteen';
import { VegNonVegIndicator } from './VegNonVegIndicator';

interface OrderTokenModalProps {
  order: OrderToken | null;
  onClose: () => void;
  onViewMyOrders: () => void;
}

export const OrderTokenModal: React.FC<OrderTokenModalProps> = ({
  order,
  onClose,
  onViewMyOrders,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Confetti / Success Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 text-white p-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-400/30">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>

          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
            Payment Confirmed
          </span>
          <h3 className="font-heading font-extrabold text-2xl text-white mt-0.5">
            Your Order Token
          </h3>

          {/* Large Token Badge */}
          <div className="mt-3 inline-block bg-white text-blue-950 px-6 py-2 rounded-xl shadow-md border-2 border-amber-400">
            <span className="text-xs uppercase font-extrabold text-slate-500 block leading-none">
              Token Number
            </span>
            <span className="text-3xl font-extrabold tracking-wider tabular-nums font-mono">
              {order.id}
            </span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-6 overflow-y-auto space-y-5 text-left">
          {/* Status Tracker */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700">Live Kitchen Status:</span>
              <span className="font-extrabold text-blue-900">{order.orderStatus}</span>
            </div>
            {/* Visual Step Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full bg-emerald-600 transition-all duration-500 ${
                  order.orderStatus === 'Order Placed'
                    ? 'w-1/3'
                    : order.orderStatus === 'Kitchen Preparing'
                    ? 'w-2/3'
                    : 'w-full'
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
              <span>Placed</span>
              <span>Cooking</span>
              <span>Ready for Counter</span>
            </div>
          </div>

          {/* Pickup Instructions */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl">
              <span className="text-slate-500 text-[11px] block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-900" />
                Pickup Counter
              </span>
              <span className="font-bold text-slate-900 text-xs block mt-0.5">
                {order.pickupCounter}
              </span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl">
              <span className="text-slate-500 text-[11px] block flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-700" />
                Est. Waiting Time
              </span>
              <span className="font-bold text-emerald-800 text-xs block mt-0.5">
                ~{order.estimatedMinutes} mins
              </span>
            </div>
          </div>

          {/* Itemized summary */}
          <div className="border border-slate-200 rounded-xl p-3.5">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              Ordered Items
            </span>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <VegNonVegIndicator isVeg={item.food.isVeg} size="sm" />
                    <span className="font-medium text-slate-800 truncate">
                      {item.food.name}
                    </span>
                    <span className="text-slate-500 font-bold tabular-nums">
                      ×{item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                    ₹{item.food.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
              <span>Paid via {order.paymentMethod}</span>
              <span className="text-sm font-extrabold text-blue-950 tabular-nums">
                ₹{order.total}
              </span>
            </div>
          </div>

          {/* Digital QR Code for Counter Terminal */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-16 h-16 bg-white border border-slate-300 p-1.5 rounded-lg shrink-0 flex items-center justify-center shadow-2xs">
              <QrCode className="w-full h-full text-slate-800" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                Verification Code: #{order.pickupCode}
              </span>
              <span className="text-[11px] text-slate-500">
                Show this token screen at the counter when your token flashes on the dining hall screen.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={onViewMyOrders}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All My Tokens</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
