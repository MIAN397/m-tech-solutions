import { useState, useEffect, useRef } from 'react';
import { 
  FileText, Plus, Trash2, Save, Printer, Eye, Copy, ArrowLeft, 
  Check, RefreshCw, DollarSign, User, Building, Briefcase, 
  ChevronDown, ChevronUp, Layers, FileCheck
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

// Default initial quotation template (matching user's uploaded PDF exactly)
const DEFAULT_QUOTATION_DATA = {
  id: 'quote_flavour_hub_default',
  quoteNo: 'MTS-2026-001',
  date: 'July 25, 2026',
  validUntil: 'August 09, 2026',
  preparedBy: 'M-Tech Team',
  preparedFor: 'Usman Bin Latif',
  company: 'Flavour & Hub',
  projectTitle: 'Web Development & Digital Setup',
  
  // Section 1: One-Time Build
  section1Title: '1. ONE-TIME WEB DEVELOPMENT & DESIGN (BUILD COST)',
  section1Items: [
    {
      id: 's1_1',
      title: 'UI/UX Design & Prototyping',
      scope: 'Custom responsive website layouts, color themes, wireframes, user experience design, and mobile-first mockups.',
      cost: '8000',
      suffix: '--RS'
    },
    {
      id: 's1_2',
      title: 'Front-End & Back-End Dev',
      scope: 'Full website build, database architecture, CMS/admin panel integration, dynamic functionality, and custom features.',
      cost: '7000',
      suffix: '--RS'
    },
    {
      id: 's1_3',
      title: 'Mobile & Device Optimization',
      scope: 'Complete cross-browser compatibility testing (Chrome, Safari, Mobile, Tablet, Desktop) and speed optimization.',
      cost: '',
      suffix: '____ . ____'
    },
    {
      id: 's1_4',
      title: 'Content Upload & On-Page SEO',
      scope: 'Initial content setup, image compression, meta titles, SEO descriptions, Google Search Console & Analytics setup.',
      cost: '',
      suffix: '____ . ____'
    },
    {
      id: 's1_5',
      title: 'QA, Security & Final Launch',
      scope: 'Rigorous bug testing, security hardening, SSL configuration, domain pointing, and live server deployment.',
      cost: '',
      suffix: '____ . ____'
    }
  ],

  // Section 2: Infrastructure
  section2Title: '2. DOMAIN, SERVER INFRASTRUCTURE & LICENSING (RECURRING/ANNUAL)',
  section2Items: [
    {
      id: 's2_1',
      title: 'Domain Name Registration',
      scope: 'Custom domain name (.com, .pk, etc.) registration and DNS management (Annual).',
      cost: '7000',
      suffix: '/ yr'
    },
    {
      id: 's2_2',
      title: 'Web Hosting & Cloud Server',
      scope: 'High-performance SSD hosting/cloud infrastructure, high uptime, and server setup (Annual/Monthly).',
      cost: '4000',
      suffix: '/ yr'
    },
    {
      id: 's2_3',
      title: 'SSL Security Certificate',
      scope: 'HTTPS end-to-end data encryption and web trust badge setup (Annual).',
      cost: '',
      suffix: '/ yr'
    },
    {
      id: 's2_4',
      title: 'Premium Plugins / Licenses',
      scope: 'Third-party software licenses, custom API keys, or premium tools (if required).',
      cost: '',
      suffix: '/ yr'
    }
  ],

  // Section 3: Maintenance & Support
  section3Title: '3. WEBSITE MAINTENANCE & TECHNICAL SUPPORT (OPTIONAL RECURRING)',
  section3Items: [
    {
      id: 's3_1',
      title: 'Core Maintenance & Backups',
      scope: 'CMS core & plugin updates, daily/weekly site backups, malware scanning, and server health checks.',
      cost: '2000',
      suffix: '/ mo'
    },
    {
      id: 's3_2',
      title: 'Technical Support & Updates',
      scope: 'Priority technical support, content updates (text/image tweaks), bug fixes, and minor adjustments.',
      cost: '2500',
      suffix: '/ mo'
    }
  ],

  // Additional sections
  whyChooseUs: [
    'Custom scalable code tailored to your business needs.',
    'Mobile-first, lightning-fast loading speeds.',
    'Dedicated post-launch technical support & guidance.',
    'Transparent pricing with zero hidden charges.'
  ],

  paymentSchedule: [
    '50% Advance Deposit: Due upon proposal approval and project kickoff.',
    '30% Beta Milestone: Due upon completion and review of core design & features.',
    '20% Final Balance: Due upon final approval prior to live domain deployment.'
  ],

  termsConditions: [
    'Quotation validity is 15 days from the date of issue.',
    'Any additional features outside the scope will be quoted separately.',
    'Client is responsible for providing copy/images unless content services are purchased.'
  ],

  currency: 'RS',
  createdAt: new Date().toISOString()
};

export default function QuotationMaker() {
  const [quotations, setQuotations] = useState([]);
  const [activeQuote, setActiveQuote] = useState(DEFAULT_QUOTATION_DATA);
  const [viewMode, setViewMode] = useState('editor'); // 'list', 'editor', 'preview'
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form Collapsible Sections
  const [openSections, setOpenSections] = useState({
    meta: true,
    sec1: true,
    sec2: true,
    sec3: true,
    notes: false
  });

  const printRef = useRef(null);

  // Load Quotations from Firestore on mount
  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      const snap = await getDocs(collection(db, 'quotations'));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      
      if (list.length === 0) {
        // Seed default quote if empty
        await setDoc(doc(db, 'quotations', DEFAULT_QUOTATION_DATA.id), DEFAULT_QUOTATION_DATA);
        setQuotations([DEFAULT_QUOTATION_DATA]);
      } else {
        setQuotations(list);
      }
    } catch (err) {
      console.error('Error loading quotations:', err);
      // Fallback to local default
      setQuotations([DEFAULT_QUOTATION_DATA]);
    }
  };

  // Calculate Subtotals automatically
  const calcSubtotal = (items) => {
    return items.reduce((acc, item) => {
      const val = parseFloat(item.cost);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const subtotalBuild = calcSubtotal(activeQuote.section1Items);
  const subtotalInfra = calcSubtotal(activeQuote.section2Items);
  const subtotalMaint = calcSubtotal(activeQuote.section3Items);
  const grandTotal = subtotalBuild + subtotalInfra + subtotalMaint;

  // Toggle Section in Form
  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Save Active Quote
  const handleSaveQuote = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const quoteToSave = {
        ...activeQuote,
        subtotalBuild,
        subtotalInfra,
        subtotalMaint,
        grandTotal,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'quotations', activeQuote.id), quoteToSave);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadQuotations();
    } catch (err) {
      console.error('Error saving quotation:', err);
      alert('Failed to save quotation to cloud storage.');
    } finally {
      setSaving(false);
    }
  };

  // Create New Empty Quotation
  const handleCreateNew = () => {
    const newId = 'quote_' + Date.now();
    const newQuote = {
      ...DEFAULT_QUOTATION_DATA,
      id: newId,
      quoteNo: `MTS-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      validUntil: new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      preparedFor: '',
      company: '',
      projectTitle: 'Web Development & Digital Setup'
    };
    setActiveQuote(newQuote);
    setViewMode('editor');
  };

  // Duplicate Quotation
  const handleDuplicate = (quote) => {
    const dupQuote = {
      ...quote,
      id: 'quote_' + Date.now(),
      quoteNo: `${quote.quoteNo}-COPY`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setActiveQuote(dupQuote);
    setViewMode('editor');
  };

  // Delete Quotation
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this quotation?')) {
      try {
        await deleteDoc(doc(db, 'quotations', id));
        setQuotations(prev => prev.filter(q => q.id !== id));
        if (activeQuote.id === id) {
          setActiveQuote(DEFAULT_QUOTATION_DATA);
        }
      } catch (err) {
        console.error('Failed to delete quotation:', err);
      }
    }
  };

  // Printable Action - Prints ONLY the quotation PDF document (Strict 2 Pages)
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) {
      window.print();
      return;
    }

    const printWin = window.open('', '_blank', 'width=900,height=1100');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Quotation_${activeQuote.quoteNo || 'MTS-2026'}</title>
            <meta charset="utf-8" />
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
              @page {
                size: A4 portrait;
                margin: 0;
              }
              html, body {
                background: #ffffff !important;
                color: #0f172a !important;
                margin: 0 !important;
                padding: 0 !important;
                font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .pdf-page {
                width: 210mm !important;
                height: 297mm !important;
                max-height: 297mm !important;
                box-sizing: border-box !important;
                padding: 10mm 12mm !important;
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
                overflow: hidden !important;
                box-shadow: none !important;
                border: none !important;
              }
            </style>
          </head>
          <body class="bg-white">
            <div class="w-full flex flex-col items-center">
              ${content.innerHTML}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 350);
              };
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    } else {
      // Fallback to window.print() if popup blocked
      window.print();
    }
  };



  // Item Handlers
  const handleItemChange = (sectionKey, itemId, field, value) => {
    setActiveQuote(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map(item => item.id === itemId ? { ...item, [field]: value } : item)
    }));
  };

  const handleAddItem = (sectionKey, defaultSuffix) => {
    const newItem = {
      id: 'item_' + Date.now(),
      title: 'New Service Component',
      scope: 'Scope description and details included.',
      cost: '',
      suffix: defaultSuffix
    };
    setActiveQuote(prev => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], newItem]
    }));
  };

  const handleRemoveItem = (sectionKey, itemId) => {
    setActiveQuote(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter(item => item.id !== itemId)
    }));
  };

  // List Items (Why choose us, etc.) handlers
  const handleListChange = (listKey, index, value) => {
    setActiveQuote(prev => {
      const updated = [...prev[listKey]];
      updated[index] = value;
      return { ...prev, [listKey]: updated };
    });
  };

  const handleAddListItem = (listKey) => {
    setActiveQuote(prev => ({
      ...prev,
      [listKey]: [...prev[listKey], 'New item description']
    }));
  };

  const handleRemoveListItem = (listKey, index) => {
    setActiveQuote(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index)
    }));
  };

  const filteredQuotes = quotations.filter(q => 
    q.quoteNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.preparedFor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6 text-text-main">
      
      {/* Top Action Header (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-border-main">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/15 border border-accent/20 rounded-xl text-accent">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-text-main">Quotation Creator & Generator</h2>
            <p className="text-xs text-accent-silver">Generate official PDF quotations matching exact corporate formatting</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode !== 'list' && (
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2.5 bg-white/5 border border-border-main hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Saved Quotes</span>
            </button>
          )}

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-accent hover:bg-accent-blue text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Quote</span>
          </button>

          <button
            onClick={() => {
              setActiveQuote(DEFAULT_QUOTATION_DATA);
              setViewMode('editor');
            }}
            className="px-3.5 py-2.5 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all"
            title="Load Default Sample Quotation (Flavour & Hub)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sample PDF</span>
          </button>

          <button
            onClick={handleSaveQuote}
            disabled={saving}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Quote'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        /* SAVED QUOTATIONS DIRECTORY LIST */
        <div className="no-print glass-card rounded-2xl border border-border-main p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h3 className="font-display font-bold text-base uppercase tracking-wider text-text-main flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              Saved Quotations ({quotations.length})
            </h3>
            <input
              type="text"
              placeholder="Search Quote #, Client, or Company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-border-main rounded-xl text-xs text-text-main placeholder-accent-silver focus:outline-none focus:border-accent w-full sm:w-72"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  setActiveQuote(q);
                  setViewMode('editor');
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  activeQuote.id === q.id
                    ? 'bg-accent/10 border-accent'
                    : 'bg-white/5 border-border-main hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-accent/20 border border-accent/30 text-accent text-[11px] font-bold rounded-lg uppercase tracking-wider">
                      {q.quoteNo}
                    </span>
                    <span className="text-[11px] text-accent-silver font-medium">{q.date}</span>
                  </div>
                  <h4 className="font-bold text-base text-text-main mt-1">{q.preparedFor || 'Unnamed Client'}</h4>
                  <p className="text-xs text-accent-silver flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-accent" />
                    {q.company || 'Individual / Business'}
                  </p>
                  <p className="text-xs text-text-main font-medium truncate mt-1">
                    {q.projectTitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-main flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-accent-silver block">Total Estimate</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {(q.grandTotal || calcSubtotal(q.section1Items) + calcSubtotal(q.section2Items) + calcSubtotal(q.section3Items)).toLocaleString()} {q.currency || 'RS'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(q);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-accent-silver hover:text-white transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(q.id, e)}
                      className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EDITOR & PREVIEW SPLIT LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: EDITOR FORM (Hidden in Print) */}
          <div className="no-print lg:col-span-5 flex flex-col gap-4">
            
            {/* View Mode Toggle: Form vs Full PDF */}
            <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-border-main rounded-xl">
              <button
                onClick={() => setViewMode('editor')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  viewMode === 'editor' ? 'bg-accent text-white shadow-md' : 'text-accent-silver hover:text-text-main'
                }`}
              >
                Form Inputs
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  viewMode === 'preview' ? 'bg-accent text-white shadow-md' : 'text-accent-silver hover:text-text-main'
                }`}
              >
                Full Preview
              </button>
            </div>

            {/* SECTION: METADATA & CLIENT */}
            <div className="glass-card rounded-2xl border border-border-main overflow-hidden">
              <button
                onClick={() => toggleSection('meta')}
                className="w-full p-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-text-main bg-white/2 hover:bg-white/5 border-b border-border-main"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  Client & Quotation Metadata
                </span>
                {openSections.meta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {openSections.meta && (
                <div className="p-4 flex flex-col gap-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-accent-silver uppercase block mb-1">Quote #</label>
                      <input
                        type="text"
                        value={activeQuote.quoteNo}
                        onChange={(e) => setActiveQuote({ ...activeQuote, quoteNo: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-border-main rounded-xl text-text-main focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-accent-silver uppercase block mb-1">Prepared By</label>
                      <input
                        type="text"
                        value={activeQuote.preparedBy}
                        onChange={(e) => setActiveQuote({ ...activeQuote, preparedBy: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-border-main rounded-xl text-text-main focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-accent-silver uppercase block mb-1">Issue Date</label>
                      <input
                        type="text"
                        value={activeQuote.date}
                        onChange={(e) => setActiveQuote({ ...activeQuote, date: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-border-main rounded-xl text-text-main focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-accent-silver uppercase block mb-1">Valid Until</label>
                      <input
                        type="text"
                        value={activeQuote.validUntil}
                        onChange={(e) => setActiveQuote({ ...activeQuote, validUntil: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-border-main rounded-xl text-text-main focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-accent-silver uppercase block mb-1">Prepared For (Client Name)</label>
                    <input
                      type="text"
                      placeholder="e.g. Usman Bin Latif"
                      value={activeQuote.preparedFor}
                      onChange={(e) => setActiveQuote({ ...activeQuote, preparedFor: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-border-main rounded-xl text-text-main focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-accent-silver uppercase block mb-1">Company / Business</label>
                    <input
                      type="text"
                      placeholder="e.g. Flavour & Hub"
                      value={activeQuote.company}
                      onChange={(e) => setActiveQuote({ ...activeQuote, company: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-border-main rounded-xl text-text-main focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-accent-silver uppercase block mb-1">Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Web Development & Digital Setup"
                      value={activeQuote.projectTitle}
                      onChange={(e) => setActiveQuote({ ...activeQuote, projectTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-border-main rounded-xl text-text-main focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 1: BUILD COST */}
            <div className="glass-card rounded-2xl border border-border-main overflow-hidden">
              <button
                onClick={() => toggleSection('sec1')}
                className="w-full p-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-text-main bg-white/2 hover:bg-white/5 border-b border-border-main"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  1. One-Time Build Costs ({activeQuote.section1Items.length})
                </span>
                <span className="text-[11px] text-emerald-400 font-bold ml-auto mr-2">
                  Subtotal: {subtotalBuild.toLocaleString()} {activeQuote.currency}
                </span>
                {openSections.sec1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {openSections.sec1 && (
                <div className="p-4 flex flex-col gap-4">
                  {activeQuote.section1Items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-white/5 border border-border-main rounded-xl flex flex-col gap-2 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-silver">Item #{idx+1}</span>
                        <button
                          onClick={() => handleRemoveItem('section1Items', item.id)}
                          className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Service Component"
                        value={item.title}
                        onChange={(e) => handleItemChange('section1Items', item.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-bold text-text-main focus:border-accent focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Scope & Deliverables"
                        value={item.scope}
                        onChange={(e) => handleItemChange('section1Items', item.id, 'scope', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-[11px] text-text-main focus:border-accent focus:outline-none resize-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Cost (e.g. 8000 or blank)"
                          value={item.cost}
                          onChange={(e) => handleItemChange('section1Items', item.id, 'cost', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-mono text-emerald-400 focus:border-accent focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Suffix (e.g. --RS)"
                          value={item.suffix}
                          onChange={(e) => handleItemChange('section1Items', item.id, 'suffix', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-mono text-accent-silver focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddItem('section1Items', '--RS')}
                    className="w-full py-2 bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Build Component</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 2: INFRASTRUCTURE */}
            <div className="glass-card rounded-2xl border border-border-main overflow-hidden">
              <button
                onClick={() => toggleSection('sec2')}
                className="w-full p-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-text-main bg-white/2 hover:bg-white/5 border-b border-border-main"
              >
                <span className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-400" />
                  2. Infrastructure & Hosting ({activeQuote.section2Items.length})
                </span>
                <span className="text-[11px] text-sky-400 font-bold ml-auto mr-2">
                  Subtotal: {subtotalInfra.toLocaleString()} {activeQuote.currency}/yr
                </span>
                {openSections.sec2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {openSections.sec2 && (
                <div className="p-4 flex flex-col gap-4">
                  {activeQuote.section2Items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-white/5 border border-border-main rounded-xl flex flex-col gap-2 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-silver">Item #{idx+1}</span>
                        <button
                          onClick={() => handleRemoveItem('section2Items', item.id)}
                          className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Infrastructure Item"
                        value={item.title}
                        onChange={(e) => handleItemChange('section2Items', item.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-bold text-text-main focus:border-accent focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Details & Billing Frequency"
                        value={item.scope}
                        onChange={(e) => handleItemChange('section2Items', item.id, 'scope', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-[11px] text-text-main focus:border-accent focus:outline-none resize-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Cost (e.g. 7000)"
                          value={item.cost}
                          onChange={(e) => handleItemChange('section2Items', item.id, 'cost', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-mono text-sky-400 focus:border-accent focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Suffix (e.g. / yr)"
                          value={item.suffix}
                          onChange={(e) => handleItemChange('section2Items', item.id, 'suffix', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-mono text-accent-silver focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddItem('section2Items', '/ yr')}
                    className="w-full py-2 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Infrastructure Item</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 3: MAINTENANCE & SUPPORT */}
            <div className="glass-card rounded-2xl border border-border-main overflow-hidden">
              <button
                onClick={() => toggleSection('sec3')}
                className="w-full p-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-text-main bg-white/2 hover:bg-white/5 border-b border-border-main"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  3. Maintenance & Technical Support ({activeQuote.section3Items.length})
                </span>
                <span className="text-[11px] text-purple-400 font-bold ml-auto mr-2">
                  Subtotal: {subtotalMaint.toLocaleString()} {activeQuote.currency}/mo
                </span>
                {openSections.sec3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {openSections.sec3 && (
                <div className="p-4 flex flex-col gap-4">
                  {activeQuote.section3Items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-white/5 border border-border-main rounded-xl flex flex-col gap-2 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-silver">Item #{idx+1}</span>
                        <button
                          onClick={() => handleRemoveItem('section3Items', item.id)}
                          className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Support Package"
                        value={item.title}
                        onChange={(e) => handleItemChange('section3Items', item.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-bold text-text-main focus:border-accent focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Included Monthly Support Scope"
                        value={item.scope}
                        onChange={(e) => handleItemChange('section3Items', item.id, 'scope', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-[11px] text-text-main focus:border-accent focus:outline-none resize-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Cost (e.g. 2000)"
                          value={item.cost}
                          onChange={(e) => handleItemChange('section3Items', item.id, 'cost', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-mono text-purple-400 focus:border-accent focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Suffix (e.g. / mo)"
                          value={item.suffix}
                          onChange={(e) => handleItemChange('section3Items', item.id, 'suffix', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-border-main rounded-lg text-xs font-mono text-accent-silver focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddItem('section3Items', '/ mo')}
                    className="w-full py-2 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Support Package</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION: NOTES & TERMS */}
            <div className="glass-card rounded-2xl border border-border-main overflow-hidden">
              <button
                onClick={() => toggleSection('notes')}
                className="w-full p-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-text-main bg-white/2 hover:bg-white/5 border-b border-border-main"
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  Terms, Conditions & Payment Schedule
                </span>
                {openSections.notes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {openSections.notes && (
                <div className="p-4 flex flex-col gap-4 text-xs">
                  {/* Why Choose Us */}
                  <div>
                    <label className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Why Choose M-Tech Solutions?</label>
                    {activeQuote.whyChooseUs.map((note, i) => (
                      <div key={i} className="flex gap-2 mb-1.5 items-center">
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => handleListChange('whyChooseUs', i, e.target.value)}
                          className="flex-1 px-2.5 py-1 bg-white/5 border border-border-main rounded-lg text-xs text-text-main"
                        />
                        <button onClick={() => handleRemoveListItem('whyChooseUs', i)} className="text-rose-400 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => handleAddListItem('whyChooseUs')} className="text-[11px] text-accent font-bold mt-1">
                      + Add Advantage Point
                    </button>
                  </div>

                  {/* Payment Schedule */}
                  <div>
                    <label className="text-[10px] font-bold text-sky-400 uppercase block mb-1">Payment Schedule Points</label>
                    {activeQuote.paymentSchedule.map((note, i) => (
                      <div key={i} className="flex gap-2 mb-1.5 items-center">
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => handleListChange('paymentSchedule', i, e.target.value)}
                          className="flex-1 px-2.5 py-1 bg-white/5 border border-border-main rounded-lg text-xs text-text-main"
                        />
                        <button onClick={() => handleRemoveListItem('paymentSchedule', i)} className="text-rose-400 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => handleAddListItem('paymentSchedule')} className="text-[11px] text-accent font-bold mt-1">
                      + Add Payment Rule
                    </button>
                  </div>

                  {/* Terms */}
                  <div>
                    <label className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Terms & Conditions</label>
                    {activeQuote.termsConditions.map((note, i) => (
                      <div key={i} className="flex gap-2 mb-1.5 items-center">
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => handleListChange('termsConditions', i, e.target.value)}
                          className="flex-1 px-2.5 py-1 bg-white/5 border border-border-main rounded-lg text-xs text-text-main"
                        />
                        <button onClick={() => handleRemoveListItem('termsConditions', i)} className="text-rose-400 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => handleAddListItem('termsConditions')} className="text-[11px] text-accent font-bold mt-1">
                      + Add Term
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PDF PREVIEW & PRINT DOCUMENT */}
          <div className={`w-full ${viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
            
            {/* PDF Canvas Container */}
            <div className="w-full flex flex-col items-center gap-6 overflow-x-auto pb-8">
              
              {/* Print Notice (Hidden in Print) */}
              <div className="no-print w-full flex items-center justify-between p-3 bg-white/5 border border-border-main rounded-xl text-xs text-accent-silver">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-accent" />
                  Live Official PDF Document Preview (Exact 1:1 Corporate Print Replica)
                </span>
                <span className="text-[11px] font-bold text-accent">A4 Standard Format</span>
              </div>

              {/* Printable Wrapper */}
              <div ref={printRef} className="print-area w-full flex flex-col items-center gap-6">
                
                {/* ========================================================================= */}
                {/* PAGE 1 DOCUMENT */}
                {/* ========================================================================= */}
                <div 
                  className="pdf-page bg-white text-slate-900 shadow-2xl rounded-none p-7 font-sans flex flex-col justify-between"
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    height: '1100px',
                    maxHeight: '1100px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                  }}
                >
                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-slate-700 pb-3">
                      {/* Left Header */}
                      <div className="flex flex-col">
                        <h1 className="text-2xl font-extrabold tracking-tight text-[#0055FF]">
                          M-Tech Solutions
                        </h1>
                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
                          WEB DEVELOPMENT & DIGITAL INFRASTRUCTURE
                        </span>
                        
                        <div className="flex flex-col gap-0.5 text-[11px] font-medium text-slate-700 mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#0055FF] font-bold">🌐 Website:</span>
                            <span>mtechsolutions.online</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#0055FF] font-bold">✉️ Email:</span>
                            <span>mtechsolutions.online@gmail.com</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#0055FF] font-bold">📞 Phone:</span>
                            <span>+92 336 3800438</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Header */}
                      <div className="flex flex-col items-end text-right">
                        <h2 className="text-2xl font-black tracking-widest text-[#0F172A] uppercase">
                          QUOTATION
                        </h2>
                        
                        <div className="flex flex-col text-[11px] font-semibold text-slate-700 mt-2 gap-0.5">
                          <div><span className="text-slate-500">Quote #:</span> <span className="font-bold text-slate-900">{activeQuote.quoteNo || 'MTS-2026-____'}</span></div>
                          <div><span className="text-slate-500">Date:</span> <span className="font-bold text-slate-900">{activeQuote.date || 'July 25, 2026'}</span></div>
                          <div><span className="text-slate-500">Valid Until:</span> <span className="font-bold text-slate-900">{activeQuote.validUntil || '_______________'}</span></div>
                          <div><span className="text-slate-500">Prepared By:</span> <span className="font-bold text-slate-900">{activeQuote.preparedBy || 'M-Tech Team'}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Prepared For Client Box */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 grid grid-cols-12 gap-3 text-[11px]">
                      <div className="col-span-6 flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">PREPARED FOR:</span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5">{activeQuote.preparedFor || '_____________________'}</span>
                      </div>
                      <div className="col-span-6 flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">COMPANY / BUSINESS:</span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5">{activeQuote.company || '_____________________'}</span>
                      </div>
                      <div className="col-span-12 flex flex-col border-t border-slate-200 pt-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">PROJECT TITLE:</span>
                        <span className="text-xs font-bold text-[#0055FF] mt-0.5">{activeQuote.projectTitle || 'Web Development & Digital Setup'}</span>
                      </div>
                    </div>

                    {/* TABLE 1: BUILD COST */}
                    <div className="flex flex-col overflow-hidden rounded border border-slate-300">
                      <div className="bg-[#1E293B] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                        {activeQuote.section1Title || '1. ONE-TIME WEB DEVELOPMENT & DESIGN (BUILD COST)'}
                      </div>
                      <table className="w-full text-left text-[10.5px] border-collapse">
                        <thead>
                          <tr className="bg-[#F1F5F9] border-b border-slate-300 text-[9.5px] font-bold text-slate-700 uppercase tracking-wider">
                            <th className="py-1 px-2.5 w-[28%] border-r border-slate-300">SERVICE COMPONENT</th>
                            <th className="py-1 px-2.5 w-[52%] border-r border-slate-300">SCOPE & DELIVERABLES INCLUDED</th>
                            <th className="py-1 px-2.5 w-[20%] text-center">COST (PKR / USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                          {activeQuote.section1Items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="py-1 px-2.5 border-r border-slate-300 font-bold text-slate-900">{item.title}</td>
                              <td className="py-1 px-2.5 border-r border-slate-300 leading-tight text-[10px] text-slate-600">{item.scope}</td>
                              <td className="py-1 px-2.5 text-center font-bold text-slate-900 font-mono whitespace-nowrap">
                                {item.cost ? `${item.cost}${item.suffix ? (item.suffix.startsWith('/') ? ' ' + item.suffix : item.suffix) : ''}` : item.suffix || '____ . ____'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* TABLE 2: INFRASTRUCTURE */}
                    <div className="flex flex-col overflow-hidden rounded border border-slate-300">
                      <div className="bg-[#1E293B] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                        {activeQuote.section2Title || '2. DOMAIN, SERVER INFRASTRUCTURE & LICENSING (RECURRING/ANNUAL)'}
                      </div>
                      <table className="w-full text-left text-[10.5px] border-collapse">
                        <thead>
                          <tr className="bg-[#F1F5F9] border-b border-slate-300 text-[9.5px] font-bold text-slate-700 uppercase tracking-wider">
                            <th className="py-1 px-2.5 w-[28%] border-r border-slate-300">INFRASTRUCTURE ITEM</th>
                            <th className="py-1 px-2.5 w-[52%] border-r border-slate-300">DETAILS & BILLING FREQUENCY</th>
                            <th className="py-1 px-2.5 w-[20%] text-center">COST (PKR / USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                          {activeQuote.section2Items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="py-1 px-2.5 border-r border-slate-300 font-bold text-slate-900">{item.title}</td>
                              <td className="py-1 px-2.5 border-r border-slate-300 leading-tight text-[10px] text-slate-600">{item.scope}</td>
                              <td className="py-1 px-2.5 text-center font-bold text-slate-900 font-mono whitespace-nowrap">
                                {item.cost ? `${item.cost}${item.suffix ? (item.suffix.startsWith('/') ? ' ' + item.suffix : item.suffix) : ''}` : `____ . ____ ${item.suffix || '/ yr'}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* TABLE 3: MAINTENANCE */}
                    <div className="flex flex-col overflow-hidden rounded border border-slate-300">
                      <div className="bg-[#1E293B] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                        {activeQuote.section3Title || '3. WEBSITE MAINTENANCE & TECHNICAL SUPPORT (OPTIONAL RECURRING)'}
                      </div>
                      <table className="w-full text-left text-[10.5px] border-collapse">
                        <thead>
                          <tr className="bg-[#F1F5F9] border-b border-slate-300 text-[9.5px] font-bold text-slate-700 uppercase tracking-wider">
                            <th className="py-1 px-2.5 w-[28%] border-r border-slate-300">SUPPORT PACKAGE</th>
                            <th className="py-1 px-2.5 w-[52%] border-r border-slate-300">INCLUDED MONTHLY SUPPORT SCOPE</th>
                            <th className="py-1 px-2.5 w-[20%] text-center">COST (PKR / USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                          {activeQuote.section3Items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="py-1 px-2.5 border-r border-slate-300 font-bold text-slate-900">{item.title}</td>
                              <td className="py-1 px-2.5 border-r border-slate-300 leading-tight text-[10px] text-slate-600">{item.scope}</td>
                              <td className="py-1 px-2.5 text-center font-bold text-slate-900 font-mono whitespace-nowrap">
                                {item.cost ? `${item.cost}${item.suffix ? (item.suffix.startsWith('/') ? ' ' + item.suffix : item.suffix) : ''}` : `____ . ____ ${item.suffix || '/ mo'}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Page 1 Footer */}
                  <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>M-Tech Solutions • Confidential Quotation</span>
                    <span>Page 1 of 2</span>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* PAGE 2 DOCUMENT */}
                {/* ========================================================================= */}
                <div 
                  className="pdf-page bg-white text-slate-900 shadow-2xl rounded-none p-8 font-sans flex flex-col justify-between"
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    height: '1100px',
                    maxHeight: '1100px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                  }}
                >
                  <div className="flex flex-col gap-6">
                    
                    {/* Top Row: Why Choose Us & Financial Summaries */}
                    <div className="grid grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Why Choose Us Box */}
                      <div className="col-span-7 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 text-xs text-[#78350F] flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xs text-[#92400E] mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            💡 Why Choose M-Tech Solutions?
                          </h3>
                          <ul className="flex flex-col gap-1.5 font-medium text-[11px] leading-tight">
                            {activeQuote.whyChooseUs.map((note, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right: Subtotals & Total Estimate Banner */}
                      <div className="col-span-5 flex flex-col justify-between gap-3 text-xs">
                        <div className="flex flex-col gap-2 font-bold text-slate-800 px-1 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Subtotal (Build Cost):</span>
                            <span className="font-mono text-slate-900">{subtotalBuild.toLocaleString()} {activeQuote.currency}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Subtotal (Infrastructure/Year):</span>
                            <span className="font-mono text-slate-900">{subtotalInfra.toLocaleString()} {activeQuote.currency}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Subtotal (Maintenance/Month):</span>
                            <span className="font-mono text-slate-900">{subtotalMaint.toLocaleString()} {activeQuote.currency}</span>
                          </div>
                        </div>

                        {/* Grand Total Banner */}
                        <div className="bg-[#0055FF] text-white p-3.5 rounded-xl flex justify-between items-center font-extrabold tracking-wider shadow-md">
                          <span className="text-xs uppercase">TOTAL ESTIMATE:</span>
                          <span className="text-lg font-mono">{grandTotal.toLocaleString()} {activeQuote.currency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Payment Schedule & Terms */}
                    <div className="grid grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Payment Schedule */}
                      <div className="col-span-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-xs text-slate-800">
                        <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                          💳 PAYMENT SCHEDULE
                        </h3>
                        <ul className="flex flex-col gap-1.5 font-medium text-[11px] leading-relaxed">
                          {activeQuote.paymentSchedule.map((note, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Terms & Conditions */}
                      <div className="col-span-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-xs text-slate-800">
                        <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                          📝 TERMS & CONDITIONS
                        </h3>
                        <ul className="flex flex-col gap-1.5 font-medium text-[11px] leading-relaxed">
                          {activeQuote.termsConditions.map((note, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Row: Signatures & Authorization */}
                    <div className="grid grid-cols-12 gap-5 items-end mt-4">
                      
                      {/* Left Signature */}
                      <div className="col-span-6 border border-slate-200 rounded-xl p-4 flex flex-col justify-between min-h-[130px]">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                            PREPARED BY (SERVICE PROVIDER)
                          </span>
                          <h4 className="font-bold text-xs text-slate-900">M-Tech Solutions</h4>
                          <p className="text-[11px] text-slate-600">Web Development & Digital Services</p>
                        </div>
                        <div className="mt-6 border-b-2 border-dashed border-slate-400 pb-1 text-slate-400 text-[11px]">
                          Authorized Signature & Date
                        </div>
                      </div>

                      {/* Right Signature */}
                      <div className="col-span-6 border border-slate-200 rounded-xl p-4 flex flex-col justify-between min-h-[130px]">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                            ACCEPTED BY (CLIENT AUTHORIZATION)
                          </span>
                          <p className="text-[11px] text-slate-700 leading-snug">
                            I accept this quotation and authorize M-Tech Solutions to commence work as outlined.
                          </p>
                        </div>
                        <div className="mt-6 border-b-2 border-dashed border-slate-400 pb-1 text-slate-400 text-[11px]">
                          Client Signature, Name & Date
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Page 2 Footer */}
                  <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>M-Tech Solutions • Confidential Quotation</span>
                    <span>Page 2 of 2</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


