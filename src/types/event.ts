export interface Event {
  id?: string;
  name: string;
  dateTime: string;
  location: string;
  description: string;
  cost?: string; // Cost per person
  flyerImage?: string; // URL or base64 for the flyer image
  backgroundImage?: string; // URL or base64 for the background image
  modules: EventModule[]; // Array of added modules (deprecated - using fields instead)
  // Quick link fields
  capacity?: string;
  photoGallery?: string[];
  links?: Array<{ url: string; label: string }>;
  announcements?: string;
  download?: string;
  // Track which fields are enabled
  enabledFields: string[]; // Array of field codes that are enabled (e.g., ['capacity', 'links'])
}

export interface EventModule {
  id: string;
  type: string; // Module type code from backend (e.g., 'capacity', 'photo_gallery')
  config: Record<string, any>; // Module-specific configuration
}

