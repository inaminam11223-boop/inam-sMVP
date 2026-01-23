
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { 
  Briefcase, 
  Store, 
  User as UserIcon, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  Building,
  MapPin,
  QrCode,
  Lock,
  Mail,
  UserCircle
} from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.BUSINESS_ADMIN);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: 'Retail / Kirana',
    address: '',
    inviteCode: '',
    city: ''
  });
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'LOGIN') {
      // Simulate Login Logic
      const user = MOCK_USERS.find(u => u.email === formData.email);
      
      if (user) {
        // Strict Role Check
        // Note: In a real app, you'd check password hash here.
        // We map "Admin" selection to BUSINESS_ADMIN for clarity in UI vs Types
        if (user.role === selectedRole) {
           onLogin(user);
        } else {
           setError(`This account is registered as ${user.role.replace('_', ' ')}, not ${selectedRole.replace('_', ' ')}.`);
        }
      } else {
        // For demo purposes, if user not found in mocks, we can simulate a successful login for testing
        // OR show error. Let's allow test login if it matches specific patterns or just show error.
        // To make it easy to test:
        setError('User not found. Please sign up first.');
      }
    } else {
      // Simulate Signup Logic
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: selectedRole,
        businessId: selectedRole === UserRole.CUSTOMER ? undefined : 'b1', // Auto-assign to mock business for demo
        city: formData.city
      };
      
      // In real app -> API Call -> Token -> Redirect
      onLogin(newUser);
    }
  };

  const roles = [
    { id: UserRole.BUSINESS_ADMIN, label: 'Admin', sub: 'Business Owner', icon: <Store size={20} /> },
    { id: UserRole.MANAGER, label: 'Manager', sub: 'Store Manager', icon: <Briefcase size={20} /> },
    { id: UserRole.STAFF, label: 'Staff', sub: 'Employee', icon: <UserCircle size={20} /> },
    { id: UserRole.CUSTOMER, label: 'Customer', sub: 'Shopper', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700">
        
        {/* Left Side - Hero / Context */}
        <div className="md:w-5/12 bg-blue-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <ShieldCheck size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-black mb-8 border border-white/20 backdrop-blur-sm shadow-xl">
              KB
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Welcome to <br/> KHAN BUSSINESS
            </h1>
            <p className="text-blue-100 font-medium leading-relaxed opacity-90">
              Pakistan's #1 All-in-One Business Operating System. Manage inventory, staff, and sales in one place.
            </p>
          </div>

          <div className="relative z-10 mt-10">
            <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <CheckCircle size={20} className="text-green-400" />
              <span>Verified Secure Platform</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white dark:bg-slate-800">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">
              {mode === 'LOGIN' ? 'Access Portal' : 'Create Account'}
            </h2>
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex text-xs font-bold uppercase tracking-widest">
              <button 
                onClick={() => { setMode('LOGIN'); setError(''); }}
                className={`px-4 py-2 rounded-lg transition-all ${mode === 'LOGIN' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button 
                onClick={() => { setMode('SIGNUP'); setError(''); }}
                className={`px-4 py-2 rounded-lg transition-all ${mode === 'SIGNUP' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      selectedRole === r.id 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 text-slate-500'
                    }`}
                  >
                    <div className={`${selectedRole === r.id ? 'text-blue-600' : 'text-slate-400'}`}>
                      {r.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide">{r.label}</p>
                      <p className="text-[9px] font-bold opacity-60 uppercase">{r.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {mode === 'SIGNUP' && (
                <div className="relative">
                   <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                    required 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                </div>
              )}
              
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                  required 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                 />
              </div>

              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                  required 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                 />
              </div>

              {mode === 'SIGNUP' && (
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                    required 
                    type="password" 
                    placeholder="Confirm Password" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                   />
                </div>
              )}

              {/* Dynamic Fields based on Role & Signup */}
              {mode === 'SIGNUP' && selectedRole === UserRole.BUSINESS_ADMIN && (
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Details</p>
                   <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required 
                        type="text" 
                        placeholder="Business Name" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                        value={formData.businessName}
                        onChange={e => setFormData({...formData, businessName: e.target.value})}
                      />
                   </div>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required 
                        type="text" 
                        placeholder="Business Address" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                   </div>
                </div>
              )}

              {mode === 'SIGNUP' && (selectedRole === UserRole.MANAGER || selectedRole === UserRole.STAFF) && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Join Organization</p>
                   <div className="relative">
                      <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required 
                        type="text" 
                        placeholder={selectedRole === UserRole.MANAGER ? "Business Code / Invite ID" : "Employee ID / Invite Code"}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                        value={formData.inviteCode}
                        onChange={e => setFormData({...formData, inviteCode: e.target.value})}
                      />
                   </div>
                </div>
              )}

              {mode === 'SIGNUP' && selectedRole === UserRole.CUSTOMER && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Location Info</p>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required 
                        type="text" 
                        placeholder="Your City" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:text-white"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      />
                   </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold rounded-xl animate-in shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              {mode === 'LOGIN' ? 'Access Dashboard' : 'Complete Registration'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 KHAN BUSSINESS Tech (Pvt) Ltd.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
