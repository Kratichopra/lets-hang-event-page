import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { eventState } from '../../state/atoms';
import { createEvent, updateEvent } from '../../services/apiClient';
import { CustomizeSection } from './CustomizeSection';

export const EventForm = () => {
  const [event, setEvent] = useRecoilState(eventState);
  const [showMore, setShowMore] = useState(false);

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
      let savedEvent;
      if (event.id) {
        // In real backend: savedEvent = await updateEvent(event);
        savedEvent = await updateEvent(event);
      } else {
        // In real backend: savedEvent = await createEvent(event);
        savedEvent = await createEvent(event);
      }
      setEvent(savedEvent);
      alert('Event saved successfully!');
      console.log('Saved event:', savedEvent);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
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
                  <input
                    type="text"
                    placeholder="Capacity"
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
                <div className="flex items-center justify-between px-4 py-3">
                  <input
                    type="text"
                    placeholder="Links (format: label, url)"
                    value={event.links?.map(l => `${l.label}, ${l.url}`).join('; ') || ''}
                    onChange={(e) => {
                      const links = e.target.value.split(';').map(s => {
                        const [label, url] = s.split(',').map(x => x.trim());
                        return { label: label || '', url: url || '' };
                      }).filter(l => l.label || l.url);
                      handleFieldValueChange('links', links);
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white placeholder:opacity-70 text-base"
                  />
                  <button
                    onClick={() => handleRemoveField('links')}
                    className="ml-2 text-white/70 hover:text-white cursor-pointer"
                  >
                    ×
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
          className="mt-8 py-3.5 px-8 bg-white/10 backdrop-blur-md text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 w-full hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
          onClick={handleSave}
        >
          🚀 Go live
        </button>
      </div>
    </div>
  );
};

