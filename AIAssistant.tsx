
import React, { useState, useRef, useEffect } from 'react';
import { Resource } from '../types';

interface AIAssistantProps {
  isDarkMode: boolean;
  resources: Resource[];
  onRecommend: (id: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isDarkMode, resources, onRecommend }) => {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string, resourceId?: string }[]>([
    { role: 'ai', text: 'NEXUS Neural Link established. How can I optimize your campus navigation today?' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!query.trim()) return;

    const userMsg = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setIsScanning(true);

    // AI Logic Simulation
    setTimeout(() => {
      const lowerQuery = userMsg.toLowerCase();
      let response = "I couldn't find a specific match for that query. Try asking for a lab with GPUs or a large lecture hall.";
      let resourceId: string | undefined;

      // Rule-based logic
      if (lowerQuery.includes('place for') || lowerQuery.includes('room for')) {
        const capacityMatch = lowerQuery.match(/\d+/);
        if (capacityMatch) {
          const cap = parseInt(capacityMatch[0]);
          const match = resources.find(r => r.status === 'available' && r.capacity >= cap);
          if (match) {
            response = `Analysis complete. I recommend the ${match.name}. It is currently available and accommodates ${match.capacity} units.`;
            resourceId = match.id;
          } else {
            response = `Searching... no available rooms found with capacity ${cap}. Attempting to optimize alternative sectors.`;
          }
        }
      } else if (lowerQuery.includes('gpu') || lowerQuery.includes('ai')) {
        const match = resources.find(r => r.status === 'available' && (r.gpuStatus || r.equipment?.some(e => e.name.toLowerCase().includes('gpu'))));
        if (match) {
          response = `Target acquired. The ${match.name} has active GPU clusters and is currently available for booking.`;
          resourceId = match.id;
        } else {
          response = "Active scan shows all GPU-equipped labs are currently at peak capacity.";
        }
      } else if (lowerQuery.includes('whiteboard') || lowerQuery.includes('seminar')) {
        const match = resources.find(r => r.status === 'available' && r.equipment?.some(e => e.name.toLowerCase().includes('whiteboard')));
        if (match) {
          response = `Optimization found: ${match.name} is available and equipped with high-contrast whiteboards.`;
          resourceId = match.id;
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: response, resourceId }]);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light mb-1">Nexus <span className="font-bold text-cyan-500">Assistant</span></h2>
          <p className="text-white/40 text-xs mono uppercase tracking-widest">Real-time Facility Optimization Engine</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase rounded-full">Neural Link: Active</div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 rounded-3xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'} mb-6 space-y-6`}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] p-4 rounded-2xl border ${
              m.role === 'user' 
                ? 'bg-cyan-500/10 border-cyan-500/20 text-white' 
                : 'bg-white/5 border-white/10 text-white/80'
            }`}>
              <div className="text-[9px] mono uppercase tracking-widest mb-1 opacity-40">{m.role === 'ai' ? 'Nexus_Core' : 'User_Node'}</div>
              <p className="text-sm leading-relaxed">{m.text}</p>
              {m.resourceId && (
                <button 
                  onClick={() => onRecommend(m.resourceId!)}
                  className="mt-4 w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-900/20"
                >
                  Show Location on Live Map
                </button>
              )}
            </div>
          </div>
        ))}
        {isScanning && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl w-full max-w-md">
              <div className="text-[9px] mono uppercase tracking-widest mb-3 text-cyan-500">Scanning Campus Grid...</div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 animate-[scan_2s_linear_infinite]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Enter command (e.g., 'Find me a lab with GPUs')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className={`flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-cyan-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
        />
        <button 
          onClick={handleSend}
          className="px-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-cyan-900/20"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;