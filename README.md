# Let's Hang - Event Page

A modern, feature-rich event page built with React and TypeScript. Create, customize, and manage events with an intuitive interface and glassmorphic design.

## 🎯 Features

### Core Functionality
- **Create Events**: Build comprehensive event pages with all essential details
- **Image Management**: 
  - Upload and customize event flyer images (520x520px)
  - Set custom background images with smooth glassmorphic effects
- **Dynamic Form Fields**: Add customizable fields on-the-fly:
  - Capacity management
  - Photo gallery
  - Links collection
  - Announcements
  - Download resources
- **Module Browser**: Browse and add additional modules to enhance your event
- **Real-time Updates**: All changes are reflected instantly using Recoil state management

### Design Features
- **Glassmorphic UI**: Beautiful frosted glass effects with backdrop blur
- **Responsive Layout**: Fixed 1440px × 1036px container with expandable content
- **Modern Typography**: Custom fonts (Syne, SF Pro Display)
- **Smooth Animations**: Hover effects and transitions throughout

## 🛠️ Tech Stack

### Frontend
- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript
- **State Management**: Recoil
- **Styling**: Tailwind CSS 4.x
- **Build Tool**: Vite
- **Routing**: React Router DOM

### Backend (Mock Server)
- **Server**: Express.js
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lets-hang.git
   cd lets-hang/events_page
   ```

2. **Install all dependencies** (frontend + backend)
   ```bash
   npm run install:all
   ```
   This installs dependencies for both frontend and backend.

3. **Start both servers** (recommended - runs both together)
   ```bash
   npm run dev:all
   ```
   Or simply:
   ```bash
   npm start
   ```
   This starts both the backend (`http://localhost:3000`) and frontend (`http://localhost:5173`) servers simultaneously.

   **Alternative - Run separately:**
   - Terminal 1 (Backend): `npm run dev:backend`
   - Terminal 2 (Frontend): `npm run dev:frontend`

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 🚀 Usage

### Creating an Event

1. **Basic Information**
   - Enter event name in the large input field at the top
   - Fill in date/time, location, and cost per person
   - Add a description

2. **Customize Images**
   - Click the edit button (bottom-right of flyer image) to upload a flyer
   - Click "Change background" to set a background image
   - Background applies to the entire page with glassmorphic blur

3. **Add Custom Fields**
   - Use Quick Links to add: Capacity, Photo Gallery, or Links
   - Click "Show more" for additional options: Announcements, Download
   - Each field can be removed with the × button

4. **Browse Modules**
   - Click "Customize" in the "Customize your event your way" section
   - Browse available modules and add them to your event
   - Supported modules integrate directly into the form

5. **Save Event**
   - Click "🚀 Go live" to save your event
   - Event data is stored in Recoil state (mock backend)

## 📁 Project Structure

```
events_page/
├── src/                              # Frontend React application
│   ├── components/
│   │   └── CreateEvent/
│   │       ├── Navbar.tsx           # Navigation bar
│   │       ├── FlyerSection.tsx     # Flyer image and background controls
│   │       ├── EventForm.tsx        # Main event form with dynamic fields
│   │       ├── CustomizeSection.tsx # Module browser trigger
│   │       ├── ModuleBrowser.tsx    # Module selection modal
│   │       └── ImageUploader.tsx    # Reusable image upload component
│   ├── pages/
│   │   └── CreateEventPage.tsx      # Main page component
│   ├── state/
│   │   └── atoms.ts                 # Recoil state atoms
│   ├── services/
│   │   └── mockBackend.ts          # API client (HTTP requests)
│   ├── types/
│   │   ├── event.ts                # Event type definitions
│   │   └── module.ts               # Module type definitions
│   ├── App.tsx                      # Root component
│   └── main.tsx                     # Application entry point
├── mock-backend/                     # Server-side mock backend
│   ├── server.js                    # Express server
│   ├── package.json                 # Backend dependencies
│   └── .gitignore
├── package.json                     # Frontend dependencies
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔌 Backend Architecture

The application uses a **server-side mock backend** that runs separately from the frontend. This provides a production-like development environment with real HTTP requests.

### Mock Backend Server

The mock backend is located in the `mock-backend/` folder and provides:

- **Express.js server** running on `http://localhost:3000`
- **RESTful API endpoints** matching production API structure
- **In-memory data storage** (resets on server restart)
- **File upload handling** with Multer
- **CORS enabled** for frontend communication

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/modules` | Get all available modules |
| POST | `/api/events` | Create a new event |
| PUT | `/api/events/:id` | Update an existing event |
| GET | `/api/events/:id` | Get a specific event |
| POST | `/api/upload` | Upload an image file |
| POST | `/api/events/:id/modules` | Add module to event |
| DELETE | `/api/events/:id/modules/:moduleId` | Remove module from event |
| GET | `/health` | Health check endpoint |

### Frontend API Client

The frontend makes HTTP requests through `src/services/mockBackend.ts`:

```typescript
// API base URL - configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Example: Fetch modules
export const getAvailableModules = async (): Promise<ModuleDefinition[]> => {
  const response = await fetch(`${API_BASE_URL}/api/modules`);
  return response.json();
};
```

### Replacing with Real Backend

To replace the mock backend with your production backend:

1. **Update API Base URL**
   
   Create a `.env` file in the frontend root:
   ```env
   VITE_API_URL=https://your-production-api.com
   ```

2. **Ensure API Compatibility**
   
   Your real backend should implement the same endpoints:
   - Same HTTP methods (GET, POST, PUT, DELETE)
   - Same request/response formats
   - Same status codes

3. **Handle Authentication**
   
   Update `mockBackend.ts` to include auth headers:
   ```typescript
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`
   }
   ```

4. **Stop Mock Backend**
   
   Simply stop running the mock backend server. The frontend will call your production API.

### State Management

The app uses **Recoil** for state management:
- State is stored in memory (Recoil atoms)
- API calls update state through service functions
- State persists during session (until page refresh)

## 🎨 Customization

### Styling

- **Tailwind CSS**: All styles use Tailwind utility classes
- **Glassmorphism**: Applied via `bg-white/10 backdrop-blur-md`
- **Colors**: Custom gradient backgrounds and glass effects

### Adding New Fields

1. Add field to `Event` interface in `src/types/event.ts`
2. Add field to `eventState` default in `src/state/atoms.ts`
3. Add rendering logic in `EventForm.tsx`
4. Add to Quick Links or Module Browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Tailwind CSS
Configuration in `tailwind.config.js` - scans all `.tsx` and `.ts` files.

### TypeScript
Strict mode enabled. Configuration in `tsconfig.json`.


## 🚦 Running the Application

### Quick Start (Recommended)

Run both servers with a single command:
```bash
npm start
# or
npm run dev:all
```

This starts:
- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` or `npm run dev:all` | Run both frontend and backend together |
| `npm run dev:frontend` | Run only frontend server |
| `npm run dev:backend` | Run only backend server |
| `npm run dev` | Run only frontend (alias for dev:frontend) |
| `npm run install:all` | Install dependencies for both frontend and backend |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

### Environment Variables

Create a `.env` file in the frontend root to customize the API URL:

```env
VITE_API_URL=http://localhost:3000
```

For production, set this to your production API URL.

### Running Servers Separately

If you prefer to run servers in separate terminals:

**Terminal 1 - Backend Server:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev:frontend
```

---

**Note**: The mock backend uses in-memory storage and resets on server restart. For production, replace with a real backend with persistent database storage.

