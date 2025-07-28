// components/MenuItem.tsx
import React from 'react';

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description }) => {
  return (
    <div className="flex flex-col p-4 bg-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-baseline mb-1">
        {/* Item name uses dark dark pink */}
        <h3 className="text-lg font-semibold text-textLight leading-tight">{name}</h3>
        {/* Price also uses dark dark pink */}
        <span className="text-lg font-bold text-textLight ml-4 shrink-0">{price}</span>
      </div>
      {description && (
        // Description text is slightly off-white
        <p className="text-sm text-textMuted mt-1 leading-snug">{description}</p>
      )}
    </div>
  );
};

export default MenuItem;