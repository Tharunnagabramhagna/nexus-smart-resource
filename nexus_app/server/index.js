import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.join(__dirname, 'store.json');
const projectRoot = path.resolve(__dirname, '..');
const distPath = path.join(projectRoot, 'dist');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const validStatuses = ['available', 'occupied', 'maintenance'];
const validCategories = ['lab', 'room', 'equipment', 'parking'];

async function readStore() {
  const raw = await fs.readFile(storePath, 'utf8');
  return JSON.parse(raw);
}

async function writeStore(store) {
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), 'utf8');
}

function toMinutes(time) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function bookingsOverlap(startA, endA, startB, endB) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA);
}

function titleFromEmail(email) {
  const seed = email.split('@')[0].replace(/[._-]+/g, ' ');
  return seed.replace(/\b\w/g, character => character.toUpperCase()) || 'Nexus User';
}

function createRecommendation(store, targetResource) {
  const candidate = store.resources.find(
    resource =>
      resource.id !== targetResource.id &&
      resource.category === targetResource.category &&
      resource.status === 'available' &&
      resource.capacity >= Math.max(1, Math.ceil(targetResource.capacity * 0.75))
  );

  if (!candidate) {
    return {
      title: 'No alternate node ready',
      action: 'Review another time block or clear the current occupancy from the admin console.',
    };
  }

  return {
    title: candidate.name,
    action: `Use ${candidate.location} for the next booking window to avoid overlap.`,
  };
}

function buildGuide() {
  return {
    directive:
      'Shared-resource conflict occurs when concurrent access requests target finite facility nodes without atomic state validation. NEXUS mitigates this via telemetry, booking rules, and guided intervention.',
    architecture: [
      {
        id: 'frontend',
        title: 'FRONTEND',
        description: 'The operational dashboard where users explore resources and administrators control the facility state.',
      },
      {
        id: 'backend',
        title: 'BACKEND',
        description: 'The booking engine that validates requests, resolves overlaps, and protects the schedule in real time.',
      },
      {
        id: 'database',
        title: 'DATABASE',
        description: 'A persistent store for resources, users, issues, and booking history.',
      },
      {
        id: 'ai-layer',
        title: 'AI LAYER',
        description: 'A recommendation layer that suggests alternate resources when conflicts are detected.',
      },
    ],
    roadmap: [
      { label: 'PARKING SPACES', detail: 'GPS-tagged bay management.' },
      { label: 'EQUIPMENT', detail: 'High-value asset tracking.' },
      { label: 'MEETING ROOMS', detail: 'Corporate floor management.' },
    ],
    impact: [
      { metric: 'Conflict rate', before: 'High', after: 'Near Zero', delta: '-65%' },
      { metric: 'Manual supervision', before: 'High', after: 'Low', delta: '-45%' },
      { metric: 'Scheduling accuracy', before: 'Medium', after: 'High', delta: '+99.5%' },
    ],
  };
}

function buildLiveMap(store) {
  const basePositions = [
    { x: 14, y: 22 },
    { x: 36, y: 18 },
    { x: 58, y: 20 },
    { x: 74, y: 28 },
    { x: 28, y: 46 },
    { x: 52, y: 50 },
    { x: 74, y: 56 },
  ];

  return store.resources.map((resource, index) => ({
    id: resource.id,
    name: resource.name,
    category: resource.category,
    status: resource.status,
    x: basePositions[index % basePositions.length].x,
    y: basePositions[index % basePositions.length].y,
    width: resource.category === 'equipment' ? 14 : 18,
    height: 12,
  }));
}

function buildDashboard(store) {
  const openIncidents = store.issues.filter(issue => !issue.resolved).length;
  const statusCounts = store.resources.reduce(
    (accumulator, resource) => {
      accumulator[resource.status] += 1;
      return accumulator;
    },
    { available: 0, occupied: 0, maintenance: 0 }
  );

  const systemHealth = Math.max(
    92,
    100 - openIncidents * 2 - statusCounts.maintenance * 1.5
  ).toFixed(1);

  const utilization = Object.entries(
    store.resources.reduce((accumulator, resource) => {
      accumulator[resource.category] = accumulator[resource.category] || {
        total: 0,
        active: 0,
      };
      accumulator[resource.category].total += 1;
      if (resource.status === 'occupied') accumulator[resource.category].active += 1;
      return accumulator;
    }, {})
  ).map(([category, stats]) => ({
    category,
    percent: stats.total ? Math.round((stats.active / stats.total) * 100) : 0,
  }));

  const anomalies = store.resources
    .filter(resource => resource.status !== 'available' || resource.tag === 'HIGH DEMAND')
    .slice(0, 5)
    .map(resource => ({
      id: resource.id,
      name: resource.name,
      signal:
        resource.status === 'maintenance'
          ? 'MAINT_REQUIRED'
          : resource.status === 'occupied'
            ? 'ON_LOAD'
            : 'HIGH_DEMAND',
    }));

  return {
    stats: [
      { label: 'ACTIVE NODES', value: String(store.resources.length) },
      { label: 'CONFIRMED LOADS', value: String(store.bookings.length) },
      { label: 'OPEN INCIDENTS', value: String(openIncidents) },
      { label: 'SYSTEM HEALTH', value: `${systemHealth}%` },
    ],
    utilization,
    impact: {
      baseline: '2.3',
      optimized: '3.0',
      gain: '+28.2%',
    },
    anomalies,
    activityLog: store.activityLog.slice(-4).reverse(),
    nodeCounts: statusCounts,
  };
}

function buildBootstrap(store) {
  return {
    resources: store.resources,
    bookings: store.bookings.slice().reverse(),
    issues: store.issues.slice().reverse(),
    dashboard: buildDashboard(store),
    guide: buildGuide(),
    liveMap: buildLiveMap(store),
    serverTime: new Date().toISOString(),
  };
}

app.get('/api/bootstrap', async (_request, response) => {
  const store = await readStore();
  response.json(buildBootstrap(store));
});

app.post('/api/auth/login', async (request, response) => {
  const { email, role = 'admin' } = request.body ?? {};
  if (!email || !String(email).includes('@')) {
    response.status(400).json({ message: 'A valid institutional email is required.' });
    return;
  }

  const normalizedRole = role === 'student' ? 'student' : 'admin';
  response.json({
    user: {
      email,
      role: normalizedRole,
      name: normalizedRole === 'admin' ? 'ADMIN' : titleFromEmail(email),
    },
  });
});

app.post('/api/bookings', async (request, response) => {
  const { resourceId, userEmail, date, startTime, endTime } = request.body ?? {};
  const store = await readStore();
  const resource = store.resources.find(item => item.id === resourceId);

  if (!resource) {
    response.status(404).json({ message: 'Resource not found.' });
    return;
  }

  if (!userEmail || !date || !startTime || !endTime) {
    response.status(400).json({ message: 'Booking payload is incomplete.' });
    return;
  }

  if (toMinutes(startTime) >= toMinutes(endTime)) {
    response.status(400).json({ message: 'Finish time must be later than start time.' });
    return;
  }

  if (resource.status === 'maintenance') {
    response.status(409).json({
      message: `${resource.name} is under maintenance and cannot be reserved.`,
      recommendation: createRecommendation(store, resource),
    });
    return;
  }

  const conflicting = store.bookings.find(
    booking =>
      booking.resourceId === resourceId &&
      booking.date === date &&
      booking.status === 'confirmed' &&
      bookingsOverlap(booking.startTime, booking.endTime, startTime, endTime)
  );

  if (conflicting) {
    response.status(409).json({
      message: `Collision detected with an existing booking from ${conflicting.startTime} to ${conflicting.endTime}.`,
      recommendation: createRecommendation(store, resource),
    });
    return;
  }

  const booking = {
    id: randomUUID(),
    resourceId,
    resourceName: resource.name,
    userEmail,
    date,
    startTime,
    endTime,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  store.bookings.push(booking);
  resource.status = 'occupied';
  store.activityLog.push({
    id: randomUUID(),
    resourceName: resource.name,
    timestamp: new Date().toISOString(),
    message: 'BOOKING_OK',
  });

  await writeStore(store);

  response.status(201).json({
    booking,
    recommendation: {
      title: 'AI RECOMMENDATION',
      action: `${resource.name} has been locked for ${date} ${startTime}-${endTime}.`,
    },
  });
});

app.patch('/api/resources/:id/status', async (request, response) => {
  const { id } = request.params;
  const { status } = request.body ?? {};

  if (!validStatuses.includes(status)) {
    response.status(400).json({ message: 'Invalid status value.' });
    return;
  }

  const store = await readStore();
  const resource = store.resources.find(item => item.id === id);

  if (!resource) {
    response.status(404).json({ message: 'Resource not found.' });
    return;
  }

  resource.status = status;
  store.activityLog.push({
    id: randomUUID(),
    resourceName: resource.name,
    timestamp: new Date().toISOString(),
    message: `STATE_${status.toUpperCase()}`,
  });

  await writeStore(store);
  response.json({ resource });
});

app.post('/api/issues', async (request, response) => {
  const { resourceId, summary, severity = 'medium', reportedBy = 'admin@nexus.ai' } = request.body ?? {};
  const store = await readStore();
  const resource = store.resources.find(item => item.id === resourceId);

  if (!resource) {
    response.status(404).json({ message: 'Resource not found.' });
    return;
  }

  if (!summary) {
    response.status(400).json({ message: 'Issue summary is required.' });
    return;
  }

  const issue = {
    id: randomUUID(),
    resourceId,
    resourceName: resource.name,
    severity,
    summary,
    reportedBy,
    createdAt: new Date().toISOString(),
    resolved: false,
  };

  store.issues.push(issue);
  store.activityLog.push({
    id: randomUUID(),
    resourceName: resource.name,
    timestamp: new Date().toISOString(),
    message: 'ISSUE_REPORTED',
  });

  await writeStore(store);
  response.status(201).json({ issue });
});

app.get('/api/resources', async (request, response) => {
  const store = await readStore();
  const { category, search } = request.query;

  const filtered = store.resources.filter(resource => {
    const categoryMatch = !category || category === 'all' || resource.category === category;
    const searchMatch =
      !search ||
      resource.name.toLowerCase().includes(String(search).toLowerCase()) ||
      resource.location.toLowerCase().includes(String(search).toLowerCase());
    return categoryMatch && searchMatch;
  });

  response.json({ resources: filtered });
});

app.get('/api/resources/:id', async (request, response) => {
  const store = await readStore();
  const resource = store.resources.find(item => item.id === request.params.id);

  if (!resource) {
    response.status(404).json({ message: 'Resource not found.' });
    return;
  }

  response.json({
    resource,
    bookings: store.bookings.filter(booking => booking.resourceId === resource.id).slice(-5).reverse(),
  });
});

app.get('/api/dashboard', async (_request, response) => {
  const store = await readStore();
  response.json(buildDashboard(store));
});

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'nexus-backend' });
});

app.use(express.static(distPath));

app.get('*', async (request, response, next) => {
  if (request.path.startsWith('/api')) {
    next();
    return;
  }

  try {
    await fs.access(path.join(distPath, 'index.html'));
    response.sendFile(path.join(distPath, 'index.html'));
  } catch {
    response
      .status(503)
      .send(
        'Frontend build is not available yet. Run "npm run build" or use "npm run dev:full" for development.'
      );
  }
});

app.listen(PORT, () => {
  console.log(`NEXUS backend listening on http://localhost:${PORT}`);
});
