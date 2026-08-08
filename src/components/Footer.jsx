import { useState } from 'react';
import { MessageCircle, Phone, ArrowUpRight, Mail } from 'lucide-react';
import { Logo } from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText('mtechsolutions.online@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="relative w-full bg-dark border-t border-border-main pt-16 sm:pt-20 md:pt-32 pb-12 px-4 sm:px-6 md:px-12 overflow-hidden"
    >
      {/* Visual Accent Glow */}
      <div className="absolute left-10 bottom-0 w-80 h-80 bg-accent-blue/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto flex flex-col justify-between">
        {/* Core Conversion Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-12 sm:mb-16 md:mb-24">
          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
                Start a Conversation
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-7xl uppercase tracking-tighter text-text-main select-none leading-[0.95] mb-6 sm:mb-8">
              Let's Build <br />
              <span className="text-gradient-accent">Something</span> <br />
              Great.
            </h2>
            <p className="text-accent-silver font-medium text-xs sm:text-base md:text-lg leading-relaxed max-w-md">
              Have an idea or operational block? Contact us to architect systems that expand your
              market reach.
            </p>
          </div>

          {/* Contact Details Bento Card */}
          <div
            data-cursor="footer"
            className="glass-card rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-12 flex flex-col justify-between border border-border-main relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-6 sm:gap-8 relative z-10">
              {/* WhatsApp Call to Action */}
              <a
                href="https://wa.me/923363800438"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group pb-5 sm:pb-6 border-b border-border-main hover:border-accent transition-colors duration-300"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-white/5 rounded-2xl group-hover:bg-accent/15 transition-all duration-300">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-text-main group-hover:text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-accent-silver uppercase tracking-wider mb-0.5">
                      WhatsApp Business
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-text-main group-hover:text-accent transition-colors duration-300">
                      +92 336 3800438
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent-silver group-hover:text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </a>

              {/* Direct Phone Call */}
              <a
                href="tel:+923363800438"
                className="flex items-center justify-between group pb-5 sm:pb-6 border-b border-border-main hover:border-accent transition-colors duration-300"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-white/5 rounded-2xl group-hover:bg-accent/15 transition-all duration-300">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-text-main group-hover:text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-accent-silver uppercase tracking-wider mb-0.5">
                      Direct Line
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-text-main group-hover:text-accent transition-colors duration-300">
                      +92 336 3800438
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent-silver group-hover:text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </a>

              {/* Email Inquiry */}
              <a
                href="mailto:mtechsolutions.online@gmail.com"
                onClick={handleEmailClick}
                className="flex items-center justify-between group pb-5 sm:pb-6 border-b border-border-main hover:border-accent transition-colors duration-300"
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className="p-2.5 sm:p-3 bg-white/5 rounded-2xl group-hover:bg-accent/15 transition-all duration-300 shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-text-main group-hover:text-accent" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5 transition-colors duration-300">
                      {copied ? (
                        <span className="text-accent font-bold">Copied to Clipboard!</span>
                      ) : (
                        <span className="text-accent-silver">Email Address</span>
                      )}
                    </p>
                    <p className="text-xs sm:text-base md:text-lg font-bold text-text-main group-hover:text-accent transition-colors duration-300 truncate">
                      mtechsolutions.online@gmail.com
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent-silver group-hover:text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Sub-Bar */}
        <div className="pt-8 border-t border-border-main flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo iconClassName="w-5 h-5 sm:w-6 sm:h-6" />
            <p className="text-[11px] sm:text-xs font-semibold text-accent-silver">
              &copy; {currentYear} M-Tech Solutions. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/mtechsolutions.online/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              aria-label="Instagram"
              className="p-2.5 sm:p-3 bg-white/5 border border-border-main rounded-full text-accent-silver hover:text-text-main hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Facebook Link */}
            <a
              href="#"
              data-cursor="magnetic"
              aria-label="Facebook"
              className="p-2.5 sm:p-3 bg-white/5 border border-border-main rounded-full text-accent-silver hover:text-text-main hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
