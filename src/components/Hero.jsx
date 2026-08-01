import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef(null);
  const scrollBtnRef = useRef(null);

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
      amplitude: 50 + idx * 15,
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

    // 3. Scroll Button Magnetic Effect
    const btn = scrollBtnRef.current;
    if (btn) {
      const handleBtnMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) * 0.4;
        const y = (e.clientY - centerY) * 0.4;

        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      };

      const handleBtnLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      };

      btn.addEventListener('mousemove', handleBtnMove);
      btn.addEventListener('mouseleave', handleBtnLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        btn.removeEventListener('mousemove', handleBtnMove);
        btn.removeEventListener('mouseleave', handleBtnLeave);
      };
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-12 overflow-hidden bg-dark"
    >
      {/* Background Interactive Waves */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Grid Pattern Details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center mt-12 md:mt-20">
        {/* Massive Typography Headers */}
        <h1 className="font-display font-extrabold tracking-tight text-text-main flex flex-col gap-1 md:gap-3 leading-none select-none text-[12vw] sm:text-[9vw] lg:text-[7.5vw] uppercase">
          <span className="overflow-hidden block py-1">
            <span className="hero-title-line inline-block">We Shape</span>
          </span>
          <span className="overflow-hidden block py-1 text-gradient-accent">
            <span className="hero-title-line inline-block">Digital Leaders</span>
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="hero-subhead max-w-xl md:max-w-2xl text-accent-silver text-base md:text-xl font-medium tracking-wide mt-6 md:mt-8 leading-relaxed opacity-0">
          M-Tech Solutions scales businesses by building high-performance, custom digital products.
          From enterprise architectures to premium web experiences.
        </p>

        {/* Explore Button */}
        <div className="hero-scroll-cta mt-12 md:mt-16 opacity-0">
          <a
            href="#about"
            ref={scrollBtnRef}
            data-cursor="magnetic"
            className="magnetic-btn w-28 h-28 md:w-32 md:h-32 border border-border-main rounded-full flex flex-col items-center justify-center gap-2 hover:border-accent hover:bg-accent/5 transition-colors duration-300"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-main">
              Explore
            </span>
            <ArrowDown className="w-4 h-4 text-accent animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
