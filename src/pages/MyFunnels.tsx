import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { MoreVertical, Edit2, Trash2, ExternalLink, Copy } from 'lucide-react';

export default function MyFunnels() {
  const { user } = useAuth();
  const [funnels, setFunnels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnels();
  }, [user]);

  const fetchFunnels = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'funnels'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const funnelsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFunnels(funnelsData);
    } catch (error) {
      console.error("Error fetching funnels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this funnel?')) return;
    try {
      await deleteDoc(doc(db, 'funnels', id));
      setFunnels(funnels.filter(f => f.id !== id));
    } catch (error) {
      console.error("Error deleting funnel:", error);
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Funnels</h1>
            <p className="text-slate-500">Manage your WhatsApp lead generation funnels.</p>
          </div>
          <Link to="/funnels/new" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm shadow-blue-500/20">
            + New Funnel
          </Link>
        </div>

        {loading ? (
          <div>Loading funnels...</div>
        ) : funnels.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No funnels yet</h3>
            <p className="text-slate-500 mb-6">Create your first funnel to start capturing leads on WhatsApp.</p>
            <Link to="/funnels/new" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20">
              Create Funnel
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-medium text-slate-600">Name</th>
                  <th className="p-4 font-medium text-slate-600">Status</th>
                  <th className="p-4 font-medium text-slate-600">Views</th>
                  <th className="p-4 font-medium text-slate-600">Leads</th>
                  <th className="p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {funnels.map((funnel) => (
                  <tr key={funnel.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{funnel.name}</div>
                      <div className="text-sm text-slate-500 truncate max-w-[200px]">{window.location.origin}/f/{funnel.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${funnel.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {funnel.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{funnel.views || 0}</td>
                    <td className="p-4 text-slate-600">{funnel.leads || 0}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => copyLink(funnel.slug)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Copy Link">
                          <Copy size={18} />
                        </button>
                        <Link to={`/f/${funnel.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Public">
                          <ExternalLink size={18} />
                        </Link>
                        <Link to={`/funnels/${funnel.id}`} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(funnel.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
