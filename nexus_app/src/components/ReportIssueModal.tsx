import React, { useState, useEffect, useRef } from 'react';
import { Resource } from '../../types';

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
  'General Maintenance',
];

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  resource,
  isDarkMode,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [issueType, setIssueType] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setIsSubmitted(false);
    setIssueType('');
    setDescription('');

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitted) return;

    setIsSubmitted(true);

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (!isOpen || !resource) return null;

  const bgClasses = isDarkMode
    ? 'bg-slate-900/90 border-white/10'
    : 'bg-white border-slate-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode
    ? 'bg-white/5 border-white/10 text-white'
    : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${bgClasses}`}
      >
        {!isSubmitted ? (
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">
                    Incident Report
                  </span>
                </div>
                <h2 className={`text-2xl font-bold ${textPrimary}`}>
                  Reporting{' '}
                  <span className="text-cyan-500">{resource.name}</span>
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className={`p-2 rounded-xl transition-colors ${
                  isDarkMode
                    ? 'hover:bg-white/5 text-white/20 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className={`text-xs font-bold uppercase tracking-widest ml-1 ${textSecondary}`}
                >
                  Issue Type
                </label>
                <select
                  required
                  value={issueType}
                  onChange={e => setIssueType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-cyan-500/50 ${inputBg}`}
                >
                  <option value="" disabled>
                    Select a category...
                  </option>
                  {ISSUE_TYPES.map(type => (
                    <option
                      key={type}
                      value={type}
                      className={isDarkMode ? 'bg-slate-900' : 'bg-white'}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className={`text-xs font-bold uppercase tracking-widest ml-1 ${textSecondary}`}
                >
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the technical fault in detail..."
                  className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:border-cyan-500/50 ${inputBg}`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest ${
                    isDarkMode
                      ? 'bg-white/5 hover:bg-white/10 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95"
                >
                  Transmit Report
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* SUCCESS */
          <div className="p-16 text-center">
            <div className="w-20 h-20 rounded-full border-4 border-cyan-500 mx-auto mb-8 flex items-center justify-center">
              ✓
            </div>
            <h3 className="text-3xl font-black text-cyan-400 mb-4">
              REPORT LOGGED
            </h3>
            <p
              className={`text-lg max-w-sm mx-auto ${
                isDarkMode ? 'text-white/80' : 'text-slate-600'
              }`}
            >
              We will resolve the issue. Thank you for notifying Nexus.
            </p>
            <div className="mt-10 text-[10px] uppercase tracking-widest text-white/30">
              Auto-closing terminal…
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIssueModal;