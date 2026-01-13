
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
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  business: Business | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, business }) => {
  const menuItems = {
    [UserRole.SUPER_ADMIN]: [
      { name: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
      { name: 'Businesses', icon: <Store size={18} /> },
      { name: 'Approve Users', icon: <Users size={18} /> },
      { name: 'Subscriptions', icon: <DollarSign size={18} /> },
      { name: 'Platform Stats', icon: <TrendingUp size={18} /> },
    ],
    [UserRole.BUSINESS_ADMIN]: [
      { name: 'Overview', icon: <LayoutDashboard size={18} />, active: true },
      { name: 'Inventory', icon: <Package size={18} /> },
      { name: 'Sales & Orders', icon: <ShoppingBag size={18} /> },
      { name: 'Accounting', icon: <DollarSign size={18} /> },
      { name: 'Staff Management', icon: <Users size={18} /> },
      { name: 'Marketing', icon: <TrendingUp size={18} /> },
    ],
    [UserRole.STAFF]: [
      { name: 'My Tasks', icon: <LayoutDashboard size={18} />, active: true },
      { name: 'Pending Orders', icon: <ShoppingBag size={18} /> },
      { name: 'Inventory Check', icon: <Package size={18} /> },
      { name: 'Attendance', icon: <Users size={18} /> },
    ],
    [UserRole.CUSTOMER]: [
      { name: 'Explore', icon: <LayoutDashboard size={18} />, active: true },
      { name: 'My Orders', icon: <ShoppingBag size={18} /> },
      { name: 'Favorites', icon: <Store size={18} /> },
      { name: 'Messages', icon: <MessageSquare size={18} /> },
    ]
  };

  const currentMenu = menuItems[user.role];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col h-full border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tighter italic">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-xs font-black shadow-lg shadow-green-500/20">KB</div>
          KHAN BUSSINESS
        </h1>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2">
          Operations
        </p>
        {currentMenu.map((item, idx) => (
          <button
            key={idx}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              item.active 
                ? 'bg-green-600 text-white font-bold shadow-lg shadow-green-600/10' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-black text-white uppercase overflow-hidden">
             {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate">{user.name}</p>
            <div className="flex items-center gap-1">
               <ShieldCheck size={10} className="text-green-500" />
               <p className="text-[9px] text-slate-500 truncate capitalize font-bold">{user.role.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
