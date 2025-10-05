import React, { useState } from 'react';
import { Order, OrderStatus, User } from '../../types';
import { MapPin, Navigation, CheckCircle, Clock, Phone } from 'lucide-react';

interface DeliveryDashboardProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  deliveryStaff: User;
}

const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({
  orders,
  onUpdateOrder,
  deliveryStaff
}) => {
  const [filter, setFilter] = useState<'available' | 'assigned' | 'delivering'>('available');

  const availableOrders = orders.filter(order => 
    order.status === 'ready' && !order.assignedDeliveryStaff
  );
  
  const assignedOrders = orders.filter(order => 
    order.assignedDeliveryStaff === deliveryStaff.id && order.status === 'ready'
  );
  
  const deliveringOrders = orders.filter(order => 
    order.assignedDeliveryStaff === deliveryStaff.id && order.status === 'dispatched'
  );

  const filteredOrders = 
    filter === 'available' ? availableOrders :
    filter === 'assigned' ? assignedOrders :
    deliveringOrders;

  const acceptOrder = (orderId: string) => {
    onUpdateOrder(orderId, {
      assignedDeliveryStaff: deliveryStaff.id,
      updatedAt: new Date()
    });
  };

  const startDelivery = (orderId: string) => {
    onUpdateOrder(orderId, {
      status: OrderStatus.DISPATCHED,
      updatedAt: new Date()
    });
  };

  const completeDelivery = (orderId: string) => {
    onUpdateOrder(orderId, {
      status: OrderStatus.DELIVERED,
      updatedAt: new Date()
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-2">Delivery Dashboard</h2>
        <p className="text-blue-100 mb-6">Manage your delivery assignments</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <h3 className="text-sm font-medium">Available</h3>
            </div>
            <p className="text-2xl font-bold mt-1">{availableOrders.length}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <h3 className="text-sm font-medium">Assigned</h3>
            </div>
            <p className="text-2xl font-bold mt-1">{assignedOrders.length}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5" />
              <h3 className="text-sm font-medium">Delivering</h3>
            </div>
            <p className="text-2xl font-bold mt-1">{deliveringOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {[
          { id: 'available' as const, label: 'Available Orders', count: availableOrders.length },
          { id: 'assigned' as const, label: 'My Orders', count: assignedOrders.length },
          { id: 'delivering' as const, label: 'Delivering', count: deliveringOrders.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
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
          const orderAge = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60));
          
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Order #{order.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">R{order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{orderAge} mins ago</p>
                </div>
              </div>

              {/* Customer Contact */}
              {order.customerPhone && (
                <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{order.customerPhone}</span>
                </div>
              )}

              {/* Delivery Address */}
              <div className="flex items-start space-x-3 mb-6 p-4 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Delivery Address</p>
                  <p className="text-gray-600">{order.deliveryAddress || 'Address not provided'}</p>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}:
                </p>
                <div className="space-y-1">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {filter === 'available' && (
                  <button
                    onClick={() => acceptOrder(order.id)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Accept Order</span>
                  </button>
                )}
                
                {filter === 'assigned' && (
                  <button
                    onClick={() => startDelivery(order.id)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>Start Delivery</span>
                  </button>
                )}
                
                {filter === 'delivering' && (
                  <button
                    onClick={() => completeDelivery(order.id)}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Delivery</span>
                  </button>
                )}

                {/* Navigation Button */}
                {(filter === 'assigned' || filter === 'delivering') && order.deliveryAddress && (
                  <button
                    onClick={() => {
                      const encodedAddress = encodeURIComponent(order.deliveryAddress || '');
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
                    }}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Navigate</span>
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="mt-4 text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'ready' ? 'bg-orange-100 text-orange-800' :
                  order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
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
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No orders to show</h3>
          <p className="text-gray-500">
            {filter === 'available' 
              ? 'No available delivery orders at the moment'
              : filter === 'assigned'
              ? 'No assigned orders. Accept some orders to get started!'
              : 'No active deliveries'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;