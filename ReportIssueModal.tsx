
import React, { useState, useEffect } from 'react';
import { Resource } from '../types';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  isDarkMode: boolean;
}

const ISSUE_TYPES = [
  'Air Conditioning Malfunction',
  'Projector / AV Issues',
  'Furniture Damage',
  'Connectivity (Wi-Fi/Ethernet)',
  'Cleanliness Issue',
  'Hardware / GPU Fault',
  'Lighting Problems',
  'General Maintenance'
];

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose, resource, isDarkMode }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setIssueType('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Auto-close after 3 seconds as requested
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (!isOpen || !resource) return null;

  const bgClasses = isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
      <div 
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all transform animate-in zoom-in-95 duration-300 ${bgClasses}`}
      >
        {!isSubmitted ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] mono text-amber-500">Incident Report</span>
                </div>
                <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>
                  Reporting <span className="text-cyan-500">{resource.name}</span>
                </h2>
              </div>
              <button 
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5 text-white/20 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-widest mono ml-1 ${textSecondary}`}>Issue Type</label>
                <select
                  required
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer ${inputBg}`}
                >
                  <option value="" disabled>Select a category...</option>
                  {ISSUE_TYPES.map(type => (
                    <option key={type} value={type} className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-widest mono ml-1 ${textSecondary}`}>Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the technical fault in detail..."
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-cyan-500/50 transition-colors resize-none ${inputBg}`}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className={`flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                >
                  Transmit Report
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full border-4 border-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                <svg className="w-12 h-12 text-cyan-500 animate-in slide-in-from-bottom-2 duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-cyan-400 mb-4 tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              REPORT LOGGED
            </h3>
            <p className={`text-lg leading-relaxed font-medium max-w-sm ${isDarkMode ? 'text-white/80' : 'text-slate-600'}`}>
              We will resolve the issue. Thank you for notifying Nexus.
            </p>
            
            <div className="mt-12 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce"></div>
              </div>
              <span className="text-[10px] mono uppercase tracking-[0.2em] text-white/30 font-bold">Auto-Closing Terminal</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIssueModal;
