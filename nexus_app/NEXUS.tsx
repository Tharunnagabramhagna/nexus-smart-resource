
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import ResourceCard from './components/ResourceCard';
import ReportIssueModal from './components/ReportIssueModal';
import BookingModal from './components/BookingModal';
import UsageAudit from './components/UsageAudit';
import SystemGuide from './components/SystemGuide';
import ResourceDetail from './components/ResourceDetail';
import Repository from './components/Repository';
import { User, Resource } from './types';

interface NEXUSProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const INITIAL_RESOURCES: Resource[] = [
  { 
    id: 'l1', 
    name: 'AI/ML Computing Lab', 
    type: 'lab', 
    status: 'available', 
    location: 'CYBER-WING, FLOOR 2',
    capacity: 50,
    description: 'Specialized deep learning facility with high-performance GPU clusters, neural processing units...',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
  },
  { 
    id: 'c12', 
    name: 'Newton Lecture Hall', 
    type: 'classroom', 
    status: 'available', 
    location: 'ACADEMIC WING, LEVEL 1',
    capacity: 120,
    description: 'Premier large-capacity lecture hall featuring tiered seating, warm wood acoustics...',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678'
  },
  { 
    id: 'p1', 
    name: 'Cyber-Vault EV Bay', 
    type: 'parking', 
    status: 'available', 
    location: 'SECTOR-7, B2',
    capacity: 12,
    description: 'High-speed 350kW charging ports with automated cable management systems for electric fleet deployment.',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7'
  },
  { 
    id: 'e1', 
    name: 'NVIDIA H100 GPU Cluster', 
    type: 'equipment', 
    status: 'available', 
    location: 'DATA-CENTER, RACK 04',
    capacity: 1,
    description: 'Enterprise-grade GPU node with 80GB HBM3 memory, optimized for training large language models.',
    imageUrl: 'https://images.unsplash.com/photo-1591405351990-4726e33df58d'
  },
  { 
    id: 'p2', 
    name: 'Sub-Level Robotic Hangar', 
    type: 'parking', 
    status: 'occupied', 
    location: 'MAIN PLAZA, B4',
    capacity: 40,
    description: 'Automated retrieval-based underground parking system utilizing industrial AGV platforms.',
    imageUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98'
  },
  { 
    id: 'e2', 
    name: 'Unitree B2 Quadruped', 
    type: 'equipment', 
    status: 'available', 
    location: 'ROBOTICS WING, B-02',
    capacity: 1,
    description: 'Industrial-grade quadruped robot with advanced perception sensors for autonomous navigation research.',
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008'
  },
  { 
    id: 'l3', 
    name: 'Aryabhatta Gallery', 
    type: 'classroom', 
    status: 'available', 
    location: 'MAIN BLOCK, LEVEL 1',
    capacity: 150,
    description: 'A grand gallery hall designed for high-impact presentations and hybrid events...',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'
  },
  { 
    id: 'c13', 
    name: 'Tesla Seminar Room', 
    type: 'classroom', 
    status: 'available', 
    location: 'MAIN BLOCK, LEVEL 2',
    capacity: 40,
    description: 'Medium-sized collaborative seminar space with integrated AV systems.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c'
  },
  { 
    id: 'c14', 
    name: 'Hybrid Teaching Studio', 
    type: 'classroom', 
    status: 'available', 
    location: 'ACADEMIC WING, LEVEL 2',
    capacity: 30,
    description: 'Optimized for simultaneous on-site and remote pedagogy.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655'
  },
  { 
    id: 'l2', 
    name: 'IoT Prototyping Lab', 
    type: 'lab', 
    status: 'occupied', 
    location: 'CYBER-WING, FLOOR 1',
    capacity: 20,
    description: 'Rapid prototyping space equipped with sensor arrays, edge devices and soldering stations.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475' 
  }
];

const NEXUS: React.FC<NEXUSProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);
  const [bookingResource, setBookingResource] = useState<Resource | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'live-map' | 'audit' | 'guide' | 'repository'>('matrix');
  const [filterType, setFilterType] = useState<'ALL' | 'LABS' | 'ROOMS' | 'EQUIPMENT' | 'PARKING'>('ALL');
  const [eventLogs, setEventLogs] = useState<{timestamp: string, msg: string, type: 'info'|'warning'|'error'|'success'}[]>([]);

  const addLog = (msg: string, type: 'info'|'warning'|'error'|'success' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLogs(prev => [{ timestamp, msg, type }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    addLog(`User Session Established: ${user.name} (${user.role})`, "success");
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filterType === 'ALL' || 
        (filterType === 'LABS' && res.type === 'lab') ||
        (filterType === 'ROOMS' && res.type === 'classroom') ||
        (filterType === 'EQUIPMENT' && res.type === 'equipment') ||
        (filterType === 'PARKING' && res.type === 'parking');
      return matchesSearch && matchesFilter;
    });
  }, [resources, filterType, searchTerm]);

  const handleBookingComplete = (newBooking: any) => {
    addLog(`Reservation finalized for ${newBooking.resourceName}`, "success");
    setBookingResource(null);
    setSelectedDetail(null);
  };

  const updateResourceStatus = (id: string, newStatus: Resource['status']) => {
    setResources(prev => prev.map(res => res.id === id ? { ...res, status: newStatus } : res));
    addLog(`Manual Status Override: Node ${id} -> ${newStatus.toUpperCase()}`, "warning");
  };

  const isListView = activeTab === 'matrix' && !selectedDetail;

  return (
    <div className={`min-h-screen flex overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#050507] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen} 
        user={user} 
        onLogout={onLogout} 
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedDetail(null);
        }}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className={`px-8 py-4 flex items-center justify-between border-b transition-colors duration-500 z-40 ${isDarkMode ? 'border-white/5 bg-[#0a0a0f]/40 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'}`}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className={`mr-2 p-2 rounded-xl border transition-all group ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30' : 'bg-slate-100 border-slate-200 hover:bg-blue-50 hover:border-blue-300'}`}
                >
                  <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <svg width="28" height="28" viewBox="0 0 100 100" className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M50 10 L50 50 M85 30 L50 50 M15 30 L50 50" stroke="currentColor" strokeWidth="4" />
                <rect x="42" y="42" width="16" height="16" fill="currentColor" fillOpacity="0.8" />
              </svg>
              <h1 className="text-xl font-black tracking-widest uppercase">NEXUS</h1>
            </div>
            <div className={`h-4 w-[1px] hidden sm:block ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
            <div className={`text-[10px] mono uppercase tracking-[0.2em] hidden sm:block ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
              NEXUS - SMART RESOURCE AND SPACE MANAGEMENT SYSTEM
              <div className="text-[8px] opacity-60">ACCESS LEVEL: <span className={user.role === 'admin' ? 'text-lime-400' : 'text-blue-600'}>{user.role.toUpperCase()}</span></div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-center group ${
                isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-indigo-600'
              }`}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2 hidden lg:flex">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className={`text-[9px] mono font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>SYSTEMS: OPERATIONAL</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isListView && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-700 p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tight uppercase">EXPLORER</h2>
                  <p className="text-xs mono text-blue-500 font-bold uppercase tracking-[0.2em] mt-1">FACILITY NETWORK NODES</p>
                </div>
                
                <div className="relative w-full md:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-4 w-4 ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search nodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-xs mono focus:outline-none transition-all ${
                      isDarkMode 
                      ? 'bg-white/[0.03] border border-white/10 focus:border-blue-500/50 placeholder:text-white/10' 
                      : 'bg-white border border-slate-200 focus:border-blue-400 placeholder:text-slate-300 shadow-sm'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-10 overflow-x-auto pb-2 custom-scrollbar">
                {(['ALL', 'LABS', 'ROOMS', 'EQUIPMENT', 'PARKING'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterType(tab as any)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                      filterType === tab 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : isDarkMode 
                        ? 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {filteredResources.map(res => (
                  <ResourceCard 
                    key={res.id} 
                    resource={res} 
                    isDarkMode={isDarkMode} 
                    isAdmin={user.role === 'admin'}
                    onStatusChange={(status) => updateResourceStatus(res.id, status)}
                    onReport={(r) => setReportingResource(r)} 
                    onBook={(r) => setBookingResource(r)}
                    onDetail={(r) => setSelectedDetail(r)}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedDetail && (
            <ResourceDetail 
              resource={selectedDetail} 
              isDarkMode={isDarkMode} 
              onBack={() => setSelectedDetail(null)}
              onBookingComplete={handleBookingComplete}
              onReport={(r) => setReportingResource(r)}
            />
          )}

          {activeTab === 'live-map' && (
            <div className="w-full h-full relative">
              <Map resources={resources} isDarkMode={isDarkMode} searchTerm={searchTerm} onNodeClick={() => {}} selectedId={null} />
            </div>
          )}
          
          {activeTab === 'audit' && user.role === 'admin' && (
            <UsageAudit isDarkMode={isDarkMode} resources={resources} onStatusChange={updateResourceStatus} />
          )}

          {activeTab === 'guide' && <SystemGuide isDarkMode={isDarkMode} />}
          
          {activeTab === 'repository' && <Repository isDarkMode={isDarkMode} />}
        </div>

        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] mono tracking-widest text-center px-4 w-full z-40 pointer-events-none ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-black text-[7px] animate-pulse"># HIGH DEMAND</span>
          </div>
          THIS APP WAS DEVELOPED BY ANOTHER USER. IT MAY BE INACCURATE OR UNSAFE. <button className="pointer-events-auto hover:text-blue-500 underline decoration-current/10">REPORT LEGAL ISSUE</button>
        </div>

        <ReportIssueModal isOpen={!!reportingResource} onClose={() => setReportingResource(null)} resource={reportingResource} isDarkMode={isDarkMode} />
        <BookingModal 
          isOpen={!!bookingResource} onClose={() => setBookingResource(null)} resource={bookingResource} resources={resources}
          isDarkMode={isDarkMode} onComplete={handleBookingComplete} onLog={addLog}
        />
      </main>
    </div>
  );
};

export default NEXUS;
