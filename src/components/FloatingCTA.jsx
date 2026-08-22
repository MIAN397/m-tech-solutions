import { useState, useEffect } from 'react';
import { MessageCircle, Phone, X, Sparkles } from 'lucide-react';
import { trackWhatsAppClick, trackPhoneClick } from '../utils/analytics';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating bar after scrolling 200px
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-end gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="p-3.5 bg-accent text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
          aria-label="Open Quick Contact"
        >
          <MessageCircle className="w-6 h-6 animate-pulse" />
        </button>
      ) : (
        <div className="glass-card bg-dark-secondary/90 backdrop-blur-xl border border-border-main p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center gap-2 sm:gap-3 max-w-[92vw] sm:max-w-md relative overflow-hidden">
          {/* Header Tag */}
          <div className="flex items-center gap-2 pl-1 pr-2 border-r border-border-main/60 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <span>Online</span>
                <Sparkles className="w-2.5 h-2.5" />
              </span>
              <span className="text-xs font-bold text-text-main leading-tight hidden sm:block">Quick Consult</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* WhatsApp Link */}
            <a
              href="https://wa.me/923363800438?text=Hi%20M-Tech%20Solutions,%20I'd%20like%20to%20discuss%20a%20project"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('Floating Widget')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg transition-all duration-200 active:scale-95 shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>WhatsApp</span>
            </a>

            {/* Direct Phone Call */}
            <a
              href="tel:+923363800438"
              onClick={() => trackPhoneClick('Floating Widget')}
              className="bg-white/5 hover:bg-white/10 text-text-main border border-border-main hover:border-accent font-bold text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 active:scale-95 shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span className="hidden xs:inline sm:inline">Call</span>
            </a>
          </div>

          {/* Minimize button */}
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 text-accent-silver hover:text-text-main hover:bg-white/10 rounded-lg transition-colors ml-1"
            aria-label="Minimize Widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
