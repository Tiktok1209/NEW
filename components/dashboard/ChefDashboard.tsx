import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

interface ChefDashboardProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
}

const ChefDashboard: React.FC<ChefDashboardProps> = ({ orders, onUpdateOrder }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing'>('all');

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const startPreparing = (orderId: string) => {
    onUpdateOrder(orderId, {
      status: OrderStatus.PREPARING,
      updatedAt: new Date()
    });
  };

  const markReady = (orderId: string) => {
    onUpdateOrder(orderId, {
      status: OrderStatus.READY,
      updatedAt: new Date()
    });
  };

  const getOrderPriority = (order: Order) => {
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const minutesAgo = (now.getTime() - orderTime.getTime()) / (1000 * 60);
    
    if (minutesAgo > 30) return 'high';
    if (minutesAgo > 15) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-2">Chef Dashboard</h2>
        <p className="text-green-100 mb-6">Manage kitchen operations and orders</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-medium">Pending Orders</h3>
            </div>
            <p className="text-2xl font-bold mt-1">{pendingOrders.length}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <h3 className="text-sm font-medium">In Preparation</h3>
            </div>
            <p className="text-2xl font-bold mt-1">{preparingOrders.length}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <h3 className="text-sm font-medium">Total Active</h3>
            </div>
            <p className="text-2xl font-bold mt-1">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {[
          { id: 'all' as const, label: 'All Orders', count: orders.length },
          { id: 'pending' as const, label: 'Pending', count: pendingOrders.length },
          { id: 'preparing' as const, label: 'Preparing', count: preparingOrders.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map(order => {
          const priority = getOrderPriority(order);
          const orderAge = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60));
          
          return (
            <div 
              key={order.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(priority)} p-6`}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Order #{order.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.customerName} • {order.type}
                  </p>
                  {order.paymentStatus && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Payment Received' :
                       order.paymentStatus === 'failed' ? 'Payment Failed' :
                       'Payment Pending'}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">R{order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{orderAge} mins ago</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {item.customizations.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {order.status === 'pending' && (
                  <button
                    onClick={() => startPreparing(order.id)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-5 h-5" />
                    <span>Start Preparing</span>
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <button
                    onClick={() => markReady(order.id)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Mark Ready</span>
                  </button>
                )}

                {order.status === 'ready' && (
                  <div className="flex-1 bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium text-center">
                    Ready for Pickup/Delivery
                  </div>
                )}
              </div>

              {/* Priority Indicator */}
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  priority === 'high' ? 'bg-red-100 text-red-800' :
                  priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </span>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'pending' ? 'bg-red-100 text-red-800' :
                  order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No orders to show</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No active orders at the moment'
              : `No ${filter} orders at the moment`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;