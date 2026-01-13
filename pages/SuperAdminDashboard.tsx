
import React from 'react';
import { Business, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Globe, Building2, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  businesses: Business[];
  toggleApproval: (id: string) => void;
  allUsers: User[];
}

const SuperAdminDashboard: React.FC<Props> = ({ businesses, toggleApproval, allUsers }) => {
  const chartData = [
    { name: 'Jan', active: 400 },
    { name: 'Feb', active: 300 },
    { name: 'Mar', active: 600 },
    { name: 'Apr', active: 800 },
    { name: 'May', active: businesses.length * 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Command Center</h1>
          <p className="text-slate-500 font-medium">Welcome back, Super Admin <span className="text-green-600 font-black">INAM KHAN</span></p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95">Generate Audit Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Businesses', value: businesses.length, icon: <Building2 />, color: 'blue' },
          { label: 'Active Users', value: allUsers.length, icon: <Users />, color: 'green' },
          { label: 'Platform Revenue', value: 'PKR 1.2M', icon: <Activity />, color: 'purple' },
          { label: 'System Health', value: '99.9%', icon: <Globe />, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6 italic uppercase tracking-tighter">Ecosystem Growth</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                />
                <Bar dataKey="active" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-lg font-black text-slate-800 mb-6 italic uppercase tracking-tighter">Merchant Verifications</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
            {businesses.map((biz) => (
              <div key={biz.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-200 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-800 italic shadow-sm group-hover:scale-110 transition-transform">
                    {biz.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate max-w-[120px]">{biz.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{biz.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleApproval(biz.id)}
                  className={`p-2 rounded-xl transition-all active:scale-90 ${biz.isApproved ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-600' : 'bg-amber-100 text-amber-600 hover:bg-green-600 hover:text-white'}`}
                  title={biz.isApproved ? 'Deactivate' : 'Approve'}
                >
                  {biz.isApproved ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
