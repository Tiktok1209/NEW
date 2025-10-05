import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { Eye, RefreshCw, Phone, MapPin, Clock } from 'lucide-react';

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, onUpdateOrder }) => {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    onUpdateOrder(orderId, { status, updatedAt: new Date() });
    setSelectedOrder(null);
  };

  const getStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    const statusFlow: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.DISPATCHED, OrderStatus.DELIVERED],
      [OrderStatus.DISPATCHED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: []
    };
    return statusFlow[currentStatus] || [];
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        {[
          { id: 'all' as const, label: 'All Orders' },
          { id: OrderStatus.PENDING, label: 'Pending' },
          { id: OrderStatus.CONFIRMED, label: 'Confirmed' },
          { id: OrderStatus.PREPARING, label: 'Preparing' },
          { id: OrderStatus.READY, label: 'Ready' },
          { id: OrderStatus.DISPATCHED, label: 'Dispatched' },
          { id: OrderStatus.DELIVERED, label: 'Delivered' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              filter === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-sm">
              ({tab.id === 'all' 
                ? orders.length 
                : orders.filter(o => o.status === tab.id).length
              })
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Order ID</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Items</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Total</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Time</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm">#{order.id.slice(-6)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-800">{order.customerName}</p>
                      {order.customerPhone && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {order.customerPhone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.type === 'delivery' ? 'bg-blue-100 text-blue-800' :
                      order.type === 'takeaway' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {order.type}
                    </span>
                    {order.type === 'delivery' && order.deliveryAddress && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {order.deliveryAddress.substring(0, 30)}...
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm">{order.items.length} items</p>
                    <p className="text-xs text-gray-500">
                      {order.items.slice(0, 2).map(item => item.name).join(', ')}
                      {order.items.length > 2 && '...'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium">R{order.total.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'preparing' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      order.status === 'dispatched' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="flex items-center text-gray-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60))}m ago
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 text-gray-600 hover:text-purple-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {getStatusOptions(order.status).length > 0 && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-gray-600 hover:text-purple-600 transition-colors"
                          title="Update Status"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No orders have been placed yet'
                : `No ${filter} orders at the moment`
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Order #{selectedOrder.id.slice(-6)}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Order Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Customer</p>
                    <p className="text-gray-800">{selectedOrder.customerName}</p>
                    {selectedOrder.customerPhone && (
                      <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Order Type</p>
                    <p className="text-gray-800 capitalize">{selectedOrder.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedOrder.deliveryAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                    <p className="text-gray-800">{selectedOrder.deliveryAddress}</p>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          {item.customizations && item.customizations.length > 0 && (
                            <p className="text-sm text-orange-600">
                              + {item.customizations.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p>R{item.price.toFixed(2)} × {item.quantity}</p>
                          <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                {getStatusOptions(selectedOrder.status).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
                    <div className="flex space-x-2">
                      {getStatusOptions(selectedOrder.status).map(status => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(selectedOrder.id, status)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;