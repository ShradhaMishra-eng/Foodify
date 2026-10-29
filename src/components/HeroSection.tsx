import React from 'react';
import { ArrowRight, Utensils, Zap, ShieldCheck, Ticket, Smile } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onOrderNow: () => void;
  openKdsScreen: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onOrderNow,
  openKdsScreen,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-14 lg:pb-16">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Campus Trust Label (clean unboxed text, no candy pill) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-3 tracking-wide uppercase">
              <span>Mahatma Jyotiba Phule Rohilkhand University</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-emerald-700">Central Campus Dining</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15] text-balance mb-4">
              Your Campus Canteen,{' '}
              <span className="text-blue-900 block sm:inline">Now Just a Click Away!</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              Discover your favourite meals, order online, pay securely, and collect your food without waiting in long queues during busy lecture breaks.
            </p>

            {/* Two Prominent Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <button
                type="button"
                onClick={onOrderNow}
                className="px-6 py-3.5 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                type="button"
                onClick={onExploreMenu}
                className="px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Utensils className="w-4 h-4 text-blue-900" />
                <span>Explore Menu</span>
              </button>
            </div>

            {/* Trust Quote / Campus Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200/80">
              <div>
                <span className="font-bold text-slate-900 text-sm">~6-8 mins</span>
                <span className="block text-[11px] text-slate-500">Average prep time</span>
              </div>
              <span className="w-px h-6 bg-slate-200" aria-hidden="true" />
              <div>
                <span className="font-bold text-slate-900 text-sm">₹0 Convenience Fee</span>
                <span className="block text-[11px] text-slate-500">University subsidized</span>
              </div>
              <span className="w-px h-6 bg-slate-200" aria-hidden="true" />
              <div>
                <span className="font-bold text-slate-900 text-sm">3 Express Counters</span>
                <span className="block text-[11px] text-slate-500">Fast token pickup</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Fidelity Food Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 aspect-[16/10] lg:aspect-[4/3] group">
              <img
                src={HERO_IMAGE}
                alt="Appetizing spread of Indian canteen breakfast, lunch thali, dosa, samosas and tea at MJPRU"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* In-Image Caption & Counter Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between text-xs mb-1 font-medium">
                  <span className="text-amber-300 font-semibold">Fresh Daily Specials</span>
                  <span className="bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold">
                    Open for Lunch & Snacks
                  </span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-1">
                  Pure Desi Ghee Preparations · North & South Indian Combos · Fresh Beverages
                </p>
              </div>
            </div>

            {/* Floating Live Queue Teaser */}
            <div className="absolute -bottom-4 -left-4 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-md hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                <Ticket className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-slate-900">Instant Order Token</div>
                <div className="text-[11px] text-slate-500">Show token at counter to collect</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Strip (Row below Hero split) */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-900 shrink-0">
                <Zap className="w-4 h-4 text-blue-900" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Quick Online Ordering</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Pre-order before lectures end
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Secure Digital Payments</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  UPI, Paytm, Campus Smart Card
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                <Ticket className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Instant Order Tokens</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Live counter screen alerts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700 shrink-0">
                <Smile className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Less Waiting, More Enjoying</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Zero line rush at peak hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
