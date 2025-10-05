import React, { useState, useEffect } from 'react';
import { UserRole, User, Order, MenuItem } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ChefDashboard from './components/dashboard/ChefDashboard';
import DeliveryDashboard from './components/dashboard/DeliveryDashboard';
import Navigation from './components/layout/Navigation';
import { mockMenuItems, mockOrders } from './data/mockData';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };

  const addOrder = (newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [...prev, newItem]);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.CUSTOMER:
        return (
          <CustomerDashboard
            user={user}
            menuItems={menuItems}
            orders={orders.filter(order => order.customerId === user.id)}
            onPlaceOrder={addOrder}
          />
        );
      case UserRole.ADMIN:
        return (
          <AdminDashboard
            orders={orders}
            menuItems={menuItems}
            onUpdateOrder={updateOrder}
            onUpdateMenuItem={updateMenuItem}
            onAddMenuItem={addMenuItem}
            onDeleteMenuItem={deleteMenuItem}
          />
        );
      case UserRole.CHEF:
        return (
          <ChefDashboard
            orders={orders.filter(order => 
              ['pending', 'confirmed', 'preparing'].includes(order.status)
            )}
            onUpdateOrder={updateOrder}
          />
        );
      case UserRole.DELIVERY:
        return (
          <DeliveryDashboard
            orders={orders.filter(order => 
              order.type === 'delivery' && ['ready', 'dispatched'].includes(order.status)
            )}
            onUpdateOrder={updateOrder}
            deliveryStaff={user}
          />
        );
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      <main className="pt-16">
        {renderDashboard()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;