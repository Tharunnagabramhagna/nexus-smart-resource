import React, { useEffect, useMemo, useState } from 'react';
import Auth from './components/Auth';
import SystemGuide from './components/SystemGuide';
import UsageAudit from './components/UsageAudit';
import { Resource, User } from './types';

type ViewKey = 'explore' | 'map' | 'reservations' | 'conflicts' | 'admin' | 'guide';
type CategoryKey = 'all' | 'lab' | 'room' | 'equipment' | 'parking';
type StatusKey = 'available' | 'occupied' | 'maintenance';

type ApiResource = {
  id: string;
  name: string;
  category: 'lab' | 'room' | 'equipment' | 'parking';
  status: StatusKey;
  capacity: number;
  location: string;
  zone: string;
  maxLoad: number;
  environment: string;
  tag?: Resource['tag'];
  description?: string;
  assets?: string[];
  specification?: string;
  preview?: string;
};

type Booking = {
  id: string;
  resourceId: string;
  resourceName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
};

type DashboardData = {
  stats: Array<{ label: string; value: string }>;
  utilization: Array<{ category: string; percent: number }>;
  impact: { baseline: string; optimized: string; gain: string };
  anomalies: Array<{ id: string; name: string; signal: string }>;
  activityLog: Array<{ id: string; resourceName: string; timestamp: string; message: string }>;
  nodeCounts: Record<StatusKey, number>;
};

type GuideData = {
  directive: string;
  architecture: Array<{ id: string; title: string; description: string }>;
  roadmap: Array<{ label: string; detail: string }>;
  impact: Array<{ metric: string; before: string; after: string; delta: string }>;
};

type MapNode = {
  id: string;
  name: string;
  category: 'lab' | 'room' | 'equipment' | 'parking';
  status: StatusKey;
  x: number;
  y: number;
  width: number;
  height: number;
};

type BootstrapData = {
  resources: ApiResource[];
  bookings: Booking[];
  issues: Array<{ id: string; resourceId: string; summary: string }>;
  dashboard: DashboardData;
  guide: GuideData;
  liveMap: MapNode[];
  serverTime: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const defaultBookingForm = { date: '2026-06-18', startTime: '09:00', endTime: '11:00' };

const previewImages: Record<string, string[]> = {
  network: [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1000&q=80',
  ],
  lecture: [
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
  ],
  seminar: [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517503735044-6f4c0f3b1f4d?auto=format&fit=crop&w=1000&q=80',
  ],
  equipment: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1000&q=80',
  ],
  lab: [
    'https://images.unsplash.com/photo-1581092921461-eab10380fdc5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
  ],
  studio: [
    'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
  ],
};

const mapCategoryToType = (category: ApiResource['category']): Resource['type'] =>
  category === 'room' ? 'classroom' : category;

function toUiResource(resource: ApiResource): Resource {
  return {
    id: resource.id,
    name: resource.name,
    type: mapCategoryToType(resource.category),
    category: resource.category,
    status: resource.status,
    imageUrl: (previewImages[resource.preview || 'lab'] || previewImages.lab)[0],
    capacity: resource.capacity,
    location: resource.location,
    zone: resource.zone,
    maxLoad: resource.maxLoad,
    environment: resource.environment,
    description: resource.description,
    assets: resource.assets || [],
    equipment: (resource.assets || []).map((asset, index) => ({
      id: `${resource.id}-${index}`,
      name: asset,
      status: 'functional',
    })),
    specification: resource.specification,
    preview: resource.preview || 'lab',
    recommendationTag: resource.tag,
    tag: resource.tag,
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewKey>('explore');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');
  const [mapCategory, setMapCategory] = useState<CategoryKey>('all');
  const [zoom, setZoom] = useState(1);
  const [bookingForm, setBookingForm] = useState(defaultBookingForm);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [recommendation, setRecommendation] = useState<{ title: string; action: string } | null>(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationSeed, setReservationSeed] = useState(defaultBookingForm);

  const buildBootstrapFromFallback = (store: any): BootstrapData => {
    const resources = Array.isArray(store?.resources) ? store.resources : [];
    const bookings = Array.isArray(store?.bookings) ? store.bookings.slice().reverse() : [];
    const issues = Array.isArray(store?.issues) ? store.issues.slice().reverse() : [];
    const activityLog = Array.isArray(store?.activityLog) ? store.activityLog.slice().reverse() : [];

    const statusCounts: Record<StatusKey, number> = {
      available: 0,
      occupied: 0,
      maintenance: 0,
    };

    const utilizationSeed: Record<string, { total: number; occupied: number }> = {};
    for (const resource of resources) {
      const status = resource.status as StatusKey;
      if (statusCounts[status] !== undefined) statusCounts[status] += 1;

      const categoryKey = String(resource.category || 'unknown').toUpperCase();
      utilizationSeed[categoryKey] = utilizationSeed[categoryKey] || { total: 0, occupied: 0 };
      utilizationSeed[categoryKey].total += 1;
      if (status === 'occupied') utilizationSeed[categoryKey].occupied += 1;
    }

    const utilization = Object.entries(utilizationSeed).map(([category, info]) => ({
      category,
      percent: info.total ? Math.round((info.occupied / info.total) * 100) : 0,
    }));

    const anomalies = issues.slice(0, 4).map((issue: any) => ({
      id: issue.id || cryptoRandomId(),
      name: issue.resourceName || resources.find((r: any) => r.id === issue.resourceId)?.name || 'RESOURCE',
      signal: String(issue.summary || 'INCIDENT').toUpperCase().slice(0, 42),
    }));

    const dashboard: DashboardData = {
      stats: [
        { label: 'ACTIVE NODES', value: String(resources.length) },
        { label: 'CONFIRMED LOADS', value: String(bookings.filter((b: any) => b.status === 'confirmed').length) },
        { label: 'OPEN INCIDENTS', value: String(issues.filter((i: any) => !i.resolved).length) },
        { label: 'SYSTEM HEALTH', value: '99.9%' },
      ],
      utilization,
      impact: { baseline: '2.3', optimized: '3.0', gain: '+28.2%' },
      anomalies,
      activityLog: activityLog.slice(0, 6).map((log: any) => ({
        id: log.id || cryptoRandomId(),
        resourceName: log.resourceName || 'SYSTEM',
        timestamp: log.timestamp || new Date().toISOString(),
        message: log.message || 'SYNC',
      })),
      nodeCounts: statusCounts,
    };

    const guide: GuideData = {
      directive:
        'Demo mode: Backend is unavailable. The UI is running with a local snapshot so you can preview Explorer, Map, Admin widgets, and the booking conflict flow.',
      architecture: [
        { id: 'frontend', title: 'FRONTEND', description: 'Static UI shell with glassmorphism + neon HUD components.' },
        { id: 'backend', title: 'BACKEND', description: 'API layer that powers bookings, metrics, and conflict detection.' },
        { id: 'scheduler', title: 'SCHEDULER', description: 'Atomic booking validation preventing overlaps.' },
        { id: 'telemetry', title: 'TELEMETRY', description: 'Resource status + anomaly tracking across campus zones.' },
      ],
      roadmap: [
        { label: 'AUTH', detail: 'Sync institutional identity via /api/auth/login.' },
        { label: 'BOOKINGS', detail: 'POST /api/bookings validates collisions and issues recommendations.' },
        { label: 'METRICS', detail: 'GET /api/dashboard streams utilization + impact analytics.' },
      ],
      impact: [
        { metric: 'CONFIRMATION TIME', before: '4.2m', after: '1.7m', delta: '+59%' },
        { metric: 'UTILIZATION', before: '63%', after: '81%', delta: '+28%' },
        { metric: 'COLLISIONS', before: 'High', after: 'Blocked', delta: '-100%' },
      ],
    };

    const liveMap: MapNode[] = resources.slice(0, 10).map((resource: any, index: number) => ({
      id: String(resource.id),
      name: String(resource.name).slice(0, 18),
      category: resource.category,
      status: resource.status,
      x: 8 + (index % 5) * 18,
      y: 12 + Math.floor(index / 5) * 26,
      width: 16,
      height: 10,
    }));

    return {
      resources,
      bookings,
      issues,
      dashboard,
      guide,
      liveMap,
      serverTime: new Date().toISOString(),
    };
  };

  const cryptoRandomId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const loadBootstrap = async () => {
    try {
      const response = await fetch(`${API_BASE}/bootstrap`);
      if (!response.ok) {
        throw new Error('Unable to fetch NEXUS operational state.');
      }
      const data = (await response.json()) as BootstrapData;
      setBootstrap(data);
      setOfflineMode(false);
    } catch (error) {
      try {
        const fallbackResponse = await fetch(`${import.meta.env.BASE_URL}fallback-store.json`, {
          cache: 'no-store',
        });
        if (fallbackResponse.ok) {
          const store = await fallbackResponse.json();
          setBootstrap(buildBootstrapFromFallback(store));
          setOfflineMode(true);
        } else {
          throw new Error('Fallback snapshot missing.');
        }
      } catch {
        setMessage({
          kind: 'error',
          text: error instanceof Error ? error.message : 'Unable to load the app.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = window.localStorage.getItem('nexus-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser) as User);
    }
    loadBootstrap();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 4200);
    return () => window.clearTimeout(timer);
  }, [message]);

  const resources = useMemo(
    () => (bootstrap?.resources || []).map(resource => toUiResource(resource)),
    [bootstrap]
  );

  const selectedResource = useMemo(
    () => resources.find(resource => resource.id === selectedId) || null,
    [resources, selectedId]
  );

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const categoryMatch =
        category === 'all' ||
        resource.category === category ||
        (category === 'room' && resource.type === 'classroom');
      const searchMatch =
        !search ||
        resource.name.toLowerCase().includes(search.toLowerCase()) ||
        (resource.location || '').toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [category, resources, search]);

  const filteredMapNodes = useMemo(() => {
    return (bootstrap?.liveMap || []).filter(
      node => mapCategory === 'all' || node.category === mapCategory
    );
  }, [bootstrap, mapCategory]);

  const handleLogin = (nextUser: User) => {
    setUser(nextUser);
    window.localStorage.setItem('nexus-user', JSON.stringify(nextUser));
    setMessage({ kind: 'success', text: 'Identity synced successfully.' });
  };

  const handleStatusChange = async (id: string, newStatus: Resource['status']) => {
    setBusy(`status-${id}-${newStatus}`);
    try {
      const response = await fetch(`${API_BASE}/resources/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to update resource status.');
      }
      await loadBootstrap();
      setMessage({ kind: 'success', text: `${payload.resource.name} updated to ${newStatus}.` });
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Status update failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(60,78,255,0.16),_transparent_30%),radial-gradient(circle_at_right,_rgba(0,204,255,0.06),_transparent_18%)]" />
      <div className="relative min-h-screen p-4 md:p-6">
        <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] rounded-[28px] border border-white/10 bg-[#060814]/95 shadow-2xl backdrop-blur-xl flex overflow-hidden">
          <Sidebar
            user={user}
            current={view}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={() => {
              window.localStorage.removeItem('nexus-user');
              setUser(null);
              setView('explore');
            }}
            onSelect={nextView => {
              setSelectedId(null);
              setView(nextView);
              setSidebarOpen(false);
            }}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <HeaderBar
              view={view}
              serverTime={bootstrap?.serverTime}
              onRefresh={loadBootstrap}
              onMenu={() => setSidebarOpen(true)}
            />

            <div className="flex-1 overflow-y-auto pr-2">
              {loading && !bootstrap ? (
                <div className="h-full grid place-items-center text-white/40 text-sm tracking-widest uppercase">
                  Syncing Nexus Grid...
                </div>
              ) : null}

              {!loading && bootstrap ? (
                <>
                  {view === 'explore' && (
                    <ExplorerScreen
                      resources={filteredResources}
                      selectedResource={selectedResource}
                      bookings={bootstrap.bookings}
                      recommendation={recommendation}
                      search={search}
                      category={category}
                      bookingForm={bookingForm}
                      onSearchChange={setSearch}
                      onCategoryChange={setCategory}
                      onSelectResource={id => {
                        setSelectedId(id);
                        setRecommendation(null);
                      }}
                      onBack={() => {
                        setSelectedId(null);
                        setRecommendation(null);
                      }}
                      onBookingFormChange={setBookingForm}
                      onOpenReservation={() => {
                        setReservationSeed(bookingForm);
                        setReservationOpen(true);
                      }}
                    />
                  )}
                  {view === 'map' && (
                    <MapScreen
                      nodes={filteredMapNodes}
                      category={mapCategory}
                      zoom={zoom}
                      onCategoryChange={setMapCategory}
                      onZoomChange={setZoom}
                    />
                  )}
                  {view === 'admin' && (
                    <div className="px-4 pb-10 md:px-8">
                      <UsageAudit
                        isDarkMode
                        resources={resources}
                        dashboard={bootstrap.dashboard}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  )}
                  {view === 'guide' && (
                    <div className="px-4 pb-10 md:px-8">
                      <SystemGuide isDarkMode guide={bootstrap.guide} />
                    </div>
                  )}
                  {view === 'reservations' && (
                    <ReservationsScreen
                      bookings={bootstrap.bookings}
                      user={user}
                      onBrowse={() => setView('explore')}
                    />
                  )}
                  {view === 'conflicts' && (
                    <ConflictResolutionScreen
                      resources={resources}
                      bookings={bootstrap.bookings}
                      issues={bootstrap.issues}
                      onJumpToResource={resourceId => {
                        setView('explore');
                        setSelectedId(resourceId);
                      }}
                    />
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {message ? (
        <div
          className={`fixed right-6 bottom-6 z-50 rounded-2xl border px-5 py-4 text-sm backdrop-blur-xl ${
            message.kind === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <ReservationFlowModal
        open={reservationOpen}
        seed={reservationSeed}
        user={user}
        resource={selectedResource}
        resources={resources}
        bookings={bootstrap?.bookings || []}
        onClose={() => setReservationOpen(false)}
        onConfirm={async payload => {
          setBusy('booking');
          setRecommendation(null);
          try {
            const response = await fetch(`${API_BASE}/bookings`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const body = await response.json();
            if (!response.ok) {
              setRecommendation(body.recommendation || null);
              throw new Error(body.message || 'Booking failed.');
            }
            await loadBootstrap();
            setSelectedId(body.booking?.resourceId || payload.resourceId);
            setRecommendation(body.recommendation || null);
            setMessage({
              kind: 'success',
              text: `Booking confirmed for ${body.booking?.date || payload.date} ${body.booking?.startTime || payload.startTime}-${body.booking?.endTime || payload.endTime}.`,
            });
            return { ok: true as const };
          } catch (error) {
            setMessage({
              kind: 'error',
              text: error instanceof Error ? error.message : 'Booking failed.',
            });
            return { ok: false as const, message: error instanceof Error ? error.message : 'Booking failed.' };
          } finally {
            setBusy(null);
          }
        }}
        busy={busy === 'booking'}
      />
    </div>
  );
}

function Sidebar({
  user,
  current,
  open,
  onClose,
  onLogout,
  onSelect,
}: {
  user: User;
  current: ViewKey;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSelect: (view: ViewKey) => void;
}) {
  const items: Array<{ key: ViewKey; label: string; icon: string }> = [
    { key: 'explore', label: 'EXPLORE RESOURCES', icon: '⬡' },
    { key: 'map', label: 'LIVE MAP', icon: '⌘' },
    { key: 'reservations', label: 'RESERVATIONS', icon: '⧗' },
    { key: 'conflicts', label: 'CONFLICT CENTER', icon: '⊗' },
    { key: 'admin', label: 'ADMIN DASHBOARD', icon: '▦' },
    { key: 'guide', label: 'SYSTEM GUIDE', icon: 'ⓘ' },
  ];

  const content = (
    <aside className="w-72 border-r border-white/10 bg-[linear-gradient(180deg,#071029,#050914)] flex flex-col px-5 py-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl border border-blue-500/30 bg-blue-600/10 grid place-items-center text-blue-300 text-xl shadow-[0_0_22px_rgba(59,130,246,0.22)]">
          ⌬
        </div>
        <div>
          <div className="font-black tracking-[0.22em] text-lg leading-none">NEXUS</div>
          <div className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
            Smart Campus OS
          </div>
        </div>
      </div>

      <div className="mt-7 text-[10px] font-black uppercase tracking-[0.28em] text-white/35 px-2">
        Navigation
      </div>

      <nav className="mt-4 space-y-2">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left text-[12px] font-black tracking-[0.14em] transition-all ${
              current === item.key
                ? 'bg-blue-600 text-white shadow-[0_0_26px_rgba(59,130,246,0.35)]'
                : 'bg-white/[0.02] text-white/80 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-lime-300 text-black font-black grid place-items-center">
          {(user.name || user.email || 'N').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black tracking-[0.18em] uppercase truncate">
                {user.role === 'admin' ? 'ADMIN' : user.name}
              </div>
              <div className="text-[10px] text-white/40 truncate">{user.email}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/70 hover:bg-white/[0.06] hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex">{content}</div>
      {open ? (
        <div className="md:hidden fixed inset-0 z-[80]">
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 shadow-2xl">{content}</div>
        </div>
      ) : null}
    </>
  );
}

function HeaderBar({
  view,
  serverTime,
  onRefresh,
  onMenu,
}: {
  view: ViewKey;
  serverTime?: string;
  onRefresh: () => void;
  onMenu: () => void;
}) {
  const viewTitle: Record<ViewKey, string> = {
    explore: 'EXPLORER',
    map: 'LIVE CAMPUS MAP',
    reservations: 'RESERVATIONS',
    conflicts: 'CONFLICT RESOLUTION',
    admin: 'Command Center',
    guide: 'NEXUS SYSTEM GUIDE',
  };

  return (
    <div className="px-6 md:px-8 pt-6 pb-4 border-b border-white/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-400">
            NEXUS - SMART RESOURCE AND SPACE MANAGEMENT SYSTEM
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-black uppercase tracking-tight">
            {viewTitle[view]}
          </h1>
          <div className="text-[10px] mt-2 uppercase tracking-[0.28em] text-white/35">
            Architecting the future of campus intelligence
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="md:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_10px_#10b981]" />
            SYSTEMS: OPERATIONAL
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            LATENCY: {serverTime ? `${new Date(serverTime).getSeconds() + 120}MS` : '128MS'}
          </div>
          <button
            onClick={onRefresh}
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
          >
            ↻
          </button>
        </div>
      </div>
    </div>
  );
}

function ExplorerScreen({
  resources,
  selectedResource,
  bookings,
  recommendation,
  search,
  category,
  bookingForm,
  onSearchChange,
  onCategoryChange,
  onSelectResource,
  onBack,
  onBookingFormChange,
  onOpenReservation,
}: {
  resources: Resource[];
  selectedResource: Resource | null;
  bookings: Booking[];
  recommendation: { title: string; action: string } | null;
  search: string;
  category: CategoryKey;
  bookingForm: { date: string; startTime: string; endTime: string };
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CategoryKey) => void;
  onSelectResource: (id: string | null) => void;
  onBack: () => void;
  onBookingFormChange: React.Dispatch<
    React.SetStateAction<{ date: string; startTime: string; endTime: string }>
  >;
  onOpenReservation: () => void;
}) {
  const filters: Array<{ key: CategoryKey; label: string }> = [
    { key: 'all', label: 'ALL' },
    { key: 'lab', label: 'LABS' },
    { key: 'room', label: 'ROOMS' },
    { key: 'equipment', label: 'EQUIPMENT' },
    { key: 'parking', label: 'PARKING SPACES' },
  ];

  if (selectedResource) {
    const gallery = previewImages[selectedResource.preview || 'lab'] || previewImages.lab;
    const recentBookings = bookings.filter(item => item.resourceId === selectedResource.id).slice(0, 3);

    return (
      <div className="px-4 md:px-8 pb-12">
        <button
          onClick={onBack}
          className="mt-6 mb-6 text-blue-400 text-xs font-black tracking-[0.25em] uppercase"
        >
          &lt; Browse / {selectedResource.name}
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-[#0a0a16]/70 p-8">
              {selectedResource.recommendationTag ? (
                <div className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-5">
                  {selectedResource.recommendationTag}
                </div>
              ) : null}

              <h2 className="text-5xl font-black leading-none mb-4">{selectedResource.name}</h2>
              <div className="space-y-2 text-sm text-white/70 mb-8">
                <div>{selectedResource.location}</div>
                <div>{selectedResource.environment}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <MetricCard label="CAPACITY" value={`${selectedResource.capacity} SEATS`} />
                <MetricCard
                  label="ENVIRONMENT"
                  value={selectedResource.environment || selectedResource.type.toUpperCase()}
                />
              </div>

              <div className="mb-8">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400 mb-4">
                  KEY TECHNICAL ASSETS
                </div>
                <div className="space-y-3">
                  {(selectedResource.assets || []).map(asset => (
                    <div
                      key={asset}
                      className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-300"
                    >
                      {asset}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35 mb-4">
                  SPECIFICATIONS
                </div>
                <p className="text-sm text-white/70 leading-7">{selectedResource.specification}</p>
                <p className="text-sm text-white/45 leading-7 mt-4">{selectedResource.description}</p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-[#0a0a16]/70 p-5 h-[390px] overflow-hidden">
              <PreviewCanvas kind={selectedResource.preview || 'lab'} large />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35 mb-4">
                PERSPECTIVE GALLERY
              </div>
              <div className="grid grid-cols-3 gap-4">
                {gallery.map(image => (
                  <div
                    key={image}
                    className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]"
                  >
                    <img src={image} alt={selectedResource.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            {recentBookings.length > 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-[#0a0a16]/70 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35 mb-4">
                  RECENT BOOKINGS
                </div>
                <div className="space-y-3">
                  {recentBookings.map(booking => (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 flex justify-between text-sm"
                    >
                      <span>{booking.date}</span>
                      <span className="text-white/60">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="xl:col-span-3">
            <div className="rounded-[32px] border border-white/10 bg-[#0a0a16]/85 p-8 sticky top-6">
              <h3 className="text-4xl font-black mb-3">Reserve</h3>
              <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 mb-8">
                UNIT READY
              </div>

              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                Deployment Date
              </label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={event =>
                  onBookingFormChange(current => ({ ...current, date: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm mb-6"
              />

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                    Start
                  </label>
                  <input
                    type="time"
                    value={bookingForm.startTime}
                    onChange={event =>
                      onBookingFormChange(current => ({ ...current, startTime: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                    Finish
                  </label>
                  <input
                    type="time"
                    value={bookingForm.endTime}
                    onChange={event =>
                      onBookingFormChange(current => ({ ...current, endTime: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={onOpenReservation}
                className="w-full rounded-2xl bg-blue-600 py-5 text-xs font-black uppercase tracking-[0.32em] shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 disabled:opacity-60"
              >
                EXECUTE BOOKING
              </button>

              {recommendation ? (
                <div className="mt-6 rounded-[24px] border border-cyan-400/20 bg-cyan-400/8 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                    AI Recommendation
                  </div>
                  <div className="mt-3 text-lg font-black text-white">{recommendation.title}</div>
                  <p className="mt-3 text-sm leading-6 text-white/65">{recommendation.action}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="mt-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => onCategoryChange(filter.key)}
              className={`rounded-full px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] border transition-all ${
                category === filter.key
                  ? 'border-blue-400/40 bg-blue-600 text-white shadow-[0_0_24px_rgba(59,130,246,0.35)]'
                  : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.07]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search nodes..."
          className="w-full md:w-[320px] rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <article
            key={resource.id}
            className="rounded-[32px] border border-white/10 bg-[#0a0a16]/72 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="relative rounded-[24px] overflow-hidden border border-white/10 h-[260px] bg-[#060b18]">
              <PreviewCanvas kind={resource.preview || 'lab'} />
              <div
                className={`absolute top-4 right-4 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${
                  resource.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : resource.status === 'occupied'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {resource.status}
              </div>
              <div className="absolute left-4 top-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/65">
                {resource.environment}
              </div>
              <div className="absolute left-4 bottom-4 right-4">
                <h3 className="text-3xl font-black leading-none drop-shadow-lg">{resource.name}</h3>
                <div className="mt-3 flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  <span>{resource.location}</span>
                  <span>{resource.capacity} MAX</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-white/60 leading-6 min-h-[72px]">{resource.description}</p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => onSelectResource(resource.id)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] hover:bg-white/[0.08]"
              >
                Detail
              </button>
              <button
                onClick={() => onSelectResource(resource.id)}
                className="flex-1 rounded-2xl bg-blue-600 px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] hover:bg-blue-500"
              >
                Reserve Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MapScreen({
  nodes,
  category,
  zoom,
  onCategoryChange,
  onZoomChange,
}: {
  nodes: MapNode[];
  category: CategoryKey;
  zoom: number;
  onCategoryChange: (value: CategoryKey) => void;
  onZoomChange: (value: number) => void;
}) {
  const filters: Array<{ key: CategoryKey; label: string }> = [
    { key: 'all', label: 'ALL' },
    { key: 'lab', label: 'LABS' },
    { key: 'room', label: 'ROOMS' },
  ];

  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="mt-6 rounded-[36px] border border-white/10 bg-[#091120]/80 p-6 min-h-[700px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative z-10 flex justify-end mb-6">
          <div className="space-y-2">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
              NODE PROTOCOL
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
              FUNCTIONAL
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
              OCCUPIED
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
              OFFLINE
            </div>
          </div>
        </div>

        <div className="relative z-10 h-[520px] origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute rounded-2xl border px-3 py-2 backdrop-blur-md ${
                node.status === 'available'
                  ? 'border-cyan-400/20 bg-cyan-400/10'
                  : node.status === 'occupied'
                  ? 'border-rose-400/20 bg-rose-400/10'
                  : 'border-amber-400/20 bg-amber-400/10'
              }`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.width}%`,
                minHeight: `${node.height * 5}px`,
              }}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                {node.name}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute left-6 bottom-24 z-10 flex flex-col gap-3">
          <button
            onClick={() => onZoomChange(Math.min(1.35, zoom + 0.1))}
            className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.06] text-lg"
          >
            +
          </button>
          <button
            onClick={() => onZoomChange(Math.max(0.85, zoom - 0.1))}
            className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.06] text-lg"
          >
            −
          </button>
          <button
            onClick={() => onZoomChange(1)}
            className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.06] text-lg"
          >
            ⤢
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-full border border-white/10 bg-[#121834] px-4 py-3 flex gap-3">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => onCategoryChange(filter.key)}
              className={`rounded-full px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] ${
                category === filter.key ? 'bg-blue-600' : 'bg-white/[0.04] text-white/70'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReservationsScreen({
  bookings,
  user,
  onBrowse,
}: {
  bookings: Booking[];
  user: User;
  onBrowse: () => void;
}) {
  const mine = bookings.filter(item => item.userEmail === user.email);
  const total = bookings.length;
  const confirmed = bookings.filter(item => item.status === 'confirmed').length;

  return (
    <div className="px-4 md:px-8 pb-12">
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-[32px] border border-white/10 bg-[#0a0a16]/70 p-7">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">
            Booking ledger
          </div>
          <h2 className="mt-3 text-5xl font-black leading-none">History</h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Confirmed leases and recent deployment activity. Entries stream from the Nexus backend.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                Total
              </div>
              <div className="mt-3 text-3xl font-black text-white">{total}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                Mine
              </div>
              <div className="mt-3 text-3xl font-black text-blue-200">{mine.length}</div>
            </div>
            <div className="rounded-[22px] border border-emerald-400/18 bg-emerald-400/8 p-5 col-span-2">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/80">
                Confirmed
              </div>
              <div className="mt-3 text-3xl font-black text-emerald-300">{confirmed}</div>
            </div>
          </div>

          <button
            onClick={onBrowse}
            className="mt-8 w-full rounded-2xl bg-blue-600 py-4 text-[11px] font-black uppercase tracking-[0.28em] hover:bg-blue-500"
          >
            Browse resources
          </button>
        </div>

        <div className="lg:col-span-8 rounded-[32px] border border-white/10 bg-[#0a0a16]/70 p-7 overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                Live booking stream
              </div>
              <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-white">
                Confirmations
              </h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
              Sync: {new Date().toISOString().slice(11, 19)}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">
                <span>Resource</span>
                <span>Date</span>
                <span>Start</span>
                <span>End</span>
                <span>Status</span>
              </div>

              {bookings.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-white/45">
                  No bookings detected yet. Execute a reservation to populate the ledger.
                </div>
              ) : (
                bookings.slice(0, 18).map(item => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-3 items-center border-b border-white/5 bg-white/[0.01] px-5 py-5 text-sm last:border-b-0"
                  >
                    <div>
                      <div className="font-black uppercase tracking-[0.12em] text-white">
                        {item.resourceName}
                      </div>
                      <div className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                        {item.userEmail === user.email ? 'Your node' : item.userEmail}
                      </div>
                    </div>
                    <span className="text-white/70">{item.date}</span>
                    <span className="text-white/70">{item.startTime}</span>
                    <span className="text-white/70">{item.endTime}</span>
                    <span
                      className={`inline-flex w-fit rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
                        item.status === 'confirmed'
                          ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                          : 'border-white/10 bg-white/[0.03] text-white/60'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConflictResolutionScreen({
  resources,
  bookings,
  issues,
  onJumpToResource,
}: {
  resources: Resource[];
  bookings: Booking[];
  issues: Array<{ id: string; resourceId: string; summary: string; resourceName?: string; severity?: string; createdAt?: string; resolved?: boolean }>;
  onJumpToResource: (resourceId: string) => void;
}) {
  const [resourceId, setResourceId] = useState(resources[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    const a0 = toMinutes(aStart);
    const a1 = toMinutes(aEnd);
    const b0 = toMinutes(bStart);
    const b1 = toMinutes(bEnd);
    return a0 < b1 && b0 < a1;
  };

  const selected = resources.find(item => item.id === resourceId) || null;
  const conflict = bookings.find(
    booking =>
      booking.resourceId === resourceId &&
      booking.date === date &&
      booking.status === 'confirmed' &&
      overlaps(booking.startTime, booking.endTime, startTime, endTime)
  );

  const viableAlternatives = useMemo(() => {
    if (!selected) return [];
    return resources
      .filter(item => item.id !== selected.id)
      .filter(item => item.category === selected.category)
      .filter(item => item.status === 'available')
      .filter(item => item.capacity >= selected.capacity)
      .filter(item => {
        const hit = bookings.find(
          booking =>
            booking.resourceId === item.id &&
            booking.date === date &&
            booking.status === 'confirmed' &&
            overlaps(booking.startTime, booking.endTime, startTime, endTime)
        );
        return !hit;
      })
      .slice(0, 3);
  }, [bookings, date, endTime, resources, selected, startTime]);

  return (
    <div className="px-4 md:px-8 pb-12">
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[#0a0a16]/70 p-7">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">
              Conflict detection
            </div>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight">Resolution Center</h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Run a collision scan against confirmed bookings and receive an optimized alternative.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0a0a16]/80 p-7">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35 mb-5">
              Collision simulator
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                  Resource node
                </label>
                <select
                  value={resourceId}
                  onChange={event => setResourceId(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                >
                  {resources.map(item => (
                    <option key={item.id} value={item.id} className="bg-[#070a14]">
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={event => setDate(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                    Start
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={event => setStartTime(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                  End
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={event => setEndTime(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                />
              </div>

              {conflict ? (
                <div className="rounded-[26px] border border-rose-400/20 bg-rose-500/10 p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-300">
                    Collision detected
                  </div>
                  <div className="mt-3 text-xl font-black text-white">Overlap identified</div>
                  <div className="mt-3 text-sm text-white/70">
                    Existing booking: {conflict.startTime} → {conflict.endTime} ({conflict.userEmail})
                  </div>
                </div>
              ) : (
                <div className="rounded-[26px] border border-emerald-400/18 bg-emerald-400/10 p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200/80">
                    Conflict check
                  </div>
                  <div className="mt-3 text-xl font-black text-white">Clear</div>
                  <div className="mt-3 text-sm text-white/70">
                    No overlaps detected for the requested window.
                  </div>
                </div>
              )}

              {conflict && viableAlternatives.length > 0 ? (
                <div className="rounded-[28px] border border-cyan-400/18 bg-cyan-500/8 p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                    Suggested alternatives
                  </div>
                  <div className="mt-4 space-y-3">
                    {viableAlternatives.map(item => (
                      <button
                        key={item.id}
                        onClick={() => onJumpToResource(item.id)}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left hover:bg-white/[0.06]"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-black text-white">{item.name}</div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                            Open
                          </span>
                        </div>
                        <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                          Capacity {item.capacity} • {item.location}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="xl:col-span-7 space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[#0a0a16]/70 p-7">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                  Incident queue
                </div>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-white">
                  Active conflicts / issues
                </h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                {issues.length} flagged
              </div>
            </div>

            {issues.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] px-6 py-10 text-center text-sm text-white/45">
                No incidents currently queued.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issues.slice(0, 8).map(issue => (
                  <div
                    key={issue.id}
                    className="rounded-[28px] border border-amber-400/14 bg-amber-400/6 p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200/80">
                        {issue.severity || 'medium'} priority
                      </div>
                      <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.8)]" />
                    </div>
                    <div className="mt-3 text-lg font-black text-white">
                      {issue.resourceName || resources.find(r => r.id === issue.resourceId)?.name || 'Resource'}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/65">{issue.summary}</p>
                    <button
                      onClick={() => onJumpToResource(issue.resourceId)}
                      className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/75 hover:bg-white/[0.06]"
                    >
                      Open node
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type BookingRequestPayload = {
  resourceId: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
};

function ReservationFlowModal({
  open,
  seed,
  user,
  resource,
  resources,
  bookings,
  onClose,
  onConfirm,
  busy,
}: {
  open: boolean;
  seed: { date: string; startTime: string; endTime: string };
  user: User;
  resource: Resource | null;
  resources: Resource[];
  bookings: Booking[];
  onClose: () => void;
  onConfirm: (payload: BookingRequestPayload) => Promise<{ ok: true } | { ok: false; message: string }>;
  busy: boolean;
}) {
  const [step, setStep] = useState<'schedule' | 'checking' | 'conflict' | 'summary' | 'success'>('schedule');
  const [form, setForm] = useState(seed);
  const [activeResourceId, setActiveResourceId] = useState<string>(resource?.id || '');
  const [conflict, setConflict] = useState<Booking | null>(null);
  const [alt, setAlt] = useState<Resource | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep('schedule');
    setForm(seed);
    setActiveResourceId(resource?.id || '');
    setConflict(null);
    setAlt(null);
    setInlineError(null);
  }, [open, resource?.id, seed]);

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    const a0 = toMinutes(aStart);
    const a1 = toMinutes(aEnd);
    const b0 = toMinutes(bStart);
    const b1 = toMinutes(bEnd);
    return a0 < b1 && b0 < a1;
  };

  const activeResource = useMemo(
    () => resources.find(item => item.id === activeResourceId) || null,
    [activeResourceId, resources]
  );

  const runConflictCheck = () => {
    setInlineError(null);
    if (!activeResource) return;
    if (toMinutes(form.startTime) >= toMinutes(form.endTime)) {
      setInlineError('Finish time must be later than start time.');
      return;
    }

    setStep('checking');
    window.setTimeout(() => {
      const hit =
        bookings.find(
          booking =>
            booking.resourceId === activeResource.id &&
            booking.date === form.date &&
            booking.status === 'confirmed' &&
            overlaps(booking.startTime, booking.endTime, form.startTime, form.endTime)
        ) || null;

      setConflict(hit);
      if (hit) {
        const suggestion =
          resources
            .filter(item => item.id !== activeResource.id)
            .filter(item => item.category === activeResource.category)
            .filter(item => item.status === 'available')
            .filter(item => item.capacity >= activeResource.capacity)
            .find(item => {
              const clash = bookings.find(
                booking =>
                  booking.resourceId === item.id &&
                  booking.date === form.date &&
                  booking.status === 'confirmed' &&
                  overlaps(booking.startTime, booking.endTime, form.startTime, form.endTime)
              );
              return !clash;
            }) || null;

        setAlt(suggestion);
        setStep('conflict');
      } else {
        setAlt(null);
        setStep('summary');
      }
    }, 900);
  };

  const confirmBooking = async () => {
    setInlineError(null);
    if (!activeResource) return;
    setStep('checking');
    const result = await onConfirm({
      resourceId: activeResource.id,
      userEmail: user.email,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    });

    if (result.ok) {
      setStep('success');
      window.setTimeout(() => onClose(), 1200);
      return;
    }

    setInlineError(result.message || 'Booking failed.');
    setStep('summary');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[34px] border border-white/10 bg-[#070a18]/90 shadow-2xl overflow-hidden">
        <div className="px-7 py-6 border-b border-white/10 flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">
              Reservation protocol
            </div>
            <div className="mt-3 text-2xl font-black text-white">
              {activeResource?.name || resource?.name || 'Select Resource'}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
              {form.date} • {form.startTime} → {form.endTime}
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            aria-label="Close reservation"
          >
            ✕
          </button>
        </div>

        <div className="px-7 py-7">
          {inlineError ? (
            <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {inlineError}
            </div>
          ) : null}

          {step === 'schedule' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                  Resource node
                </label>
                <select
                  value={activeResourceId}
                  onChange={event => setActiveResourceId(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                >
                  {resources.map(item => (
                    <option key={item.id} value={item.id} className="bg-[#070a14]">
                      {item.name} ({item.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={event => setForm(current => ({ ...current, date: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                  Start
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={event => setForm(current => ({ ...current, startTime: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
                  End
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={event => setForm(current => ({ ...current, endTime: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-[10px] font-black uppercase tracking-[0.28em] text-white/70 hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  onClick={runConflictCheck}
                  className="flex-1 rounded-2xl bg-blue-600 py-4 text-[10px] font-black uppercase tracking-[0.28em] hover:bg-blue-500"
                >
                  Run conflict check
                </button>
              </div>
            </div>
          ) : null}

          {step === 'checking' ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full border-2 border-blue-400/30 border-t-blue-300 animate-spin" />
              <div className="mt-6 text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                Scanning availability matrix...
              </div>
              {busy ? (
                <div className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-blue-200/80">
                  Locking node
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 'conflict' ? (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-300">
                  Collision detected
                </div>
                <div className="mt-3 text-xl font-black text-white">Reservation blocked</div>
                <div className="mt-3 text-sm text-white/70">
                  Overlap: {conflict?.startTime} → {conflict?.endTime} • {conflict?.userEmail}
                </div>
              </div>

              {alt ? (
                <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-500/8 p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                    AI Recommendation
                  </div>
                  <div className="mt-3 text-xl font-black text-white">{alt.name}</div>
                  <div className="mt-2 text-sm text-white/65">
                    Available for the same window • Capacity {alt.capacity}
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => {
                        setActiveResourceId(alt.id);
                        setStep('summary');
                        setConflict(null);
                      }}
                      className="flex-1 rounded-2xl bg-blue-600 py-4 text-[10px] font-black uppercase tracking-[0.28em] hover:bg-blue-500"
                    >
                      Switch node
                    </button>
                    <button
                      onClick={() => setStep('schedule')}
                      className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-[10px] font-black uppercase tracking-[0.28em] text-white/70 hover:bg-white/[0.06]"
                    >
                      Edit request
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                    No alternatives found
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setStep('schedule')}
                      className="flex-1 rounded-2xl bg-blue-600 py-4 text-[10px] font-black uppercase tracking-[0.28em] hover:bg-blue-500"
                    >
                      Adjust timing
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-[10px] font-black uppercase tracking-[0.28em] text-white/70 hover:bg-white/[0.06]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {step === 'summary' ? (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-emerald-400/18 bg-emerald-400/10 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200/80">
                  Conflict check
                </div>
                <div className="mt-3 text-xl font-black text-white">Passed</div>
                <div className="mt-3 text-sm text-white/70">
                  Node ready for confirmation.
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                  Booking summary
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                      Resource
                    </div>
                    <div className="mt-2 font-black text-white">{activeResource?.name}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                      Operator
                    </div>
                    <div className="mt-2 font-black text-white">{user.email}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                      Window
                    </div>
                    <div className="mt-2 font-black text-white">
                      {form.startTime} → {form.endTime}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                      Date
                    </div>
                    <div className="mt-2 font-black text-white">{form.date}</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep('schedule')}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-[10px] font-black uppercase tracking-[0.28em] text-white/70 hover:bg-white/[0.06]"
                  >
                    Edit
                  </button>
                  <button
                    disabled={busy}
                    onClick={confirmBooking}
                    className="flex-1 rounded-2xl bg-blue-600 py-4 text-[10px] font-black uppercase tracking-[0.28em] hover:bg-blue-500 disabled:opacity-60"
                  >
                    Confirm booking
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {step === 'success' ? (
            <div className="py-14 text-center">
              <div className="mx-auto h-16 w-16 rounded-full border-2 border-emerald-400/40 bg-emerald-400/10 grid place-items-center text-2xl text-emerald-200 shadow-[0_0_30px_rgba(52,211,153,0.25)]">
                ✓
              </div>
              <div className="mt-7 text-2xl font-black uppercase tracking-[0.18em] text-white">
                Lease secured
              </div>
              <div className="mt-3 text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                Closing terminal...
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35 mb-3">
        {label}
      </div>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}

function PreviewCanvas({ kind, large = false }: { kind: string; large?: boolean }) {
  const cubeCount = large ? 18 : 12;
  const palette =
    kind === 'equipment'
      ? 'from-cyan-500/30 via-fuchsia-500/10 to-transparent'
      : kind === 'lecture' || kind === 'gallery'
      ? 'from-amber-400/20 via-blue-500/10 to-transparent'
      : kind === 'seminar'
      ? 'from-rose-500/25 via-violet-500/10 to-transparent'
      : 'from-blue-500/30 via-cyan-500/10 to-transparent';

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${palette}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_80%_15%,rgba(77,113,255,0.25),transparent_22%)]" />
      <div className={`absolute inset-0 grid ${large ? 'grid-cols-5' : 'grid-cols-4'} gap-5 p-6 place-items-center`}>
        {Array.from({ length: cubeCount }).map((_, index) => (
          <div
            key={index}
            className={`border ${kind === 'seminar' ? 'border-rose-300/40' : 'border-white/55'} ${large ? 'h-10 w-10' : 'h-8 w-8'} rotate-12 rounded-[6px] shadow-[0_0_14px_rgba(255,255,255,0.08)]`}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
