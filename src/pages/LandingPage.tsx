import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Zap, Users, ArrowRight, CheckCircle2, BarChart2, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-2 rounded-xl text-white shadow-sm">
              <MessageCircle size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Chat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Funnel AI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-900 transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Docs</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium hidden sm:block">Login</Link>
            <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm shadow-blue-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Turn Website Visitors Into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              WhatsApp Conversations Instantly
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Build automated lead generation and sales funnels that redirect directly to WhatsApp. Capture leads, pre-fill messages, and close deals faster with zero coding.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
              Start Free <ArrowRight size={20} />
            </Link>
            <a href="#demo" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
              View Demo
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">No credit card required. Setup in 2 minutes.</p>
        </motion.div>

        {/* Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="aspect-[16/9] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative">
            <div className="absolute top-0 w-full h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="absolute inset-0 top-12 bg-gradient-to-tr from-blue-50/50 to-violet-50/50 flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop" alt="Dashboard Preview" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full text-left">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                       <MessageCircle size={20} />
                     </div>
                     <div>
                       <div className="font-bold text-slate-900">Chat Funnel AI</div>
                       <div className="text-xs text-slate-500">Preview Mode</div>
                     </div>
                   </div>
                   <h3 className="text-xl font-bold mb-2 text-slate-900">Ready to boost your sales?</h3>
                   <p className="text-slate-600 mb-6 text-sm">Answer a few questions and we'll connect you with the right expert on WhatsApp.</p>
                   <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium shadow-md">
                     Start Now
                   </button>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Powerful features designed to maximize your conversion rate and streamline your WhatsApp lead generation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <LayoutTemplate className="text-blue-500" size={28} />, title: 'Visual Funnel Builder', desc: 'Drag and drop interface to create high-converting funnels in minutes without any coding.' },
              { icon: <MessageCircle className="text-violet-500" size={28} />, title: 'WhatsApp Automation', desc: 'Automatically redirect users to WhatsApp with pre-filled messages based on their answers.' },
              { icon: <Users className="text-emerald-500" size={28} />, title: 'Lead Capture', desc: 'Collect names, emails, and phone numbers before they even reach your WhatsApp inbox.' },
              { icon: <BarChart2 className="text-amber-500" size={28} />, title: 'Analytics Dashboard', desc: 'Track views, leads, and conversion rates to optimize your funnels for better performance.' },
              { icon: <Zap className="text-rose-500" size={28} />, title: 'Lightning Fast', desc: 'Optimized for mobile devices to ensure your funnels load instantly on any connection.' },
              { icon: <CheckCircle2 className="text-indigo-500" size={28} />, title: 'Ready Templates', desc: 'Start quickly with our library of proven templates for various industries and use cases.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                <div className="mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for trying out the platform.</p>
              <div className="text-4xl font-extrabold mb-6 text-slate-900">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['1 Active Funnel', '100 Leads/mo', 'Basic Analytics', 'Chat Funnel AI Branding'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 bg-slate-100 text-slate-900 text-center rounded-xl font-bold hover:bg-slate-200 transition-colors">Start Free</Link>
            </div>
            {/* Pro */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 text-sm mb-6">For growing businesses and agencies.</p>
              <div className="text-4xl font-extrabold text-white mb-6">$29<span className="text-lg text-slate-400 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Funnels', 'Unlimited Leads', 'Advanced Analytics', 'Remove Branding', 'Priority Support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={20} className="text-violet-400 shrink-0" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">Get Pro</Link>
            </div>
            {/* Business */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Business</h3>
              <p className="text-slate-500 text-sm mb-6">For large teams and high volume.</p>
              <div className="text-4xl font-extrabold mb-6 text-slate-900">$99<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Everything in Pro', 'Custom Domain', 'Team Access', 'Dedicated Account Manager', 'API Access'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 bg-slate-100 text-slate-900 text-center rounded-xl font-bold hover:bg-slate-200 transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-1.5 rounded-lg text-white">
                <MessageCircle size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Chat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Funnel AI</span>
              </span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500 font-medium">
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Chat Funnel AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
