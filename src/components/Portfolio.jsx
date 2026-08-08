import { useRef } from 'react';
import { Smartphone, GraduationCap, ShoppingBag, Terminal, ExternalLink } from 'lucide-react';
import erpDashboardMockup from '../assets/erp_dashboard_mockup.png';
import mobilePosMockup from '../assets/mobile_pos_mockup.png';
import ecommerceStoreMockup from '../assets/ecommerce_store_mockup.png';
import educationPortalMockup from '../assets/education_portal_mockup.png';

export default function Portfolio() {
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

  const projects = [
    {
      title: 'Mobile Parts ERP SaaS',
      subtitle: 'Enterprise System Architecture',
      desc: 'Next-generation ERP engineered for wholesale components distribution. Features compound SKU/IMEI databases, advanced MongoDB aggregation pipelines for real-time margin tracking, and intra-branch stock reconciliation.',
      icon: Terminal,
      tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Compound Indexes'],
      color: 'hover:border-purple-500/30',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      iconColor: 'text-purple-400 bg-purple-500/10',
      image: erpDashboardMockup,
      glowColor: 'rgba(168, 85, 247, 0.15)'
    },
    {
      title: 'Mobile POS System',
      subtitle: 'Retail & Wholesale App',
      desc: 'React Native mobile application featuring barcode scanner integration and offline-first database synchronization. Implements local cache reconciliation to queue invoices and sync in the background when connection returns.',
      icon: Smartphone,
      tags: ['React Native', 'Node.js', 'Tailwind CSS', 'IndexedDB', 'Sync Worker'],
      color: 'hover:border-sky-500/30',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      iconColor: 'text-sky-400 bg-sky-500/10',
      image: mobilePosMockup,
      glowColor: 'rgba(14, 165, 233, 0.15)'
    },
    {
      title: 'Adil Computers Store',
      subtitle: 'Headless E-Commerce Platform',
      desc: 'A high-speed headless Shopify storefront built using Next.js. Deploys custom database synchronizations that coordinate retail warehouse inventory logs directly with active web storefront states.',
      icon: ShoppingBag,
      tags: ['Next.js', 'Shopify Storefront API', 'PostgreSQL', 'TailwindCSS'],
      color: 'hover:border-emerald-500/30',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      image: ecommerceStoreMockup,
      glowColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      title: 'Education Management Portal',
      subtitle: 'Full-Stack Web SaaS Platform',
      desc: 'Comprehensive multi-tenant SaaS portal designed for academic institutions. Manages student registration workflows, automated fee generation pipelines, attendance monitoring, and real-time parent notifications.',
      icon: GraduationCap,
      tags: ['React', 'Firebase Firestore', 'TailwindCSS', 'Cloud Functions'],
      color: 'hover:border-amber-500/30',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconColor: 'text-amber-400 bg-amber-500/10',
      image: educationPortalMockup,
      glowColor: 'rgba(245, 158, 11, 0.15)'
    }
  ];

  return (
    <section id="portfolio" className="w-full py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 bg-dark-secondary relative">
      {/* Glow ambient backgrounds */}
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute right-10 top-1/3 w-80 h-80 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
                Case Studies
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl tracking-tight text-text-main uppercase select-none leading-none">
              Flagship <br />
              <span className="text-gradient-accent">Projects</span>
            </h2>
          </div>
          <p className="max-w-md text-accent-silver font-medium text-xs sm:text-sm md:text-base leading-relaxed">
            Discover how M-Tech Solutions builds custom tech infrastructure to automate work pipelines and scale web performance.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                data-cursor="view"
                data-cursor-text="case-study"
                style={{ '--glow-color': project.glowColor }}
                className={`bento-card group relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-dark border border-border-main p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] ${project.color} transition-all duration-500`}
              >
                {/* Custom Card Spotlight Glow */}
                <div className="bento-glow" />

                {/* Background image preview */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-20 sm:opacity-25 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bento-image-overlay" />
                </div>

                {/* Card Top Header */}
                <div className="relative z-10 flex justify-between items-start gap-2">
                  <div className={`p-3 sm:p-4 rounded-2xl border border-border-main transition-colors duration-500 ${project.iconColor}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className={`font-display text-[9px] sm:text-[10px] font-bold tracking-wider border rounded-full px-2.5 sm:px-3 py-1 bg-white/5 uppercase truncate max-w-[170px] sm:max-w-none ${project.badgeColor}`}>
                    {project.subtitle}
                  </span>
                </div>

                {/* Card Main Info */}
                <div className="relative z-10 mt-6 sm:mt-10 flex flex-col justify-end flex-grow">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text-main group-hover:text-accent transition-colors duration-500 mb-2 sm:mb-3 flex items-center gap-2">
                    <span>{project.title}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent shrink-0" />
                  </h3>
                  <p className="text-accent-silver text-xs sm:text-sm font-medium leading-relaxed mb-4 sm:mb-6">
                    {project.desc}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-border-main text-text-main/80"
                      >
                        {tag}
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
