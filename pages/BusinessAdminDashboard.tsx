
import React, { useState, useMemo } from 'react';
import { Business, Product, Order, OrderStatus, Expense, UserRole } from '../types';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  Star, 
  ArrowUpRight, 
  Sparkles, 
  Megaphone,
  Share2,
  Check,
  X,
  DollarSign,
  Edit2,
  Copy,
  Loader2,
  X as CloseIcon,
  Eye,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  Filter
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface Props {
  business: Business;
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  addExpense: (e: Expense) => void;
  userRole: UserRole;
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Grain': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  'Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?auto=format&fit=crop&w=800&q=80',
  'Fruit': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  'Beverage': 'https://images.unsplash.com/photo-1544787210-2211d74fc119?auto=format&fit=crop&w=800&q=80',
  'Vegetable': 'https://images.unsplash.com/photo-1566385101042-1a000c1269c4?auto=format&fit=crop&w=800&q=80',
  'Meat': 'https://images.unsplash.com/photo-1607623273573-fb949bc59437?auto=format&fit=crop&w=800&q=80',
  'Bakery': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
  'General': 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=80'
};

const EXPENSE_CATEGORIES = [
  'Supplies',
  'Salaries',
  'Rent',
  'Utilities',
  'Marketing',
  'Logistics',
  'Maintenance',
  'Miscellaneous'
];

const BusinessAdminDashboard: React.FC<Props> = ({ business, products, orders, expenses, setOrders, addProduct, updateProduct, addExpense, userRole }) => {
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingMarketing, setLoadingMarketing] = useState(false);
  const [generatedPromo, setGeneratedPromo] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  
  // Filtering state
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'ALL'>('ALL');
  
  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);
  
  const [expenseForm, setExpenseForm] = useState({ label: '', amount: '', category: 'Supplies' });
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', category: '' });

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const res = await geminiService.getBusinessInsights({ 
      orders: orders.length, 
      products: products.length, 
      rating: business.rating,
      type: business.type,
      expenses: expenses.reduce((acc, e) => acc + e.amount, 0)
    });
    setInsight(res);
    setLoadingInsight(false);
  };

  const generatePromo = async (productName: string) => {
    setGeneratedPromo("");
    setLoadingMarketing(true);
    setIsCopied(false);
    const res = await geminiService.generatePromotion(productName, business.type);
    setGeneratedPromo(res || "");
    setLoadingMarketing(false);
  };

  const copyToClipboard = () => {
    if (!generatedPromo) return;
    navigator.clipboard.writeText(generatedPromo).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.label || !expenseForm.amount) return;
    addExpense({
      id: Math.random().toString(),
      businessId: business.id,
      amount: parseInt(expenseForm.amount),
      category: expenseForm.category,
      note: expenseForm.label,
      date: new Date().toISOString()
    });
    setExpenseForm({ label: '', amount: '', category: 'Supplies' });
    setIsExpenseModalOpen(false);
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) return;
    
    const category = productForm.category || 'General';
    const placeholderImage = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['General'];

    addProduct({
      id: Math.random().toString(),
      businessId: business.id,
      name: productForm.name,
      category: category,
      price: parseInt(productForm.price),
      stock: parseInt(productForm.stock),
      image: placeholderImage,
      description: 'New product added via dashboard'
    });
    setProductForm({ name: '', price: '', stock: '', category: '' });
    setIsProductModalOpen(false);
  };

  const quickStockEdit = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const newStock = prompt(`Edit stock for ${p.name}:`, p.stock.toString());
    if (newStock !== null) {
      updateProduct({ ...p, stock: parseInt(newStock) });
    }
  };

  const getProductRating = (product: Product) => {
    if (!product.ratings || product.ratings.length === 0) return { avg: 0, count: 0 };
    const sum = product.ratings.reduce((a, b) => a + b, 0);
    return { avg: (sum / product.ratings.length).toFixed(1), count: product.ratings.length };
  };

  const totalSales = useMemo(() => orders.filter(o => o.status === OrderStatus.COMPLETED).reduce((acc, o) => acc + o.totalPrice, 0), [orders]);
  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const netProfit = totalSales - totalExpenses;

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'ALL') return orders;
    return orders.filter(o => o.status === orderFilter);
  }, [orders, orderFilter]);

  const statusFilters = ['ALL', ...Object.values(OrderStatus)];

  const isManager = userRole === UserRole.MANAGER;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{business.name}</h1>
          <div className="flex items-center gap-3 mt-1 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-bold"><Star size={16} className="text-amber-500 fill-amber-500" /> {business.rating}</span>
            <span>•</span>
            <span className="font-bold text-xs uppercase tracking-widest">{business.type}</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">KHAN Verified</span>
          </div>
        </div>
        <div className="flex gap-2">
          {!isManager && (
            <button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors dark:text-slate-200">
              <DollarSign size={14} /> Add Expense
            </button>
          )}
          <button onClick={() => setIsProductModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Sales</p>
          <h3 className="text-2xl font-black">Rs. {totalSales.toLocaleString()}</h3>
          <div className="flex items-center gap-2 mt-4 text-blue-400 text-[10px] font-black">
            <TrendingUp size={14} /> Live Sync
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        </div>

        {!isManager ? (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Expenses</p>
            <h3 className="text-2xl font-black text-red-600 dark:text-red-500">Rs. {totalExpenses.toLocaleString()}</h3>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-4 italic">{expenses.length} Records</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Products</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{products.length}</h3>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-4 italic">Active SKU's</p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Live Pipeline</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{orders.filter(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED).length}</h3>
          <div className="mt-4 flex gap-1">
             <div className="h-1.5 w-2/3 bg-amber-500 rounded-full"></div>
             <div className="h-1.5 w-1/3 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>

        {!isManager ? (
          <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Net Balance</p>
            <h3 className="text-2xl font-black">Rs. {netProfit.toLocaleString()}</h3>
            <p className="text-blue-200 text-[10px] font-bold mt-4 uppercase tracking-widest">Target: Rs. 1M</p>
          </div>
        ) : (
          <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
             <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Daily Target</p>
             <h3 className="text-2xl font-black">85%</h3>
             <p className="text-blue-200 text-[10px] font-bold mt-4 uppercase tracking-widest">Completed</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Management Section */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-black text-slate-800 dark:text-white italic tracking-tighter uppercase">Live Orders & Bargains</h3>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <Filter size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Filter by status</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status as OrderStatus | 'ALL')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                      orderFilter === status
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredOrders.length === 0 ? (
                <div className="p-20 text-center">
                  <ShoppingBag size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                  <p className="text-slate-400 dark:text-slate-500 italic font-medium">No orders found matching this filter.</p>
                </div>
              ) : filteredOrders.map(order => (
                <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black italic">
                      {order.id.slice(-2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 dark:text-white uppercase">#{order.id.slice(-4)}</p>
                        {order.status === OrderStatus.BARGAINING && (
                          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase rounded flex items-center gap-1">
                            <Sparkles size={10} /> Negotiation
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">ABDULLAH • {new Date(order.createdAt).toLocaleDateString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-slate-900 dark:text-white font-black">Rs. {order.totalPrice.toLocaleString()}</p>
                        {order.originalPrice > order.totalPrice && (
                          <p className="text-xs text-red-400 dark:text-red-500/70 line-through font-bold">Rs. {order.originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === OrderStatus.PENDING || order.status === OrderStatus.BARGAINING ? (
                      <>
                        <button 
                          onClick={() => updateOrderStatus(order.id, OrderStatus.ACCEPTED)}
                          className="bg-blue-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                          className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-300 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 hover:border-red-200 transition-all"
                        >
                          <X size={14} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        order.status === OrderStatus.COMPLETED 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : order.status === OrderStatus.CANCELLED
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
                      }`}>
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Marketing Console */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-700 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles size={120} />
            </div>
            
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 border border-blue-100 dark:border-slate-700">
                <Megaphone size={32} />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">KHAN AI Marketing Console</h4>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm shadow-blue-600/20">Gemini 3 Flash</span>
                </div>
                
                <div className="mt-8">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Choose product to promote:</p>
                  <div className="flex flex-wrap gap-2">
                    {products.map(p => (
                      <button 
                        key={p.id}
                        disabled={loadingMarketing}
                        onClick={() => generatePromo(p.name)}
                        className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
                          loadingMarketing ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingMarketing && (
                  <div className="mt-10 flex flex-col items-center justify-center p-12 bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-white dark:border-slate-700 border-dashed animate-in fade-in duration-300">
                    <Loader2 size={40} className="text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] animate-pulse">Generating creative copy...</p>
                  </div>
                )}

                {!loadingMarketing && generatedPromo && (
                  <div className="mt-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-blue-200 dark:border-blue-900/30 animate-in slide-in-from-top-4 duration-500 relative group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles size={12} className="text-amber-500" /> AI Generated Content
                      </span>
                      <button 
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          isCopied ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700'
                        }`}
                      >
                        {isCopied ? (
                          <><Check size={14} /> Copied!</>
                        ) : (
                          <><Copy size={14} /> Copy to Clipboard</>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {generatedPromo}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                       <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 italic">Ready for WhatsApp or Instagram promotion.</p>
                       <div className="flex gap-2">
                         <button onClick={copyToClipboard} className="text-slate-400 dark:text-slate-500 hover:text-blue-600 transition-colors">
                           <Share2 size={16} />
                         </button>
                       </div>
                    </div>
                  </div>
                )}
                
                {!loadingMarketing && !generatedPromo && (
                  <div className="mt-8 p-10 border-2 border-dashed border-blue-200/50 dark:border-slate-700 rounded-[2.5rem] text-center">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select a product above to generate an instant AI marketing campaign.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Tools */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
              <Sparkles size={18} className="text-amber-500" /> Strategic Insights
            </h4>
            {insight ? (
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border-l-4 border-amber-400">
                {insight}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">Tap to analyze KHAN performance.</p>
            )}
            <button 
              onClick={fetchInsight}
              disabled={loadingInsight}
              className="w-full mt-8 bg-slate-900 dark:bg-slate-700 text-white py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 dark:hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingInsight && <Loader2 size={16} className="animate-spin" />}
              {loadingInsight ? 'Consulting Gemini...' : 'Analyze Profitability'}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
             <h4 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
              <Package size={18} className="text-slate-500 dark:text-slate-400" /> Inventory Desk
            </h4>
            <div className="space-y-6">
              {products.map(p => (
                <div key={p.id} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase truncate pr-4">{p.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setSelectedProductForView(p)} className="text-[10px] text-blue-600 dark:text-blue-400 font-black flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                         <Eye size={12} /> VIEW
                      </button>
                      <button onClick={() => quickStockEdit(p.id)} className="text-[10px] text-blue-600 dark:text-blue-400 font-black flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                         <Edit2 size={10} /> EDIT
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    <span>Level</span>
                    <button 
                      onClick={() => quickStockEdit(p.id)} 
                      className={`hover:scale-125 transition-transform cursor-pointer ${p.stock < 20 ? 'text-red-500' : 'text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'}`}
                      title="Update Stock"
                    >
                      {p.stock}
                    </button>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${p.stock < 20 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(p.stock, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProductForView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md transition-all">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20 dark:border-slate-700">
            <div className="relative h-64 bg-slate-100 dark:bg-slate-900">
              <img src={selectedProductForView.image} className="w-full h-full object-cover" alt={selectedProductForView.name} />
              <button 
                onClick={() => setSelectedProductForView(null)}
                className="absolute top-6 right-6 p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-900 dark:text-white rounded-full hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 transition-all shadow-xl"
              >
                <CloseIcon size={20} />
              </button>
              <div className="absolute bottom-6 left-6 bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-black italic shadow-2xl border border-white/10 uppercase tracking-tight">
                Rs. {selectedProductForView.price.toLocaleString()}
              </div>
            </div>

            <div className="p-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200 dark:border-blue-800">
                      {selectedProductForView.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-500 font-black text-sm">
                      <Star size={16} fill="currentColor" /> 
                      {getProductRating(selectedProductForView).avg} 
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">({getProductRating(selectedProductForView).count})</span>
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none mb-4">
                    {selectedProductForView.name}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-md">
                    {selectedProductForView.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">In Stock</p>
                    <p className={`text-xl font-black ${selectedProductForView.stock < 20 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{selectedProductForView.stock}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Active</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${selectedProductForView.stock < 20 ? 'bg-red-500' : 'bg-blue-500'}`} 
                    style={{ width: `${Math.min((selectedProductForView.stock / 100) * 100, 100)}%` }} 
                  />
                </div>
                
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-2"><Layers size={14} /> Inventory Strength</span>
                  <span className={selectedProductForView.stock < 20 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}>
                    {selectedProductForView.stock < 20 ? 'CRITICAL - REORDER SOON' : 'HEALTHY STOCK LEVELS'}
                  </span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    quickStockEdit(selectedProductForView.id);
                    setSelectedProductForView(null);
                  }}
                  className="flex-1 bg-slate-900 dark:bg-slate-700 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Update Inventory
                </button>
                <button 
                  onClick={() => {
                    generatePromo(selectedProductForView.name);
                    setSelectedProductForView(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Megaphone size={16} /> Promote Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">Record Expense</h2>
                 <button onClick={() => setIsExpenseModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><CloseIcon size={20} className="dark:text-white"/></button>
              </div>
              <form onSubmit={submitExpense} className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Category</label>
                    <div className="relative">
                      <select 
                        value={expenseForm.category} 
                        onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} 
                        className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer dark:text-white"
                      >
                        {EXPENSE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Reason / Details</label>
                    <input autoFocus value={expenseForm.label} onChange={e => setExpenseForm({...expenseForm, label: e.target.value})} className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="e.g. Electric Bill, Fuel, Salary" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Amount (PKR)</label>
                    <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="5000" />
                 </div>
                 <button className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all mt-4">Save Record</button>
              </form>
           </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">Add New Product</h2>
                 <button onClick={() => setIsProductModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><CloseIcon size={20} className="dark:text-white"/></button>
              </div>
              <form onSubmit={submitProduct} className="space-y-4">
                 <input autoFocus value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Product Name" />
                 <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Price (Rs.)" />
                 <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Initial Stock" />
                 <select 
                    value={productForm.category} 
                    onChange={e => setProductForm({...productForm, category: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {Object.keys(CATEGORY_IMAGES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                 </select>
                 <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-700 transition-all">List Product</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default BusinessAdminDashboard;
