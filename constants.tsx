
import { UserRole, BusinessType, User, Business, Product } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'INAM KHAN', email: 'inam@platform.com', role: UserRole.SUPER_ADMIN },
  { id: 'u2', name: 'Khan Enterprise Owner', email: 'owner@shop.com', role: UserRole.BUSINESS_ADMIN, businessId: 'b1' },
  { id: 'u3', name: 'DANYIAL HOTI', email: 'danyial@shop.com', role: UserRole.STAFF, businessId: 'b1' },
  { id: 'u4', name: 'ABDULLAH', email: 'abdullah@gmail.com', role: UserRole.CUSTOMER }
];

export const MOCK_BUSINESSES: Business[] = [
  { id: 'b1', name: 'KHAN BUSSINESS Peshawar', type: BusinessType.GROCERY, ownerId: 'u2', address: 'University Road, Peshawar', rating: 4.8, isApproved: true, marketingBudget: 5000 },
  { id: 'b2', name: 'Khyber Tikka House', type: BusinessType.RESTAURANT, ownerId: 'u5', address: 'Namak Mandi', rating: 4.5, isApproved: true, marketingBudget: 3000 },
  { id: 'b3', name: 'Lahore Logistics', type: BusinessType.TRANSPORT, ownerId: 'u6', address: 'GT Road, Lahore', rating: 4.2, isApproved: true, marketingBudget: 10000 }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', businessId: 'b1', name: 'Basmati Rice 5kg', category: 'Grain', price: 1200, stock: 50, image: 'https://picsum.photos/seed/rice/400/300', description: 'Premium quality long grain rice' },
  { id: 'p2', businessId: 'b1', name: 'Sunflower Oil 1L', category: 'Oil', price: 650, stock: 15, image: 'https://picsum.photos/seed/oil/400/300', description: 'Healthy cooking oil' },
  { id: 'p3', businessId: 'b1', name: 'Red Apples', category: 'Fruit', price: 200, stock: 100, image: 'https://picsum.photos/seed/apple/400/300', description: 'Fresh seasonal apples from Swat' },
  { id: 'p4', businessId: 'b1', name: 'Khyber Tea Leaves', category: 'Beverage', price: 450, stock: 30, image: 'https://picsum.photos/seed/tea/400/300', description: 'Strong black tea' }
];
