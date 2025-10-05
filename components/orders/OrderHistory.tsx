import React from 'react';
import { Order } from '../../types';
import { Clock, CheckCircle, Truck, Star, MapPin } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'preparing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'dispatched':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'dispatched':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">No orders yet</h3>
        <p className="text-gray-500">Your order history will appear here once you place your first order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
      
      <div className="space-y-4">
        {sortedOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border p-6">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="font-bold text-gray-800">Order #{order.id.slice(-6)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-800">R{order.total.toFixed(2)}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            {order.type === 'delivery' && order.deliveryAddress && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4" />
                <span>{order.deliveryAddress}</span>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.customizations && item.customizations.length > 0 && (
                      <p className="text-sm text-orange-600">
                        + {item.customizations.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R{item.price.toFixed(2)} × {item.quantity}</p>
                    <p className="text-sm text-gray-600">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Actions */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-4">
                {order.status === 'delivered' && (
                  <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium">
                    <Star className="w-4 h-4" />
                    <span>Rate Order</span>
                  </button>
                )}
                
                {['pending', 'confirmed', 'preparing', 'ready', 'dispatched'].includes(order.status) && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {order.status === 'pending' && 'Order received, awaiting confirmation'}
                      {order.status === 'confirmed' && 'Order confirmed, preparing soon'}
                      {order.status === 'preparing' && 'Your order is being prepared'}
                      {order.status === 'ready' && 'Order ready for pickup/delivery'}
                      {order.status === 'dispatched' && 'Order is on the way'}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;