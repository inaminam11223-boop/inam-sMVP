
import React, { useState, useMemo } from 'react';
import { User, Business, Product, Order, OrderStatus } from '../types';
import { 
  ShoppingCart, 
  Search, 
  Gavel, 
  Package, 
  Star,
  Clock,
  CheckCircle,
  Plus,
  Minus,
  Truck,
  Zap,
  ShieldCheck,
  Timer,
  X as CloseIcon,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Props {
  user: User;
  businesses: Business[];
  products: Product[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onRateProduct?: (productId: string, rating: number) => void;
}

const CustomerPortal: React.FC<Props> = ({ user, businesses, products, orders, setOrders, onRateProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBargainModalOpen, setIsBargainModalOpen] = useState(false);
  const [bargainValue, setBargainValue] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Rating Modal state
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.qty > 1) {
        return prev.map(item => item.product.id === productId ? { ...item, qty: item.qty - 1 } : item);
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const getCartItem = (productId: string) => {
    return cart.find(item => item.product.id === productId);
  };

  const placeOrder = (bargainPrice?: number) => {
    if (cart.length === 0) return;
    
    const originalTotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.qty), 0);
    const finalTotal = bargainPrice || originalTotal;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerId: user.id,
      businessId: cart[0].product.businessId,
      items: cart.map(item => ({ productId: item.product.id, quantity: item.qty, price: item.product.price })),
      totalPrice: finalTotal,
      originalPrice: originalTotal,
      status: bargainPrice ? OrderStatus.BARGAINING : OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsBargainModalOpen(false);
  };

  const currentTotal = cart.reduce((acc, c) => acc + (c.product.price * c.qty), 0);

  const filteredProducts = products.filter(p => {
    const biz = businesses.find(b => b.id === p.businessId);
    if (!biz) return false;
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const activeOrder = useMemo(() => {
    return orders.find(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED);
  }, [orders]);

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
      case OrderStatus.BARGAINING:
        return 1;
      case OrderStatus.ACCEPTED:
        return 2;
      case OrderStatus.ASSIGNED:
      case OrderStatus.IN_PROGRESS:
        return 3;
      case OrderStatus.COMPLETED:
        return 4;
      default:
        return 0;
    }
  };

  const statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Order Placed',
    [OrderStatus.BARGAINING]: 'In Negotiation',
    [OrderStatus.ACCEPTED]: 'Confirmed & Processing',
    [OrderStatus.ASSIGNED]: 'Staff Assigned',
    [OrderStatus.IN_PROGRESS]: 'Being Prepared',
    [OrderStatus.COMPLETED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled'
  };

  const estimatedArrival = useMemo(() => {
    if (!activeOrder) return null;
    if (activeOrder.status === OrderStatus.ACCEPTED) {
      return "Est. Delivery: 45 - 60 mins";
    }
    if (activeOrder.status === OrderStatus.ASSIGNED || activeOrder.status === OrderStatus.IN_PROGRESS) {
      return "Arriving in: 15 - 20 mins";
    }
    return null;
  }, [activeOrder]);

  const getAverageRating = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (!p || !p.ratings || p.ratings.length === 0) return { avg: 0, count: 0 };
    const sum = p.ratings.reduce((a, b) => a + b, 0);
    return { avg: (sum / p.ratings.length).toFixed(1), count: p.ratings.length };
  };

  const handleRateSubmit = () => {
    if (!onRateProduct) return;
    Object.entries(itemRatings).forEach(([prodId, val]) => {
      onRateProduct(prodId, val);
    });
    setRatingOrder(null);
    setItemRatings({});
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-8 pb-32 animate-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000" alt="Market" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white bg-gradient-to-t from-slate-900/80 to-transparent">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Salam, {user.name}!</h1>
          <p className="text-slate-300 mt-4 text-base md:text-xl max-w-xl font-medium">Verified goods from Peshawar to Karachi. Quality guaranteed by MY BUSSINESS network.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 sticky top-4 z-20">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 rounded-[2rem] shadow-2xl shadow-slate-200/50 outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Live Tracker */}
      {activeOrder && (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <Truck size={28} className="animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight">Live Order Tracking</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">ORDER ID: <span className="text-white">#{activeOrder.id.slice(-6)}</span></p>
                    {estimatedArrival && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                        <Clock size={12} /> {estimatedArrival}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/5 text-center min-w-[160px]">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Current Status</p>
                <p className="text-blue-400 font-black uppercase italic tracking-tighter leading-none">{statusLabels[activeOrder.status]}</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4">
              <div className="absolute left-10 right-10 h-1 bg-slate-800 top-1/2 -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000" 
                  style={{ width: `${((getStatusStep(activeOrder.status) - 1) / 3) * 100}%` }}
                ></div>
              </div>

              {[
                { label: 'Placed', icon: <Package size={16} /> },
                { label: 'Confirmed', icon: <ShieldCheck size={16} /> },
                { label: 'Processing', icon: <Zap size={16} /> },
                { label: 'Delivered', icon: <CheckCircle size={16} /> }
              ].map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = getStatusStep(activeOrder.status) > stepNum;
                const isActive = getStatusStep(activeOrder.status) === stepNum;
                
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                      isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                      isActive ? 'bg-slate-900 border-blue-600 text-blue-600 scale-125 shadow-lg shadow-blue-600/20 animate-pulse' :
                      'bg-slate-900 border-slate-800 text-slate-600'
                    }`}>
                      {step.icon}
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const biz = businesses.find(b => b.id === product.businessId);
          const cartItem = getCartItem(product.id);
          const { avg, count } = getAverageRating(product.id);
          
          return (
            <div key={product.id} className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 group hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black italic shadow-lg">
                  Rs. {product.price}
                </div>
                {count > 0 && (
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-amber-500 px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg border border-slate-100 dark:border-slate-700">
                    <Star size={12} fill="currentColor" /> {avg} ({count})
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest truncate max-w-[100px]">{biz?.name}</p>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">★ {biz?.rating}</span>
                </div>
                <h4 className="font-black text-slate-900 dark:text-white text-lg leading-tight uppercase italic tracking-tight truncate">{product.name}</h4>
                
                <div className="mt-6">
                  {cartItem ? (
                    <div className="flex items-center justify-between bg-blue-600 rounded-2xl p-1 shadow-lg shadow-blue-600/20 animate-in zoom-in duration-200">
                      <button 
                        onClick={() => removeFromCart(product.id)}
                        className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-black text-white text-sm">{cartItem.qty}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Plus size={14} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order History */}
      <div className="space-y-6 pt-12">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
          <Clock size={28} className="text-blue-600" /> Order History
        </h2>
        
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
            <Package size={60} className="mx-auto mb-4 opacity-10" />
            <p className="font-bold text-lg">No active orders found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              
              return (
                <div 
                  key={order.id} 
                  className={`bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-blue-300 transition-all flex flex-col cursor-pointer overflow-hidden ${isExpanded ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950' : ''}`}
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                >
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-xl shrink-0 ${order.status === OrderStatus.COMPLETED ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600'}`}>
                         {order.status === OrderStatus.COMPLETED ? <CheckCircle size={28} /> : <Package size={28} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 dark:text-white text-sm italic uppercase tracking-tighter flex items-center gap-2">
                          #{order.id.slice(-6)}
                          {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </p>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${order.status === OrderStatus.COMPLETED ? 'text-blue-600' : 'text-slate-400'}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 dark:text-white text-sm">Rs. {order.totalPrice.toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-50 dark:border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Order Items</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-bold">
                            <div className="flex gap-2">
                              <span className="text-blue-600 dark:text-blue-400 font-black">{item.quantity}x</span>
                              <span className="text-slate-700 dark:text-slate-200 uppercase truncate max-w-[120px]">{getProductName(item.productId)}</span>
                            </div>
                            <span className="text-slate-400 dark:text-slate-500 tracking-tight">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="pt-3 flex flex-col gap-1 border-t border-slate-50 dark:border-slate-700/50">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                            <span>Subtotal</span>
                            <span>Rs. {order.originalPrice.toLocaleString()}</span>
                          </div>
                          {order.originalPrice > order.totalPrice && (
                            <div className="flex justify-between text-[10px] font-black uppercase text-red-500">
                              <span>Bargain Discount</span>
                              <span>- Rs. {(order.originalPrice - order.totalPrice).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs font-black uppercase text-slate-900 dark:text-white mt-1">
                            <span>Final Total</span>
                            <span className="text-blue-600 dark:text-blue-400">Rs. {order.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {order.status === OrderStatus.COMPLETED && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setRatingOrder(order);
                        }}
                        className="w-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all border border-amber-100 dark:border-amber-900/50"
                      >
                        <Star size={14} /> Rate Products
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="font-black text-2xl tracking-tighter uppercase italic leading-none">Checkout</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{cart.reduce((a, b) => a + b.qty, 0)} Items Selected</p>
              </div>
              <div className="text-right">
                <p className="text-blue-400 text-2xl font-black">Rs. {currentTotal.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => placeOrder()} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-600/20">
                Confirm Order
              </button>
              <button onClick={() => { setBargainValue(Math.round(currentTotal * 0.9).toString()); setIsBargainModalOpen(true); }} className="flex-1 bg-white/10 text-white border border-white/20 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 active:scale-95 transition-all">
                <Gavel size={18} className="text-amber-400" /> Open Bargain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
