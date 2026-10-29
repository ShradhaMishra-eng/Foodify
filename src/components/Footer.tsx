import React from 'react';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectNav: (tab: string) => void;
  onOpenKDS: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectNav, onOpenKDS }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: University Branding */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-amber-300 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-white text-base">
                MJPRU Digital Canteen
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Mahatma Jyotiba Phule Rohilkhand University, Bareilly, Uttar Pradesh, India.
            </p>
            <p className="text-emerald-400 font-semibold text-[11px]">
              “Order Smart. Eat Fresh. Skip the Queue.”
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Food Menus
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectNav('breakfast')}
                  className="hover:text-white transition-colors"
                >
                  Breakfast (7:30 – 11:30 AM)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectNav('lunch')}
                  className="hover:text-white transition-colors"
                >
                  Lunch Meals (12:00 – 3:30 PM)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectNav('snacks')}
                  className="hover:text-white transition-colors"
                >
                  Evening Snacks (3:30 – 8:00 PM)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectNav('beverages')}
                  className="hover:text-white transition-colors"
                >
                  Chai & Refreshments
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Canteen Timings & Counters */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Campus Counters
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <strong className="text-slate-200">Counter 1:</strong> North Indian Meals & Thalis
              </li>
              <li>
                <strong className="text-slate-200">Counter 2:</strong> Hot Snacks, Maggi & Chai
              </li>
              <li>
                <strong className="text-slate-200">Counter 3:</strong> South Indian & Fresh Juices
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenKDS}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 mt-1"
                >
                  Dining Hall TV Token Display ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hygiene & University Contacts */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              University Helpdesk
            </h4>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Near Student Activity Centre, MJPRU Campus, Pilibhit Bypass Rd, Bareilly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Mon – Sat: 7:30 AM – 8:30 PM</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>100% FSSAI Certified University Catering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Mahatma Jyotiba Phule Rohilkhand University (MJPRU). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Canteen Hygiene Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
