'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    "I have a $800 budget. Android or iOS?",
    "Compare the cameras on Pixel 8 and Galaxy S24",
    "I need 12GB RAM and 512GB storage for gaming",
    "What's the best battery life under $400?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ content: input });  // just pass the string, not an object
    setInput('');
  };

  const handleQuickAction = (text: string) => {
    sendMessage({ content: text });  // just pass the string
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 md:p-6 bg-gray-50 font-sans">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">TechMatch AI</h1>
        <p className="text-slate-500 mt-1">Your personal smartphone comparison expert.</p>
      </header>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-600 max-w-md">
                Ready to find your next phone? Select a quick action below or type your specific requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-left p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm shadow-md'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200'
                  }`}>
                  <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                    {m.parts
                      ? m.parts.map((part: any, i: number) =>
                        part.type === 'text' ? <span key={i}>{part.text}</span> : null
                      )
                      : m.content}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-bl-sm p-4 flex space-x-2 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
              value={input}
              placeholder="E.g., I need a gaming phone under $500..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center min-w-[100px]"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}