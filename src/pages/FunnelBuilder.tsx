import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Save, Plus, Trash2, ArrowLeft, Smartphone, Monitor } from 'lucide-react';

interface FunnelStep {
  id: string;
  type: string;
  title: string;
  description: string;
  buttonText: string;
  options?: string[];
  fields?: { name: string; label?: string; type: string; required: boolean }[];
}

interface Funnel {
  name: string;
  slug: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  isActive: boolean;
  steps: FunnelStep[];
}

export default function FunnelBuilder() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const [funnel, setFunnel] = useState<Funnel>({
    name: 'My New Funnel',
    slug: '',
    whatsappNumber: '',
    whatsappMessageTemplate: 'Hi! I am interested. My name is {name} and my email is {email}.',
    isActive: true,
    steps: [
      {
        id: uuidv4(),
        type: 'welcome',
        title: 'Welcome to our Funnel',
        description: 'Click below to get started.',
        buttonText: 'Start Now'
      }
    ]
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchFunnel();
    } else {
      setFunnel(prev => ({ ...prev, slug: uuidv4().substring(0, 8) }));
    }
  }, [id]);

  const fetchFunnel = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'funnels', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFunnel(docSnap.data() as any);
      } else {
        alert('Funnel not found');
        navigate('/funnels');
      }
    } catch (error) {
      console.error("Error fetching funnel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!funnel.whatsappNumber) {
      alert('Please enter a WhatsApp number');
      return;
    }
    setSaving(true);
    try {
      const isNew = !id || id === 'new';
      const funnelId = !isNew ? id : uuidv4();
      const funnelData = {
        ...funnel,
        id: funnelId,
        userId: user.uid,
        updatedAt: serverTimestamp(),
        ...(isNew ? { createdAt: serverTimestamp(), views: 0, leads: 0 } : {})
      };
      
      await setDoc(doc(db, 'funnels', funnelId), funnelData, { merge: true });
      alert('Funnel saved successfully!');
      if (isNew) {
        navigate(`/funnels/${funnelId}`, { replace: true });
      }
    } catch (error) {
      console.error("Error saving funnel:", error);
      alert('Failed to save funnel');
    } finally {
      setSaving(false);
    }
  };

  const addStep = (type: string) => {
    const newStep: any = {
      id: uuidv4(),
      type,
      title: 'New Step',
      description: '',
      buttonText: 'Continue'
    };
    
    if (type === 'question') {
      newStep.options = ['Option 1', 'Option 2'];
    } else if (type === 'input') {
      newStep.fields = [{ name: 'name', label: 'Your Name', type: 'text', required: true }];
    }
    
    setFunnel({ ...funnel, steps: [...funnel.steps, newStep] });
    setActiveStepIndex(funnel.steps.length);
  };

  const updateStep = (stepId: string, updates: any) => {
    setFunnel({
      ...funnel,
      steps: funnel.steps.map(step => step.id === stepId ? { ...step, ...updates } : step)
    });
  };

  const removeStep = (stepId: string) => {
    const stepIndex = funnel.steps.findIndex(step => step.id === stepId);
    setFunnel({
      ...funnel,
      steps: funnel.steps.filter(step => step.id !== stepId)
    });
    if (activeStepIndex >= funnel.steps.length - 1) {
      setActiveStepIndex(Math.max(0, funnel.steps.length - 2));
    } else if (activeStepIndex > stepIndex) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/funnels')} className="p-2 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <input 
                type="text" 
                value={funnel.name} 
                onChange={(e) => setFunnel({...funnel, name: e.target.value})}
                className="font-bold text-lg bg-transparent border-none focus:ring-0 p-0 text-slate-900 outline-none"
              />
            </div>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Funnel'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
            {/* General Settings */}
            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 tracking-tight">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Funnel Slug (URL)</label>
                  <input 
                    type="text" 
                    value={funnel.slug} 
                    onChange={(e) => setFunnel({...funnel, slug: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number (with country code)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 919876543210"
                    value={funnel.whatsappNumber} 
                    onChange={(e) => setFunnel({...funnel, whatsappNumber: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Message Template</label>
                <p className="text-xs text-slate-500 mb-2">Use {'{field_name}'} to insert user answers.</p>
                <textarea 
                  value={funnel.whatsappMessageTemplate} 
                  onChange={(e) => setFunnel({...funnel, whatsappMessageTemplate: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none h-24 resize-none"
                />
              </div>
            </div>

            {/* Steps */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 tracking-tight">Funnel Steps</h3>
              <div className="space-y-4">
                {funnel.steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    onClick={() => setActiveStepIndex(index)}
                    className={`border rounded-2xl p-6 bg-white shadow-sm relative hover:shadow-md transition-all cursor-pointer ${activeStepIndex === index ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}
                  >
                    <div className="absolute top-6 right-6 flex gap-2">
                      <button onClick={() => removeStep(step.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="mb-6">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Step {index + 1}: {step.type}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input 
                          type="text" 
                          value={step.title} 
                          onChange={(e) => updateStep(step.id, { title: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <input 
                          type="text" 
                          value={step.description} 
                          onChange={(e) => updateStep(step.id, { description: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                        />
                      </div>
                      
                      {step.type === 'question' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Options (comma separated)</label>
                          <input 
                            type="text" 
                            value={step.options?.join(', ')} 
                            onChange={(e) => updateStep(step.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                          />
                        </div>
                      )}

                      {step.type === 'input' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Fields</label>
                          <div className="space-y-3">
                            {step.fields?.map((field: any, fIndex: number) => (
                              <div key={fIndex} className="flex gap-3 items-center">
                                <input 
                                  type="text" 
                                  placeholder="Field Name (e.g. email)"
                                  value={field.name} 
                                  onChange={(e) => {
                                    const newFields = [...(step.fields || [])];
                                    newFields[fIndex].name = e.target.value;
                                    updateStep(step.id, { fields: newFields });
                                  }}
                                  className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Label"
                                  value={field.label} 
                                  onChange={(e) => {
                                    const newFields = [...(step.fields || [])];
                                    newFields[fIndex].label = e.target.value;
                                    updateStep(step.id, { fields: newFields });
                                  }}
                                  className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                                />
                                <select
                                  value={field.type}
                                  onChange={(e) => {
                                    const newFields = [...(step.fields || [])];
                                    newFields[fIndex].type = e.target.value;
                                    updateStep(step.id, { fields: newFields });
                                  }}
                                  className="px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none bg-white"
                                >
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="tel">Phone</option>
                                </select>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newFields = [...(step.fields || []), { name: 'new_field', label: 'New Field', type: 'text', required: true }];
                                updateStep(step.id, { fields: newFields });
                              }}
                              className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                              + Add Field
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                        <input 
                          type="text" 
                          value={step.buttonText} 
                          onChange={(e) => updateStep(step.id, { buttonText: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => addStep('welcome')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <Plus size={16} /> Welcome Step
                </button>
                <button onClick={() => addStep('question')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <Plus size={16} /> Question Step
                </button>
                <button onClick={() => addStep('input')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <Plus size={16} /> Input Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className={`hidden lg:flex flex-col items-center bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm transition-all duration-300 ${previewMode === 'mobile' ? 'w-[350px]' : 'w-[800px]'}`}>
          <div className="flex items-center justify-between w-full mb-6">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              {previewMode === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />} Live Preview
            </div>
            <div className="flex bg-slate-200 p-1 rounded-lg">
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                title="Mobile View"
              >
                <Smartphone size={16} />
              </button>
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                title="Desktop View"
              >
                <Monitor size={16} />
              </button>
            </div>
          </div>
          <div className={`w-full bg-white shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300 ${previewMode === 'mobile' ? 'h-[650px] rounded-[2.5rem] border-8 border-slate-900' : 'h-[600px] rounded-xl border border-slate-200'}`}>
            {/* Mock Header */}
            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-xs font-medium text-slate-400">
              chatfunnel.ai/f/{funnel.slug}
            </div>
            
            {/* Preview Content (Showing active step) */}
            <div className="flex-1 p-6 flex flex-col justify-center items-center text-center bg-white overflow-y-auto">
              {funnel.steps.length > 0 && funnel.steps[activeStepIndex] && (
                <div className={`w-full ${previewMode === 'desktop' ? 'max-w-md mx-auto' : ''}`}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{funnel.steps[activeStepIndex].title}</h2>
                  <p className="text-slate-600 mb-8">{funnel.steps[activeStepIndex].description}</p>
                  
                  {funnel.steps[activeStepIndex].type === 'question' && funnel.steps[activeStepIndex].options && (
                    <div className="w-full space-y-3 mb-8">
                      {funnel.steps[activeStepIndex].options.map((opt: string, i: number) => (
                        <div key={i} className="w-full py-3 px-4 border-2 border-slate-100 rounded-xl text-slate-700 font-medium bg-slate-50">{opt}</div>
                      ))}
                    </div>
                  )}

                  {funnel.steps[activeStepIndex].type === 'input' && funnel.steps[activeStepIndex].fields && (
                    <div className="w-full space-y-4 mb-8 text-left">
                      {funnel.steps[activeStepIndex].fields.map((field: any, i: number) => (
                        <div key={i}>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                          <input type={field.type} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50" disabled />
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">
                    {funnel.steps[activeStepIndex].buttonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
