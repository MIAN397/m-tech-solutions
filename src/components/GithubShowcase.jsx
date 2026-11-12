import { useState } from 'react';
import { ExternalLink, ArrowUpRight, FolderGit2, CheckCircle2, Globe } from 'lucide-react';
import ccaLiveScreenshot from '../assets/cca_live_screenshot.png';
import ccaTestPortalScreenshot from '../assets/cca_test_portal_screenshot.png';
import mtechSolutionsScreenshot from '../assets/mtech_solutions_screenshot.png';
import portfolioV1Screenshot from '../assets/portfolio_v1_screenshot.png';

export default function GithubShowcase() {
  const [activeProjectKey, setActiveProjectKey] = useState('cca');

  const liveProjects = {
    cca: {
      title: 'Cadets Coaching Academy',
      badge: 'Full-Stack LMS & Admissions Portal',
      displayUrl: 'cadets-coaching-academy-1234.web.app',
      liveUrl: 'https://cadets-coaching-academy-1234.web.app/',
      repoUrl: 'https://github.com/MIAN397/cadets-coaching-academy',
      image: ccaLiveScreenshot,
      desc: 'Complete institutional web application and Learning Management System designed for military and academic coaching. Built with React 19, TypeScript, and Firebase Firestore. Supports dual academic tracks (FBISE/Punjab boards and Cadet College pre-commissioning), 1:15 small batch student tracking, interactive CBT test simulator, and multi-role faculty administration.',
      tech: ['React 19', 'TypeScript', 'Vite 8', 'Firebase Firestore', 'Firebase Auth', 'TailwindCSS'],
      metrics: [
        { label: 'Academic Streams', value: 'Classes 1–10 + Armed Forces' },
        { label: 'CBT Simulator', value: '750+ Questions Ready' },
        { label: 'Deployment', value: 'Firebase Global CDN' }
      ]
    },
    cbt: {
      title: 'CCA Examination & Testing Portal',
      badge: 'CBT Exam SaaS & Faculty Command',
      displayUrl: 'ccap-testportal.web.app',
      liveUrl: 'https://ccap-testportal.web.app/',
      repoUrl: 'https://github.com/MIAN397/CCA-Test-portal',
      image: ccaTestPortalScreenshot,
      desc: 'High-concurrency Computer-Based Testing (CBT) portal and Faculty Command Center. Enables faculty to manage student cohorts across classes (PAF College Sargodha Prep, Military Colleges), conduct timed MCQ assessments with live countdowns, archive quiz banks, and review detailed answer sheets with Cloud Multi-Sync.',
      tech: ['React', 'TypeScript', 'Cloud Multi-Sync', 'Firestore', 'Realtime DB', 'Security Rules'],
      metrics: [
        { label: 'Cohort Engine', value: 'Class VIII PAF Prep' },
        { label: 'Sync Protocol', value: 'Live Multi-Sync' },
        { label: 'Evaluation', value: 'Instant Grading Engine' }
      ]
    },
    mtech: {
      title: 'M-Tech Solutions Web Platform',
      badge: 'Enterprise Architecture & Agency Engine',
      displayUrl: 'mtechsolutions.online',
      liveUrl: 'https://mtechsolutions.online/',
      repoUrl: 'https://github.com/MIAN397/m-tech-solutions',
      image: mtechSolutionsScreenshot,
      desc: 'High-converting corporate agency platform architected for speed, modern aesthetics, and business automation. Integrates fluid GSAP kinetic typography, magnetic cursor controllers, interactive quotation builder, and dynamic multi-tenant partner portal modules.',
      tech: ['React 19', 'GSAP', 'TailwindCSS 4', 'Vite', 'Firebase Hosting', 'Google Analytics'],
      metrics: [
        { label: 'UI Physics', value: 'GSAP Kinetics' },
        { label: 'Portal', value: 'Real-time Partner Hub' },
        { label: 'Performance', value: '99+ PageSpeed Core' }
      ]
    },
    portfolio: {
      title: 'Tuaha Afzal — Developer Portfolio',
      badge: 'Editorial Frontend & Design System',
      displayUrl: 'github.com/MIAN397/portfolio1',
      liveUrl: 'https://portfolio1-omega-gold-99.vercel.app',
      repoUrl: 'https://github.com/MIAN397/portfolio1',
      image: portfolioV1Screenshot,
      desc: 'Editorial-grade portfolio designed with luxury typography, dark-room color palettes, custom cursor follower physics, numeric preloader telemetry, career milestone roadmap, and Web3Forms contact integration.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Web3Forms', 'GSAP Scroll', 'Custom Cursor'],
      metrics: [
        { label: 'Design System', value: 'Editorial Dark' },
        { label: 'Interactions', value: 'Custom Follower' },
        { label: 'Architecture', value: 'Component-First' }
      ]
    }
  };

  const currentProject = liveProjects[activeProjectKey];

  return (
    <section id="github" className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-dark relative overflow-hidden border-t border-border-main/50">
      {/* Background ambient lighting */}
      <div className="absolute left-1/4 top-0 w-96 h-96 bg-accent/5 rounded-full filter blur-[130px] pointer-events-none" />
      <div className="absolute right-10 bottom-10 w-96 h-96 bg-sky-500/5 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
                Live Repositories & Real Web Deployments
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl tracking-tight text-text-main uppercase select-none leading-none">
              Explore Live <br />
              <span className="text-gradient-accent">Web Projects</span>
            </h2>
          </div>
          <p className="max-w-md text-accent-silver font-medium text-xs sm:text-sm md:text-base leading-relaxed">
            Real screenshots captured from production web applications built in Tuaha Afzal's GitHub repositories. Toggle below to preview each live web platform.
          </p>
        </div>

        {/* Project Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {Object.entries(liveProjects).map(([key, item]) => {
            const isActive = activeProjectKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveProjectKey(key)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-display font-bold transition-all duration-300 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-[1.02]'
                    : 'bg-white/[0.03] text-accent-silver border-border-main hover:border-accent/40 hover:text-text-main'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-green-400'} animate-pulse`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Live Chrome Browser Showcase Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Chrome Browser Mockup Window with Real Screenshot */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="rounded-3xl bg-dark-secondary border border-border-main overflow-hidden shadow-2xl">
              {/* Browser window chrome toolbar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-dark border-b border-border-main gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-border-main text-xs text-accent-silver font-mono">
                    <Globe className="w-3.5 h-3.5 text-accent" />
                    <span className="truncate max-w-[220px] sm:max-w-md text-text-main font-semibold">
                      https://{currentProject.displayUrl}
                    </span>
                  </div>
                </div>

                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent/15 text-accent border border-accent/30 text-xs font-bold hover:bg-accent hover:text-white transition-all"
                >
                  <span>Open Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Real Chrome Screenshot */}
              <div className="relative group overflow-hidden bg-black/60">
                <img
                  key={activeProjectKey}
                  src={currentProject.image}
                  alt={`${currentProject.title} real live screenshot`}
                  className="w-full h-auto max-h-[500px] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />

                {/* Floating overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 rounded-xl bg-dark/95 backdrop-blur-md border border-border-main text-xs shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-semibold text-text-main">
                      Verified Live Deployment
                    </span>
                  </div>
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-accent hover:underline text-xs"
                  >
                    Visit App
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Real Screenshot Caption */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-border-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-accent-silver">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>
                  Real screenshot captured via automated Google Chrome DevTools from live deployment.
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={currentProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Project Deep-Dive & Architecture Info */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Project Details Card */}
            <div className="p-6 rounded-3xl bg-dark-secondary border border-border-main flex flex-col gap-4">
              <div>
                <span className="font-display text-[10px] font-bold tracking-wider rounded-full px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 uppercase">
                  {currentProject.badge}
                </span>
                <h3 className="font-display font-bold text-2xl text-text-main mt-3 mb-2 leading-tight">
                  {currentProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-accent-silver leading-relaxed">
                  {currentProject.desc}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 gap-2.5 pt-3 border-t border-border-main">
                {currentProject.metrics.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-border-main">
                    <span className="text-[11px] font-semibold text-accent-silver">{m.label}</span>
                    <span className="text-[11px] font-bold text-text-main">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-2">
                <p className="text-[10px] font-bold text-accent-silver uppercase tracking-wider mb-2">
                  Engineered With
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentProject.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-border-main text-text-main/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-border-main">
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
                >
                  <Globe className="w-4 h-4" />
                  <span>Launch Live Web App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={currentProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-border-main text-accent-silver hover:text-text-main font-semibold text-xs transition-colors duration-300"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-accent" />
                  <span>View Source on GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
