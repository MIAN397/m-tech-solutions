import { useRef } from 'react';
import { Smartphone, GraduationCap, Terminal, ArrowUpRight, Globe, Layers, ExternalLink } from 'lucide-react';
import { trackQuoteClick } from '../utils/analytics';
import ccaLiveScreenshot from '../assets/cca_live_screenshot.png';
import ccaTestPortalScreenshot from '../assets/cca_test_portal_screenshot.png';
import mtechSolutionsScreenshot from '../assets/mtech_solutions_screenshot.png';
import portfolioV1Screenshot from '../assets/portfolio_v1_screenshot.png';
import erpDashboardMockup from '../assets/erp_dashboard_mockup.png';
import mobilePosMockup from '../assets/mobile_pos_mockup.png';

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
      title: 'Cadets Coaching Academy',
      subtitle: 'Production LMS & Admissions Portal',
      desc: 'Live full-stack academy portal combining Board education (Classes 1 to 10 FBISE/Punjab) with military & armed forces pre-commissioning. Features small batch admissions, interactive CBT exam simulator, student portal, and faculty administration.',
      icon: GraduationCap,
      tags: ['React 19', 'TypeScript', 'Vite 8', 'Firebase Firestore', 'Firebase Auth'],
      color: 'hover:border-amber-500/40',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconColor: 'text-amber-400 bg-amber-500/10',
      image: ccaLiveScreenshot,
      glowColor: 'rgba(245, 158, 11, 0.18)',
      liveUrl: 'https://cadets-coaching-academy-1234.web.app/',
      repoUrl: 'https://github.com/MIAN397/cadets-coaching-academy',
      isLive: true
    },
    {
      title: 'CCA Examination & Testing Portal',
      subtitle: 'Computer-Based Testing (CBT) SaaS',
      desc: 'Live high-stakes testing platform and faculty command portal. Features timed MCQ assessments, cohort student directory across multiple classes, instant scoring engines, quiz bank archives, and real-time cloud multi-sync.',
      icon: Layers,
      tags: ['React', 'TypeScript', 'Cloud Multi-Sync', 'Firebase Firestore', 'Realtime DB'],
      color: 'hover:border-purple-500/40',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      iconColor: 'text-purple-400 bg-purple-500/10',
      image: ccaTestPortalScreenshot,
      glowColor: 'rgba(168, 85, 247, 0.18)',
      liveUrl: 'https://ccap-testportal.web.app/',
      repoUrl: 'https://github.com/MIAN397/CCA-Test-portal',
      isLive: true
    },
    {
      title: 'M-Tech Solutions Web Platform',
      subtitle: 'Official Enterprise Architecture',
      desc: 'Production corporate web application engineered with high-velocity GSAP physics animations, interactive quotation builder, dark/light theme engine, and integrated partner management portals.',
      icon: Globe,
      tags: ['React 19', 'GSAP', 'TailwindCSS 4', 'Vite', 'Firebase Hosting'],
      color: 'hover:border-sky-500/40',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      iconColor: 'text-sky-400 bg-sky-500/10',
      image: mtechSolutionsScreenshot,
      glowColor: 'rgba(14, 165, 233, 0.18)',
      liveUrl: 'https://mtechsolutions.online/',
      repoUrl: 'https://github.com/MIAN397/m-tech-solutions',
      isLive: true
    },
    {
      title: 'Developer Portfolio & Design System',
      subtitle: 'Editorial Frontend Architecture',
      desc: 'Custom-crafted developer portfolio featuring editorial typography, custom cursor follower kinematics, preloader counter telemetry, experience journey timeline, and automated contact pipelines.',
      icon: Terminal,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Web3Forms', 'Micro-Interactions'],
      color: 'hover:border-emerald-500/40',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      image: portfolioV1Screenshot,
      glowColor: 'rgba(16, 185, 129, 0.18)',
      liveUrl: 'https://portfolio1-omega-gold-99.vercel.app',
      repoUrl: 'https://github.com/MIAN397/portfolio1',
      isLive: true
    },
    {
      title: 'Mobile Parts ERP SaaS',
      subtitle: 'Enterprise Distribution System',
      desc: 'Next-generation ERP engineered for wholesale components distribution. Features compound SKU/IMEI databases, advanced MongoDB aggregation pipelines for real-time margin tracking, and intra-branch stock reconciliation.',
      icon: Terminal,
      tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Compound Indexes'],
      color: 'hover:border-purple-500/30',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      iconColor: 'text-purple-400 bg-purple-500/10',
      image: erpDashboardMockup,
      glowColor: 'rgba(168, 85, 247, 0.15)',
      isLive: false
    },
    {
      title: 'Mobile POS System',
      subtitle: 'Offline-First Retail & Wholesale App',
      desc: 'React Native mobile application featuring barcode scanner integration and offline-first database synchronization. Implements local cache reconciliation to queue invoices and sync in the background when connection returns.',
      icon: Smartphone,
      tags: ['React Native', 'Node.js', 'Tailwind CSS', 'IndexedDB', 'Sync Worker'],
      color: 'hover:border-sky-500/30',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      iconColor: 'text-sky-400 bg-sky-500/10',
      image: mobilePosMockup,
      glowColor: 'rgba(14, 165, 233, 0.15)',
      isLive: false
    }
  ];

  return (
    <section id="portfolio" className="w-full py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 bg-dark-secondary relative">
      {/* Glow ambient backgrounds */}
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute right-10 top-1/3 w-80 h-80 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
                Real Projects & Live Deployments
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl tracking-tight text-text-main uppercase select-none leading-none">
              Shipped <br />
              <span className="text-gradient-accent">Web Projects</span>
            </h2>
          </div>
          <p className="max-w-md text-accent-silver font-medium text-xs sm:text-sm md:text-base leading-relaxed">
            Real screenshots captured from production web applications built and deployed by Tuaha Afzal. Click any project to explore the live application or source code.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                data-cursor="view"
                data-cursor-text={project.isLive ? 'live-site' : 'case-study'}
                style={{ '--glow-color': project.glowColor }}
                className={`bento-card group relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-dark border border-border-main p-6 sm:p-8 md:p-9 flex flex-col justify-between min-h-[440px] sm:min-h-[480px] ${project.color} transition-all duration-500 hover:-translate-y-1`}
              >
                {/* Custom Card Spotlight Glow */}
                <div className="bento-glow" />

                {/* Real Background image preview */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.title} - ${project.subtitle} real web screenshot`}
                    width="1440"
                    height="900"
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-cover object-top opacity-30 sm:opacity-35 group-hover:opacity-75 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/85 to-dark/40" />
                </div>

                {/* Card Top Header */}
                <div className="relative z-10 flex justify-between items-start gap-2">
                  <div className={`p-3 sm:p-3.5 rounded-2xl border border-border-main transition-colors duration-500 ${project.iconColor}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    {project.isLive && (
                      <span className="inline-flex items-center gap-1.5 font-display text-[9px] sm:text-[10px] font-bold tracking-wider rounded-full px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Live Web App
                      </span>
                    )}
                    <span className={`font-display text-[9px] sm:text-[10px] font-bold tracking-wider border rounded-full px-2.5 sm:px-3 py-1 bg-white/5 uppercase truncate max-w-[170px] sm:max-w-none ${project.badgeColor}`}>
                      {project.subtitle}
                    </span>
                  </div>
                </div>

                {/* Card Main Info */}
                <div className="relative z-10 mt-6 sm:mt-8 flex flex-col justify-end flex-grow">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text-main group-hover:text-accent transition-colors duration-500 mb-2 sm:mb-3">
                    {project.title}
                  </h3>
                  <p className="text-accent-silver text-xs sm:text-sm font-medium leading-relaxed mb-4 sm:mb-6">
                    {project.desc}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-1 rounded-lg bg-white/5 border border-border-main text-text-main/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Link Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-border-main/50">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          trackQuoteClick(`Visit Live - ${project.title}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-white font-display text-xs font-bold tracking-wide uppercase hover:bg-accent-hover transition-colors shadow-md"
                      >
                        <span>Visit Live Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : null}

                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-border-main text-accent-silver hover:text-text-main font-semibold text-xs transition-colors"
                      >
                        <span>Source Code</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : null}

                    <a
                      href="#contact"
                      onClick={() => trackQuoteClick(`Discuss System - ${project.title}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover ml-auto transition-colors"
                    >
                      <span>Discuss System</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
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
