
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, Business, Product, Order, OrderStatus, Expense } from './types';
import { MOCK_USERS, MOCK_BUSINESSES, MOCK_PRODUCTS } from './constants';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import BusinessAdminDashboard from './pages/BusinessAdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CustomerPortal from './pages/CustomerPortal';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('khan_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('khan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('khan_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const activeBusiness = useMemo(() => {
    if (!currentUser?.businessId) return null;
    return businesses.find(b => b.id === currentUser.businessId) || null;
  }, [currentUser, businesses]);

  const toggleBusinessApproval = (bizId: string) => {
    setBusinesses(prev => prev.map(b => b.id === bizId ? { ...b, isApproved: !b.isApproved } : b));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleRateProduct = (productId: string, rating: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const currentRatings = p.ratings || [];
        return { ...p, ratings: [...currentRatings, rating] };
      }
      return p;
    }));
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
      <Sidebar user={currentUser} onLogout={handleLogout} business={activeBusiness} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar 
          user={currentUser} 
          business={activeBusiness} 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleDarkMode}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-8 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentUser.role === UserRole.SUPER_ADMIN && (
              <SuperAdminDashboard 
                businesses={businesses} 
                toggleApproval={toggleBusinessApproval}
                allUsers={MOCK_USERS}
              />
            )}
            
            {(currentUser.role === UserRole.BUSINESS_ADMIN || currentUser.role === UserRole.MANAGER) && activeBusiness && (
              <BusinessAdminDashboard 
                business={activeBusiness}
                products={products.filter(p => p.businessId === activeBusiness.id)}
                orders={orders.filter(o => o.businessId === activeBusiness.id)}
                expenses={expenses.filter(e => e.businessId === activeBusiness.id)}
                setOrders={setOrders}
                addProduct={handleAddProduct}
                updateProduct={handleUpdateProduct}
                addExpense={handleAddExpense}
                userRole={currentUser.role}
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
                onRateProduct={handleRateProduct}
              />
            )}
          </div>
        </main>
      </div>

      <MobileSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={currentUser}
        business={activeBusiness}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
