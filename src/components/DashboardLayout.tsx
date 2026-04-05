import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Users, Settings as SettingsIcon, LogOut, MessageCircle, CreditCard, BarChart2, LayoutTemplate } from 'lucide-react';
import { auth } from '../lib/firebase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Create Funnel', path: '/funnels/new', icon: <PlusCircle size={20} /> },
    { name: 'My Funnels', path: '/funnels', icon: <List size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
    { name: 'Templates', path: '/templates', icon: <LayoutTemplate size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Billing', path: '/billing', icon: <CreditCard size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-1.5 rounded-lg text-white shadow-sm">
              <MessageCircle size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Chat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Funnel AI</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-1.5 rounded-lg text-white">
              <MessageCircle size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Chat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Funnel AI</span>
            </span>
          </Link>
          <button onClick={handleLogout} className="text-slate-500 hover:text-red-500">
            <LogOut size={20} />
          </button>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
