import React, { useState } from 'react';
import { User, MenuItem, Order, OrderStatus, OrderType } from '../../types';
import MenuGrid from '../menu/MenuGrid';
import OrderHistory from '../orders/OrderHistory';
import ShoppingCart from '../cart/ShoppingCart';
import { ShoppingBag, Clock, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CustomerDashboardProps {
  user: User;
  menuItems: MenuItem[];
  orders: Order[];
  onPlaceOrder: (order: Order) => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  menuItems,
  orders,
  onPlaceOrder
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'cart'>('menu');
  const [cartItems, setCartItems] = useState<Array<{
    menuItem: MenuItem;
    quantity: number;
    customizations?: string[];
  }>>([]);

  const addToCart = (menuItem: MenuItem, quantity: number, customizations?: string[]) => {
    const existingItem = cartItems.find(item => 
      item.menuItem.id === menuItem.id &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingItem) {
      setCartItems(prev => prev.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems(prev => [...prev, { menuItem, quantity, customizations }]);
    }
  };

  const updateCartItem = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setCartItems(prev => prev.map((item, i) =>
        i === index ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handlePlaceOrder = async (orderDetails: {
    type: OrderType;
    deliveryAddress?: string;
    scheduledTime?: Date;
    paymentDetails: {
      paymentMethod: 'card' | 'mobile_wallet';
      cardNumber?: string;
      cardHolderName?: string;
    };
  }) => {
    const orderItems = cartItems.map(item => ({
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
      customizations: item.customizations,
      image: item.menuItem.image
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderDetails.type === OrderType.DELIVERY ? 25 : 0;
    const total = subtotal + deliveryFee;

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          customer_name: user.name,
          customer_phone: user.phone,
          items: orderItems,
          total,
          status: OrderStatus.PENDING,
          type: orderDetails.type,
          delivery_address: orderDetails.deliveryAddress,
          scheduled_time: orderDetails.scheduledTime?.toISOString(),
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderData.id,
          customer_id: user.id,
          amount: total,
          payment_method: orderDetails.paymentDetails.paymentMethod,
          card_number: orderDetails.paymentDetails.cardNumber,
          card_holder_name: orderDetails.paymentDetails.cardHolderName,
          status: 'completed',
          transaction_id: `TXN-${Date.now()}`,
        });

      if (paymentError) throw paymentError;

      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', orderData.id);

      const newOrder: Order = {
        id: orderData.id,
        customerId: user.id,
        customerName: user.name,
        items: orderItems,
        total,
        status: OrderStatus.PENDING,
        type: orderDetails.type,
        deliveryAddress: orderDetails.deliveryAddress,
        scheduledTime: orderDetails.scheduledTime,
        createdAt: new Date(orderData.created_at),
        updatedAt: new Date(orderData.updated_at),
        customerPhone: user.phone,
      };

      onPlaceOrder(newOrder);
      clearCart();
      setActiveTab('orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );

  const tabs = [
    { id: 'menu' as const, label: 'Menu', icon: ShoppingBag },
    { id: 'orders' as const, label: 'My Orders', icon: Clock },
    { id: 'cart' as const, label: `Cart (${cartItems.length})`, icon: Star }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
        <p className="text-orange-100 mb-4">
          Discover our delicious traditional and flame-grilled meals
        </p>
        {activeOrders.length > 0 && (
          <div className="bg-white/20 rounded-lg p-4">
            <p className="font-medium mb-2">Active Orders: {activeOrders.length}</p>
            <div className="flex space-x-4">
              {activeOrders.map(order => (
                <span key={order.id} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  #{order.id.slice(-6)} - {order.status}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'menu' && (
          <MenuGrid
            menuItems={menuItems.filter(item => item.available)}
            onAddToCart={addToCart}
          />
        )}
        
        {activeTab === 'orders' && (
          <OrderHistory orders={orders} />
        )}
        
        {activeTab === 'cart' && (
          <ShoppingCart
            items={cartItems}
            onUpdateItem={updateCartItem}
            onClearCart={clearCart}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;