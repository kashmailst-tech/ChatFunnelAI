import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { MessageSquare, X, Send, Image as ImageIcon, Search, Zap, BrainCircuit, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hi! I am your Chat Funnel AI Assistant. How can I help you build your funnel today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'fast' | 'smart' | 'search' | 'image'>('fast');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (mode === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: input,
        });
        
        let imageUrl = '';
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: imageUrl ? 'Here is your generated image:' : 'Sorry, I could not generate the image.',
          imageUrl
        }]);
      } else {
        let modelName = 'gemini-3.1-flash-lite-preview';
        let config: any = {
          systemInstruction: 'You are an expert funnel builder assistant. Help the user create high-converting WhatsApp funnels. Keep responses concise and actionable. Format responses in Markdown.'
        };

        if (mode === 'smart') {
          modelName = 'gemini-3.1-pro-preview';
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
        } else if (mode === 'search') {
          modelName = 'gemini-3-flash-preview';
          config.tools = [{ googleSearch: {} }];
        }

        const history = messages
          .filter(m => m.id !== '1') // Exclude the initial greeting
          .map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }));
        
        history.push({ role: 'user', parts: [{ text: input }] });

        const response = await ai.models.generateContent({
          model: modelName,
          contents: history,
          config
        });

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: response.text || 'Sorry, I could not generate a response.'
        }]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Sorry, an error occurred while processing your request.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BrainCircuit size={20} />
              <h3 className="font-bold">AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-50">
            <button
              onClick={() => setMode('fast')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${mode === 'fast' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
              title="Fast Chat (Low Latency)"
            >
              <Zap size={14} /> Fast
            </button>
            <button
              onClick={() => setMode('smart')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${mode === 'smart' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:bg-slate-200'}`}
              title="Smart Chat (High Thinking)"
            >
              <BrainCircuit size={14} /> Smart
            </button>
            <button
              onClick={() => setMode('search')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${mode === 'search' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:bg-slate-200'}`}
              title="Web Search"
            >
              <Search size={14} /> Search
            </button>
            <button
              onClick={() => setMode('image')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${mode === 'image' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:bg-slate-200'}`}
              title="Generate Image"
            >
              <ImageIcon size={14} /> Image
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                  {msg.role === 'model' ? (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-50">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  )}
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="Generated" className="mt-2 rounded-lg max-w-full h-auto border border-slate-200" />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2 text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 px-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={mode === 'image' ? "Describe an image to generate..." : "Ask me anything..."}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 px-2 text-slate-700 placeholder-slate-400"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
