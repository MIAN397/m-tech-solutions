import { useState, useRef } from 'react';
import { Star, Quote, CheckCircle, Globe, Smartphone, Server, Layers } from 'lucide-react';

export default function Reviews() {
  const [activeTab, setActiveTab] = useState('all');
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

  const reviews = [
    {
      id: 1,
      category: 'web',
      name: 'Adil Raza',
      role: 'Director of Operations',
      company: 'Adil Computers & Retail Store',
      avatar: 'AR',
      rating: 5,
      tag: 'Headless E-Commerce Web Platform',
      icon: Globe,
      color: 'hover:border-emerald-500/30',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      metric: '+320% Speed',
      content:
        'M-Tech Solutions engineered a custom Next.js headless Shopify storefront integrated directly with our retail warehouse database. Site performance skyrocketed, and multi-branch inventory mismatches dropped to zero. Highly recommended for enterprise web apps!'
    },
    {
      id: 2,
      category: 'mobile',
      name: 'Muhammad Usama',
      role: 'General Manager',
      company: 'Al-Razaq Mobile Components',
      avatar: 'MU',
      rating: 5,
      tag: 'React Native Offline Mobile POS',
      icon: Smartphone,
      color: 'hover:border-sky-500/30',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      iconColor: 'text-sky-400 bg-sky-500/10',
      glowColor: 'rgba(14, 165, 233, 0.15)',
      metric: '100% Zero-Downtime',
      content:
        'The mobile POS app changed the way counter sales and warehouse technicians operate. Even during internet outages in our storage basement, transactions queue locally and sync automatically when reconnected. Unmatched mobile app craftsmanship.'
    },
    {
      id: 3,
      category: 'web',
      name: 'Ali Khan',
      role: 'Co-Founder & CTO',
      company: 'Apex Logistics & Trade',
      avatar: 'AK',
      rating: 5,
      tag: 'Wholesale ERP & Supply Chain System',
      icon: Server,
      color: 'hover:border-purple-500/30',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      iconColor: 'text-purple-400 bg-purple-500/10',
      glowColor: 'rgba(168, 85, 247, 0.15)',
      metric: '< 100ms Query',
      content:
        'Their compound SKU and serial tracking system cut our wholesale invoicing time from minutes down to milliseconds. The custom MongoDB aggregation pipeline and clean, responsive web interface make daily operations effortless.'
    },
    {
      id: 4,
      category: 'mobile',
      name: 'Hamza Farooq',
      role: 'Head of Fleet Operations',
      company: 'OmniTech Mobility',
      avatar: 'HF',
      rating: 5,
      tag: 'Cross-Platform Mobile App & Dashboard',
      icon: Layers,
      color: 'hover:border-amber-500/30',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconColor: 'text-amber-400 bg-amber-500/10',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      metric: '4.9 App Rating',
      content:
        'From slick mobile micro-animations to real-time dispatch web portals, M-Tech delivered a full-stack solution ahead of schedule. Their attention to UX detail on both iOS/Android views and admin panels set a high standard.'
    },
    {
      id: 5,
      category: 'web',
      name: 'Dr. Tariq Mahmood',
      role: 'Academic Director',
      company: 'FutureGen Education Portal',
      avatar: 'TM',
      rating: 5,
      tag: 'Full-Stack Student Portal Web App',
      icon: Globe,
      color: 'hover:border-rose-500/30',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      iconColor: 'text-rose-400 bg-rose-500/10',
      glowColor: 'rgba(244, 63, 94, 0.15)',
      metric: '15k+ Sessions',
      content:
        'During peak examination enrollment, our student web portal sustained over 15,000 active concurrent users without any lag. Instant payment processing callbacks and intuitive dashboard design made it a huge success.'
    },
    {
      id: 6,
      category: 'mobile',
      name: 'Saad Ahmed',
      role: 'VP of Product',
      company: 'QuickServe Retail Apps',
      avatar: 'SA',
      rating: 5,
      tag: 'Hybrid Mobile Order & Inventory App',
      icon: Smartphone,
      color: 'hover:border-cyan-500/30',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      iconColor: 'text-cyan-400 bg-cyan-500/10',
      glowColor: 'rgba(6, 182, 212, 0.15)',
      metric: '99.98% Crash-Free',
      content:
        'M-Tech Solutions built an extremely stable mobile scanning and billing app for our store staff. Barcode reading speed is instantaneous, memory usage is super low, and code architecture is very clean.'
    }
  ];

  const filteredReviews =
    activeTab === 'all'
      ? reviews
      : reviews.filter((review) => review.category === activeTab);

  return (
    <section id="reviews" className="relative w-full py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 overflow-hidden bg-dark">
      {/* Background Accent Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span className="font-display text-xs md:text-sm font-bold tracking-widest text-accent uppercase">
                Client Reviews & Endorsements
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-text-main leading-tight">
              Engineered for Impact. <br />
              <span className="text-gradient-accent">Trusted by Leaders.</span>
            </h2>
          </div>

          <p className="text-accent-silver font-medium text-xs sm:text-sm md:text-lg leading-relaxed max-w-md">
            Discover how our custom web platforms and mobile applications empower businesses with high performance, stability, and growth.
          </p>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 glass-card rounded-2xl border border-border-main mb-8 sm:mb-12">
          <div className="flex flex-col gap-1 border-r border-border-main/50 pr-2 sm:pr-4">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-text-main">4.98 / 5</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-accent-silver font-medium">Average Rating</span>
          </div>

          <div className="flex flex-col gap-1 border-r-0 lg:border-r border-border-main/50 pl-2 sm:pl-4 pr-2 sm:pr-4">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-accent">50+</span>
            <span className="text-[10px] sm:text-xs text-accent-silver font-medium">Apps Delivered</span>
            <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold uppercase tracking-wider">100% Production Ready</span>
          </div>

          <div className="flex flex-col gap-1 border-r border-border-main/50 pr-2 sm:pr-4 pl-0 lg:pl-4 pt-2 lg:pt-0 border-t lg:border-t-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-text-main">99.9%</span>
            <span className="text-[10px] sm:text-xs text-accent-silver font-medium">System Uptime</span>
            <span className="text-[9px] sm:text-[10px] text-sky-400 font-bold uppercase tracking-wider">Enterprise Architecture</span>
          </div>

          <div className="flex flex-col gap-1 pl-2 sm:pl-4 pt-2 lg:pt-0 border-t lg:border-t-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-purple-400">100%</span>
            <span className="text-[10px] sm:text-xs text-accent-silver font-medium">Client Retention</span>
            <span className="text-[9px] sm:text-[10px] text-purple-400 font-bold uppercase tracking-wider">Dedicated Engineering</span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'all'
                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                : 'bg-white/5 text-accent-silver hover:bg-white/10 hover:text-text-main border border-border-main'
            }`}
          >
            All Reviews ({reviews.length})
          </button>

          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'web'
                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                : 'bg-white/5 text-accent-silver hover:bg-white/10 hover:text-text-main border border-border-main'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Web Apps ({reviews.filter((r) => r.category === 'web').length})
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'mobile'
                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                : 'bg-white/5 text-accent-silver hover:bg-white/10 hover:text-text-main border border-border-main'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile Apps ({reviews.filter((r) => r.category === 'mobile').length})
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredReviews.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                style={{
                  '--glow-color': item.glowColor
                }}
                className={`glass-card rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 flex flex-col justify-between border border-border-main ${item.color} transition-all duration-500 relative overflow-hidden group hover:-translate-y-1`}
              >
                {/* Mouse-following gradient glow */}
                <div
                  className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px]"
                  style={{
                    background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--glow-color), transparent 80%)`
                  }}
                />

                <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                  {/* Top Badges & Category Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border truncate max-w-[180px] sm:max-w-none ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${item.iconColor}`}>
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>

                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-white/10 group-hover:text-accent/30 transition-colors" />
                  </div>

                  {/* Review Text */}
                  <p className="text-text-main text-xs sm:text-sm md:text-base leading-relaxed font-normal italic">
                    "{item.content}"
                  </p>
                </div>

                {/* Footer Client Info & Metric */}
                <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border-main/60 flex flex-col gap-2.5 sm:gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center font-display font-bold text-accent text-xs sm:text-sm shadow-inner shrink-0">
                        {item.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-text-main">{item.name}</h4>
                          <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                        </div>
                        <p className="text-[11px] sm:text-xs text-accent-silver font-medium">{item.role}</p>
                        <p className="text-[10px] sm:text-[11px] text-accent-silver/80 font-normal">{item.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Impact Metric Pill */}
                  <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-bold text-accent-silver uppercase tracking-wider">Impact Delivered</span>
                    <span className="text-[11px] sm:text-xs font-bold text-accent font-mono">{item.metric}</span>
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
