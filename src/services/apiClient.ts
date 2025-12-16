import type { Event, EventModule } from '../types/event';
import type { ModuleDefinition } from '../types/module';

/**
 * API Client - Handles all HTTP requests to the backend
 * Works with both mock backend (localhost:3000) and production backend
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to convert base64 images to simple path names for mock backend
// This prevents payload size issues by not sending large base64 strings
const stripBase64Images = (event: Event): Event => {
  const eventCopy = { ...event };
  
  // Convert base64 flyerImage to simple path name
  if (eventCopy.flyerImage && typeof eventCopy.flyerImage === 'string' && eventCopy.flyerImage.startsWith('data:')) {
    const eventId = eventCopy.id || `event_${Date.now()}`;
    const mimeMatch = eventCopy.flyerImage.match(/^data:([A-Za-z-+\/]+);base64/);
    const extension = mimeMatch ? mimeMatch[1].split('/')[1] || 'png' : 'png';
    const originalSize = eventCopy.flyerImage.length;
    eventCopy.flyerImage = `/events/images/flyer-${eventId}-${Date.now()}.${extension}`;
    console.log(`🖼️  Stripped flyerImage: ${(originalSize / 1024).toFixed(2)} KB -> ${eventCopy.flyerImage.length} bytes`);
  }
  
  // Convert base64 backgroundImage to simple path name
  if (eventCopy.backgroundImage && typeof eventCopy.backgroundImage === 'string' && eventCopy.backgroundImage.startsWith('data:')) {
    const eventId = eventCopy.id || `event_${Date.now()}`;
    const mimeMatch = eventCopy.backgroundImage.match(/^data:([A-Za-z-+\/]+);base64/);
    const extension = mimeMatch ? mimeMatch[1].split('/')[1] || 'png' : 'png';
    const originalSize = eventCopy.backgroundImage.length;
    eventCopy.backgroundImage = `/events/images/background-${eventId}-${Date.now()}.${extension}`;
    console.log(`🖼️  Stripped backgroundImage: ${(originalSize / 1024).toFixed(2)} KB -> ${eventCopy.backgroundImage.length} bytes`);
  }
  
  return eventCopy;
};

// Get available modules from server
export const getAvailableModules = async (): Promise<ModuleDefinition[]> => {
  const response = await fetch(`${API_BASE_URL}/api/modules`);
  if (!response.ok) {
    throw new Error('Failed to fetch available modules');
  }
  return response.json();
};

// Create a new event
export const createEvent = async (event: Event): Promise<Event> => {
  // Strip base64 images before sending to prevent payload size issues
  const eventToSend = stripBase64Images(event);
  
  // Log payload size for debugging
  const payload = JSON.stringify(eventToSend);
  const payloadSizeMB = (new Blob([payload]).size / 1024 / 1024).toFixed(2);
  console.log(`📤 Sending event, payload size: ${payloadSizeMB} MB`);
  
  // Check if there's still base64 data (shouldn't happen)
  if (payload.includes('data:image') && payload.length > 1000000) {
    console.warn('⚠️  Warning: Large payload detected, may contain base64 data');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to create event:', response.status, errorText);
    throw new Error(`Failed to create event: ${response.status} ${errorText}`);
  }
  
  const result = await response.json();
  console.log('✅ Event created successfully:', result.id);
  return result;
};

// Update an existing event
export const updateEvent = async (event: Event): Promise<Event> => {
  if (!event.id) {
    throw new Error('Event ID is required for update');
  }
  
  // Strip base64 images before sending to prevent payload size issues
  const eventToSend = stripBase64Images(event);
  
  const response = await fetch(`${API_BASE_URL}/api/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventToSend),
  });
  if (!response.ok) {
    throw new Error('Failed to update event');
  }
  return response.json();
};

// Upload an image file
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  const data = await response.json();
  return data.url;
};

// Add a module to an event
export const addModuleToEvent = async (
  eventId: string,
  moduleType: string
): Promise<EventModule> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ moduleType }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add module to event');
  }
  
  return response.json();
};

// Remove a module from an event
export const removeModuleFromEvent = async (
  eventId: string,
  moduleId: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/modules/${moduleId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove module from event');
  }
};

