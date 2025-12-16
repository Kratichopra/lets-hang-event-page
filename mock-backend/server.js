import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data storage
let events = [];
let modules = [
  {
    code: 'questionnaires',
    name: 'Questionnaires',
    description: 'Create questionnaires for your event. Hosts can create questions and view responses.',
    price: 'Free',
    usageCount: 446,
    likesCount: 406,
  },
  {
    code: 'new_section',
    name: 'New section',
    description: 'Add a custom section to showcase anything you want on your event page.',
    price: 'Free',
    usageCount: 817,
    likesCount: 277,
  },
  {
    code: 'invite',
    name: 'Invite',
    label: 'RSVP',
    description: 'Personally invite each and every guest within seconds',
    price: 'Paid',
    priceAmount: '$',
    usageCount: 340000,
    likesCount: 150000,
  },
  {
    code: 'photo_gallery',
    name: 'Photo Gallery',
    description: 'Add photos for guests to view and relive the vibe.',
    price: 'Free',
    usageCount: 342,
    likesCount: 302,
  },
  {
    code: 'links',
    name: 'Links',
    description: 'Share links to event guides, menus, playlists, and more.',
    price: 'Free',
    usageCount: 832,
    likesCount: 292,
  },
  {
    code: 'capacity',
    name: 'Capacity',
    description: 'Set and manage the maximum number of attendees for your event.',
    price: 'Free',
    usageCount: 523,
    likesCount: 445,
  },
  {
    code: 'announcements',
    name: 'Announcements',
    description: 'Share important updates and announcements with your guests.',
    price: 'Free',
    usageCount: 289,
    likesCount: 234,
  },
];

// Routes

// GET /api/modules - Get all available modules
app.get('/api/modules', async (req, res) => {
  await delay(300);
  res.json(modules);
});

// POST /api/events - Create a new event
app.post('/api/events', async (req, res) => {
  await delay(500);
  const event = {
    ...req.body,
    id: `event_${Date.now()}`,
  };
  events.push(event);
  res.status(201).json(event);
});

// PUT /api/events/:id - Update an existing event
app.put('/api/events/:id', async (req, res) => {
  await delay(500);
  const eventId = req.params.id;
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const updatedEvent = {
    ...events[eventIndex],
    ...req.body,
    id: eventId,
  };
  events[eventIndex] = updatedEvent;
  res.json(updatedEvent);
});

// GET /api/events/:id - Get a specific event
app.get('/api/events/:id', async (req, res) => {
  await delay(300);
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  res.json(event);
});

// POST /api/upload - Upload an image file
app.post('/api/upload', upload.single('image'), async (req, res) => {
  await delay(800);
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Convert buffer to base64
  const base64 = req.file.buffer.toString('base64');
  const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
  
  res.json({ url: dataUrl });
});

// POST /api/events/:id/modules - Add a module to an event
app.post('/api/events/:id/modules', async (req, res) => {
  await delay(400);
  const eventId = req.params.id;
  const { moduleType } = req.body;
  
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const newModule = {
    id: `module_${Date.now()}`,
    type: moduleType,
    config: {},
  };
  
  if (!event.modules) {
    event.modules = [];
  }
  event.modules.push(newModule);
  
  res.status(201).json(newModule);
});

// DELETE /api/events/:id/modules/:moduleId - Remove a module from an event
app.delete('/api/events/:id/modules/:moduleId', async (req, res) => {
  await delay(300);
  const eventId = req.params.id;
  const moduleId = req.params.moduleId;
  
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (event.modules) {
    event.modules = event.modules.filter(m => m.id !== moduleId);
  }
  
  res.status(204).send();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   GET  /api/modules`);
  console.log(`   POST /api/events`);
  console.log(`   PUT  /api/events/:id`);
  console.log(`   GET  /api/events/:id`);
  console.log(`   POST /api/upload`);
  console.log(`   POST /api/events/:id/modules`);
  console.log(`   DELETE /api/events/:id/modules/:moduleId`);
});

