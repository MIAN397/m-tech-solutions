import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('Error: dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

const routes = [
  {
    slug: 'erp-software',
    title: 'Custom ERP & Wholesale Inventory Software | Mobile Parts ERP | M-Tech Solutions',
    description:
      'Custom Enterprise ERP & Wholesale Inventory Management Software by M-Tech Solutions. Multi-branch stock transfers, landed cost calculation, supplier ledgers & Mobile Parts compatibility matrices.',
    h1: 'Custom Enterprise ERP, Wholesale Inventory & Mobile Parts Distribution Software',
    lead:
      'M-Tech Solutions engineers high-speed, multi-warehouse Enterprise Resource Planning (ERP) platforms tailored for wholesale distributors, mobile spare parts importers, and retail chains—featuring <100ms SKU/IMEI lookups, landed cost accounting, and automated double-entry ledgers.',
  },
  {
    slug: 'pos-system',
    title: 'Offline-First Mobile POS Software (iOS, Android & Desktop) | M-Tech Solutions',
    description:
      'Zero-downtime Offline-First Mobile & Retail POS System engineered by M-Tech Solutions. Local IndexedDB/SQLite billing, 80mm/58mm ESC/POS thermal printer bridging, barcode scanning & automatic cloud sync.',
    h1: 'Offline-First Mobile & Retail Point of Sale (POS) Software — iOS, Android & Desktop',
    lead:
      'Never lose a sale during an internet outage. M-Tech Solutions builds local-first Point of Sale applications using IndexedDB and SQLite with deterministic background sync workers and native hardware bridges for ESC/POS thermal receipt printers, barcode scanners, and cash drawers.',
  },
  {
    slug: 'services',
    title: 'Custom Software Development Services | ERP, POS, Next.js & Cloud APIs | M-Tech Solutions',
    description:
      'End-to-end custom software engineering by M-Tech Solutions: Enterprise ERPs, Offline Mobile POS, Headless Next.js/Shopify E-Commerce, LMS/CBT Portals, Real-Time Analytics & Firebase/Node.js APIs.',
    h1: 'Enterprise Software Engineering, Web Application & Mobile App Development Services',
    lead:
      'From custom CRM/ERP architectures and cross-platform React Native/Flutter mobile apps to sub-second Next.js headless e-commerce storefronts and zero-trust Firebase/PostgreSQL cloud backends, M-Tech Solutions delivers production-ready systems in 2 to 6 weeks.',
  },
  {
    slug: 'portfolio',
    title: 'Shipped Software Case Studies & Live Web Projects | Tuaha Afzal & M-Tech Solutions',
    description:
      'Explore live production web applications and enterprise systems engineered by Tuaha Afzal at M-Tech Solutions: Cadets Coaching Academy LMS, CCA CBT Testing Portal, Mobile Parts ERP & Offline POS.',
    h1: 'Shipped Production Software Systems, Live LMS Portals & Enterprise Case Studies',
    lead:
      'Verified production deployments built by Principal Software Architect Tuaha Afzal and M-Tech Solutions—including the Cadets Coaching Academy LMS, CCA Computer-Based Testing (CBT) SaaS Portal (15,000+ concurrent student sessions), Mobile Parts ERP SaaS, and Offline-First Mobile POS.',
  },
  {
    slug: 'faq',
    title: 'Custom ERP, Offline POS & Software Engineering FAQ | Pricing & Timelines | M-Tech Solutions',
    description:
      'Answers to common questions about M-Tech Solutions custom ERP development, offline-first POS synchronization, ESC/POS printer hardware integration, 2–6 week project timelines, and fixed-milestone pricing.',
    h1: 'Frequently Asked Questions — Custom ERP, Offline POS, Hardware Integration & Pricing',
    lead:
      'Everything you need to know about how M-Tech Solutions architects offline-first POS systems, integrates with existing thermal printers and barcode scanners, migrates legacy inventory databases, and delivers fixed-milestone enterprise projects in 2 to 6 weeks.',
  },
  {
    slug: 'contact',
    title: 'Contact M-Tech Solutions | Free Software Architecture Quote & Consultation',
    description:
      'Contact M-Tech Solutions via WhatsApp (+92 336 3800438) or email (mtechsolutions.online@gmail.com) for a free software architecture consultation, scope analysis, and fixed-milestone project quotation.',
    h1: 'Contact M-Tech Solutions — Request Your Free Software Architecture Consultation & Quote',
    lead:
      'Speak directly with Principal Software Architect Tuaha Afzal on WhatsApp (+92 336 3800438) or email (mtechsolutions.online@gmail.com) for a comprehensive system architecture blueprint and fixed-milestone quote at zero upfront cost.',
  },
];

for (const route of routes) {
  const canonicalUrl = `https://mtechsolutions.online/${route.slug}`;
  let html = baseHtml;

  // Replace <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${route.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace canonical & hreflang links
  html = html.replace(
    /<link rel="canonical" href="https:\/\/mtechsolutions\.online\/" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
  html = html.replaceAll(
    'href="https://mtechsolutions.online/"',
    `href="${canonicalUrl}"`
  );
  // Restore logo link to root in header
  html = html.replace(
    `<a href="${canonicalUrl}" style="font-weight:800;`,
    `<a href="https://mtechsolutions.online/" style="font-weight:800;`
  );

  // Replace OpenGraph & Twitter titles/descriptions/urls
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  // Replace pre-rendered H1 and lead paragraph inside #root for route-specific keyword relevance
  html = html.replace(
    /<h1 style="font-size:2\.5rem;font-weight:800;line-height:1\.15;color:#ffffff;margin:0 0 1rem;">[\s\S]*?<\/h1>/,
    `<h1 style="font-size:2.5rem;font-weight:800;line-height:1.15;color:#ffffff;margin:0 0 1rem;">${route.h1}</h1>\n          <p style="font-size:1.05rem;color:#93c5fd;max-width:850px;margin-bottom:1rem;">${route.lead}</p>`
  );

  const routeDir = path.join(distDir, route.slug);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
  // Also write flat .html file for cleanUrls compatibility on all static hosts
  fs.writeFileSync(path.join(distDir, `${route.slug}.html`), html, 'utf8');
  console.log(`Pre-rendered SEO route: /${route.slug} -> dist/${route.slug}/index.html`);
}
