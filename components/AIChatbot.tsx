
import React, { useState, useEffect, useRef } from 'react';
import { User, Business, UserRole } from '../types';
import { geminiService } from '../services/geminiService';
import { MessageSquare, Send, X, Bot, User as UserIcon, Sparkles, Minus } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

interface AIChatbotProps {
  user: User;
  business: Business | null;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ user, business }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: `Assalam-o-Alaikum ${user.name}! I am your MY BUSSINESS AI assistant. How can I help you grow your activities today?` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  useEffect(() => {
    if (isOpen && !chatSession) {
      const session = geminiService.createChat(user.role, user.name, business?.name);
      setChatSession(session);
    }
  }, [isOpen, user, business]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession || isTyping) return;

    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const stream = await chatSession.sendMessageStream({ message: userText });
      let fullText = "";
      
      setMessages(prev => [...prev, { role: 'bot', text: "" }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text;
        if (textChunk) {
          fullText += textChunk;
          setMessages(prev => {
            const last = [...prev];
            last[last.length - 1] = { role: 'bot', text: fullText };
            return last;
          });
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Maaf kijiyay, connectivity issue hay. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-tighter italic">MY AI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400">
                <Minus size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                    {m.role === 'user' ? <UserIcon size={12} /> : <Sparkles size={12} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm font-medium'
                  }`}>
                    {m.text || (isTyping && i === messages.length - 1 ? "..." : "")}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask MY AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 text-center font-black uppercase tracking-widest">Powered by MY Intelligence & Gemini 3 Pro</p>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
          isOpen ? 'bg-white text-slate-900 rotate-90 scale-0 opacity-0' : 'bg-blue-600 text-white scale-100 opacity-100 hover:rotate-12 hover:bg-blue-700'
        }`}
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default AIChatbot;
