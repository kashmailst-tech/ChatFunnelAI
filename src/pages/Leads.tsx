import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Download, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [funnels, setFunnels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      // Fetch funnels to map IDs to names
      const funnelsQuery = query(collection(db, 'funnels'), where('userId', '==', user.uid));
      const funnelsSnap = await getDocs(funnelsQuery);
      const funnelMap: Record<string, string> = {};
      funnelsSnap.forEach(doc => {
        funnelMap[doc.id] = doc.data().name;
      });
      setFunnels(funnelMap);

      // Fetch leads
      const leadsQuery = query(
        collection(db, 'leads'), 
        where('userId', '==', user.uid),
        // Note: orderBy requires a composite index if used with where on a different field.
        // For simplicity in this demo, we'll fetch and sort client-side if needed, or just rely on default order.
      );
      const leadsSnap = await getDocs(leadsQuery);
      const leadsData = leadsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      
      // Sort client side by createdAt descending
      leadsData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;

    // Get all unique keys from data
    const allKeys = new Set<string>();
    leads.forEach(lead => {
      if (lead.data) {
        Object.keys(lead.data).forEach(k => allKeys.add(k));
      }
    });

    const headers = ['Date', 'Funnel', ...Array.from(allKeys)];
    
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => {
        const date = lead.createdAt ? format(lead.createdAt.toDate(), 'yyyy-MM-dd HH:mm') : 'N/A';
        const funnelName = funnels[lead.funnelId] || 'Unknown Funnel';
        const dataCols = Array.from(allKeys).map(key => {
          const val = lead.data?.[key] || '';
          // Escape quotes and wrap in quotes
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        return `"${date}","${funnelName}",${dataCols.join(',')}`;
      })
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(lead => {
    const searchString = JSON.stringify(lead.data).toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h1>
            <p className="text-slate-500">View and export leads captured from your funnels.</p>
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-white">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No leads found</h3>
                <p className="text-slate-500">When people complete your funnels, their data will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
                  <tr className="border-b border-slate-200">
                    <th className="p-4 font-medium text-slate-600 whitespace-nowrap">Date</th>
                    <th className="p-4 font-medium text-slate-600 whitespace-nowrap">Funnel</th>
                    <th className="p-4 font-medium text-slate-600">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                        {lead.createdAt ? format(lead.createdAt.toDate(), 'MMM d, yyyy HH:mm') : 'N/A'}
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                        {funnels[lead.funnelId] || 'Unknown'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(lead.data || {}).map(([key, value]) => (
                            <div key={key} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm flex gap-2 shadow-sm">
                              <span className="text-slate-500 font-medium">{key}:</span>
                              <span className="text-slate-900">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
