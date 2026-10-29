import React, { useState } from 'react';
import { ShoppingBag, User, UtensilsCrossed, Monitor, Clock, ShieldCheck, ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { UserProfile } from '../types/canteen';

interface NavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  activeTab: string;
  onSelectNav: (tab: string) => void;
  currentUser: UserProfile;
  onOpenUserModal: () => void;
  onOpenKDS: () => void;
  activeOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  onOpenCart,
  activeTab,
  onSelectNav,
  currentUser,
  onOpenUserModal,
  onOpenKDS,
  activeOrdersCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    onSelectNav(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-shadow">
      {/* Top University Info Bar */}
      <div className="bg-blue-950 text-slate-200 text-[11px] px-4 py-1.5 hidden sm:flex items-center justify-between border-b border-blue-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">MJPRU Bareilly</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>Mahatma Jyotiba Phule Rohilkhand University, Uttar Pradesh</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Kitchen Active (7:30 AM – 8:30 PM)
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Counter Pickup: 1, 2 & 3</span>
        </div>
      </div>

      {/* Main Navigation (3-Zone Top Bar Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-extrabold text-base shadow-xs group-hover:bg-blue-800 transition-colors shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-slate-900 text-lg leading-tight tracking-tight whitespace-nowrap group-hover:text-blue-900 transition-colors">
                MJPRU Digital Canteen
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wide uppercase">
                Order Smart · Skip Queue
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-900 ${
              activeTab === 'home' ? 'text-blue-900 font-bold border-b-2 border-blue-900 py-1' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu-all')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-900 ${
              activeTab === 'menu-all' ? 'text-blue-900 font-bold border-b-2 border-blue-900 py-1' : ''
            }`}
          >
            Explore Menu
          </button>
          <button
            onClick={() => handleNavClick('breakfast')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-900 ${
              activeTab === 'breakfast' ? 'text-blue-900 font-bold border-b-2 border-blue-900 py-1' : ''
            }`}
          >
            Breakfast
          </button>
          <button
            onClick={() => handleNavClick('lunch')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-900 ${
              activeTab === 'lunch' ? 'text-blue-900 font-bold border-b-2 border-blue-900 py-1' : ''
            }`}
          >
            Lunch
          </button>
          <button
            onClick={() => handleNavClick('snacks')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-900 ${
              activeTab === 'snacks' ? 'text-blue-900 font-bold border-b-2 border-blue-900 py-1' : ''
            }`}
          >
            Evening Snacks
          </button>
          <button
            onClick={() => handleNavClick('orders')}
            className={`relative transition-colors whitespace-nowrap shrink-0 hover:text-blue-900 flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'text-blue-900 font-bold border-b-2 border-blue-900 py-1' : ''
            }`}
          >
            <span>My Orders</span>
            {activeOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                {activeOrdersCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Canteen Staff / TV Display Launcher */}
          <button
            type="button"
            onClick={onOpenKDS}
            title="Open Canteen Staff & Live TV Token Board"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-900" />
            <span>Kitchen / Live Screen</span>
          </button>

          {/* User Profile / Switcher button */}
          <button
            type="button"
            onClick={onOpenUserModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Switch User or View Campus Balance"
          >
            <div className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="font-semibold text-slate-800 text-[11px] max-w-[90px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold tabular-nums">
                ₹{currentUser.walletBalance}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="View Cart"
            className="relative px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-emerald-500 text-white font-extrabold text-[11px] px-1.5 py-0.2 rounded-full tabular-nums">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 shadow-lg space-y-1">
          <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span>Signed in as: <strong className="text-slate-800">{currentUser.name}</strong></span>
            <span className="font-semibold text-emerald-700">₹{currentUser.walletBalance}</span>
          </div>
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu-all')}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
              activeTab === 'menu-all' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            Explore Full Menu
          </button>
          <button
            onClick={() => handleNavClick('breakfast')}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
              activeTab === 'breakfast' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            Breakfast Menu
          </button>
          <button
            onClick={() => handleNavClick('lunch')}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
              activeTab === 'lunch' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            Lunch Menu
          </button>
          <button
            onClick={() => handleNavClick('snacks')}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
              activeTab === 'snacks' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            Evening Snacks
          </button>
          <button
            onClick={() => handleNavClick('orders')}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium flex items-center justify-between ${
              activeTab === 'orders' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            <span>My Orders & Tokens</span>
            {activeOrdersCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-600 text-white font-bold">
                {activeOrdersCount} active
              </span>
            )}
          </button>
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenKDS();
              }}
              className="flex-1 py-2 text-xs font-semibold text-center text-blue-900 bg-blue-50 rounded-lg"
            >
              Kitchen & TV Display
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenUserModal();
              }}
              className="flex-1 py-2 text-xs font-semibold text-center text-slate-700 bg-slate-100 rounded-lg"
            >
              Switch Role
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
