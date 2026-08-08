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
      color: 'hover:border-accent-blue/30',
      iconColor: 'text-accent-blue bg-accent-blue/10',
      glowColor: 'rgba(47, 87, 255, 0.15)',
    },
    {
      title: 'Mobile Applications',
      subtitle: 'Native iOS & Android Engineering',
      desc: 'Fluid, cross-platform mobile experiences powered by React Native and Flutter. Offline-first architectures, background sync workers, push notifications, and intuitive mobile UI design.',
      icon: Laptop,
      cursorText: 'mobile-app',
      color: 'hover:border-purple-500/30',
      iconColor: 'text-purple-400 bg-purple-500/10',
      glowColor: 'rgba(168, 85, 247, 0.15)',
    },
    {
      title: 'Headless E-Commerce',
      subtitle: 'High-Conversion Web Storefronts',
      desc: 'Ultra-fast Next.js ecommerce platforms linked to custom inventory backends. Sub-second page transition speeds, localized checkout pipelines, and Shopify Storefront API integrations.',
      icon: Layers,
      cursorText: 'e-commerce',
      color: 'hover:border-emerald-500/30',
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      glowColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      title: 'Real-Time Analytics',
      subtitle: 'Live Telemetry & Reporting Dashboards',
      desc: 'Aggregation pipelines and web socket analytics. Instant profit margin calculations, stock alert triggers, automated financial summaries, and executive data visualizations.',
      icon: LineChart,
      cursorText: 'analytics',
      color: 'hover:border-amber-500/30',
      iconColor: 'text-amber-400 bg-amber-500/10',
      glowColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      title: 'API Infrastructure',
      subtitle: 'Scalable Microservices & Databases',
      desc: 'Resilient Node.js and Express API gateways built over MongoDB and PostgreSQL databases. High-throughput endpoints engineered with compound indexes and query caching.',
      icon: Cpu,
      cursorText: 'backend-api',
      color: 'hover:border-sky-500/30',
      iconColor: 'text-sky-400 bg-sky-500/10',
      glowColor: 'rgba(14, 165, 233, 0.15)',
    },
    {
      title: 'Security & Audit',
      subtitle: 'Enterprise Compliance & Firestore Rules',
      desc: 'Zero-trust security policies, audited Firebase Security Rules, encrypted user authentication, role authorization guards, and automated backup infrastructure.',
      icon: ShieldAlert,
      cursorText: 'sec-audit',
      color: 'hover:border-rose-500/30',
      iconColor: 'text-rose-400 bg-rose-500/10',
      glowColor: 'rgba(244, 63, 94, 0.15)',
    },
  ];

  return (
    <section id="services" className="w-full py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 bg-dark relative">
      {/* Decorative details */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-accent-blue/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
                What We Offer
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl tracking-tight text-text-main uppercase select-none leading-none">
              High-End <br />
              <span className="text-gradient-accent">Services</span>
            </h2>
          </div>
          <p className="max-w-md text-accent-silver font-medium text-xs sm:text-sm md:text-base leading-relaxed">
            We engineer custom, high-performance web products to elevate operational efficacy and extend your market reach.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                data-cursor="view"
                data-cursor-text={service.cursorText}
                style={{ '--glow-color': service.glowColor }}
                className={`bento-card group relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-dark-secondary border border-border-main p-6 sm:p-7 md:p-8 flex flex-col justify-between ${service.color} transition-all duration-500`}
              >
                {/* Custom Card Spotlight Glow */}
                <div className="bento-glow" />

                <div>
                  <div className="flex justify-between items-start mb-6 sm:mb-8">
                    <div className={`p-3 sm:p-4 rounded-2xl border border-border-main transition-colors duration-500 ${service.iconColor}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <span className="font-display text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent block mb-2">
                    {service.subtitle}
                  </span>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text-main group-hover:text-accent transition-colors duration-500 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-accent-silver text-xs sm:text-sm font-medium leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 border-t border-border-main/50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-accent-silver uppercase tracking-wider">Engineering Spec</span>
                  <span className="text-xs font-bold text-accent">Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
