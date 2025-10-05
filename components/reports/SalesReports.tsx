import React, { useState } from 'react';
import { Order } from '../../types';
import { Calendar, DollarSign, TrendingUp, Users, Clock, Package } from 'lucide-react';

interface SalesReportsProps {
  orders: Order[];
}

const SalesReports: React.FC<SalesReportsProps> = ({ orders }) => {
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const filterOrdersByDate = (orders: Order[], filter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today;
        });
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= weekAgo;
        });
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= monthAgo;
        });
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrdersByDate(orders, dateFilter);
  const completedOrders = filteredOrders.filter(order => order.status === 'delivered');
  
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;

  // Order type breakdown
  const orderTypeBreakdown = filteredOrders.reduce((acc, order) => {
    acc[order.type] = (acc[order.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Popular items
  const itemSales = filteredOrders.flatMap(order => order.items)
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const popularItems = Object.entries(itemSales)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Daily sales (for the selected period)
  const dailySales = filteredOrders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toDateString();
    if (!acc[date]) {
      acc[date] = { orders: 0, revenue: 0 };
    }
    acc[date].orders += 1;
    if (order.status === 'delivered') {
      acc[date].revenue += order.total;
    }
    return acc;
  }, {} as Record<string, { orders: number; revenue: number }>);

  const sortedDailySales = Object.entries(dailySales)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-8">
      {/* Header & Date Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">R{totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold">R{avgOrderValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Completed Orders</p>
              <p className="text-2xl font-bold">{completedOrders.length}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Type Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Order Type Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(orderTypeBreakdown).map(([type, count]) => {
              const percentage = totalOrders > 0 ? (count / totalOrders * 100) : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      type === 'delivery' ? 'bg-blue-500' :
                      type === 'takeaway' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />
                    <span className="font-medium capitalize">{type}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">{count}</span>
                    <span className="text-sm text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Popular Items</h3>
          <div className="space-y-4">
            {popularItems.map(([item, count], index) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 text-orange-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">{count}</span>
                  <span className="text-sm text-gray-500 ml-1">sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Sales Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedDailySales.map(([date, data]) => (
                <tr key={date} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {new Date(date).toLocaleDateString('en-ZA', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4 font-medium">{data.orders}</td>
                  <td className="py-3 px-4 font-medium">R{data.revenue.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    R{data.orders > 0 ? (data.revenue / data.orders).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Export Reports</h3>
        <div className="flex space-x-4">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Export as PDF
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;