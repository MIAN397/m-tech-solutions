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
    words.forEach((word, idx) => {
      const span = document.createElement('span');
      span.className = 'inline-block opacity-15 transition-all duration-300';
      span.textContent = word;
      textEl.appendChild(span);
      wordSpans.push(span);

      // Append actual space node between words
      if (idx < words.length - 1) {
        textEl.appendChild(document.createTextNode(' '));
      }
    });

    // GSAP ScrollTrigger timeline to scrub word reveal
    const revealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: textEl,
        start: 'top 85%',
        end: 'bottom 45%',
        scrub: true,
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
      className="relative w-full min-h-[80vh] flex flex-col justify-center items-center py-24 md:py-36 px-6 md:px-12 bg-dark-secondary"
    >
      <div className="w-full max-w-5xl flex flex-col justify-start">
        {/* Category tag */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
            Our Philosophy
          </span>
        </div>

        <h2
          ref={textRef}
          className="font-display font-bold leading-normal text-2xl sm:text-4xl md:text-5xl lg:text-[4vw] tracking-tight text-text-main select-none"
        >
          At M-Tech Solutions (also written as MTech Solutions or M Tech Solutions), we do not just write code. We craft premium digital ecosystems that drive efficiency,
          expand market footprint, and scale your operations. Our team is dedicated to
          bridging beautiful design with hyper-performance systems.
        </h2>

        {/* Small details footer */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-12 border-t border-border-main">
          <div>
            <h3 className="font-display font-bold text-lg mb-3 uppercase tracking-wider text-text-main">
              The Cuberto Way
            </h3>
            <p className="text-accent-silver text-sm md:text-base leading-relaxed font-medium">
              We believe a digital product is a living piece of art. Every transition, every
              micro-interaction, and every pixel should feel intentional, fluid, and responsive to
              the touch.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-3 uppercase tracking-wider text-text-main">
              Uncompromising Performance
            </h3>
            <p className="text-accent-silver text-sm md:text-base leading-relaxed font-medium">
              Our codebases are optimized for lightning-fast loads, SEO crawlability, and modular
              scaling. By decoupling static layouts and applying micro-animations, we achieve an
              elite standard of responsiveness.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
