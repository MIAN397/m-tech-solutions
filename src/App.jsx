import { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import PartnerPortal from './components/PartnerPortal';

export default function App() {
  const [view, setView] = useState('home'); // 'home' or 'portal'

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
          </main>
          {/* Conversion footer */}
          <Footer />
        </>
      ) : (
        <PartnerPortal onClose={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'instant' }); }} />
      )}
    </div>
  );
}
