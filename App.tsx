
import React, { useState, useMemo } from 'react';
import { User, UserRole, Business, Product, Order, OrderStatus, Expense } from './types';
import { MOCK_USERS, MOCK_BUSINESSES, MOCK_PRODUCTS } from './constants';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import BusinessAdminDashboard from './pages/BusinessAdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CustomerPortal from './pages/CustomerPortal';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';
import MobileNav from './components/MobileNav';
import MobileSearchModal from './components/MobileSearchModal';
import MobileSidebar from './components/MobileSidebar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const activeBusiness = useMemo(() => {
    if (!currentUser?.businessId) return null;
    return businesses.find(b => b.id === currentUser.businessId) || null;
  }, [currentUser, businesses]);

  // Handlers for interactive buttons
  const toggleBusinessApproval = (bizId: string) => {
    setBusinesses(prev => prev.map(b => b.id === bizId ? { ...b, isApproved: !b.isApproved } : b));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <Sidebar user={currentUser} onLogout={handleLogout} business={activeBusiness} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar 
          user={currentUser} 
          business={activeBusiness} 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentUser.role === UserRole.SUPER_ADMIN && (
              <SuperAdminDashboard 
                businesses={businesses} 
                toggleApproval={toggleBusinessApproval}
                allUsers={MOCK_USERS}
              />
            )}
            
            {currentUser.role === UserRole.BUSINESS_ADMIN && activeBusiness && (
              <BusinessAdminDashboard 
                business={activeBusiness}
                products={products.filter(p => p.businessId === activeBusiness.id)}
                orders={orders.filter(o => o.businessId === activeBusiness.id)}
                expenses={expenses.filter(e => e.businessId === activeBusiness.id)}
                setOrders={setOrders}
                addProduct={handleAddProduct}
                updateProduct={handleUpdateProduct}
                addExpense={handleAddExpense}
              />
            )}
            
            {currentUser.role === UserRole.STAFF && activeBusiness && (
              <StaffDashboard 
                business={activeBusiness}
                orders={orders.filter(o => o.businessId === activeBusiness.id && (o.staffId === currentUser.id || !o.staffId))}
                setOrders={setOrders}
                user={currentUser}
              />
            )}
            
            {currentUser.role === UserRole.CUSTOMER && (
              <CustomerPortal 
                businesses={businesses.filter(b => b.isApproved)}
                products={products}
                orders={orders.filter(o => o.customerId === currentUser.id)}
                setOrders={setOrders}
                user={currentUser}
              />
            )}
          </div>
        </main>
        
        <MobileNav 
          role={currentUser.role} 
          onSearchClick={() => setIsSearchOpen(true)} 
        />
      </div>

      <MobileSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={currentUser}
        business={activeBusiness}
        onLogout={handleLogout}
      />
      <AIChatbot user={currentUser} business={activeBusiness} />
    </div>
  );
};

export default App;
