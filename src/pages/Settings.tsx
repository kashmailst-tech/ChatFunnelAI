import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Save, User, CreditCard } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({
    displayName: '',
    defaultWhatsAppNumber: '',
    plan: 'free'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: profile.displayName,
        defaultWhatsAppNumber: profile.defaultWhatsAppNumber
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500">Manage your account and preferences.</p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                  <User size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Profile Information</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
                  <input 
                    type="text" 
                    value={profile.displayName || ''} 
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Default WhatsApp Number</label>
                  <p className="text-xs text-slate-500 mb-2">This will be pre-filled when creating new funnels.</p>
                  <input 
                    type="text" 
                    placeholder="e.g. 919876543210"
                    value={profile.defaultWhatsAppNumber || ''} 
                    onChange={(e) => setProfile({...profile, defaultWhatsAppNumber: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>
              </div>
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Billing Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="bg-violet-100 p-2.5 rounded-xl text-violet-600">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Billing & Plan</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Current Plan</p>
                    <h3 className="text-2xl font-bold text-slate-900 capitalize">{profile.plan} Plan</h3>
                  </div>
                  {profile.plan === 'free' && (
                    <button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20">
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
