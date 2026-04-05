import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Check, CreditCard, Zap } from 'lucide-react';

export default function Billing() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: string) => {
    alert(`Stripe/Razorpay integration pending for ${plan} plan. This will open a checkout session.`);
  };

  if (loading) return <DashboardLayout><div className="flex justify-center items-center h-full">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Upgrade your plan</h1>
          <p className="text-slate-500 text-lg">Choose the perfect plan for your business needs. Scale your WhatsApp lead generation today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className={`bg-white rounded-3xl border ${profile?.plan === 'free' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} p-8 shadow-sm relative flex flex-col`}>
            {profile?.plan === 'free' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Current Plan
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-500 text-sm h-10">Perfect for trying out Chat Funnel AI.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span>Up to 3 Funnels</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span>100 Leads / month</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span>Basic Analytics</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <Check size={18} className="text-slate-300 shrink-0 mt-0.5" />
                <span>Chat Funnel AI Branding</span>
              </li>
            </ul>
            <button 
              disabled={profile?.plan === 'free'}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 text-slate-900 hover:bg-slate-200"
            >
              {profile?.plan === 'free' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`bg-slate-900 rounded-3xl border ${profile?.plan === 'pro' ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-800'} p-8 shadow-xl relative flex flex-col transform md:-translate-y-4`}>
            {profile?.plan === 'pro' ? (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Current Plan
              </div>
            ) : (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap size={12} /> Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 text-sm h-10">For growing businesses and agencies.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-slate-400">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Check size={18} className="text-violet-400 shrink-0 mt-0.5" />
                <span className="text-white font-medium">Unlimited Funnels</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Check size={18} className="text-violet-400 shrink-0 mt-0.5" />
                <span className="text-white font-medium">5,000 Leads / month</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Check size={18} className="text-violet-400 shrink-0 mt-0.5" />
                <span>Advanced Analytics</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Check size={18} className="text-violet-400 shrink-0 mt-0.5" />
                <span>Remove Branding</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Check size={18} className="text-violet-400 shrink-0 mt-0.5" />
                <span>Custom Domains</span>
              </li>
            </ul>
            <button 
              onClick={() => handleUpgrade('pro')}
              disabled={profile?.plan === 'pro'}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/20"
            >
              {profile?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Business Plan */}
          <div className={`bg-white rounded-3xl border ${profile?.plan === 'business' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} p-8 shadow-sm relative flex flex-col`}>
             {profile?.plan === 'business' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Current Plan
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Business</h3>
              <p className="text-slate-500 text-sm h-10">High volume lead generation.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-500">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span>Unlimited Funnels</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span>Unlimited Leads</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span>API Access</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span>Priority Support</span>
              </li>
            </ul>
            <button 
              onClick={() => handleUpgrade('business')}
              disabled={profile?.plan === 'business'}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 text-slate-900 hover:bg-slate-200"
            >
              {profile?.plan === 'business' ? 'Current Plan' : 'Upgrade to Business'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
