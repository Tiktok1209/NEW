import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { Plus, Clock, Star } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, customizations?: string[]) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [showCustomizations, setShowCustomizations] = useState(false);

  const handleCustomizationToggle = (customization: string) => {
    setSelectedCustomizations(prev =>
      prev.includes(customization)
        ? prev.filter(c => c !== customization)
        : [...prev, customization]
    );
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedCustomizations.length > 0 ? selectedCustomizations : undefined);
    setQuantity(1);
    setSelectedCustomizations([]);
    setShowCustomizations(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 rounded-t-xl overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            R{item.price.toFixed(2)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-800">{item.prepTime}min</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-gray-800">4.5</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            {item.category}
          </span>
          {item.available ? (
            <span className="text-green-600 text-sm font-medium">Available</span>
          ) : (
            <span className="text-red-600 text-sm font-medium">Unavailable</span>
          )}
        </div>

        {/* Customizations */}
        {item.customizations && item.customizations.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowCustomizations(!showCustomizations)}
              className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
            >
              {showCustomizations ? 'Hide' : 'Show'} Customizations
            </button>
            
            {showCustomizations && (
              <div className="mt-3 space-y-2">
                {item.customizations.map((customization, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCustomizations.includes(customization)}
                      onChange={() => handleCustomizationToggle(customization)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{customization}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Qty:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!item.available}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;