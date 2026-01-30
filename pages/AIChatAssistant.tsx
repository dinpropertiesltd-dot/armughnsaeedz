
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, Loader2, Minus, Maximize2, Mic, MicOff } from 'lucide-react';
import { streamChatResponse } from '../AIService';

const AIChatAssistant = ({ currentUser, userFiles, allFiles = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      content: currentUser.role === 'ADMIN' 
        ? `Supervisor ${currentUser.name}, system ready.`
        : `Greetings, ${currentUser.name}. How can I assist?` 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    const contextData = currentUser.role === 'ADMIN' ? allFiles : userFiles;
    try {
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      const stream = streamChatResponse(userMsg, currentUser.role, contextData);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          const rest = prev.slice(0, -1);
          return [...rest, { role: 'model', content: fullResponse }];
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "SYSTEM ERROR." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-[60]">
        <Sparkles size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 z-[60] transition-all duration-500 ease-in-out ${isMinimized ? 'h-16 w-64' : 'h-[650px] w-[700px]'}`}>
      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 h-full flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <Bot size={20} />
          <button onClick={() => setIsOpen(false)}><X size={16} /></button>
        </div>
        {!isMinimized && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-[11px] ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
              <input type="text" placeholder="Query Ledger..." className="flex-1 p-3 border rounded-xl text-xs" value={input} onChange={e => setInput(e.target.value)} />
              <button type="submit" className="bg-slate-900 text-white px-4 rounded-xl"><Send size={18} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatAssistant;
