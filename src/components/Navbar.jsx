import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Phone, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';

export default function Navbar({ onPortalClick, isPortalOpen }) {
  const brandRef = useRef(null);
  const btnRef = useRef(null);
  const toggleRef = useRef(null);
  const portalRef = useRef(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage theme state
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      setIsLight(true);
    } else {
      document.documentElement.classList.remove('light');
      setIsLight(false);
    }

    // Magnetic Effect logic for branding & CTA button & toggle
    const makeMagnetic = (el, power = 0.3) => {
      if (!el) return;

      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) * power;
        const y = (e.clientY - centerY) * power;

        gsap.to(el, {
          x: x,
          y: y,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
        });
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    const cleanupBrand = makeMagnetic(brandRef.current, 0.25);
    const cleanupBtn = makeMagnetic(btnRef.current, 0.35);
    const cleanupToggle = makeMagnetic(toggleRef.current, 0.35);
    const cleanupPortal = makeMagnetic(portalRef.current, 0.35);

    // Initial Navbar Entrance Fade In
    gsap.fromTo(
      '.nav-item',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.3 }
    );

    return () => {
      if (cleanupBrand) cleanupBrand();
      if (cleanupBtn) cleanupBtn();
      if (cleanupToggle) cleanupToggle();
      if (cleanupPortal) cleanupPortal();
    };
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('light')) {
      html.classList.remove('light');
      setIsLight(false);
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.add('light');
      setIsLight(true);
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-nav py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* Brand logo (magnetic hover trigger) */}
      <div className="nav-item">
        <a
          href="#home"
          onClick={(e) => {
            if (isPortalOpen) {
              e.preventDefault();
              onPortalClick();
            }
          }}
          ref={brandRef}
          data-cursor="magnetic"
          className="inline-block transition-transform duration-200"
        >
          <Logo />
        </a>
      </div>

      {/* Navigation Menu / Contact CTA */}
      <div className="flex items-center gap-4 md:gap-6 nav-item">
        <a
          href="tel:+923363800438"
          data-cursor="magnetic"
          className="hidden lg:flex items-center gap-2 text-sm font-semibold text-accent-silver hover:text-text-main transition-colors duration-200 mr-2"
        >
          <Phone className="w-4 h-4 text-accent" />
          <span>+92 336 3800438</span>
        </a>

        {/* Partner Portal Toggler */}
        <button
          onClick={onPortalClick}
          ref={portalRef}
          data-cursor="magnetic"
          className="text-xs md:text-sm font-bold uppercase tracking-wider text-accent-silver hover:text-text-main transition-colors duration-200 px-2 py-1"
        >
          {isPortalOpen ? 'Home Workspace' : 'Partner Portal'}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          ref={toggleRef}
          data-cursor="magnetic"
          className="p-3 bg-white/5 border border-border-main rounded-full hover:border-accent hover:bg-accent/15 transition-all duration-300 text-text-main flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-accent" />
          ) : (
            <Sun className="w-4 h-4 text-accent" />
          )}
        </button>

        {/* Let's Talk CTA */}
        <a
          href="#contact"
          onClick={(e) => {
            if (isPortalOpen) {
              e.preventDefault();
              onPortalClick();
              // Scroll to contact after view transitions
              setTimeout(() => {
                const el = document.getElementById('contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }}
          ref={btnRef}
          data-cursor="magnetic"
          className="magnetic-btn bg-text-main hover:bg-accent text-dark hover:text-white font-bold text-sm px-4 py-3 sm:px-6 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-lg transition-all duration-300 transform active:scale-95 shrink-0"
        >
          <span className="hidden sm:inline">Let's Talk</span>
          <span className="sm:hidden text-xs">Talk</span>
          <ArrowUpRight className="w-4 h-4 shrink-0" />
        </a>
      </div>
    </nav>
  );
}
