import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MousePointerClick, MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFunnels: 0,
    totalLeads: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const funnelsQuery = query(collection(db, 'funnels'), where('userId', '==', user.uid));
        const funnelsSnapshot = await getDocs(funnelsQuery);
        
        let views = 0;
        let leads = 0;
        
        funnelsSnapshot.forEach(doc => {
          const data = doc.data();
          views += data.views || 0;
          leads += data.leads || 0;
        });

        setStats({
          totalFunnels: funnelsSnapshot.size,
          totalLeads: leads,
          totalViews: views,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const mockChartData = [
    { name: 'Mon', leads: 4 },
    { name: 'Tue', leads: 7 },
    { name: 'Wed', leads: 5 },
    { name: 'Thu', leads: 12 },
    { name: 'Fri', leads: 8 },
    { name: 'Sat', leads: 15 },
    { name: 'Sun', leads: 10 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back!</h1>
            <p className="text-slate-500">Here's what's happening with your funnels today.</p>
          </div>
          <Link to="/funnels/new" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm shadow-blue-500/20">
            + New Funnel
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <MousePointerClick size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Views</p>
                <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : stats.totalViews}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-violet-50 p-3 rounded-xl text-violet-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Leads</p>
                <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : stats.totalLeads}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Funnels</p>
                <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : stats.totalFunnels}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Leads Overview</h3>
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">
              <TrendingUp size={16} /> +12% this week
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="leads" fill="url(#colorLeads)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
