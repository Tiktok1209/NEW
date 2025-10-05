import { User, UserRole, Order, MenuItem, OrderStatus, OrderType } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'customer-1',
    name: 'mbuso',
    email: 'coulombs@ubuntu.co.za',
    role: UserRole.CUSTOMER,
    phone: '0680998913',
    address: '123 Main Street, Durban, 4001',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'admin-1',
    name: 'khumbuzile Manager',
    email: 'admin@ubuntu.co.za',
    role: UserRole.ADMIN,
    phone: '0680998912',
    createdAt: new Date('2025-09-26')
  },
  {
    id: 'chef-1',
    name: 'amuh Chef',
    email: 'amuh@ubuntu.co.za',
    role: UserRole.CHEF,
    phone: '0680998914',
    createdAt: new Date('2025-09-26')
  },
  {
    id: 'delivery-1',
    name: ' mkhaya Driver',
    email: 'mkhaya@ubuntu.co.za',
    role: UserRole.DELIVERY,
    phone: '0680998915',
    createdAt: new Date('2025-09-26')
  }
];

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Traditional Braai Platter',
    description: 'Flame-grilled mixed meat platter with boerewors, lamb chops, and chicken served with traditional sides',
    price: 195.00,
    category: 'Traditional',
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizations: ['Extra Sauce', 'Spicy', 'Medium Rare', 'Well Done'],
    prepTime: 25
  },
  {
    id: 'item-2',
    name: 'Ubuntu Flame Burger',
    description: 'Premium beef patty flame-grilled to perfection with cheese, lettuce, tomato, and our signature sauce',
    price: 89.50,
    category: 'Burgers',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizations: ['Extra Cheese', 'No Pickles', 'Extra Sauce', 'Bacon'],
    prepTime: 15
  },
  {
    id: 'item-3',
    name: 'Grilled Chicken & Rice',
    description: 'Tender flame-grilled chicken breast served with aromatic basmati rice and seasonal vegetables',
    price: 125.00,
    category: 'Grilled',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizations: ['Spicy Marinade', 'Lemon Herb', 'Extra Vegetables'],
    prepTime: 20
  },
  {
    id: 'item-4',
    name: 'Flame-Grilled Fish & Chips',
    description: 'Fresh fish grilled over open flame served with crispy chips and tartar sauce',
    price: 145.00,
    category: 'Seafood',
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizations: ['Extra Tartar Sauce', 'Lemon Butter', 'Grilled Vegetables'],
    prepTime: 18
  },
  {
    id: 'item-5',
    name: 'Vegetarian Sosatie',
    description: 'Traditional vegetarian kebabs with marinated vegetables and halloumi cheese',
    price: 95.00,
    category: 'Vegetarian',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizations: ['Extra Halloumi', 'Spicy Marinade', 'Extra Vegetables'],
    prepTime: 15
  },
  {
    id: 'item-6',
    name: 'Traditional Pap & Vleis',
    description: 'Classic South African dish with creamy pap, flame-grilled meat, and morogo',
    price: 115.00,
    category: 'Traditional',
    image: 'https://images.pexels.com/photos/15832879/pexels-photo-15832879.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    customizations: ['Extra Gravy', 'Spicy Meat', 'Extra Morogo'],
    prepTime: 22
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    customerId: 'customer-1',
    customerName: 'coulombs',
    items: [
      {
        menuItemId: 'item-1',
        name: 'Traditional Braai Platter',
        price: 195.00,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        menuItemId: 'item-2',
        name: 'Ubuntu Flame Burger',
        price: 89.50,
        quantity: 2,
        customizations: ['Extra Cheese', 'Bacon'],
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 374.00,
    status: OrderStatus.PREPARING,
    type: OrderType.DELIVERY,
    deliveryAddress: '123 Main Street, Durban, 4001',
    createdAt: new Date('2025-01-15T10:30:00'),
    updatedAt: new Date('2025-01-15T10:35:00'),
    customerPhone: '0680998913',
    assignedChef: 'chef-1'
  },
  {
    id: 'order-002',
    customerId: 'customer-1',
    customerName: 'coulombs',
    items: [
      {
        menuItemId: 'item-3',
        name: 'Grilled Chicken & Rice',
        price: 125.00,
        quantity: 1,
        customizations: ['Lemon Herb'],
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 125.00,
    status: OrderStatus.READY,
    type: OrderType.TAKEAWAY,
    createdAt: new Date('2025-01-15T09:15:00'),
    updatedAt: new Date('2025-01-15T09:35:00'),
    customerPhone: '+27123456789'
  },
  {
    id: 'order-003',
    customerId: 'customer-1',
    customerName: 'mpume ',
    items: [
      {
        menuItemId: 'item-4',
        name: 'Flame-Grilled Fish & Chips',
        price: 145.00,
        quantity: 2,
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 315.00, // Including delivery fee
    status: OrderStatus.DISPATCHED,
    type: OrderType.DELIVERY,
    deliveryAddress: '456 Beach Road, Durban North, 4051',
    createdAt: new Date('2025-01-15T11:00:00'),
    updatedAt: new Date('2025-01-15T11:30:00'),
    customerPhone: '+27987654321',
    assignedDeliveryStaff: 'delivery-1'
  },
  {
    id: 'order-004',
    customerId: 'customer-1',
    customerName: 'amuh',
    items: [
      {
        menuItemId: 'item-5',
        name: 'Vegetarian Sosatie',
        price: 95.00,
        quantity: 1,
        customizations: ['Extra Halloumi'],
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        menuItemId: 'item-6',
        name: 'Traditional Pap & Vleis',
        price: 115.00,
        quantity: 1,
        image: 'https://images.pexels.com/photos/15832879/pexels-photo-15832879.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 210.00,
    status: OrderStatus.PENDING,
    type: OrderType.DINE_IN,
    createdAt: new Date('2025-01-15T12:15:00'),
    updatedAt: new Date('2025-01-15T12:15:00'),
    customerPhone: '+27555666777'
  },
  {
    id: 'order-005',
    customerId: 'customer-1',
    customerName: 'coulombs',
    items: [
      {
        menuItemId: 'item-1',
        name: 'Traditional Braai Platter',
        price: 195.00,
        quantity: 1,
        customizations: ['Medium Rare', 'Extra Sauce'],
        image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 195.00,
    status: OrderStatus.DELIVERED,
    type: OrderType.TAKEAWAY,
    createdAt: new Date('2025-01-14T18:30:00'),
    updatedAt: new Date('2025-01-14T19:00:00'),
    customerPhone: '+27888999000'
  }
];