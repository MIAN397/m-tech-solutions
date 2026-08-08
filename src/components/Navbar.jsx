import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Phone, ArrowUpRight, Sun, Moon, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export default function Navbar({ onPortalClick, isPortalOpen }) {
  const brandRef = useRef(null);
  const btnRef = useRef(null);
  const toggleRef = useRef(null);
  const portalRef = useRef(null);
  const [isLight, setIsLight] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' }
  ];

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

    // Magnetic Effect logic for elements
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
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
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
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power4.out', delay: 0.2 }
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

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    if (isPortalOpen) {
      e.preventDefault();
      onPortalClick();
      setTimeout(() => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 glass-nav py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        {/* Brand logo (magnetic hover trigger) */}
        <div className="nav-item">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            ref={brandRef}
            data-cursor="magnetic"
            className="inline-block transition-transform duration-200"
          >
            <Logo />
          </a>
        </div>

        {/* Center Desktop Navigation Bar */}
        <div
          className="hidden md:flex items-center gap-1 border border-border-main rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-sm nav-item"
          style={{ backgroundColor: 'var(--nav-pill-bg)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              data-cursor="magnetic"
              className="text-xs font-bold uppercase tracking-wider text-accent-silver hover:text-accent hover:bg-accent/10 px-3.5 py-1.5 rounded-full transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Section Actions & Controls */}
        <div className="flex items-center gap-3 md:gap-5 nav-item">
          <a
            href="tel:+923363800438"
            data-cursor="magnetic"
            className="hidden xl:flex items-center gap-2 text-xs font-semibold text-accent-silver hover:text-accent transition-colors duration-200 mr-1"
          >
            <Phone className="w-3.5 h-3.5 text-accent" />
            <span>+92 336 3800438</span>
          </a>

          {/* Partner Portal Toggler */}
          <button
            onClick={onPortalClick}
            ref={portalRef}
            data-cursor="magnetic"
            className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-accent-silver hover:text-accent transition-colors duration-200 px-2 py-1"
          >
            {isPortalOpen ? 'Home Workspace' : 'Partner Portal'}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            ref={toggleRef}
            data-cursor="magnetic"
            className="p-2.5 border border-border-main rounded-full hover:border-accent hover:bg-accent/15 transition-all duration-300 text-text-main flex items-center justify-center"
            style={{ backgroundColor: 'var(--nav-pill-bg)' }}
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
            onClick={(e) => handleNavClick(e, '#contact')}
            ref={btnRef}
            data-cursor="magnetic"
            className="magnetic-btn bg-text-main hover:bg-accent text-dark hover:text-white font-bold text-xs sm:text-sm px-4 py-2.5 sm:px-5 sm:py-3 rounded-full flex items-center gap-1.5 shadow-lg transition-all duration-300 transform active:scale-95 shrink-0"
          >
            <span className="hidden sm:inline">Let's Talk</span>
            <span className="sm:hidden text-xs">Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 border border-border-main rounded-full text-text-main hover:bg-accent/10 transition-colors"
            style={{ backgroundColor: 'var(--nav-pill-bg)' }}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-accent" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[73px] z-40 bg-dark/95 backdrop-blur-xl border-b border-border-main py-6 px-6 flex flex-col gap-5 md:hidden transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Navigation</span>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-bold text-text-main hover:text-accent transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-border-main flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onPortalClick();
              }}
              className="w-full text-left text-sm font-bold uppercase tracking-wider text-accent-silver hover:text-accent py-1"
            >
              {isPortalOpen ? 'Return to Home Workspace' : 'Open Partner Portal'}
            </button>

            <a
              href="tel:+923363800438"
              className="flex items-center gap-2 text-sm font-semibold text-accent-silver py-1"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>+92 336 3800438</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
