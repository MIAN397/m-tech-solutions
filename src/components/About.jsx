import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    // Split text into words
    const words = textEl.textContent.trim().split(/\s+/);
    textEl.innerHTML = ''; // Clear original text

    // Create wrapper spans for each word
    const wordSpans = [];
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'inline-block opacity-60 transition-all duration-300';
      span.textContent = word;

      // Add a space between words
      textEl.appendChild(span);
      textEl.appendChild(document.createTextNode(' '));
      wordSpans.push(span);
    });

    // Create ScrollTrigger animation for text reveal
    const revealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });

    revealTimeline.to(wordSpans, {
      opacity: 1,
      color: 'var(--text-primary)',
      stagger: 0.05,
      ease: 'power1.out',
    });

    return () => {
      // Clean up triggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === textEl) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full min-h-[80vh] flex flex-col justify-center items-center py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 bg-dark-secondary"
    >
      <div className="w-full max-w-5xl flex flex-col justify-start">
        {/* Category tag */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
            Our Philosophy
          </span>
        </div>

        {/* Scroll-driven typography reveal */}
        <h2
          ref={textRef}
          className="font-display font-extrabold text-xl sm:text-3xl md:text-5xl lg:text-6xl text-text-main leading-snug sm:leading-tight md:leading-tight uppercase tracking-tight select-none"
        >
          We build software for businesses that value speed, design, and reliable technology. We turn complex business ideas into clean, easy-to-use digital applications.
        </h2>

        {/* Keyword-Rich Core Competencies for SEO & Visitor Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 sm:mt-16 pt-10 border-t border-border-main/60">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-border-main">
            <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider mb-1 text-accent">
              Custom ERP Systems
            </h3>
            <p className="text-accent-silver text-xs leading-relaxed">
              Multi-branch inventory control, automated accounting, supplier ledger reconciliation, and live profit margins.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-border-main">
            <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider mb-1 text-sky-400">
              Offline Mobile POS
            </h3>
            <p className="text-accent-silver text-xs leading-relaxed">
              Barcode scanning, instant invoice generation, thermal printer integration, and background sync during outages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-border-main">
            <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider mb-1 text-emerald-400">
              Headless Web Apps
            </h3>
            <p className="text-accent-silver text-xs leading-relaxed">
              Sub-second Next.js web storefronts with automated Shopify inventory linkage and custom API microservices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-border-main">
            <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider mb-1 text-purple-400">
              Full-Stack Cloud
            </h3>
            <p className="text-accent-silver text-xs leading-relaxed">
              Enterprise React, Node.js, and MongoDB architectures engineered for high-throughput scaling and zero downtime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
