
import React, { useMemo, useState, useEffect } from 'react';
import { Resource } from '../types';

interface MapProps {
  isDarkMode: boolean;
  resources: Resource[];
  searchTerm: string;
  onNodeClick: (id: string) => void;
  selectedId: string | null;
  onHover?: (id: string | null) => void;
}

const Map: React.FC<MapProps> = ({ isDarkMode, resources, searchTerm, onNodeClick, selectedId, onHover }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hoveredResourceId, setHoveredResourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Spatial Grid Sync sequence
    const timer = setTimeout(() => setIsInitializing(false), 2500);
    const interval = setInterval(() => {
      setProgress(p => (p < 100 ? p + 2 : 100));
    }, 40);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Isometric Layout Configuration
  const nodeLayouts: Record<string, { x: number, y: number, w: number, h: number, floor: number }> = {
    'l1': { x: 100, y: 100, w: 100, h: 80, floor: 0 },   // AI Lab
    'l2': { x: 100, y: 220, w: 100, h: 60, floor: 0 },  // IoT Lab
    'l3': { x: 250, y: 100, w: 80, h: 80, floor: 0 },   // Cybersecurity
    'l4': { x: 250, y: 220, w: 80, h: 60, floor: 0 },   // Bio-Tech
    'c12': { x: 450, y: 100, w: 150, h: 100, floor: 0 }, // Newton Hall
    'c13': { x: 450, y: 250, w: 150, h: 60, floor: 0 },  // Seminar
    'c14': { x: 450, y: 350, w: 150, h: 60, floor: 0 },  // Hybrid Studio
    'e1': { x: 650, y: 100, w: 40, h: 40, floor: 0 },   // GPU Server
    'p1': { x: 650, y: 250, w: 60, h: 100, floor: 0 },  // EV Station
  };

  const hoveredResource = useMemo(() => 
    resources.find(r => r.id === hoveredResourceId), 
    [hoveredResourceId, resources]
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const iso = (x: number, y: number) => {
    return {
      px: (x - y) * 0.8 + 400,
      py: (x + y) * 0.4 + 50
    };
  };

  const getRoomStyle = (status: Resource['status']) => {
    switch (status) {
      case 'available': return { 
        fill: 'rgba(34, 211, 238, 0.15)', 
        stroke: '#22d3ee', 
        glow: 'rgba(34, 211, 238, 0.4)' 
      };
      case 'occupied': return { 
        fill: 'rgba(239, 68, 68, 0.15)', 
        stroke: '#ef4444', 
        glow: 'rgba(239, 68, 68, 0.4)' 
      };
      case 'maintenance': return { 
        fill: 'rgba(245, 158, 11, 0.15)', 
        stroke: '#f59e0b', 
        glow: 'rgba(245, 158, 11, 0.4)' 
      };
      default: return { fill: 'rgba(100, 116, 139, 0.15)', stroke: '#64748b', glow: 'transparent' };
    }
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-[#050507] bg-grid pointer-events-auto cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      {/* Initialization HUD Overlay */}
      {isInitializing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl animate-out fade-out duration-1000 fill-mode-forwards">
          <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="10 5" className="opacity-40" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="1 10" />
            </svg>
            <div className="text-center z-10">
              <div className="text-cyan-400 font-black tracking-[0.4em] text-sm animate-pulse uppercase">LIVE MAP</div>
              <div className="text-[8px] text-white/40 mt-1 mono tracking-widest uppercase">Initializing Grids</div>
            </div>
          </div>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee]" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-4 text-[9px] mono text-cyan-500/40 uppercase tracking-[0.3em] font-bold">Spatial Co-ordinates Syncing: {progress}%</div>
        </div>
      )}

      {/* Floating HUD Preview */}
      {hoveredResource && (
        <div 
          className="fixed z-[100] pointer-events-none transition-all duration-300 ease-out"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y - 120,
            opacity: hoveredResourceId ? 1 : 0,
            transform: `scale(${hoveredResourceId ? 1 : 0.95})`
          }}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden w-64 shadow-[0_0_40px_rgba(34,211,238,0.2)] animate-in zoom-in-95 duration-200">
            {/* HUD Header Decor */}
            <div className="px-3 py-1 bg-cyan-500/10 border-b border-white/5 flex justify-between items-center">
               <span className="text-[8px] mono font-bold text-cyan-400 uppercase tracking-widest">Node_Telemetry_A1</span>
               <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></div>
                  <div className="w-1 h-1 rounded-full bg-cyan-500/30"></div>
               </div>
            </div>
            
            <div className="relative h-32 w-full">
              <img src={hoveredResource.imageUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-2 left-3">
                 <div className="text-[7px] mono text-cyan-400 font-black uppercase tracking-widest mb-0.5">{hoveredResource.type}</div>
                 <h4 className="text-xs font-black text-white uppercase truncate">{hoveredResource.name}</h4>
              </div>
            </div>

            <div className="p-4 space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[8px] mono text-white/40 uppercase">Status</span>
                  <span className={`text-[8px] mono font-bold uppercase ${hoveredResource.status === 'available' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {hoveredResource.status}
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[8px] mono text-white/40 uppercase">Location</span>
                  <span className="text-[8px] mono text-white/60 uppercase truncate w-32 text-right">{hoveredResource.location}</span>
               </div>
               <div className="pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[7px] mono text-white/20 uppercase">Load Index</span>
                    <span className="text-[7px] mono text-cyan-400">12.4%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" style={{ width: '12.4%' }}></div>
                  </div>
               </div>
            </div>

            {/* Bottom Tech Bar */}
            <div className="h-1 bg-cyan-500/20 w-full flex">
               <div className="h-full bg-cyan-500 animate-[scan-horizontal_3s_linear_infinite]" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* HUD Header */}
      <div className="absolute top-6 left-6 z-20 space-y-2 pointer-events-none">
        <div className="px-4 py-1.5 bg-black/60 border border-cyan-500/30 rounded-lg text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          Live_Isometric_Telemetry: V4.0
        </div>
        <div className="text-[10px] mono text-white/30 uppercase tracking-tighter">Render Engine: STARK_3D_GRID</div>
      </div>

      {/* Global Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20 overflow-hidden">
        <div className="h-full w-1 bg-cyan-500/40 blur-md animate-[scan-horizontal_8s_linear_infinite]"></div>
      </div>

      <svg 
        viewBox="0 0 1000 600" 
        className={`w-full h-full transition-all duration-1000 ease-out pointer-events-auto ${isInitializing ? 'scale-110 blur-xl opacity-0' : 'scale-100 blur-0 opacity-100'}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="roomGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floor Base */}
        <polygon 
          points="400,50 800,250 400,450 0,250" 
          fill="rgba(255,255,255,0.02)" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="1"
          className="pointer-events-none"
        />

        {resources.map((res) => {
          const layout = nodeLayouts[res.id];
          if (!layout) return null;

          const p1 = iso(layout.x, layout.y);
          const p2 = iso(layout.x + layout.w, layout.y);
          const p3 = iso(layout.x + layout.w, layout.y + layout.h);
          const p4 = iso(layout.x, layout.y + layout.h);

          const style = getRoomStyle(res.status);
          const isSelected = selectedId === res.id;
          const isMatched = searchTerm && res.name.toLowerCase().includes(searchTerm.toLowerCase());
          
          return (
            <g 
              key={res.id} 
              className="iso-lift cursor-pointer group pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                onNodeClick(res.id);
              }}
              onMouseEnter={() => {
                setHoveredResourceId(res.id);
                onHover?.(res.id);
              }}
              onMouseLeave={() => {
                setHoveredResourceId(null);
                onHover?.(null);
              }}
            >
              {/* Room Base Internal Glow */}
              <polygon 
                points={`${p1.px},${p1.py} ${p2.px},${p2.py} ${p3.px},${p3.py} ${p4.px},${p4.py}`}
                fill={style.glow}
                filter="url(#roomGlow)"
                className="opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none"
              />

              {/* Room Walls (3D Effect) */}
              <g className="opacity-80 transition-all pointer-events-none">
                <polygon 
                  points={`${p2.px},${p2.py} ${p2.px},${p2.py - 30} ${p3.px},${p3.py - 30} ${p3.px},${p3.py}`} 
                  fill="rgba(255,255,255,0.05)"
                  stroke={style.stroke}
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
                <polygon 
                  points={`${p3.px},${p3.py} ${p3.px},${p3.py - 30} ${p4.px},${p4.py - 30} ${p4.px},${p4.py}`} 
                  fill="rgba(255,255,255,0.08)"
                  stroke={style.stroke}
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
              </g>

              {/* Glass Top Surface */}
              <polygon 
                points={`${p1.px},${p1.py - 30} ${p2.px},${p2.py - 30} ${p3.px},${p3.py - 30} ${p4.px},${p4.py - 30}`}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={isSelected || isMatched ? 2 : 1}
                className="glass-room transition-all"
                style={{ 
                  filter: isMatched || isSelected || hoveredResourceId === res.id ? `drop-shadow(0 0 12px ${style.stroke})` : 'none',
                  opacity: isSelected || hoveredResourceId === res.id ? 1 : 0.8
                }}
              />

              {/* Floating Stark Label */}
              <g className="floating-label pointer-events-none">
                <line 
                  x1={p1.px + layout.w/2} y1={p1.py - 30} 
                  x2={p1.px + layout.w/2} y2={p1.py - 70} 
                  stroke="white" strokeWidth="0.5" strokeOpacity="0.2"
                />
                <foreignObject 
                  x={p1.px - 30} y={p1.py - 100} 
                  width="120" height="40"
                >
                  <div className="flex flex-col items-center">
                    <div className={`bg-black/80 backdrop-blur-md border border-white/10 rounded px-2 py-1 flex flex-col items-center shadow-lg transition-all ${hoveredResourceId === res.id ? 'scale-110 border-cyan-500/50' : 'scale-100'}`}>
                      <span className="text-[7px] font-black mono text-white uppercase truncate w-full text-center">{res.name}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-12 h-0.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${res.status === 'available' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: res.status === 'available' ? '12%' : '88%' }}></div>
                        </div>
                        <span className="text-[6px] mono text-white/40">{res.status === 'available' ? '12%' : '88%'}</span>
                      </div>
                    </div>
                  </div>
                </foreignObject>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-6 z-20 flex gap-4 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
          <span className="text-[8px] mono uppercase text-white/40">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
          <span className="text-[8px] mono uppercase text-white/40">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
          <span className="text-[8px] mono uppercase text-white/40">Maintenance</span>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Map;
