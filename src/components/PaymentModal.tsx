import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Banknote, CheckCircle2, ArrowRight, Loader2, Sparkles, Smartphone } from 'lucide-react';
import { UserProfile, CartItem, OrderToken } from '../types/canteen';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  orderDetails: {
    discountCode?: string;
    discountAmount: number;
    pickupTime: string;
    counterPreference: string;
  };
  currentUser: UserProfile;
  onPaymentSuccess: (newOrder: OrderToken) => void;
  onDeductWallet: (amount: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cart,
  orderDetails,
  currentUser,
  onPaymentSuccess,
  onDeductWallet,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Campus Smart Card' | 'Cash at Counter'>('UPI');
  const [upiId, setUpiId] = useState(`${currentUser.name.toLowerCase().replace(/\s+/g, '')}@okaxis`);
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Compute final amounts
  const subtotal = cart.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
  const discountAmount = orderDetails.discountAmount || 0;
  const canteenTax = Math.round((subtotal - discountAmount) * 0.05);
  const totalAmount = Math.max(0, subtotal - discountAmount + canteenTax);

  const handleCompletePayment = () => {
    setErrorMsg('');

    // Check campus wallet balance if using Smart Card
    if (paymentMethod === 'Campus Smart Card') {
      if (currentUser.walletBalance < totalAmount) {
        setErrorMsg(`Insufficient campus card balance (₹${currentUser.walletBalance}). Please use UPI or recharge.`);
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Deduct from wallet if smart card was used
      if (paymentMethod === 'Campus Smart Card') {
        onDeductWallet(totalAmount);
      }

      // Generate realistic unique 4-digit token
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const tokenNumber = `MJPRU-${randomNum}`;
      const pickupSecret = Math.floor(100 + Math.random() * 900).toString();

      // Determine counter based on items
      let assignedCounter = 'Counter 1 (Main Meals)';
      const hasSouthIndian = cart.some((i) => i.food.category === 'breakfast' && i.food.name.includes('Dosa'));
      const onlySnacks = cart.every((i) => i.food.category === 'snacks' || i.food.category === 'beverages');

      if (hasSouthIndian) {
        assignedCounter = 'Counter 3 (South Indian Corner)';
      } else if (onlySnacks) {
        assignedCounter = 'Counter 2 (Snacks & Quick Bites)';
      }

      const newOrder: OrderToken = {
        id: tokenNumber,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        subtotal,
        discount: discountAmount,
        discountCode: orderDetails.discountCode,
        canteenTax,
        total: totalAmount,
        paymentMethod,
        paymentReference:
          paymentMethod === 'UPI'
            ? `UPI/REF-${Math.floor(1000000000 + Math.random() * 9000000000)}`
            : paymentMethod === 'Campus Smart Card'
            ? `CAMPUS-CARD/${currentUser.campusId}`
            : 'PAY-AT-COUNTER',
        paymentStatus: paymentMethod === 'Cash at Counter' ? 'Pending at Counter' : 'Completed',
        orderStatus: 'Order Placed',
        pickupCounter: assignedCounter,
        estimatedMinutes: 8,
        customerName: currentUser.name,
        customerRole: currentUser.role,
        studentRollNo: currentUser.campusId,
        pickupCode: pickupSecret,
      };

      setIsProcessing(false);
      onPaymentSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-900 tracking-wide uppercase">
              Secure University Gateway
            </span>
            <h3 className="font-heading font-extrabold text-slate-900 text-lg">
              Digital Payment & Token Checkout
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Snapshot */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-600">Total Bill to Pay</span>
              <div className="text-2xl font-extrabold text-blue-950 tabular-nums">
                ₹{totalAmount}
              </div>
              <span className="text-[11px] text-slate-500">
                {cart.length} dish types ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Scheduled for</span>
              <span className="text-xs font-bold text-slate-900">{orderDetails.pickupTime}</span>
              <span className="text-[11px] text-emerald-700 block font-semibold mt-0.5">
                Instant Token on payment
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-blue-900 mb-2" />
                <span className="text-xs font-bold text-slate-900">UPI Digital</span>
                <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Campus Smart Card')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'Campus Smart Card'
                    ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-700 mb-2" />
                <span className="text-xs font-bold text-slate-900">Campus Card</span>
                <span className="text-[10px] text-emerald-700 font-semibold tabular-nums">
                  Bal: ₹{currentUser.walletBalance}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash at Counter')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'Cash at Counter'
                    ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-700 mb-2" />
                <span className="text-xs font-bold text-slate-900">Counter Cash</span>
                <span className="text-[10px] text-slate-500">Pay on pickup</span>
              </button>
            </div>
          </div>

          {/* Conditional Method UI */}
          {paymentMethod === 'UPI' && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-900" />
                  Instant UPI Fast Checkout
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zero Surcharge
                </span>
              </div>

              {/* UPI App Selection */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUpiApp('gpay')}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    upiApp === 'gpay'
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Google Pay
                </button>
                <button
                  type="button"
                  onClick={() => setUpiApp('phonepe')}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    upiApp === 'phonepe'
                      ? 'bg-purple-800 text-white border-purple-800'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  PhonePe
                </button>
                <button
                  type="button"
                  onClick={() => setUpiApp('paytm')}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    upiApp === 'paytm'
                      ? 'bg-sky-700 text-white border-sky-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Paytm / BHIM
                </button>
              </div>

              {/* UPI ID input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Enter VPA / UPI ID:
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-blue-600 font-medium"
                  placeholder="e.g. rollnumber@okhdfcbank"
                />
              </div>

              {/* Simulated QR Code box */}
              <div className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="w-16 h-16 bg-slate-900 p-1 rounded-md shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-white p-1 rounded-xs flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-3 h-3 bg-slate-900" />
                      <div className="w-3 h-3 bg-slate-900" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-3 h-3 bg-slate-900" />
                      <div className="w-2 h-2 bg-slate-900 self-center" />
                    </div>
                  </div>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Scan MJPRU Canteen QR</span>
                  <span className="text-[11px] text-slate-500">
                    Supports any scanner app. Auto-verifies upon clicking pay below.
                  </span>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'Campus Smart Card' && (
            <div className="border border-slate-200 rounded-xl p-4 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    MJPRU University Smart ID Card
                  </span>
                  <span className="text-[11px] text-slate-500">{currentUser.campusId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Available Balance</span>
                  <span className="text-base font-extrabold text-emerald-800 tabular-nums">
                    ₹{currentUser.walletBalance}
                  </span>
                </div>
              </div>

              {currentUser.walletBalance >= totalAmount ? (
                <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-300 text-[11px] text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Balance sufficient! ₹{totalAmount} will be debited directly from your campus wallet.
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-red-100/70 border border-red-300 text-[11px] text-red-900 flex items-center gap-2">
                  <span>
                    Low balance! Need ₹{totalAmount - currentUser.walletBalance} more. Use UPI or top up.
                  </span>
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'Cash at Counter' && (
            <div className="border border-slate-200 rounded-xl p-4 bg-amber-50/50 space-y-2">
              <span className="text-xs font-bold text-amber-900 block">
                Cash Payment at Pickup Counter
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your order will be queued immediately in the kitchen. When picking up, show your token number and pay <strong>₹{totalAmount}</strong> in cash at the counter billing terminal.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            <span>Customer: </span>
            <strong className="text-slate-900">{currentUser.name}</strong>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleCompletePayment}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <span>Confirm & Generate Token</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
