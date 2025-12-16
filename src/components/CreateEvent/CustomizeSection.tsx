import { useState } from 'react';
import { ModuleBrowser } from './ModuleBrowser';

export const CustomizeSection = () => {
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);

  return (
    <>
      <div 
        className="mt-6 rounded-xl border border-white/20 overflow-hidden relative"
        style={{
          backgroundImage: `
            linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
            linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
          `,
          backgroundBlendMode: 'overlay',
          minHeight: '140px',
        }}
      >
        {/* Scattered Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Megaphone icon - top left, more scattered */}
          <div className="absolute top-3 left-4 text-white/40">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>

          {/* People with microphone icon - more scattered, different position */}
          <div className="absolute top-17 left-30 text-white/40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 0v4m0-4h4m-4 0H8" />
            </svg>
          </div>

          {/* Checklist/list icon - more scattered */}
          <div className="absolute top-2 left-1/4 text-white/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>

          {/* Chain link icon - top right, more scattered */}
          <div className="absolute top-4 right-8 text-white/40">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>

          {/* Photo gallery icon - more scattered, different position */}
          <div className="absolute top-10 right-30 text-white/40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* RSVP text - bottom right, more scattered */}
          <div className="absolute bottom-25 right-50 text-white/50 italic bold text-xs font-medium">
            RSVP
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 px-8 py-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-4 leading-relaxed">
            Customize your<br />
            event your way
          </h3>

          {/* Customize Button */}
          <button
            onClick={() => setIsBrowserOpen(true)}
            className="py-3.5 px-8 bg-white/10 backdrop-blur-md text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 w-full hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
          >
            <span className="text-center">🎨 Customize</span>
          </button>
        </div>
      </div>

      <ModuleBrowser isOpen={isBrowserOpen} onClose={() => setIsBrowserOpen(false)} />
    </>
  );
};
