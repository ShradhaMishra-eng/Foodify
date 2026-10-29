import React from 'react';

interface VegNonVegIndicatorProps {
  isVeg: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VegNonVegIndicator: React.FC<VegNonVegIndicatorProps> = ({
  isVeg,
  size = 'md',
  showLabel = false,
}) => {
  const dimensionClasses = {
    sm: 'w-3.5 h-3.5 p-0.5',
    md: 'w-4 h-4 p-0.5',
    lg: 'w-5 h-5 p-1',
  }[size];

  const dotClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5 shrink-0" title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
      <span
        aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        className={`inline-flex items-center justify-center border rounded-xs ${
          isVeg
            ? 'border-emerald-600 bg-white text-emerald-600'
            : 'border-amber-800 bg-white text-amber-800'
        } ${dimensionClasses}`}
      >
        {isVeg ? (
          <span className={`rounded-full bg-emerald-600 ${dotClasses}`} />
        ) : (
          <span
            className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-amber-800"
          />
        )}
      </span>
      {showLabel && (
        <span
          className={`text-xs font-medium tracking-tight ${
            isVeg ? 'text-emerald-700' : 'text-amber-800'
          }`}
        >
          {isVeg ? 'Pure Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
};
