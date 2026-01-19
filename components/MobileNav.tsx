
import React from 'react';
import { LayoutDashboard, ShoppingBag, Search, User as UserIcon, Plus } from 'lucide-react';
import { UserRole } from '../types';

interface MobileNavProps {
  role: UserRole;
  onSearchClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ role, onSearchClick }) => {
  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex items-center justify-around px-4 z-[45]">
      <button className="flex flex-col items-center gap-1 text-blue-500">
        <LayoutDashboard size={20} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
      </button>
      
      <button className="flex flex-col items-center gap-1 text-slate-400">
        <ShoppingBag size={20} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Orders</span>
      </button>

      {/* Floating Action Button */}
      <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -mt-10 shadow-xl shadow-blue-600/40 border-4 border-white active:scale-90 transition-transform">
        <Plus size={24} className="text-white" />
      </button>

      <button onClick={onSearchClick} className="flex flex-col items-center gap-1 text-slate-400">
        <Search size={20} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Search</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-slate-400">
        <UserIcon size={20} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Profile</span>
      </button>
    </div>
  );
};

export default MobileNav;
