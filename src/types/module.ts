export interface ModuleDefinition {
  code: string; // Backend code for the module (e.g., 'capacity', 'photo_gallery')
  name: string; // Display name (e.g., 'Capacity', 'Photo Gallery')
  icon?: string; // Icon identifier or component name
  description?: string;
  // Additional metadata for the Customize panel
  price?: 'Free' | 'Paid'; // Pricing info
  priceAmount?: string; // e.g., "$5" for paid modules
  usageCount?: number; // Number of events using this module
  likesCount?: number; // Popularity/likes count
  label?: string; // Optional label like "RSVP" for Invite module
}

