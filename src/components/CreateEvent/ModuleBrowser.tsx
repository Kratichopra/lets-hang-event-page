import { useRecoilState, useRecoilValue } from 'recoil';
import { eventState, availableModulesState } from '../../state/atoms';
import type { ModuleDefinition } from '../../types/module';

interface ModuleBrowserProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleBrowser = ({ isOpen, onClose }: ModuleBrowserProps) => {
  const [event, setEvent] = useRecoilState(eventState);
  const availableModules = useRecoilValue(availableModulesState);

  // Map of module codes that have corresponding form fields
  const supportedFieldModules: Record<string, string> = {
    'capacity': 'capacity',
    'photo_gallery': 'photo_gallery',
    'links': 'links',
    'announcements': 'announcements',
    'download': 'download',
  };

  const handleAddModule = (module: ModuleDefinition) => {
    // Check if this module has a corresponding form field
    const fieldCode = supportedFieldModules[module.code];
    
    if (fieldCode) {
      // Add to enabledFields system (like QuickLinks)
      if (event.enabledFields.includes(fieldCode)) {
        alert(`${module.name} is already added.`);
        return;
      }

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
    } else {
      // For modules without form fields (like new_section, questionnaires, invite)
      // Show a message that they're not yet implemented as form fields
      alert(`${module.name} is not yet available as a form field. This feature will be added soon!`);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getModuleIcon = (code: string) => {
    switch (code) {
      case 'questionnaires':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'new_section':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'invite':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'photo_gallery':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'links':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'capacity':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'announcements':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] rounded-xl border border-white/20 overflow-hidden bg-white/10 backdrop-blur-md"
        style={{
          backgroundImage: `
            linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
            linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
          `,
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            
            <h2 className="text-xl font-semibold text-white">🎨 Customize</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Module List */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] px-6 py-4 space-y-3">
          {availableModules.map((module) => {
            const fieldCode = supportedFieldModules[module.code];
            const isAdded = fieldCode ? event.enabledFields.includes(fieldCode) : false;
            const isSupported = !!fieldCode;
            
            return (
              <div
                key={module.code}
                className="flex items-start gap-4 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/70">
                  {getModuleIcon(module.code)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Label (if exists) */}
                  {module.label && (
                    <div className="text-xs text-purple-200 mb-1 font-medium">{module.label}</div>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-base font-semibold text-white mb-1">
                    {module.name}
                    {!isSupported && (
                      <span className="ml-2 text-xs text-white/50 italic">(Coming soon)</span>
                    )}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-white/70 mb-2 line-clamp-2">
                    {module.description || 'No description available.'}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span className="font-medium">
                      {module.price === 'Paid' ? `${module.priceAmount || '$'} Paid` : 'Free'}
                    </span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 10-3 0v-6a1.5 1.5 0 013 0m6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                      <span>{formatNumber(module.usageCount || 0)} events</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{formatNumber(module.likesCount || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => handleAddModule(module)}
                  disabled={isAdded || !isSupported}
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    isAdded || !isSupported
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title={
                    isAdded 
                      ? 'Already added' 
                      : !isSupported 
                        ? 'Coming soon' 
                        : 'Add module'
                  }
                >
                  {isAdded ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

