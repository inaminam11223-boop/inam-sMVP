
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BUSINESS_ADMIN = 'BUSINESS_ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER'
}

export enum BusinessType {
  FRUIT_VEG = 'Fruit & Vegetable',
  RETAIL = 'Retail / Kirana',
  GROCERY = 'Grocery / Super Store',
  RESTAURANT = 'Restaurant / Café',
  SALON = 'Salon / Service',
  REAL_ESTATE = 'Real Estate',
  TRANSPORT = 'Transport / Logistics',
  MANUFACTURING = 'Manufacturing',
  WHOLESALE = 'Wholesale',
  ENTERPRISE = 'Enterprise'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
  avatar?: string;
}

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  ownerId: string;
  address: string;
  rating: number;
  isApproved: boolean;
  marketingBudget: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  BARGAINING = 'BARGAINING',
  ACCEPTED = 'ACCEPTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  customerId: string;
  businessId: string;
  items: { productId: string; quantity: number; price: number }[];
  totalPrice: number;
  originalPrice: number;
  status: OrderStatus;
  staffId?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  businessId: string;
  amount: number;
  category: string;
  note: string;
  date: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  businessId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}
