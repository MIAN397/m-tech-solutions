import { useRef } from 'react';
import { Layers, Database, ShieldAlert, Cpu, Laptop, LineChart } from 'lucide-react';

export default function Services() {
  const cardsRef = useRef([]);

  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const services = [
    {
      title: 'Management Systems',
      subtitle: 'Robust Custom CRM / ERP Architecture',
      desc: 'High-performance administrative systems tailored for enterprise operations. Fully secure, multi-tenant databases, custom roles/permissions, automated reports, and fluid control dashboards.',
      icon: Database,
      cursorText: 'systems',
      span: 'md:col-span-2',
      details: ['Multi-role RBAC', 'Cloud Data Sync', 'Automated Reports', 'API Endpoints']
    },
    {
      title: 'Inventory Solutions',
      subtitle: 'Real-time Stocks & POS Systems',
      desc: 'Liquid-smooth point-of-sale software coupled with barcode systems. Low-latency database syncing, stock warning trackers, sales forecasting analytics, and clean digital invoicing.',
      icon: Layers,
      cursorText: 'stocks',
      span: 'md:col-span-1',
      details: ['Barcode scanner API', 'Low stock alerts', 'Automated invoicing', 'Offline cache support']
    },
    {
      title: 'Premium Web Apps',
      subtitle: 'Conversion-Focused Web Applications',
      desc: 'Cuberto-inspired digital presences that capture client attention instantly. Optimized for SEO, featuring custom headless CMS integration, blazing fast response times, high-end GSAP scroll aesthetics, and seamless payment gateways.',
      icon: Laptop,
      cursorText: 'web-apps',
      span: 'md:col-span-3',
      details: ['Static Generation (SSG)', 'Micro-animations', 'Stripe/Local Payments', 'Dynamic Headless CMS']
    }
  ];

  return (
    <section id="services" className="w-full py-24 md:py-36 px-6 md:px-12 bg-dark relative">
      {/* Decorative details */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-accent-blue/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
                What We Offer
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight text-text-main uppercase select-none leading-none">
              High-End <br />
              <span className="text-gradient-accent">Services</span>
            </h2>
          </div>
          <p className="max-w-md text-accent-silver font-medium text-sm md:text-base leading-relaxed">
            We engineering custom, high-performance web products to elevate operational efficacy and extend your market reach.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                data-cursor="view"
                data-cursor-text={service.cursorText}
                className={`bento-card group relative overflow-hidden rounded-[32px] bg-dark-secondary border border-border-main p-8 md:p-10 flex flex-col justify-between min-h-[400px] hover:border-accent/30 transition-all duration-500 ${service.span}`}
              >
                {/* Spotlight hover effect background */}
                <div className="bento-glow" />

                {/* Top: Icons & Badges */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="p-4 bg-white/5 rounded-2xl border border-border-main group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors duration-500">
                    <Icon className="w-8 h-8 text-text-main group-hover:text-accent transition-colors duration-500" />
                  </div>
                  <span className="font-display text-xs font-semibold tracking-wider text-accent-silver border border-border-main rounded-full px-3 py-1 bg-white/5 uppercase">
                    {service.subtitle}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="relative z-10 mt-12 md:mt-16 flex flex-col justify-end">
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-text-main group-hover:text-accent transition-colors duration-500 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-accent-silver text-sm md:text-base font-medium leading-relaxed mb-6 max-w-2xl">
                    {service.desc}
                  </p>

                  {/* Micro features list */}
                  <div className="flex flex-wrap gap-2">
                    {service.details.map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-border-main text-text-main/70"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
