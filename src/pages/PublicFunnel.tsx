import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function PublicFunnel() {
  const { slug } = useParams();
  const [funnel, setFunnel] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFunnel();
  }, [slug]);

  const fetchFunnel = async () => {
    try {
      const q = query(collection(db, 'funnels'), where('slug', '==', slug), where('isActive', '==', true));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const funnelData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setFunnel(funnelData);
        
        // Increment views
        await updateDoc(doc(db, 'funnels', funnelData.id), {
          views: increment(1)
        });
      } else {
        setFunnel(null);
      }
    } catch (error) {
      console.error("Error fetching funnel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!funnel) return;
    
    if (currentStepIndex < funnel.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Final step, submit lead and redirect
      await submitLeadAndRedirect();
    }
  };

  const submitLeadAndRedirect = async () => {
    setSubmitting(true);
    try {
      // Save lead
      await addDoc(collection(db, 'leads'), {
        funnelId: funnel.id,
        userId: funnel.userId,
        data: answers,
        createdAt: serverTimestamp()
      });

      // Increment leads count
      await updateDoc(doc(db, 'funnels', funnel.id), {
        leads: increment(1)
      });

      // Generate WhatsApp URL
      let message = funnel.whatsappMessageTemplate || '';
      // Replace variables like {name} with answers.name
      Object.keys(answers).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        message = message.replace(regex, answers[key]);
      });

      const encodedMessage = encodeURIComponent(message);
      // Clean number (remove +, spaces, dashes)
      const cleanNumber = funnel.whatsappNumber.replace(/[\s+-]/g, '');
      const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
      
      window.location.href = waUrl;
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    const currentStep = funnel.steps[currentStepIndex];
    setAnswers({ ...answers, [currentStep.title]: option });
    handleNext();
  };

  const handleInputChange = (name: string, value: string) => {
    setAnswers({ ...answers, [name]: value });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  if (!funnel) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Funnel not found or inactive.</div>;

  const currentStep = funnel.steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative min-h-[400px] flex flex-col">
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / funnel.steps.length) * 100}%` }}
          />
        </div>

        <div className="flex-1 p-8 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center tracking-tight">{currentStep.title}</h2>
              {currentStep.description && (
                <p className="text-slate-600 mb-8 text-center">{currentStep.description}</p>
              )}

              {currentStep.type === 'question' && currentStep.options && (
                <div className="space-y-3">
                  {currentStep.options.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(opt)}
                      className="w-full py-4 px-6 text-left border-2 border-slate-100 rounded-2xl font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentStep.type === 'input' && currentStep.fields && (
                <div className="space-y-4 mb-8">
                  {currentStep.fields.map((field: any, i: number) => (
                    <div key={i}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={answers[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-slate-50/50"
                      />
                    </div>
                  ))}
                </div>
              )}

              {currentStep.type !== 'question' && (
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
                >
                  {submitting ? 'Redirecting...' : currentStep.buttonText}
                  {currentStepIndex === funnel.steps.length - 1 && <MessageCircle size={20} />}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Branding */}
        <div className="py-4 text-center border-t border-slate-100 bg-slate-50/50">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors">
            ⚡ Powered by Chat Funnel AI
          </a>
        </div>
      </div>
    </div>
  );
}
