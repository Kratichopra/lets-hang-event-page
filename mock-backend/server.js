import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Create necessary directories
const EVENTS_DIR = join(__dirname, 'events');
const IMAGES_DIR = join(EVENTS_DIR, 'images');

// Ensure directories exist on startup
try {
  if (!fs.existsSync(EVENTS_DIR)) {
    fs.mkdirSync(EVENTS_DIR, { recursive: true });
    console.log(`✅ Created events directory: ${EVENTS_DIR}`);
  } else {
    console.log(`📁 Events directory already exists: ${EVENTS_DIR}`);
  }
  
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`✅ Created images directory: ${IMAGES_DIR}`);
  } else {
    console.log(`🖼️  Images directory already exists: ${IMAGES_DIR}`);
  }
  
  console.log(`📁 Events directory: ${EVENTS_DIR}`);
  console.log(`🖼️  Images directory: ${IMAGES_DIR}`);
  console.log(`📂 Current working directory: ${process.cwd()}`);
  console.log(`📂 __dirname: ${__dirname}`);
} catch (error) {
  console.error('❌ Error creating directories:', error);
}

// Middleware
app.use(cors());

// Increase payload limit significantly to handle large requests
// Even if payload fails, we'll try to save what we can
app.use(express.json({ limit: '500mb' })); // Very large limit to handle any payload
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use('/events/images', express.static(IMAGES_DIR)); // Serve images statically

// Error handler for payload too large - but still try to save
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    console.error('⚠️  Payload too large error detected!');
    console.error('⚠️  Attempting to save event anyway with available data...');
    
    // Try to save event even with payload error
    try {
      // Try to extract event data from request if possible
      // If body parser failed, we might not have req.body, but we'll try
      if (req.body && req.body.id) {
        const event = {
          ...req.body,
          id: req.body.id || `event_${Date.now()}`,
        };
        
        // Try to save the file
        const savedEvent = saveEventToFile(event);
        console.log('✅ Event saved despite payload error:', savedEvent.id);
        
        return res.status(201).json({
          ...savedEvent,
          warning: 'Event saved but request was too large. Some data may be missing.'
        });
      }
    } catch (saveError) {
      console.error('❌ Failed to save event after payload error:', saveError);
    }
    
    return res.status(413).json({ 
      error: 'Payload too large', 
      message: 'Request body is too large. Event may still have been saved.',
      hint: 'Check if base64 images are being stripped on the frontend before sending.'
    });
  }
  next(err);
});

// Configure multer for file uploads (disk storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `image-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to extract image path/name from image data
// For mock purposes, just store a simple path/name, not the actual image or base64 data
const extractImagePath = (imageData, eventId, imageType) => {
  if (!imageData) return imageData;
  
  // If it's already a URL path, extract the filename or return as-is
  if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
    // Extract filename from URL
    const urlParts = imageData.split('/');
    const filename = urlParts[urlParts.length - 1];
    return `/events/images/${filename}`;
  }
  
  // If it's a data URL (base64), just create a mock path name (don't save the base64)
  if (imageData.startsWith('data:')) {
    // Extract extension from mime type if possible
    const mimeMatch = imageData.match(/^data:([A-Za-z-+\/]+);base64/);
    const extension = mimeMatch ? mimeMatch[1].split('/')[1] || 'png' : 'png';
    // Return a simple mock path name (no actual file saved)
    return `/events/images/${imageType}-${eventId}-${Date.now()}.${extension}`;
  }
  
  // If it's already a relative path, return as-is
  if (imageData.startsWith('/')) {
    return imageData;
  }
  
  // Default: return as-is
  return imageData;
};

// Helper function to get event file path
const getEventFilePath = (eventId) => {
  return join(EVENTS_DIR, `${eventId}.json`);
};

// Helper function to convert relative image path to full URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return imagePath;
  // If it's already a full URL or data URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // Convert relative path to full URL
  return `http://localhost:${PORT}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

// Helper function to save event to JSON file
const saveEventToFile = (event) => {
  try {
    if (!event.id) {
      throw new Error('Event ID is required');
    }
    
    console.log(`\n🔵 Starting file save process for event: ${event.id}`);
    console.log(`📂 EVENTS_DIR: ${EVENTS_DIR}`);
    console.log(`📂 __dirname: ${__dirname}`);
    
    // Ensure directory exists before saving - use absolute path
    if (!fs.existsSync(EVENTS_DIR)) {
      console.log(`📁 Creating events directory: ${EVENTS_DIR}`);
      fs.mkdirSync(EVENTS_DIR, { recursive: true });
      console.log(`✅ Created events directory`);
    } else {
      console.log(`✅ Events directory already exists`);
    }
    
    // Verify directory was created
    if (!fs.existsSync(EVENTS_DIR)) {
      throw new Error(`Failed to create or access events directory: ${EVENTS_DIR}`);
    }
    
    const filepath = getEventFilePath(event.id);
    console.log(`📝 Target file path: ${filepath}`);
    console.log(`📝 Absolute file path: ${filepath}`);
    
    // Process images - extract just path/name, no file conversion
    const eventToSave = { ...event };
    
    // Extract simple path/name from images (no base64 conversion)
    if (eventToSave.flyerImage) {
      eventToSave.flyerImage = extractImagePath(eventToSave.flyerImage, eventToSave.id, 'flyer');
    }
    
    if (eventToSave.backgroundImage) {
      eventToSave.backgroundImage = extractImagePath(eventToSave.backgroundImage, eventToSave.id, 'background');
    }

    // Convert event to JSON string
    const jsonContent = JSON.stringify(eventToSave, null, 2);
    console.log(`📊 JSON content size: ${jsonContent.length} bytes`);
    
    // Save to file (without base64 data, just paths)
    console.log(`💾 Attempting to write file...`);
    fs.writeFileSync(filepath, jsonContent, 'utf8');
    console.log(`✅ writeFileSync completed`);
    
    // Verify file was written immediately
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      console.log(`✅ File verified to exist: ${filepath}`);
      console.log(`📊 File size: ${stats.size} bytes`);
      console.log(`📅 File modified: ${stats.mtime}`);
      
      // Read back to verify content
      const readBack = fs.readFileSync(filepath, 'utf8');
      if (readBack === jsonContent) {
        console.log(`✅ File content verified - matches written content`);
      } else {
        console.warn(`⚠️  File content mismatch - file may be corrupted`);
      }
    } else {
      throw new Error(`File was not created at ${filepath}. Directory exists: ${fs.existsSync(EVENTS_DIR)}`);
    }
    
    // Return event with full image URLs for frontend
    const result = {
      ...eventToSave,
      flyerImage: getImageUrl(eventToSave.flyerImage),
      backgroundImage: getImageUrl(eventToSave.backgroundImage),
    };
    
    console.log(`✅ File save process completed successfully\n`);
    return result;
  } catch (error) {
    console.error(`\n❌ Error saving event to file:`);
    console.error(`   Event ID: ${event?.id || 'unknown'}`);
    console.error(`   Error message: ${error.message}`);
    console.error(`   Error code: ${error.code || 'N/A'}`);
    console.error(`   EVENTS_DIR: ${EVENTS_DIR}`);
    console.error(`   EVENTS_DIR exists: ${fs.existsSync(EVENTS_DIR)}`);
    console.error(`   Error stack: ${error.stack}\n`);
    throw error;
  }
};

// Helper function to load event from JSON file
const loadEventFromFile = (eventId) => {
  try {
    const filepath = getEventFilePath(eventId);
    if (!fs.existsSync(filepath)) {
      return null;
    }
    const fileContent = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading event from file:', error);
    return null;
  }
};

// Helper function to get all event IDs
const getAllEventIds = () => {
  try {
    if (!fs.existsSync(EVENTS_DIR)) {
      return [];
    }
    return fs.readdirSync(EVENTS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading events directory:', error);
    return [];
  }
};
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
  let eventSaved = false;
  let savedEvent = null;
  
  try {
    console.log('📥 Received event creation request');
    
    // Check if request body exists
    if (!req.body) {
      throw new Error('Request body is empty');
    }
    
    // Check if request body has base64 images (shouldn't happen if frontend strips them)
    const hasBase64 = (req.body.flyerImage && req.body.flyerImage.startsWith('data:')) ||
                      (req.body.backgroundImage && req.body.backgroundImage.startsWith('data:'));
    
    if (hasBase64) {
      console.warn('⚠️  Warning: Base64 images detected in request, stripping them...');
      // Strip base64 images as fallback
      if (req.body.flyerImage && req.body.flyerImage.startsWith('data:')) {
        const eventId = req.body.id || `event_${Date.now()}`;
        const mimeMatch = req.body.flyerImage.match(/^data:([A-Za-z-+\/]+);base64/);
        const extension = mimeMatch ? mimeMatch[1].split('/')[1] || 'png' : 'png';
        req.body.flyerImage = `/events/images/flyer-${eventId}-${Date.now()}.${extension}`;
      }
      if (req.body.backgroundImage && req.body.backgroundImage.startsWith('data:')) {
        const eventId = req.body.id || `event_${Date.now()}`;
        const mimeMatch = req.body.backgroundImage.match(/^data:([A-Za-z-+\/]+);base64/);
        const extension = mimeMatch ? mimeMatch[1].split('/')[1] || 'png' : 'png';
        req.body.backgroundImage = `/events/images/background-${eventId}-${Date.now()}.${extension}`;
      }
    }
    
    // Frontend already strips base64 images, so we just save the event with path names
    const event = {
      ...req.body,
      id: req.body.id || `event_${Date.now()}`,
    };
    
    console.log(`💾 Saving event with ID: ${event.id}`);
    
    // Save event to JSON file (images are already path names, not base64)
    // This MUST happen even if there are other errors
    savedEvent = saveEventToFile(event);
    eventSaved = true;
    console.log(`✅ Event saved successfully: ${getEventFilePath(event.id)}`);
    
    // Return success response
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('❌ Error in event creation:', error);
    console.error('Error stack:', error.stack);
    
    // If we managed to save the file, return success even if there was an error
    if (eventSaved && savedEvent) {
      console.log('✅ Event was saved despite error, returning saved event');
      return res.status(201).json({
        ...savedEvent,
        warning: 'Event saved but there was an error processing the request'
      });
    }
    
    // If we couldn't save, try one more time with minimal data
    if (!eventSaved && req.body) {
      try {
        console.log('🔄 Attempting to save event with minimal data...');
        const minimalEvent = {
          id: req.body.id || `event_${Date.now()}`,
          name: req.body.name || 'Untitled Event',
          dateTime: req.body.dateTime || '',
          location: req.body.location || '',
          description: req.body.description || '',
          enabledFields: req.body.enabledFields || [],
          modules: req.body.modules || [],
        };
        
        savedEvent = saveEventToFile(minimalEvent);
        eventSaved = true;
        console.log('✅ Event saved with minimal data:', savedEvent.id);
        
        return res.status(201).json({
          ...savedEvent,
          warning: 'Event saved with minimal data due to processing error'
        });
      } catch (saveError) {
        console.error('❌ Failed to save event even with minimal data:', saveError);
      }
    }
    
    // If all else fails, return error
    res.status(500).json({ 
      error: 'Failed to create event', 
      details: error.message,
      saved: eventSaved
    });
  }
});

// PUT /api/events/:id - Update an existing event
app.put('/api/events/:id', async (req, res) => {
  await delay(500);
  try {
    const eventId = req.params.id;
    const existingEvent = loadEventFromFile(eventId);
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Frontend already strips base64 images, so we just merge the update
    const updatedEvent = {
      ...existingEvent,
      ...req.body,
      id: eventId, // Ensure ID is preserved
    };
    
    // Save updated event to file (images are already path names, not base64)
    const savedEvent = saveEventToFile(updatedEvent);
    res.json(savedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// GET /api/events/:id - Get a specific event
app.get('/api/events/:id', async (req, res) => {
  await delay(300);
  try {
    const eventId = req.params.id;
    const event = loadEventFromFile(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Convert image paths to full URLs
    const eventWithUrls = {
      ...event,
      flyerImage: getImageUrl(event.flyerImage),
      backgroundImage: getImageUrl(event.backgroundImage),
    };
    
    res.json(eventWithUrls);
  } catch (error) {
    console.error('Error loading event:', error);
    res.status(500).json({ error: 'Failed to load event' });
  }
});

// GET /api/events - Get all events
app.get('/api/events', async (req, res) => {
  await delay(300);
  try {
    const eventIds = getAllEventIds();
    const events = eventIds
      .map(id => {
        const event = loadEventFromFile(id);
        if (!event) return null;
        // Convert image paths to full URLs
        return {
          ...event,
          flyerImage: getImageUrl(event.flyerImage),
          backgroundImage: getImageUrl(event.backgroundImage),
        };
      })
      .filter(event => event !== null);
    res.json(events);
  } catch (error) {
    console.error('Error loading events:', error);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

// POST /api/upload - Upload an image file
app.post('/api/upload', upload.single('image'), async (req, res) => {
  await delay(800);
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // File is already saved to disk by multer
    // Return the full URL path to the saved file
    const relativePath = `/events/images/${req.file.filename}`;
    const fullUrl = `http://localhost:${PORT}${relativePath}`;
    res.json({ url: fullUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
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

// Test endpoint to verify file writing
app.get('/api/test-save', (req, res) => {
  try {
    const testEvent = {
      id: `test_event_${Date.now()}`,
      name: 'Test Event',
      dateTime: new Date().toISOString(),
      location: 'Test Location',
      description: 'This is a test event',
      enabledFields: [],
      modules: [],
    };
    
    console.log('\n🧪 Testing file save...');
    const saved = saveEventToFile(testEvent);
    
    // List all files in events directory
    const files = fs.existsSync(EVENTS_DIR) 
      ? fs.readdirSync(EVENTS_DIR).filter(f => f.endsWith('.json'))
      : [];
    
    res.json({
      status: 'success',
      message: 'Test file saved successfully',
      eventId: testEvent.id,
      filePath: getEventFilePath(testEvent.id),
      eventsDir: EVENTS_DIR,
      eventsDirExists: fs.existsSync(EVENTS_DIR),
      filesInDir: files,
      fileCount: files.length,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Test file save failed',
      error: error.message,
      eventsDir: EVENTS_DIR,
      eventsDirExists: fs.existsSync(EVENTS_DIR),
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock backend server running on http://localhost:${PORT}`);
  console.log(`📁 Events directory: ${EVENTS_DIR}`);
  console.log(`🖼️  Images directory: ${IMAGES_DIR}`);
  console.log(`📂 __dirname: ${__dirname}`);
  console.log(`📂 process.cwd(): ${process.cwd()}`);
  console.log(`📁 Events dir exists: ${fs.existsSync(EVENTS_DIR)}`);
  console.log(`🖼️  Images dir exists: ${fs.existsSync(IMAGES_DIR)}`);
  
  // List existing event files
  if (fs.existsSync(EVENTS_DIR)) {
    const files = fs.readdirSync(EVENTS_DIR).filter(f => f.endsWith('.json'));
    console.log(`📄 Existing event files: ${files.length}`);
    if (files.length > 0) {
      console.log(`   ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
    }
  }
  
  console.log(`\n📡 API endpoints available:`);
  console.log(`   GET  /api/modules`);
  console.log(`   GET  /api/events`);
  console.log(`   POST /api/events`);
  console.log(`   PUT  /api/events/:id`);
  console.log(`   GET  /api/events/:id`);
  console.log(`   POST /api/upload`);
  console.log(`   GET  /api/test-save (test file writing)`);
  console.log(`   POST /api/events/:id/modules`);
  console.log(`   DELETE /api/events/:id/modules/:moduleId`);
  console.log(`\n`);
});

