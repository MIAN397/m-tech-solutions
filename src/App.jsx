import { useState, useEffect, lazy, Suspense } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import GithubShowcase from './components/GithubShowcase';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';

// Lazy-load PartnerPortal + Firebase Firestore SDK so initial page load & Core Web Vitals stay ultra-fast
const PartnerPortal = lazy(() => import('./components/PartnerPortal'));

export default function App() {
  const [view, setView] = useState('home'); // 'home' or 'portal'

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '');
    const routeToSection = {
      '/services': 'services',
      '/erp-software': 'services',
      '/pos-system': 'services',
      '/portfolio': 'portfolio',
      '/reviews': 'reviews',
      '/faq': 'faq',
      '/contact': 'contact',
      '/about': 'about',
    };
    const targetId = routeToSection[path];
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    }
  }, []);

  const toggleView = () => {
    setView(view === 'home' ? 'portal' : 'home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="relative w-full min-h-screen bg-dark overflow-hidden font-sans selection:bg-accent selection:text-white">
      {/* Noise filter texture for high-end aesthetic */}
      <div className="noise-bg" />

      {/* Cuberto-level morphing mouse cursor */}
      <CustomCursor />

      {/* Floating navigation bar */}
      <Navbar onPortalClick={toggleView} isPortalOpen={view === 'portal'} />

      {/* Page Sections */}
      {view === 'home' ? (
        <>
          <main>
            <Hero />
            <About />
            <Services />
            <Portfolio />
            <GithubShowcase />
            <Reviews />
            <FAQ />
          </main>
          {/* Conversion footer */}
          <Footer />
        </>
      ) : (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-accent font-display font-bold">Loading Partner Portal...</div>}>
          <PartnerPortal onClose={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'instant' }); }} />
        </Suspense>
      )}

      {/* Sticky Floating CTA Conversion Bar */}
      <FloatingCTA />
    </div>
  );
}
