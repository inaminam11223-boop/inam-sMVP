
import React, { useState, useEffect, useRef } from 'react';
import { User, Business } from '../types';
import { Bell, Search, MapPin, Store, Package, X, Menu, Grid, Sun, Moon } from 'lucide-react';
import { MOCK_BUSINESSES, MOCK_PRODUCTS } from '../constants';

interface NavbarProps {
  user: User;
  business: Business | null;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, business, onToggleSidebar, onOpenSearch, isDarkMode, onToggleTheme }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ type: 'business' | 'product', item: any }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const filteredBusinesses = MOCK_BUSINESSES.filter(b => 
      b.name.toLowerCase().includes(query.toLowerCase()) || 
      b.type.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const filteredProducts = MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    setSuggestions([
      ...filteredBusinesses.map(b => ({ type: 'business' as const, item: b })),
      ...filteredProducts.map(p => ({ type: 'product' as const, item: p }))
    ]);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-6 lg:px-8 z-30 transition-colors">
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          onClick={onToggleSidebar}
          className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">KHAN</span>
          <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">BUSSINESS</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center flex-1 max-w-xl" ref={searchRef}>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <Search size={20} />
          </span>
          <input 
            type="text" 
            placeholder="Search products, orders, or staff..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-4 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type-ahead suggestions</p>
              </div>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-4 transition-colors border-b border-slate-50 dark:border-slate-700 last:border-none group"
                  onClick={() => {
                    setQuery(s.item.name);
                    setShowSuggestions(false);
                  }}
                >
                  <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${s.type === 'business' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}>
                    {s.type === 'business' ? <Store size={18} /> : <Package size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{s.item.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      {s.type === 'business' ? s.item.type : s.item.category}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-slate-200 dark:text-slate-600 group-hover:text-blue-500 transition-colors uppercase">Select</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Mobile Search Icon */}
        <button 
          onClick={onOpenSearch}
          className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 active:scale-95 transition-all"
        >
          <Search size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
          <MapPin size={18} className="text-blue-500" />
          <span className="uppercase tracking-tight">Pakistan</span>
        </div>
        
        <button className="relative p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95 group">
          <Bell size={22} />
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all">
            3
          </span>
          <span className="absolute -top-1.5 -right-1.5 w-[20px] h-[20px] bg-red-600 rounded-full animate-ping opacity-20 pointer-events-none"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{user.name}</p>
            {business && (
              <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-widest">{business.name}</p>
            )}
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-600 flex items-center justify-center text-blue-700 dark:text-blue-400 font-black uppercase text-lg shadow-lg shadow-blue-600/10">
             {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
