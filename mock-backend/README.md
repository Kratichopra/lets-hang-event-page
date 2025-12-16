# Mock Backend Server

A functional mock backend server for the Let's Hang event management application. This server saves events locally as JSON files and stores images on disk.

## Features

- **Local File Storage**: Events are saved as JSON files in the `events/` directory
- **Image Storage**: Images (flyer and background) are saved in `events/images/` directory
- **Base64 Image Conversion**: Automatically converts base64 images to files when saving events
- **Static File Serving**: Images are served statically via `/events/images/` endpoint

## Directory Structure

```
mock-backend/
├── events/              # Events storage directory (auto-created)
│   ├── images/          # Images storage directory (auto-created)
│   │   ├── image-*.jpg  # Uploaded images
│   │   └── flyer-*.png  # Flyer images (from base64)
│   └── event_*.json     # Event JSON files
├── server.js            # Main server file
├── package.json
└── README.md
```

## How It Works

### Event Storage

1. **Creating Events**: When a new event is created via `POST /api/events`:
   - Event is assigned a unique ID: `event_${timestamp}`
   - Base64 images (flyerImage, backgroundImage) are converted to files
   - Event is saved as `events/event_{id}.json`

2. **Updating Events**: When an event is updated via `PUT /api/events/:id`:
   - Existing event is loaded from JSON file
   - Updated with new data
   - Base64 images are converted to files if present
   - Event is saved back to the same JSON file

3. **Reading Events**: When an event is fetched via `GET /api/events/:id`:
   - Event is loaded from JSON file
   - Image paths are converted to full URLs
   - Event is returned to frontend

### Image Handling

1. **File Uploads**: When images are uploaded via `POST /api/upload`:
   - Files are saved to `events/images/` directory
   - Unique filename: `image-{timestamp}-{random}.{ext}`
   - Full URL is returned: `http://localhost:3000/events/images/{filename}`

2. **Base64 Images**: When events contain base64 images:
   - Base64 data is extracted and saved as a file
   - Filename format: `{type}-{eventId}-{timestamp}.{ext}`
   - Relative path is stored in JSON: `/events/images/{filename}`
   - Full URL is returned to frontend: `http://localhost:3000/events/images/{filename}`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/modules` | Get all available modules |
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create a new event (saves to JSON file) |
| GET | `/api/events/:id` | Get a specific event (loads from JSON file) |
| PUT | `/api/events/:id` | Update an event (updates JSON file) |
| POST | `/api/upload` | Upload an image file (saves to disk) |
| GET | `/events/images/:filename` | Serve image files statically |
| GET | `/health` | Health check endpoint |

## Example Event JSON File

```json
{
  "id": "event_1234567890",
  "name": "Summer Party",
  "phoneNumber": "+1234567890",
  "dateTime": "2024-07-15T18:00:00",
  "location": "Beach Park",
  "description": "Join us for a fun summer party!",
  "cost": "$25",
  "flyerImage": "/events/images/flyer-event_1234567890-1234567890.png",
  "backgroundImage": "/events/images/background-event_1234567890-1234567890.jpg",
  "enabledFields": ["capacity", "links"],
  "capacity": "100",
  "links": [
    {
      "url": "https://example.com",
      "label": "Event Website"
    }
  ],
  "modules": []
}
```

## Notes

- **Auto-creation**: The `events/` and `events/images/` directories are automatically created on server start
- **Image URLs**: All image paths in JSON files are relative, but full URLs are returned to the frontend
- **Base64 Support**: The server automatically detects and converts base64 images to files
- **File Persistence**: All data persists between server restarts (stored on disk)
- **Git Ignore**: The `events/` directory is ignored by git (see `.gitignore`)

## Development

To start the server:

```bash
cd mock-backend
npm install
npm run dev
```

The server will:
- Create `events/` and `events/images/` directories if they don't exist
- Start listening on `http://localhost:3000`
- Serve events and images from local file system

