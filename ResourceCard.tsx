
import React, { useState } from 'react';
import { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
  isDarkMode: boolean;
  isAdmin?: boolean;
  onStatusChange?: (newStatus: Resource['status']) => void;
  onReport: (resource: Resource) => void;
  onBook: (resource: Resource) => void;
  onDetail: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onBook, onDetail, onReport, isDarkMode }) => {
  const [imgError, setImgError] = useState(false);
  const placeholderUrl = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';

  return (
    <div className={`group border rounded-[32px] overflow-hidden flex flex-col h-full transition-all duration-500 relative ${
      isDarkMode 
      ? 'bg-[#0a0a0f]/80 border-white/5 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
      : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-[0_10px_40px_rgba(148,163,184,0.15)] shadow-sm'
    }`}>
      {/* Image Area */}
      <div className="relative h-56 w-full overflow-hidden shrink-0">
        <img 
          src={imgError ? placeholderUrl : resource.imageUrl} 
          alt={resource.name} 
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        {/* Type Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-white">
          {resource.type}
        </div>
        
        {/* Availability Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg border backdrop-blur-md ${
          isDarkMode ? 'bg-[#10b981]/10 border-[#10b981]/30' : 'bg-emerald-50 border-emerald-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${resource.status === 'available' ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${resource.status === 'available' ? (isDarkMode ? 'text-[#10b981]' : 'text-emerald-700') : 'text-red-500'}`}>
              {resource.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Floating ID Tag Decoration */}
        <div className="absolute bottom-4 left-4 text-white/40 pointer-events-none">
           <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-20">
             <path d="M10 10 H90 V90 H10 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
             <path d="M30 30 H70 V70 H30 Z" fill="currentColor" opacity="0.1" />
           </svg>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        {/* Title and Metadata */}
        <div className="mb-4">
          <h3 className={`text-2xl font-black leading-tight uppercase tracking-tight group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {resource.name}
          </h3>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className={`text-[9px] font-black mono uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>{resource.location || 'SECTOR ALPHA'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
              </svg>
              <span className={`text-[9px] font-black mono uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>{resource.capacity} MAX</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs leading-relaxed mb-8 line-clamp-2 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>
          {resource.description || 'Facility optimized for high-performance operations and collaborative intelligence workflows.'}
        </p>

        {/* Actions Grid */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onDetail(resource)}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                isDarkMode 
                ? 'border-white/10 hover:bg-white/[0.05] text-white/60 hover:text-white' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600'
              }`}
            >
              DETAIL
            </button>
            <button 
              onClick={() => onReport(resource)}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                isDarkMode 
                ? 'border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-white/40 hover:text-amber-500' 
                : 'border-slate-200 hover:bg-amber-50 hover:border-amber-200 text-slate-400 hover:text-amber-600'
              }`}
            >
              REPORT
            </button>
          </div>
          <button 
            onClick={() => onBook(resource)}
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
            }`}
          >
            RESERVE NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
