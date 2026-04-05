import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, ShoppingBag, Calendar, UserPlus, Briefcase } from 'lucide-react';

const templates = [
  {
    id: 'ecommerce-lead',
    title: 'E-commerce Discount Claim',
    description: 'Capture leads by offering a discount code before redirecting to WhatsApp for sales.',
    icon: ShoppingBag,
    color: 'bg-pink-100 text-pink-600',
    category: 'E-commerce'
  },
  {
    id: 'appointment-booking',
    title: 'Service Appointment',
    description: 'Qualify leads and collect preferred times before booking via WhatsApp.',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600',
    category: 'Services'
  },
  {
    id: 'real-estate-inquiry',
    title: 'Property Inquiry',
    description: 'Collect buyer requirements (budget, location) before connecting with an agent.',
    icon: Briefcase,
    color: 'bg-emerald-100 text-emerald-600',
    category: 'Real Estate'
  },
  {
    id: 'webinar-registration',
    title: 'Webinar Registration',
    description: 'Register users for an event and send the link via WhatsApp.',
    icon: UserPlus,
    color: 'bg-violet-100 text-violet-600',
    category: 'Events'
  }
];

export default function Templates() {
  const navigate = useNavigate();

  const handleUseTemplate = (templateId: string) => {
    // In a real app, this would pre-fill the funnel builder state with the template data
    navigate('/funnels/new');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Templates</h1>
            <p className="text-slate-500">Start quickly with pre-built, high-converting funnel templates.</p>
          </div>
          <button 
            onClick={() => navigate('/funnels/new')}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm w-full md:w-auto justify-center"
          >
            <Plus size={18} /> Start from Scratch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${template.color}`}>
                  <template.icon size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                  {template.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{template.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">{template.description}</p>
              
              <button 
                onClick={() => handleUseTemplate(template.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-medium transition-colors border border-slate-200"
              >
                Use Template <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
