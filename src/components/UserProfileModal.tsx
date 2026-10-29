import React, { useState } from 'react';
import { X, User, CreditCard, ShieldCheck, Plus, Check } from 'lucide-react';
import { UserProfile } from '../types/canteen';
import { SAMPLE_USERS } from '../data/menuData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onTopUpWallet: (amount: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onTopUpWallet,
}) => {
  const [topUpAmount, setTopUpAmount] = useState(200);
  const [showTopUpSuccess, setShowTopUpSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddFunds = (amt: number) => {
    onTopUpWallet(amt);
    setShowTopUpSuccess(true);
    setTimeout(() => setShowTopUpSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-900" />
            <h3 className="font-heading font-extrabold text-slate-900 text-base">
              Campus Identity & Canteen Pass
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

        <div className="p-5 space-y-5 text-xs text-left">
          {/* Active Card */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                  MJPRU Campus Smart Wallet
                </span>
                <span className="font-bold text-sm text-white">{currentUser.name}</span>
                <span className="text-[11px] text-blue-200 block">{currentUser.department}</span>
              </div>
              <div className="bg-blue-800/80 px-2.5 py-1 rounded text-[11px] font-bold text-amber-300">
                {currentUser.role}
              </div>
            </div>

            <div className="flex justify-between items-end pt-2 border-t border-blue-800/60">
              <div>
                <span className="text-[10px] text-blue-300 block">ID / Roll No</span>
                <span className="font-mono text-xs font-semibold">{currentUser.campusId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-300 block">Canteen Balance</span>
                <span className="text-xl font-extrabold text-emerald-300 tabular-nums">
                  ₹{currentUser.walletBalance}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Wallet Top-up */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                Quick Recharge Wallet
              </span>
              {showTopUpSuccess && (
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <Check className="w-3 h-3" /> Added!
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              {[100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAddFunds(amt)}
                  className="py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-900 transition-colors"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Persona Switcher */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
              Switch University Profile (Simulation):
            </label>
            <div className="space-y-2">
              {SAMPLE_USERS.map((user) => (
                <button
                  key={user.campusId}
                  type="button"
                  onClick={() => onSelectUser(user)}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                    currentUser.campusId === user.campusId
                      ? 'border-blue-900 bg-blue-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                      {user.avatarInitials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {user.role} · {user.department}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">
                    ₹{user.walletBalance}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
