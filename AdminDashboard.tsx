import React, { useState } from 'react';
import { Order, MenuItem } from '../../types';
import OrderManagement from '../orders/OrderManagement';
import MenuManagement from '../menu/MenuManagement';
import SalesReports from '../reports/SalesReports';
import { BarChart3, Menu, ShoppingCart, Settings } from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onUpdateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  menuItems,
  onUpdateOrder,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'reports'>('overview');

  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(order => !['delivered', 'cancelled'].includes(order.status));
  const availableMenuItems = menuItems.filter(item => item.available);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'menu' as const, label: 'Menu Management', icon: Menu },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-purple-100 mb-6">Manage your restaurant operations</p>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-100">Today's Orders</h3>
            <p className="text-2xl font-bold">{todayOrders.length}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-100">Today's Revenue</h3>
            <p className="text-2xl font-bold">R{todayRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-100">Active Orders</h3>
            <p className="text-2xl font-bold">{activeOrders.length}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-100">Menu Items</h3>
            <p className="text-2xl font-bold">{availableMenuItems.length}</p>
          </div>
        </div>
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
                  ? 'bg-white text-purple-600 shadow-sm'
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R{order.total.toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Menu Items</h3>
              <div className="space-y-4">
                {menuItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">R{item.price.toFixed(2)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <OrderManagement orders={orders} onUpdateOrder={onUpdateOrder} />
        )}

        {activeTab === 'menu' && (
          <MenuManagement
            menuItems={menuItems}
            onUpdateMenuItem={onUpdateMenuItem}
            onAddMenuItem={onAddMenuItem}
            onDeleteMenuItem={onDeleteMenuItem}
          />
        )}

        {activeTab === 'reports' && (
          <SalesReports orders={orders} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;