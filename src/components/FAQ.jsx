import { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';
import { trackQuoteClick } from '../utils/analytics';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What custom software development services does M-Tech Solutions offer?',
      answer:
        'We specialize in end-to-end custom software engineering including Wholesale & Retail ERP systems, Mobile POS applications (iOS/Android with offline synchronization), Headless E-Commerce storefronts (Next.js/Shopify), real-time telemetry dashboards, and enterprise API microservices.'
    },
    {
      question: 'How do offline-first POS systems handle internet outages?',
      answer:
        'Our mobile POS applications are built using local storage (IndexedDB/SQLite) and dedicated background sync workers. When internet connectivity drops, billing, barcode scanning, and invoice printing continue seamlessly. When connection is restored, transactions reconcile and sync automatically with your central database.'
    },
    {
      question: 'Can your ERP integrate with our existing barcodes, printers, and legacy databases?',
      answer:
        'Yes. We engineer customized hardware bridges and API adapters that integrate with ESC/POS thermal receipt printers, handheld barcode/2D scanners, electronic cash drawers, and legacy SQL/Excel inventory exports without replacing your current physical infrastructure.'
    },
    {
      question: 'What is the typical timeline and process for a custom project?',
      answer:
        'Standard custom platforms are delivered in 2 to 6 weeks depending on feature complexity. Our process includes Discovery & System Architecture, Rapid Interactive Prototyping, Scalable Full-Stack Development, Rigorous Stress Testing, and Final Production Deployment with staff onboarding.'
    },
    {
      question: 'How can we get a free quotation and architectural consultation?',
      answer:
        'You can reach us directly on WhatsApp (+92 336 3800438), call our direct line, or send an email inquiry through our contact form. We provide a detailed scope analysis, tech stack recommendation, and fixed milestone pricing at zero upfront cost.'
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
                >
                  <span className="font-display font-bold text-sm sm:text-base md:text-lg text-text-main pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-xl border border-border-main shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-accent text-white border-accent' : 'bg-white/5 text-accent-silver'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-accent-silver text-xs sm:text-sm md:text-base leading-relaxed border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
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
