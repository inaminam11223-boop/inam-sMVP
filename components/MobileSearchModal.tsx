
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Store, Package, ArrowLeft, Loader2, Star } from 'lucide-react';
import { MOCK_BUSINESSES, MOCK_PRODUCTS } from '../constants';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ type: 'business' | 'product', item: any }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Simulate API delay for better UX demonstration of the loading indicator
    const fetchTimer = setTimeout(() => {
      const filteredBusinesses = MOCK_BUSINESSES.filter(b => 
        b.name.toLowerCase().includes(query.toLowerCase()) || 
        b.type.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4);

      const filteredProducts = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);

      setSuggestions([
        ...filteredBusinesses.map(b => ({ type: 'business' as const, item: b })),
        ...filteredProducts.map(p => ({ type: 'product' as const, item: p }))
      ]);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(fetchTimer);
  }, [query]);

  const getProductRating = (ratings?: number[]) => {
    if (!ratings || ratings.length === 0) return null;
    const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    return { avg, count: ratings.length };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
        <button 
          onClick={onClose} 
          className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl active:scale-90 transition-all"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-blue-500" />
            ) : (
              <Search size={18} />
            )}
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products or shops..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-[1.25rem] py-4 pl-11 pr-11 text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all shadow-inner"
          />
          {query && (
            <button 
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full hover:bg-slate-300 active:scale-90 transition-all"
              aria-label="Clear search"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/40 dark:bg-slate-950 p-5 space-y-4">
        {isLoading && suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 size={40} className="animate-spin text-blue-500 opacity-20" />
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Scanning MY BUSSINESS Network...</p>
          </div>
        ) : query.length < 2 ? (
          <div className="text-center py-20 space-y-6">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 shadow-xl rounded-[2rem] flex items-center justify-center mx-auto text-blue-500 border border-slate-50 dark:border-slate-700 animate-bounce">
               <Search size={40} />
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-xl italic leading-none">MY BUSSINESS</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-bold mt-2 leading-relaxed">Search across Peshawar, Lahore, and Karachi.<br/>Enter 2+ characters to begin.</p>
            </div>
            
            <div className="pt-8">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">Trending Tags</p>
               <div className="flex flex-wrap justify-center gap-2">
                 {['Grocery', 'Basmati', 'Tikka', 'Logistics', 'Real Estate'].map(term => (
                   <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                   >
                     {term}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        ) : suggestions.length === 0 && !isLoading ? (
          <div className="text-center py-24 px-8">
            <p className="font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-lg leading-none">No Results Found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-bold mt-2">Try searching for products like 'Rice' or 'Fruit'.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
             <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Network Results</p>
                {isLoading && <Loader2 size={12} className="animate-spin text-blue-500" />}
                {!isLoading && <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{suggestions.length} FOUND</span>}
             </div>
             {suggestions.map((s, idx) => {
               const ratingInfo = s.type === 'product' ? getProductRating(s.item.ratings) : null;
               
               return (
                <button
                  key={idx}
                  className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.97] transition-all text-left group"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${s.type === 'business' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}>
                    {s.type === 'business' ? <Store size={24} /> : <Package size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900 dark:text-white text-base truncate uppercase tracking-tight italic">{s.item.name}</p>
                      {s.type === 'business' && (
                        <span className="flex items-center gap-0.5 text-amber-500 text-[10px] font-black italic">
                          ★ {s.item.rating}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                        {s.type === 'business' ? `Partner: ${s.item.type}` : `${s.item.category}`}
                      </p>
                      {s.type === 'product' && (
                        <>
                          <span className="text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-tighter">Rs. {s.item.price.toLocaleString()}</span>
                          {ratingInfo && (
                            <span className="flex items-center gap-1 text-amber-500 text-[10px] font-black">
                              <Star size={10} fill="currentColor" /> {ratingInfo.avg} ({ratingInfo.count})
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowLeft size={16} className="rotate-180" strokeWidth={3} />
                  </div>
                </button>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchModal;
