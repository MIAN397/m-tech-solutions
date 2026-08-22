import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, MessageCircle, ArrowUpRight, Star } from 'lucide-react';
import { trackWhatsAppClick, trackQuoteClick } from '../utils/analytics';

export default function Hero() {
  const canvasRef = useRef(null);
  const scrollBtnRef = useRef(null);
  const primaryBtnRef = useRef(null);
  const whatsappBtnRef = useRef(null);

  useEffect(() => {
    // 1. Dynamic Canvas Animation (Flow Wave Field)
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates tracker with easing interpolation
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Wave elements definition
    const waveCount = 4;
    const waves = Array.from({ length: waveCount }, (_, idx) => ({
      y: height / 2,
      length: 0.001 + idx * 0.0005,
      amplitude: 40 + idx * 12,
      frequency: 0.02 + idx * 0.005,
      opacity: 0.03 + (waveCount - idx) * 0.03,
      phase: idx * 50,
    }));

    let frame = 0;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw waves
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(47, 87, 255, ${wave.opacity})`;
        ctx.lineWidth = 1.5;

        for (let i = 0; i < width; i += 2) {
          // Adjust frequency & amplitude based on mouse relative proximity
          const distToMouse = Math.abs(i - mouse.x);
          const mouseFactor = Math.max(0, 1 - distToMouse / 400); // 400px radius
          const verticalShift = (mouse.y - height / 2) * 0.15 * mouseFactor;

          const y =
            height / 2 +
            Math.sin(i * wave.length + wave.phase + frame * wave.frequency) *
              wave.amplitude *
              (1 + mouseFactor * 0.5) +
            verticalShift;

          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 2. GSAP Entrance Animations
    const tl = gsap.timeline();
    tl.fromTo(
      '.hero-title-line',
      { y: 130, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', stagger: 0.15 }
    );
    tl.fromTo(
      '.hero-subhead',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    );
    tl.fromTo(
      '.hero-scroll-cta',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)' },
      '-=0.6'
    );

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 overflow-hidden bg-dark pt-24 md:pt-16 pb-12"
    >
      {/* Background Interactive Waves */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Grid Pattern Details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center mt-4 sm:mt-8 md:mt-12">
        {/* Social Proof Rating Badge */}
        <div className="hero-subhead inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-border-main backdrop-blur-md mb-6 shadow-sm opacity-0">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-text-main">4.98 Rating</span>
          <span className="text-accent-silver text-xs">•</span>
          <span className="text-xs font-semibold text-accent">50+ Enterprise Systems Delivered</span>
        </div>

        {/* Massive Typography Headers */}
        <h1 className="font-display font-extrabold tracking-tight text-text-main flex flex-col gap-1 md:gap-3 leading-tight sm:leading-none select-none text-[11vw] sm:text-[9vw] lg:text-[7.5vw] uppercase">
          <span className="overflow-hidden block py-0.5 sm:py-1">
            <span className="hero-title-line inline-block">We Shape</span>
          </span>
          <span className="overflow-hidden block py-0.5 sm:py-1 text-gradient-accent">
            <span className="hero-title-line inline-block">Digital Leaders</span>
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="hero-subhead max-w-xl md:max-w-2xl text-accent-silver text-sm sm:text-base md:text-xl font-medium tracking-wide mt-4 sm:mt-6 md:mt-8 leading-relaxed opacity-0">
          M-Tech Solutions scales businesses by building high-performance, custom digital products.
          From enterprise POS &amp; Inventory ERP architectures to premium web &amp; mobile platforms.
        </p>

        {/* High Conversion Dual Action Buttons */}
        <div className="hero-scroll-cta mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto opacity-0">
          <a
            href="#contact"
            ref={primaryBtnRef}
            onClick={() => trackQuoteClick('Hero Primary Button')}
            data-cursor="magnetic"
            className="w-full sm:w-auto bg-accent hover:bg-accent-blue text-white font-bold text-sm md:text-base px-8 py-4 rounded-full flex items-center justify-center gap-2.5 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 transform active:scale-95"
          >
            <span>Start Your Project</span>
            <ArrowUpRight className="w-5 h-5 shrink-0" />
          </a>

          <a
            href="https://wa.me/923363800438?text=Hi%20M-Tech%20Solutions,%20I'd%20like%20to%20discuss%20a%20custom%20software%20project"
            target="_blank"
            rel="noopener noreferrer"
            ref={whatsappBtnRef}
            onClick={() => trackWhatsAppClick('Hero Secondary Button')}
            data-cursor="magnetic"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-text-main border border-border-main hover:border-accent font-bold text-sm md:text-base px-7 py-4 rounded-full flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="hero-scroll-cta mt-10 md:mt-14 opacity-0 flex flex-col items-center">
          <a
            href="#about"
            ref={scrollBtnRef}
            data-cursor="magnetic"
            className="group flex flex-col items-center gap-1.5 text-accent-silver hover:text-accent transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Explore Capabilities</span>
            <ArrowDown className="w-4 h-4 text-accent animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
