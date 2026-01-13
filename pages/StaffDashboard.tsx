
import React from 'react';
import { User, Business, Order, OrderStatus } from '../types';
import { CheckCircle, Circle, MapPin, Phone, Briefcase } from 'lucide-react';

interface Props {
  user: User;
  business: Business;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const StaffDashboard: React.FC<Props> = ({ user, business, orders, setOrders }) => {
  const toggleComplete = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.COMPLETED } : o));
  };

  const pendingCount = orders.filter(o => o.status !== OrderStatus.COMPLETED).length;
  const completedCount = orders.filter(o => o.status === OrderStatus.COMPLETED).length;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-3xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
          <Briefcase size={48} />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Duty Board</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Staff: <span className="text-orange-600">DANYIAL HOTI</span> @ {business.name}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
             <span className="text-[10px] font-black px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-100">SHIFT: 08:30 AM - 05:00 PM</span>
             <span className="text-[10px] font-black px-4 py-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">SALARY: PKR 35,000</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Assigned</p>
          <h3 className="text-3xl font-black text-slate-900">{pendingCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Resolved Today</p>
          <h3 className="text-3xl font-black text-green-600">{completedCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Rating</p>
          <h3 className="text-3xl font-black text-blue-600">4.9</h3>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Active Queue</h2>
        {orders.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-400 font-bold">
             No tasks assigned for this shift.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-orange-300 transition-all">
              <div className="flex items-start gap-5">
                <div className={`mt-1 shrink-0 ${order.status === OrderStatus.COMPLETED ? 'text-green-500' : 'text-slate-200'}`}>
                   {order.status === OrderStatus.COMPLETED ? <CheckCircle size={28} /> : <Circle size={28} />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-black text-slate-900 uppercase tracking-tight italic">Order #{order.id.slice(-6)}</h4>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded tracking-widest">ABDULLAH</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><MapPin size={14} /> Sector E</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><Phone size={14} /> +92 300</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-xs font-black uppercase tracking-widest ${order.status === OrderStatus.COMPLETED ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.status}
                  </p>
                </div>
                {order.status !== OrderStatus.COMPLETED && (
                  <button 
                    onClick={() => toggleComplete(order.id)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all active:scale-95"
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

export default StaffDashboard;
