export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  CHEF = 'chef',
  DELIVERY = 'delivery'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DISPATCHED = 'dispatched',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum OrderType {
  DINE_IN = 'dine-in',
  TAKEAWAY = 'takeaway',
  DELIVERY = 'delivery'
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: string[];
  image?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  deliveryAddress?: string;
  scheduledTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedChef?: string;
  assignedDeliveryStaff?: string;
  customerPhone?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  customizations?: string[];
  prepTime: number;
}

export interface Review {
  id: string;
  customerId: string;
  orderId: string;
  rating: number;
  feedback: string;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_wallet' | 'cash';
  name: string;
  details?: string;
}