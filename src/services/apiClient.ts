import type { Event, EventModule } from '../types/event';
import type { ModuleDefinition } from '../types/module';

/**
 * API Client - Handles all HTTP requests to the backend
 * Works with both mock backend (localhost:3000) and production backend
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Failed to create event');
  }
  return response.json();
};

// Update an existing event
export const updateEvent = async (event: Event): Promise<Event> => {
  if (!event.id) {
    throw new Error('Event ID is required for update');
  }
  const response = await fetch(`${API_BASE_URL}/api/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
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

