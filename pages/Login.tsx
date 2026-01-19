
import React from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';
import { ShieldCheck, Store, Briefcase, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-600/20 italic">
            KB
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">KHAN BUSSINESS</h1>
          <p className="text-slate-400 font-medium">Pakistan's All-in-One Business Operating System</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Choose Login Role</h2>
          
          <div className="space-y-4">
            {MOCK_USERS.map((user) => {
              const Icon = {
                SUPER_ADMIN: <ShieldCheck className="text-purple-400" />,
                BUSINESS_ADMIN: <Store className="text-blue-400" />,
                STAFF: <Briefcase className="text-orange-400" />,
                CUSTOMER: <UserIcon className="text-blue-400" />,
              }[user.role];

              return (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-700/50 border border-slate-600 hover:border-blue-500 hover:bg-slate-700 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {Icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold">{user.name}</p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
                  </div>
                  <div className="text-slate-500 group-hover:text-blue-500 transition-colors">
                    →
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              © 2024 KHAN BUSSINESS Tech (Pvt) Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
