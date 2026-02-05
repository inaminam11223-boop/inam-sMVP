
import React, { useState } from 'react';
import { User, Business, Order, OrderStatus, UserRole } from '../types';
import { CheckCircle, Circle, MapPin, Phone, Briefcase, Lock, ShieldAlert, LayoutList, PieChart, Settings } from 'lucide-react';

interface Props {
  user: User;
  business: Business;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const StaffDashboard: React.FC<Props> = ({ user, business, orders, setOrders }) => {
  const [activeTab, setActiveTab] = useState<'TASKS' | 'FINANCE' | 'SETTINGS'>('TASKS');

  const toggleComplete = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.COMPLETED } : o));
  };

  const pendingCount = orders.filter(o => o.status !== OrderStatus.COMPLETED).length;
  const completedCount = orders.filter(o => o.status === OrderStatus.COMPLETED).length;

  const renderContent = () => {
    // Permission Check: Finance/Reports
    // If a staff user somehow navigates here, show Access Denied.
    if (activeTab === 'FINANCE') {
      return (
        <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
             <Lock size={32} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">Access Denied</h2>
           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
             You do not have permission to view financial records or marketing data. This section is restricted to Managers and Admins.
           </p>
           <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
             <ShieldAlert size={14} /> Security Logged
           </div>
        </div>
      );
    }

    if (activeTab === 'SETTINGS') {
       return (
         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-6">My Profile Settings</h2>
            <div className="space-y-6">
               <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Employee Name</label>
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{user.name}</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">System Role</label>
                  <div className="flex items-center gap-2">
                     <ShieldAlert size={16} className="text-blue-600 dark:text-blue-400" />
                     <p className="font-bold text-blue-600 dark:text-blue-400 uppercase">{user.role}</p>
                  </div>
               </div>
               <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Employment Status</label>
                  <p className="font-bold text-green-600 dark:text-green-400 uppercase flex items-center gap-2">
                    <CheckCircle size={16} /> Active Verified
                  </p>
               </div>
            </div>
         </div>
       )
    }

    // Default: TASKS
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 transition-colors">
          <div className="w-24 h-24 rounded-3xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
            <Briefcase size={48} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Duty Board</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Staff: <span className="text-blue-600 dark:text-blue-400 uppercase">{user.name}</span> @ {business.name}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="text-[10px] font-black px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50 uppercase">SHIFT: 08:30 AM - 05:00 PM</span>
              <span className="text-[10px] font-black px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-100 dark:border-slate-700 uppercase">SALARY: PKR 35,000</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Assigned</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{pendingCount}</h3>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Resolved Today</p>
            <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">{completedCount}</h3>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Rating</p>
            <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">4.9</h3>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Active Queue</h2>
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 p-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold">
              No tasks assigned for this shift.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-300 transition-all">
                <div className="flex items-start gap-5">
                  <div className={`mt-1 shrink-0 ${order.status === OrderStatus.COMPLETED ? 'text-blue-500' : 'text-slate-200 dark:text-slate-700'}`}>
                    {order.status === OrderStatus.COMPLETED ? <CheckCircle size={28} /> : <Circle size={28} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Order #{order.id.slice(-6)}</h4>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase rounded tracking-widest">ABDULLAH</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase"><MapPin size={14} /> Sector E</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase"><Phone size={14} /> +92 300</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 border-t border-slate-100 dark:border-slate-700 md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <p className={`text-xs font-black uppercase tracking-widest ${order.status === OrderStatus.COMPLETED ? 'text-blue-600 dark:text-blue-400' : 'text-orange-500'}`}>
                      {order.status}
                    </p>
                  </div>
                  {order.status !== OrderStatus.COMPLETED && (
                    <button 
                      onClick={() => toggleComplete(order.id)}
                      className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all active:scale-95"
                    >
                      Finish Task
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20">
       {/* Tab Navigation (Simulating Menu/Section Switching) */}
       <div className="flex items-center gap-2 mb-8 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('TASKS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'TASKS' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <LayoutList size={14} /> Tasks
          </button>
          <button 
            onClick={() => setActiveTab('FINANCE')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'FINANCE' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <PieChart size={14} /> Reports
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'SETTINGS' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <Settings size={14} /> Settings
          </button>
       </div>

       {renderContent()}
    </div>
  );
};

export default StaffDashboard;
