
import React, { useState } from 'react';
import { Resource } from '../types';

interface ResourceDetailProps {
  resource: Resource;
  isDarkMode: boolean;
  onBack: () => void;
  onBookingComplete: (booking: any) => void;
  onReport: (resource: Resource) => void;
}

const ResourceDetail: React.FC<ResourceDetailProps> = ({ resource, isDarkMode, onBack, onBookingComplete, onReport }) => {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  const galleryImages = [
    resource.imageUrl,
    'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800'
  ];

  const handleExecuteBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      onBookingComplete({
        resourceName: resource.name,
        date: '2024-02-25',
        time: '09:00 - 11:00 AM'
      });
    }, 1500);
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 duration-500">
      <div className="max-w-[1600px] mx-auto">
        {/* Breadcrumb */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-8 group"
        >
          <span className="text-blue-500 font-black text-xs tracking-widest">&lt; BROWSE</span>
          <span className="text-white/20 text-xs font-black tracking-widest uppercase">/ {resource.name}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-24">
          
          {/* Main Visual Content (70%) */}
          <div className="lg:col-span-8 space-y-8">
            <div className={`relative aspect-video rounded-[40px] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-white/5' : 'bg-slate-100 border-slate-200 shadow-2xl'}`}>
              {/* High-tech Grid Animation / 3D Grid Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none bg-grid opacity-30"></div>
              
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <svg className="w-full h-full text-blue-500/20" viewBox="0 0 200 100">
                   <g stroke="currentColor" strokeWidth="0.5" fill="none">
                     <path d="M10 50 Q 50 10 100 50 T 190 50" strokeDasharray="5 5" />
                     <circle cx="50" cy="30" r="2" fill="currentColor" />
                     <circle cx="100" cy="50" r="2" fill="currentColor" />
                     <circle cx="150" cy="70" r="2" fill="currentColor" />
                     <line x1="50" y1="30" x2="100" y2="50" />
                     <line x1="100" y1="50" x2="150" y2="70" />
                   </g>
                </svg>
              </div>

              {/* Viewport Control Labels */}
              <div className="absolute bottom-6 right-6">
                 <button className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white/40 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                 </button>
              </div>
            </div>

            {/* Perspective Gallery */}
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">PERSPECTIVE GALLERY</h3>
               <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveGalleryIndex(i)}
                      className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all ${activeGalleryIndex === i ? 'border-blue-500 scale-[0.98]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-2 left-2 text-[8px] font-black mono text-white uppercase tracking-tighter">
                         {i === 1 ? 'Real Photo' : `Preview ${i}`}
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Booking / Right Sidebar (30%) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-10 rounded-[40px] border shadow-2xl ${isDarkMode ? 'bg-[#0a0a0f] border-white/10' : 'bg-white border-slate-200'}`}>
               <div className="flex justify-between items-start mb-10">
                  <h2 className="text-4xl font-black uppercase tracking-tight">Reserve</h2>
                  <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
               </div>

               <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">UNIT READY</span>
                  </div>
               </div>

               <div className="space-y-8">
                  {/* Date Input */}
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">DEPLOYMENT DATE</label>
                     <div className="relative">
                        <input 
                          type="text" 
                          placeholder="dd/mm/yyyy" 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs mono text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                        </svg>
                     </div>
                  </div>

                  {/* Start / Finish Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">START</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="--:--" 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-10 pr-2 text-xs mono text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">FINISH</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="--:--" 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-10 pr-2 text-xs mono text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 pt-12">
                    <button 
                      onClick={handleExecuteBooking}
                      disabled={isBooking}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group overflow-hidden"
                    >
                      <div className={`flex items-center gap-3 transition-transform duration-500 ${isBooking ? 'translate-y-[-100%]' : ''}`}>
                        <svg className="w-5 h-5 text-blue-300 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="uppercase text-xs tracking-[0.3em]">EXECUTE BOOKING</span>
                      </div>
                      {isBooking && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>

                    <button 
                      onClick={() => onReport(resource)}
                      className="w-full bg-white/[0.03] border border-white/10 hover:border-amber-500/40 text-white/40 hover:text-amber-500 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 group"
                    >
                      <svg className="w-4 h-4 text-white/20 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="uppercase text-[10px] tracking-[0.3em]">REPORT ANOMALY</span>
                    </button>
                  </div>
               </div>
            </div>

            {/* Additional Actions / Meta */}
            <div className="flex gap-2">
              <button className="flex-1 p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[9px] font-black uppercase text-white/40 hover:text-white transition-colors">
                Share Resource
              </button>
              <button className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white/40 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
