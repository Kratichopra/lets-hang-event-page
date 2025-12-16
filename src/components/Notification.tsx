import { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Notification = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}: NotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-500/20',
      border: 'border-green-400/50',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-500/20',
      border: 'border-red-400/50',
      icon: '✕',
    },
    info: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-400/50',
      icon: 'ℹ',
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`
          ${style.bg} ${style.border}
          backdrop-blur-md border-2 rounded-lg px-4 py-3
          shadow-2xl min-w-[300px] max-w-[400px]
          flex items-center justify-between gap-3
        `}
        style={{
          backgroundImage: `
            linear-gradient(var(--Materials-Ultrathin-2, #2525258C)),
            linear-gradient(var(--Materials-Ultrathin-1, #9C9C9C))
          `,
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="text-white text-xl font-bold">{style.icon}</span>
          <p className="text-white text-sm font-medium flex-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors cursor-pointer text-lg"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

