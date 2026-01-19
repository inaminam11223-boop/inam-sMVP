
import React from 'react';
import { User, UserRole, Business } from '../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  LogOut, 
  TrendingUp, 
  Package, 
  DollarSign,
  Store,
  MessageSquare,
  X,
  ShieldCheck
} from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  business: Business | null;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, user, onLogout, business }) => {
  const menuItems = {
    [UserRole.SUPER_ADMIN]: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
      { name: 'Businesses', icon: <Store size={20} /> },
      { name: 'Approve Users', icon: <Users size={20} /> },
      { name: 'Subscriptions', icon: <DollarSign size={20} /> },
      { name: 'Platform Stats', icon: <TrendingUp size={20} /> },
    ],
    [UserRole.BUSINESS_ADMIN]: [
      { name: 'Overview', icon: <LayoutDashboard size={20} />, active: true },
      { name: 'Inventory', icon: <Package size={20} /> },
      { name: 'Sales & Orders', icon: <ShoppingBag size={20} /> },
      { name: 'Accounting', icon: <DollarSign size={20} /> },
      { name: 'Staff Management', icon: <Users size={20} /> },
      { name: 'Marketing', icon: <TrendingUp size={20} /> },
    ],
    [UserRole.STAFF]: [
      { name: 'My Tasks', icon: <LayoutDashboard size={20} />, active: true },
      { name: 'Pending Orders', icon: <ShoppingBag size={20} /> },
      { name: 'Inventory Check', icon: <Package size={20} /> },
      { name: 'Attendance', icon: <Users size={20} /> },
    ],
    [UserRole.CUSTOMER]: [
      { name: 'Explore', icon: <LayoutDashboard size={20} />, active: true },
      { name: 'My Orders', icon: <ShoppingBag size={20} /> },
      { name: 'Favorites', icon: <Store size={20} /> },
      { name: 'Messages', icon: <MessageSquare size={20} /> },
    ]
  };

  const currentMenu = menuItems[user.role];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 bg-slate-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <h1 className="text-xl font-black text-white italic tracking-tighter">KHAN BUSSINESS</h1>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 mt-4">
            Dashboard Menu
          </p>
          {currentMenu.map((item, idx) => (
            <button
              key={idx}
              onClick={onClose}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-base transition-all ${
                item.active 
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white uppercase border-2 border-blue-600 shadow-lg shadow-blue-600/10">
               {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-blue-500" />
                <p className="text-xs text-slate-500 font-bold uppercase truncate">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all font-black uppercase text-xs tracking-widest"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
