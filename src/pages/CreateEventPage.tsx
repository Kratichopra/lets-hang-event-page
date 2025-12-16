import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useSetRecoilState } from 'recoil';
import { availableModulesState, eventState } from '../state/atoms';
import { getAvailableModules } from '../services/apiClient';
import { Navbar } from '../components/CreateEvent/Navbar';
import { FlyerSection } from '../components/CreateEvent/FlyerSection';
import { EventForm } from '../components/CreateEvent/EventForm';

export const CreateEventPage = () => {
  const setAvailableModules = useSetRecoilState(availableModulesState);
  const event = useRecoilValue(eventState);

  useEffect(() => {
    // Load available modules on mount
    const loadModules = async () => {
      const modules = await getAvailableModules();
      setAvailableModules(modules);
    };
    loadModules();
  }, [setAvailableModules]);

  return (
    <div 
      className="flex flex-col mx-auto rounded-2xl shadow-2xl overflow-hidden relative"
      style={{
        width: '1440px',
        minHeight: '1036px',
        backgroundImage: event.backgroundImage 
          ? `url(${event.backgroundImage})` 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Collective blur overlay - only when background image is set */}
      {event.backgroundImage && (
        <div className="absolute inset-0 backdrop-blur-md bg-white/5 pointer-events-none z-0" />
      )}
      
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <FlyerSection />
          <EventForm />
        </div>
      </div>
    </div>
  );
};

