import React, { useState, useEffect } from 'react';
import { Resource } from '../../types';

type BookingStep = 'initial' | 'conflict' | 'summary' | 'success';

type BookingPayload = {
  resourceName: string;
  time: string;
  date?: string;
};

type LogType = 'info' | 'warning' | 'success';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  resources: Resource[];
  isDarkMode: boolean;
  onComplete: (booking: BookingPayload) => void;
  onLog: (msg: string, type?: LogType) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  resource,
  resources,
  isDarkMode,
  onComplete,
  onLog,
}) => {
  const [step, setStep] = useState<BookingStep>('initial');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 - 11:00 AM');
  const [suggestions, setSuggestions] = useState<Resource[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    setStep('initial');
    setIsValidating(false);
    setSelectedSlot('09:00 - 11:00 AM');
    setSuggestions([]);
  }, [isOpen]);

  const handleConfirm = () => {
    if (!resource) return;

    setIsValidating(true);
    onLog(`Initiating availability sweep for ${resource.name}...`, 'info');

    setTimeout(() => {
      if (resource.status === 'occupied') {
        onLog(`Conflict detected at ${selectedSlot}. Launching AI Advisor.`, 'warning');

        const alternatives = resources
          .filter(
            r =>
              r.id !== resource.id &&
              r.type === resource.type &&
              r.status === 'available'
          )
          .slice(0, 2);

        setSuggestions(alternatives);
        setStep('conflict');
      } else {
        setStep('summary');
      }

      setIsValidating(false);
    }, 1200);
  };

  const applySuggestion = (alt: Resource) => {
    onLog(`User accepted AI recommendation: ${alt.name}`, 'success');

    onComplete({
      resourceName: alt.name,
      time: selectedSlot,
      date: new Date().toISOString().split('T')[0],
    });

    setStep('success');
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${
          isDarkMode
            ? 'bg-[#0a0a0c] border-white/10'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* INITIAL */}
        {step === 'initial' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              Reserve <span className="text-cyan-500">{resource.name}</span>
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {['09:00 - 11:00 AM', '11:00 - 01:00 PM', '02:00 - 04:00 PM'].map(
                  slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-4 rounded-xl border text-[10px] font-bold transition-all ${
                        selectedSlot === slot
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {slot}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleConfirm}
                disabled={isValidating}
                className={`w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                  isValidating ? 'opacity-50' : 'active:scale-95'
                }`}
              >
                {isValidating ? 'Validating Matrix...' : 'Check Availability'}
              </button>
            </div>
          </div>
        )}

        {/* CONFLICT */}
        {step === 'conflict' && (
          <div className="p-8">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
              <div className="text-xs font-bold text-red-400 uppercase tracking-widest">
                Conflict Detected
              </div>
              <div className="text-[10px] text-red-300/60 mt-1">
                Resource is leased for this period.
              </div>
            </div>

            <div className="mb-8">
              <div className="text-[10px] font-bold uppercase text-white/20 mb-4">
                AI Smart Recommendations
              </div>

              <div className="space-y-3">
                {suggestions.map(alt => (
                  <button
                    key={alt.id}
                    onClick={() => applySuggestion(alt)}
                    className="w-full flex justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all"
                  >
                    <span className="text-xs font-bold">{alt.name}</span>
                    <span className="text-[9px] font-bold text-cyan-500 uppercase">
                      Apply
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('initial')}
              className="w-full text-xs font-bold uppercase text-white/20"
            >
              Cancel
            </button>
          </div>
        )}

        {/* SUMMARY */}
        {step === 'summary' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Conflict Check: Passed
              </span>
            </div>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="opacity-40">Resource</span>
                <span>{resource.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">Time</span>
                <span>{selectedSlot}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onComplete({
                  resourceName: resource.name,
                  time: selectedSlot,
                });
                setStep('success');
              }}
              className="w-full bg-cyan-600 py-4 rounded-2xl font-bold uppercase tracking-widest"
            >
              Secure Lease
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 mx-auto mb-6 flex items-center justify-center text-emerald-500">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-black mb-2 uppercase">
              Lease Secured
            </h3>
            <p className="text-sm opacity-40 mb-8">
              Spatial grid updated.
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/5 rounded-xl text-[10px] font-bold uppercase"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;