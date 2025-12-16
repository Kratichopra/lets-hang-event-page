import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { eventState } from '../../state/atoms';
import { createEvent, updateEvent } from '../../services/apiClient';
import { CustomizeSection } from './CustomizeSection';
import { Notification, type NotificationType } from '../Notification';

export const EventForm = () => {
  const [event, setEvent] = useRecoilState(eventState);
  const [showMore, setShowMore] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  // Main visible modules (always shown)
  const mainModules = [
    { code: 'capacity', name: 'Capacity', icon: 'users' },
    { code: 'photo_gallery', name: 'Photo Gallery', icon: 'images' },
    { code: 'links', name: 'Links', icon: 'link' },
  ];

  // Modules in "Show more" section
  const moreModules = [
    { code: 'announcements', name: 'Announcements', icon: 'megaphone' },
    { code: 'download', name: 'Download', icon: 'download' },
  ];

  const handleFieldChange = (field: keyof typeof event, value: string | string[] | Array<{ url: string; label: string }>) => {
    setEvent({ ...event, [field]: value });
  };

  const handleSave = async () => {
    try {
      // Preserve original images before sending to backend
      const originalFlyerImage = event.flyerImage;
      const originalBackgroundImage = event.backgroundImage;
      
      let savedEvent;
      if (event.id) {
        // In real backend: savedEvent = await updateEvent(event);
        savedEvent = await updateEvent(event);
      } else {
        // In real backend: savedEvent = await createEvent(event);
        savedEvent = await createEvent(event);
      }
      
      // Merge saved event with original images to keep base64 data in frontend
      const eventWithOriginalImages = {
        ...savedEvent,
        flyerImage: originalFlyerImage || savedEvent.flyerImage,
        backgroundImage: originalBackgroundImage || savedEvent.backgroundImage,
      };
      
      setEvent(eventWithOriginalImages);
      setNotification({
        message: 'Event saved successfully!',
        type: 'success',
        isVisible: true,
      });
      console.log('Saved event:', savedEvent);
    } catch (error) {
      console.error('Error saving event:', error);
      setNotification({
        message: 'Failed to save event. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const handleRemoveField = (fieldCode: string) => {
    const updatedEnabledFields = event.enabledFields.filter(f => f !== fieldCode);
    const updatedEvent: typeof event = {
      ...event,
      enabledFields: updatedEnabledFields,
    };
    
    // Clear field values when removed
    if (fieldCode === 'capacity') {
      updatedEvent.capacity = undefined;
    } else if (fieldCode === 'photo_gallery') {
      updatedEvent.photoGallery = undefined;
    } else if (fieldCode === 'links') {
      updatedEvent.links = undefined;
    } else if (fieldCode === 'announcements') {
      updatedEvent.announcements = undefined;
    } else if (fieldCode === 'download') {
      updatedEvent.download = undefined;
    }
    
    setEvent(updatedEvent);
  };

  const handleFieldValueChange = (fieldCode: string, value: any) => {
    setEvent({ ...event, [fieldCode]: value });
  };

  const handleAddField = (fieldCode: string) => {
    // Check if field already exists
    const allModules = [...mainModules, ...moreModules];
    if (event.enabledFields.includes(fieldCode)) {
      alert(`${allModules.find(m => m.code === fieldCode)?.name || 'This field'} is already added.`);
      return;
    }

    // Add field to enabledFields and initialize its value
    const updatedEnabledFields = [...event.enabledFields, fieldCode];
    let updatedEvent: typeof event = {
      ...event,
      enabledFields: updatedEnabledFields,
    };

    // Initialize field values based on type
    if (fieldCode === 'capacity') {
      updatedEvent = { ...updatedEvent, capacity: '' };
    } else if (fieldCode === 'photo_gallery') {
      updatedEvent = { ...updatedEvent, photoGallery: [] };
    } else if (fieldCode === 'links') {
      updatedEvent = { ...updatedEvent, links: [] };
    } else if (fieldCode === 'announcements') {
      updatedEvent = { ...updatedEvent, announcements: '' };
    } else if (fieldCode === 'download') {
      updatedEvent = { ...updatedEvent, download: '' };
    }

    setEvent(updatedEvent);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/10">
      <div className="flex-1 p-7 px-10 overflow-y-auto">
        <div className="mb-6">
          <input
            id="event-name"
            type="text"
            placeholder="Name your event"
            value={event.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full border-none outline-none bg-transparent text-5xl font-semibold mb-6 placeholder:text-5xl placeholder:font-semibold"
            style={{
              fontFamily: "'SF Pro Display', sans-serif",
              backgroundImage: event.name
                ? `
                  linear-gradient(var(--Text-Secondary-OLD-2,rgba(252, 252, 252, 0.5))),
                  linear-gradient(var(--Text-Secondary-OLD-1,rgb(206, 189, 189)))
                `
                : 'none',
              backgroundBlendMode: 'luminosity, overlay',
              WebkitBackgroundClip: event.name ? 'text' : 'unset',
              backgroundClip: event.name ? 'text' : 'unset',
              WebkitTextFillColor: event.name ? 'transparent' : undefined,
              color: event.name ? 'transparent' : 'rgba(206, 189, 189)',
            }}
          />
        </div>

        {/* Phone number field */}
        <div 
          className="mb-6 rounded-xl border border-white/20 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
              linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
            `,
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center flex-1">
            ⚒️
              <input
                id="event-phone"
                type="tel"
                placeholder="Enter phone number to save the draft"
                value={event.phoneNumber || ''}
                onChange={(e) => handleFieldChange('phoneNumber' as keyof typeof event, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white placeholder:opacity-70 text-base"
              />
            </div>
            <button
              onClick={handleSave}
              className="ml-2 w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              title="Save draft"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Top section with Date, Location, and Cost fields */}
        <div 
          className="mb-6 rounded-xl border border-white/20 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
              linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
            `,
            backgroundBlendMode: 'overlay',
          }}
        >
          {/* Date and time field */}
          <div className="flex items-center px-4 py-3 border-b border-white/10">
          🗓️<input
              id="event-datetime"
            
              value={event.dateTime}
              onChange={(e) => handleFieldChange('dateTime', e.target.value)}
              placeholder=" Date and time"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#ffffff]  text-base"
            />
          </div>

          {/* Location field */}
          <div className="flex items-center px-4 py-3 border-b border-white/10">
          📍
            <input
              id="event-location"
              type="text"
              placeholder=" Location"
              value={event.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#ffffff]  text-base"
            />
          </div>

          {/* Cost per person field */}
          <div className="flex items-center px-4 py-3">
          💵 
            <input
              id="event-cost"
              type="text"
              placeholder="Cost per person"
              value={event.cost || ''}
              onChange={(e) => handleFieldChange('cost' as keyof typeof event, e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#ffffff] text-base"
            />
          </div>
        </div>

        {/* Bottom section - Description textarea */}
        <div 
          className="mb-6 rounded-xl border border-white/20 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
              linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
            `,
            backgroundBlendMode: 'overlay',
          }}
        >
          <textarea
            id="event-description"
            placeholder="Describe your event"
            value={event.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-[682px] px-4 py-3 bg-transparent border-none outline-none text-white placeholder:text-[#ffffff]  text-base resize-none h-[75px]"
            rows={4}
          />
        </div>

       

        

        {/* Render enabled fields */}
        {event.enabledFields.length > 0 && (
          <div className="mt-6 space-y-4">
            {event.enabledFields.includes('capacity') && (
              <div 
                className="rounded-xl border border-white/20 overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
                    linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
                  `,
                  backgroundBlendMode: 'overlay',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3 ">
                👥 
                  <input
                    type="text"
                    placeholder="  Add capacity"
                    value={event.capacity || ''}
                    onChange={(e) => handleFieldValueChange('capacity', e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white placeholder:opacity-70 text-base"
                  />
                  <button
                    onClick={() => handleRemoveField('capacity')}
                    className="ml-2 text-white/70 hover:text-white cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {event.enabledFields.includes('photo_gallery') && (
              <div 
                className="rounded-xl border border-white/20 overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
                    linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
                  `,
                  backgroundBlendMode: 'overlay',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <input
                    type="text"
                    placeholder="Photo Gallery"
                    value={event.photoGallery?.join(', ') || ''}
                    onChange={(e) => handleFieldValueChange('photoGallery', e.target.value.split(',').map(s => s.trim()))}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white placeholder:opacity-70 text-base"
                  />
                  <button
                    onClick={() => handleRemoveField('photo_gallery')}
                    className="ml-2 text-white/70 hover:text-white cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {event.enabledFields.includes('links') && (
              <div 
                className="rounded-xl border border-white/20 overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
                    linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
                  `,
                  backgroundBlendMode: 'overlay',
                }}
              >
                {/* Links list */}
                <div className="px-4 py-3 space-y-3">
                  {(() => {
                    const displayLinks = event.links && event.links.length > 0 
                      ? event.links 
                      : [{ url: '', label: '' }];
                    
                    return displayLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex items-center flex-1">
                          <span className="text-white/70 mr-3">🔗</span>
                          <input
                            type="text"
                            placeholder="Add link"
                            value={link.url || ''}
                            onChange={(e) => {
                              const currentLinks = event.links && event.links.length > 0 
                                ? [...event.links] 
                                : [];
                              
                              // Ensure we have enough items in the array
                              while (currentLinks.length <= index) {
                                currentLinks.push({ url: '', label: '' });
                              }
                              
                              currentLinks[index] = {
                                url: e.target.value,
                                label: e.target.value, // Use URL as label by default
                              };
                              
                              handleFieldValueChange('links', currentLinks);
                            }}
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white placeholder:opacity-70 text-base"
                          />
                        </div>
                        {displayLinks.length > 1 && (
                          <button
                            onClick={() => {
                              const currentLinks = event.links && event.links.length > 0 
                                ? [...event.links] 
                                : [];
                              currentLinks.splice(index, 1);
                              // Keep at least one empty link
                              const finalLinks = currentLinks.length > 0 
                                ? currentLinks 
                                : [{ url: '', label: '' }];
                              handleFieldValueChange('links', finalLinks);
                            }}
                            className="text-white/70 hover:text-white cursor-pointer text-xl"
                            title="Remove link"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ));
                  })()}
                </div>

                {/* Add another link button */}
                <div className="px-4 pb-3">
                  <button
                    onClick={() => {
                      const currentLinks = event.links || [];
                      handleFieldValueChange('links', [...currentLinks, { url: '', label: '' }]);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-1 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add another link</span>
                  </button>
                </div>

             
              </div>
            )}

            {event.enabledFields.includes('announcements') && (
              <div 
                className="rounded-xl border border-white/20 overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
                    linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
                  `,
                  backgroundBlendMode: 'overlay',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <textarea
                    placeholder="Announcements"
                    value={event.announcements || ''}
                    onChange={(e) => handleFieldValueChange('announcements', e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white placeholder:opacity-70 text-base resize-none min-h-[60px]"
                    rows={2}
                  />
                  <button
                    onClick={() => handleRemoveField('announcements')}
                    className="ml-2 text-white/70 hover:text-white cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {event.enabledFields.includes('download') && (
              <div 
                className="rounded-xl border border-white/20 overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
                    linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
                  `,
                  backgroundBlendMode: 'overlay',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <input
                    type="text"
                    placeholder="Download URL"
                    value={event.download || ''}
                    onChange={(e) => handleFieldValueChange('download', e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white placeholder:opacity-70 text-base"
                  />
                  <button
                    onClick={() => handleRemoveField('download')}
                    className="ml-2 text-white/70 hover:text-white cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Links Section */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2.5 items-center">
            {mainModules.map((module) => (
              <button
                key={module.code}
                className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-sm font-medium text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => handleAddField(module.code)}
                title={module.name}
              >
                + {module.name}
              </button>
            ))}
            
            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className="text-purple-200 hover:text-purple-100 text-sm font-medium cursor-pointer transition-colors"
              >
                Show more
              </button>
            )}
          </div>

          {showMore && (
            <div className="mt-3 flex flex-wrap gap-2.5">
              {moreModules.map((module) => (
                <button
                  key={module.code}
                  className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-sm font-medium text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => handleAddField(module.code)}
                  title={module.name}
                >
                  + {module.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <CustomizeSection />

        <button 
          className="mt-8 py-3.5 px-8 bg-white/10 backdrop-blur-md text-white border-2 border-white rounded-full rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 w-full hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
          onClick={handleSave}
        >
          🚀 Go live
        </button>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  );
};

