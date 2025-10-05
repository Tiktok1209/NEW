import React, { useState } from 'react';
import { MenuItem, OrderType } from '../../types';
import { ShoppingBag, Trash2, MapPin, Clock, CreditCard } from 'lucide-react';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations?: string[];
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateItem: (index: number, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderDetails: {
    type: OrderType;
    deliveryAddress?: string;
    scheduledTime?: Date;
  }) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateItem,
  onClearCart,
  onPlaceOrder
}) => {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.TAKEAWAY);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_wallet'>('card');

  const total = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = orderType === OrderType.DELIVERY ? 25 : 0;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    const orderDetails = {
      type: orderType,
      deliveryAddress: orderType === OrderType.DELIVERY ? deliveryAddress : undefined,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined
    };
    
    onPlaceOrder(orderDetails);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some delicious items from our menu to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <button
              onClick={onClearCart}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.menuItem.name}</h3>
                  <p className="text-gray-600 text-sm">R{item.menuItem.price.toFixed(2)} each</p>
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-orange-600 text-sm mt-1">
                      + {item.customizations.join(', ')}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateItem(index, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateItem(index, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    R{(item.menuItem.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details & Checkout */}
      <div>
        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Order Details</h3>
          
          {/* Order Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Order Type</label>
            <div className="space-y-2">
              {[
                { value: OrderType.DINE_IN, label: 'Dine In', icon: '🍽️' },
                { value: OrderType.TAKEAWAY, label: 'Takeaway', icon: '🥡' },
                { value: OrderType.DELIVERY, label: 'Delivery', icon: '🚚' }
              ].map(({ value, label, icon }) => (
                <label key={value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value={value}
                    checked={orderType === value}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                    className="text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span>{icon}</span>
                  <span className="text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {orderType === OrderType.DELIVERY && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={3}
                placeholder="Enter your delivery address..."
                required
              />
            </div>
          )}

          {/* Scheduled Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Scheduled Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  className="text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="text-gray-700">Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="mobile_wallet"
                  checked={paymentMethod === 'mobile_wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'mobile_wallet')}
                  className="text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="text-gray-700">Mobile Wallet</span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">R{total.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">R{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>R{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={orderType === OrderType.DELIVERY && !deliveryAddress.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Place Order - R{grandTotal.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;