import { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';
import { trackQuoteClick } from '../utils/analytics';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What custom software development services does M-Tech Solutions offer?',
      answer:
        'M-Tech Solutions specializes in end-to-end custom software engineering including Wholesale & Retail ERP systems, Offline-First Mobile POS applications (iOS, Android & Desktop with automatic cloud sync), Mobile Parts compatibility & distribution ERPs, Learning Management Systems (LMS) & CBT Examination Portals, Headless E-Commerce storefronts (Next.js/Shopify), real-time telemetry dashboards, and enterprise API microservices.'
    },
    {
      question: 'How do M-Tech Solutions offline-first POS systems handle internet outages?',
      answer:
        'Our mobile and desktop POS applications are engineered using local-first storage (IndexedDB and SQLite) paired with dedicated background sync workers and deterministic conflict resolution. When internet connectivity drops, barcode scanning, invoice billing, customer ledger updates, and thermal receipt printing continue at 100% speed with zero downtime. Once connectivity returns, queued transactions automatically reconcile and sync with your central cloud database.'
    },
    {
      question: 'Can your custom ERP integrate with existing barcode scanners, thermal printers, and legacy databases?',
      answer:
        'Yes. We engineer customized hardware bridges (WebUSB, Web Bluetooth, raw TCP/IP socket printing, and serial COM adapters) that integrate seamlessly with 80mm/58mm ESC/POS thermal receipt printers, handheld 1D/2D barcode and QR scanners, electronic cash drawers (RJ11/RJ12), label printers, and legacy SQL/Excel inventory exports without replacing your existing physical hardware.'
    },
    {
      question: 'What makes your Mobile Parts & Wholesale Distribution ERP unique?',
      answer:
        'Our Mobile Parts ERP is purpose-built for electronics and component wholesalers. It features hierarchical categorization for LCD/OLED screens, IC chips, flex cables, and batteries, cross-model compatibility matrices across smartphone generations, IMEI and serial number batch tracking, RMA warranty claim verification, multi-branch stock transfers, landed cost calculation, and tiered B2B/VIP wholesale pricing.'
    },
    {
      question: 'Do you build custom Learning Management Systems (LMS) and Computer-Based Testing (CBT) portals?',
      answer:
        'Yes. We have engineered and deployed production academic platforms such as the Cadets Coaching Academy LMS and the CCA Examination & Testing Portal, supporting 15,000+ concurrent student sessions, timed MCQ exam simulators, automated instant grading, cohort management, and multi-role faculty administration.'
    },
    {
      question: 'What technology stack does M-Tech Solutions use for enterprise web and mobile apps?',
      answer:
        'We build with modern, battle-tested technologies: React 19, Next.js, TypeScript, Tailwind CSS, and GSAP for sub-second frontends; React Native and Flutter for cross-platform mobile apps; and Node.js, Express, Firebase (Firestore, Realtime DB, Auth, Hosting), PostgreSQL, and MongoDB for high-throughput, zero-trust cloud backends.'
    },
    {
      question: 'What is the typical delivery timeline and pricing model for a custom software project?',
      answer:
        'Standard custom platforms are delivered in 2 to 6 weeks depending on module complexity. We follow an agile milestone workflow: 1) Discovery & System Architecture, 2) Interactive UI/UX Prototyping, 3) Full-Stack Sprint Engineering, 4) Stress Testing & Hardware Verification, and 5) Production Deployment with staff training. All projects use transparent, fixed-milestone pricing with zero hidden fees.'
    },
    {
      question: 'How can we get a free quotation and architectural consultation from M-Tech Solutions?',
      answer:
        'You can message or call us directly on WhatsApp at +92 336 3800438, email mtechsolutions.online@gmail.com, or click "Start Your Project" on our website (https://mtechsolutions.online/). Our principal software architect Tuaha Afzal provides a comprehensive scope analysis, database architecture recommendation, and fixed-milestone quotation at zero upfront cost.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="w-full py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 bg-dark relative border-t border-border-main/50">
      {/* Visual Accent Glow */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <div className="flex items-center gap-2 mb-3 md:mb-4 px-3.5 py-1.5 rounded-full bg-white/5 border border-border-main">
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span className="font-display text-xs font-bold tracking-widest text-accent uppercase">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight text-text-main leading-tight">
            Got Questions? <br />
            <span className="text-gradient-accent">We've Got Answers.</span>
          </h2>
          <p className="max-w-xl text-accent-silver font-medium text-xs sm:text-sm md:text-base mt-4 leading-relaxed">
            Everything you need to know about our custom software engineering, ERP architecture, and engagement models.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-accent/40 bg-white/[0.03]' : 'border-border-main hover:border-border-main/80 bg-white/[0.01]'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="font-display font-bold text-sm sm:text-base md:text-lg text-text-main pr-2">
                    {faq.question}
                  </h3>
                  <div
                    className={`p-2 rounded-xl border border-border-main shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-accent text-white border-accent' : 'bg-white/5 text-accent-silver'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  hidden={!isOpen}
                  className={`px-5 sm:px-6 pb-6 pt-1 text-accent-silver text-xs sm:text-sm md:text-base leading-relaxed border-t border-white/5 ${
                    isOpen ? 'block animate-in fade-in slide-in-from-top-2 duration-300' : 'hidden'
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-accent/10 via-white/5 to-purple-500/10 border border-border-main flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-text-main mb-1">
              Have a specific project in mind?
            </h3>
            <p className="text-accent-silver text-xs sm:text-sm">
              Speak with our principal software engineer for a personalized architectural review.
            </p>
          </div>
          <a
            href="#contact"
            onClick={() => trackQuoteClick('FAQ Bottom CTA')}
            className="bg-text-main hover:bg-accent text-dark hover:text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg shrink-0 active:scale-95"
          >
            <span>Ask a Question</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
