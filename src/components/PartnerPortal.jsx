import { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Plus, Edit2, Trash2, Shield, User, Users,
  Code, Compass, DollarSign, Calendar, X, AlertCircle, Mail, Key, FileText
} from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import QuotationMaker from './QuotationMaker';


const SEED_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Mobile POS System',
    description: 'A React Native point of sale app with barcode integration and offline syncing for local retail stores.',
    deadline: '2026-07-25',
    hunter: 'Ali Khan',
    developer: 'Usman',
    status: 'In Progress',
    cost: 180000,
    profit: 140000
  },
  {
    id: 'proj_2',
    name: 'Cadets Coaching Portal',
    description: 'Management portal for class scheduling, result tracking, and fee voucher distribution.',
    deadline: '2026-08-15',
    hunter: 'Zainab',
    developer: 'Usman',
    status: 'Planning',
    cost: 110000,
    profit: 90000
  },
  {
    id: 'proj_3',
    name: 'Adil Computers Store',
    description: 'Headless Shopify e-commerce system with custom ERP database integrations.',
    deadline: '2026-06-30',
    hunter: 'Ali Khan',
    developer: 'Usman',
    status: 'Completed',
    cost: 150000,
    profit: 120000
  }
];

const SEED_PROFILES = [
  { id: 'prof_1', email: 'owner@mtech.com', password: 'owner123', role: 'Owner', name: 'Tuaha Afzal' },
  { id: 'prof_2', email: 'dev@mtech.com', password: 'dev123', role: 'Developer', name: 'Usman' },
  { id: 'prof_3', email: 'hunter@mtech.com', password: 'hunter123', role: 'Hunter', name: 'Ali Khan' }
];

export default function PartnerPortal({ onClose }) {
  // Auth state
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active view tab (Owner only: 'projects' or 'users')
  const [activeTab, setActiveTab] = useState('projects');

  // Directory lists
  const [projects, setProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  
  // Modals state
  const [showProjModal, setShowProjModal] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null); // Profile object being edited, or null for new

  // Forms state
  const [projFormData, setProjFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    hunter: '',
    developer: 'Usman',
    status: 'Planning',
    cost: '',
    profit: ''
  });

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer'
  });

  // 1. Initialize databases from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load projects
        const projectsSnap = await getDocs(collection(db, 'projects'));
        let loadedProjects = [];
        let isSystemSeeded = false;
        projectsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.id === '_seeded_flag') {
            isSystemSeeded = true;
          } else {
            loadedProjects.push(data);
          }
        });

        // Seed default projects if Firestore collection is empty and not already seeded
        if (!isSystemSeeded && loadedProjects.length === 0) {
          await setDoc(doc(db, 'projects', '_seeded_flag'), { id: '_seeded_flag', isSystemFlag: true });
          loadedProjects = [...SEED_PROJECTS];
          for (const proj of SEED_PROJECTS) {
            await setDoc(doc(db, 'projects', proj.id), proj);
          }
        }
        // Sort descending by project id
        loadedProjects.sort((a, b) => b.id.localeCompare(a.id));
        setProjects(loadedProjects);
        localStorage.setItem('mtech_portal_projects', JSON.stringify(loadedProjects));

        // Load user profiles
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        let loadedProfiles = [];
        profilesSnap.forEach((doc) => {
          loadedProfiles.push(doc.data());
        });

        // Seed default profiles if empty
        if (loadedProfiles.length === 0) {
          loadedProfiles = SEED_PROFILES;
          for (const prof of SEED_PROFILES) {
            await setDoc(doc(db, 'profiles', prof.email.toLowerCase()), prof);
          }
        }
        setProfiles(loadedProfiles);
        localStorage.setItem('mtech_portal_profiles', JSON.stringify(loadedProfiles));
      } catch (error) {
        console.error("Error loading Firestore collections: ", error);
        // Fallback to local storage
        const storedProjects = localStorage.getItem('mtech_portal_projects') ? JSON.parse(localStorage.getItem('mtech_portal_projects')) : SEED_PROJECTS;
        setProjects(storedProjects);
        const storedProfiles = localStorage.getItem('mtech_portal_profiles') ? JSON.parse(localStorage.getItem('mtech_portal_profiles')) : SEED_PROFILES;
        setProfiles(storedProfiles);
      }
    };

    loadData();

    // Restore login session
    const storedUser = localStorage.getItem('mtech_portal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Authentication handlers
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Search profile in database
    const matchedProfile = profiles.find(
      p => p.email.toLowerCase() === email.toLowerCase() && p.password === password
    );

    if (matchedProfile) {
      const userData = { 
        id: matchedProfile.id,
        email: matchedProfile.email, 
        role: matchedProfile.role, 
        name: matchedProfile.name 
      };
      setUser(userData);
      localStorage.setItem('mtech_portal_user', JSON.stringify(userData));
      setEmail('');
      setPassword('');
      setActiveTab('projects'); // Default view
    } else {
      setLoginError('Invalid email or password. Check your entries or verify your profile.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mtech_portal_user');
  };

  // 3. Project CRUD handlers
  const openAddProjModal = () => {
    setActiveProject(null);
    setProjFormData({
      name: '',
      description: '',
      deadline: '',
      hunter: user.role === 'Hunter' ? user.name.split(' (')[0] : '',
      developer: 'Usman',
      status: 'Planning',
      cost: '',
      profit: ''
    });
    setShowProjModal(true);
  };

  const openEditProjModal = (project) => {
    // Safety check: Hunters can only edit their own created projects
    if (user && user.role === 'Hunter' && project.hunter.toLowerCase().trim() !== user.name.toLowerCase().trim()) {
      alert("Unauthorized: Hunters can only edit their own created projects.");
      return;
    }

    setActiveProject(project);
    setProjFormData({
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      hunter: project.hunter,
      developer: project.developer,
      status: project.status,
      cost: project.cost || '',
      profit: project.profit || ''
    });
    setShowProjModal(true);
  };

  const handleProjDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        localStorage.setItem('mtech_portal_projects', JSON.stringify(updated));
      } catch (error) {
        console.error("Error deleting project from Firestore:", error);
        alert("Failed to delete project from Firestore.");
      }
    }
  };

  const handleProjSubmit = async (e) => {
    e.preventDefault();

    if (activeProject) {
      // Safety check: Hunters can only edit their own created projects
      if (user && user.role === 'Hunter' && activeProject.hunter.toLowerCase().trim() !== user.name.toLowerCase().trim()) {
        alert("Unauthorized: Hunters can only edit their own created projects.");
        return;
      }

      const updatedProj = {
        ...activeProject,
        name: projFormData.name,
        description: projFormData.description,
        deadline: projFormData.deadline,
        hunter: projFormData.hunter,
        status: projFormData.status,
        ...(user.role === 'Owner' && {
          cost: Number(projFormData.cost),
          profit: Number(projFormData.profit)
        })
      };

      try {
        await setDoc(doc(db, 'projects', activeProject.id), updatedProj);
        const updated = projects.map(p => p.id === activeProject.id ? updatedProj : p);
        setProjects(updated);
        localStorage.setItem('mtech_portal_projects', JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving project to Firestore:", error);
        alert("Failed to save project to Firestore.");
      }
    } else {
      const newProj = {
        id: 'proj_' + Date.now(),
        name: projFormData.name,
        description: projFormData.description,
        deadline: projFormData.deadline,
        hunter: user.role === 'Hunter' ? user.name : projFormData.hunter,
        developer: projFormData.developer,
        status: projFormData.status,
        cost: user.role === 'Owner' ? Number(projFormData.cost) : 0,
        profit: user.role === 'Owner' ? Number(projFormData.profit) : 0
      };

      try {
        await setDoc(doc(db, 'projects', newProj.id), newProj);
        const updated = [newProj, ...projects];
        setProjects(updated);
        localStorage.setItem('mtech_portal_projects', JSON.stringify(updated));
      } catch (error) {
        console.error("Error creating project in Firestore:", error);
        alert("Failed to create project in Firestore.");
      }
    }
    setShowProjModal(false);
  };

  // 4. Profiles Directory CRUD handlers (Owner only)
  const openAddUserModal = () => {
    setActiveProfile(null);
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'Developer'
    });
    setShowUserModal(true);
  };

  const openEditUserModal = (profile) => {
    setActiveProfile(profile);
    setUserFormData({
      name: profile.name,
      email: profile.email,
      password: profile.password,
      role: profile.role
    });
    setShowUserModal(true);
  };

  const handleUserDelete = async (id) => {
    // Guard: Prevent Owner from deleting themselves
    if (id === user.id) {
      alert("You cannot delete your own active owner profile!");
      return;
    }

    const profileToDelete = profiles.find(p => p.id === id);
    if (!profileToDelete) return;

    if (window.confirm('Are you sure you want to remove this partner profile?')) {
      try {
        await deleteDoc(doc(db, 'profiles', profileToDelete.email.toLowerCase()));
        const updated = profiles.filter(p => p.id !== id);
        setProfiles(updated);
        localStorage.setItem('mtech_portal_profiles', JSON.stringify(updated));
      } catch (error) {
        console.error("Error deleting profile from Firestore:", error);
        alert("Failed to remove profile from Firestore.");
      }
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    // Check email uniqueness
    const emailConflict = profiles.some(p => 
      p.email.toLowerCase() === userFormData.email.toLowerCase() && 
      (!activeProfile || p.id !== activeProfile.id)
    );

    if (emailConflict) {
      alert('Email address already registered to another profile.');
      return;
    }

    if (activeProfile) {
      const updatedProfile = {
        ...activeProfile,
        name: userFormData.name,
        email: userFormData.email,
        password: userFormData.password,
        role: userFormData.role
      };

      try {
        if (activeProfile.email.toLowerCase() !== userFormData.email.toLowerCase()) {
          await deleteDoc(doc(db, 'profiles', activeProfile.email.toLowerCase()));
        }
        await setDoc(doc(db, 'profiles', userFormData.email.toLowerCase()), updatedProfile);

        const updated = profiles.map(p => p.id === activeProfile.id ? updatedProfile : p);
        setProfiles(updated);
        localStorage.setItem('mtech_portal_profiles', JSON.stringify(updated));

        // If Owner edited their own profile, sync active session
        if (activeProfile.id === user.id) {
          const updatedUserSession = {
            id: user.id,
            email: userFormData.email,
            role: userFormData.role,
            name: userFormData.name
          };
          setUser(updatedUserSession);
          localStorage.setItem('mtech_portal_user', JSON.stringify(updatedUserSession));
        }
      } catch (error) {
        console.error("Error updating profile in Firestore:", error);
        alert("Failed to update profile in Firestore.");
      }
    } else {
      const newProfile = {
        id: 'prof_' + Date.now(),
        name: userFormData.name,
        email: userFormData.email,
        password: userFormData.password,
        role: userFormData.role
      };

      try {
        await setDoc(doc(db, 'profiles', newProfile.email.toLowerCase()), newProfile);
        const updated = [...profiles, newProfile];
        setProfiles(updated);
        localStorage.setItem('mtech_portal_profiles', JSON.stringify(updated));
      } catch (error) {
        console.error("Error creating profile in Firestore:", error);
        alert("Failed to create profile in Firestore.");
      }
    }
    setShowUserModal(false);
  };

  // 5. Calculations (Owner view totals)
  const totalCost = projects.reduce((sum, p) => sum + (p.cost || 0), 0);
  const totalProfit = projects.reduce((sum, p) => sum + (p.profit || 0), 0);
  const totalRevenue = totalCost + totalProfit;
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Filtered projects list based on role-based visibility rules (e.g. Hunter sees only their own)
  const visibleProjects = user && user.role === 'Hunter'
    ? projects.filter(p => p.hunter.toLowerCase().trim() === user.name.toLowerCase().trim())
    : projects;

  // Helper status color badges
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'In Progress': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 bg-dark text-white relative">
      <div className="absolute top-10 right-10 z-10">
        <button
          onClick={onClose}
          data-cursor="magnetic"
          className="flex items-center gap-2 p-3 bg-white/5 border border-border-main rounded-full hover:bg-accent/15 hover:border-accent transition-all duration-300 text-text-main"
        >
          <X className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider pr-1 hidden sm:inline">Close Portal</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        {/* LOGGED OUT STATE */}
        {!user ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <div className="glass-card rounded-[32px] p-6 sm:p-8 md:p-12 w-full max-w-md relative overflow-hidden border border-border-main">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-full text-accent">
                  <Lock className="w-8 h-8" />
                </div>
              </div>

              <h2 className="text-center font-display font-bold text-2xl md:text-3xl text-text-main mb-2">
                Partner Login
              </h2>
              <p className="text-center text-xs md:text-sm text-accent-silver mb-8">
                Enter your credentials to access the project workspace
              </p>

              {loginError && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@mtech.com"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-border-main focus:border-accent text-sm text-text-main transition-colors duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-border-main focus:border-accent text-sm text-text-main transition-colors duration-200 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  data-cursor="magnetic"
                  className="w-full py-4 bg-accent hover:bg-accent-blue text-white font-bold text-sm rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg mt-2"
                >
                  Enter Workspace
                </button>
              </form>
            </div>
          </div>
        ) : (
          // LOGGED IN STATE
          <div className="flex flex-col gap-8">
            {/* Top Bar Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-3xl border border-border-main">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/15 border border-accent/20 rounded-2xl text-accent">
                  {user.role === 'Owner' && <Shield className="w-6 h-6" />}
                  {user.role === 'Developer' && <Code className="w-6 h-6" />}
                  {user.role === 'Hunter' && <Compass className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-text-main leading-tight">{user.name}</h2>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Role Profile: {user.role}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {user.role === 'Owner' && activeTab === 'users' && (
                  <button
                    onClick={openAddUserModal}
                    data-cursor="magnetic"
                    className="px-5 py-3 bg-accent hover:bg-accent-blue text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-md transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Profile</span>
                  </button>
                )}
                {(user.role === 'Owner' && activeTab === 'projects') && (
                  <button
                    onClick={openAddProjModal}
                    data-cursor="magnetic"
                    className="px-5 py-3 bg-accent hover:bg-accent-blue text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-md transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                )}
                {user.role === 'Hunter' && (
                  <button
                    onClick={openAddProjModal}
                    data-cursor="magnetic"
                    className="px-5 py-3 bg-accent hover:bg-accent-blue text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-md transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate Project</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  data-cursor="magnetic"
                  className="px-4 py-3 bg-white/5 border border-border-main hover:bg-rose-500/10 hover:border-rose-500/30 text-text-main hover:text-rose-400 text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Owner Tab Selection bar */}
            {user.role === 'Owner' && (
              <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-border-main pb-2">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`pb-2 px-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                    activeTab === 'projects'
                      ? 'border-accent text-text-main'
                      : 'border-transparent text-accent-silver hover:text-text-main'
                  }`}
                >
                  Projects Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`pb-2 px-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                    activeTab === 'users'
                      ? 'border-accent text-text-main'
                      : 'border-transparent text-accent-silver hover:text-text-main'
                  }`}
                >
                  Manage Partner Profiles
                </button>
                <button
                  onClick={() => setActiveTab('quotations')}
                  className={`pb-2 px-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 border-b-2 flex items-center gap-2 ${
                    activeTab === 'quotations'
                      ? 'border-accent text-text-main'
                      : 'border-transparent text-accent-silver hover:text-text-main'
                  }`}
                >
                  <FileText className="w-4 h-4 text-accent" />
                  <span>Quotation Maker</span>
                </button>
              </div>
            )}


            {/* TAB A: PROJECTS WORKSPACE */}
            {activeTab === 'projects' && (
              <>
                {/* Financial Widgets (Owner only) */}
                {user.role === 'Owner' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card rounded-2xl border border-border-main p-6 flex items-center gap-4">
                      <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-accent-silver uppercase tracking-wider">Total Sales Value</p>
                        <p className="text-lg md:text-xl font-bold text-text-main mt-0.5">{(totalCost + totalProfit).toLocaleString()} PKR</p>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl border border-border-main p-6 flex items-center gap-4">
                      <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-accent-silver uppercase tracking-wider">Project Expenses</p>
                        <p className="text-lg md:text-xl font-bold text-text-main mt-0.5">{totalCost.toLocaleString()} PKR</p>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl border border-border-main p-6 flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-accent-silver uppercase tracking-wider">Agency Net Profit</p>
                        <p className="text-lg md:text-xl font-bold text-text-main mt-0.5">{totalProfit.toLocaleString()} PKR</p>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl border border-border-main p-6 flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-accent-silver uppercase tracking-wider">Net Profit Margin</p>
                        <p className="text-lg md:text-xl font-bold text-text-main mt-0.5">{avgMargin}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects Data Grid */}
                <div className="glass-card rounded-3xl border border-border-main overflow-hidden">
                  <div className="p-6 border-b border-border-main flex justify-between items-center">
                    <h3 className="font-display font-bold text-lg text-text-main uppercase tracking-wider">Active Agency Projects</h3>
                    <span className="text-xs font-semibold px-3 py-1 bg-white/5 border border-border-main rounded-full text-accent-silver">
                      {visibleProjects.length} Total
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border-main bg-white/2 text-[10px] font-bold uppercase tracking-wider text-accent-silver">
                          <th className="p-5">Project Details</th>
                          <th className="p-5">Hunter (Agent)</th>
                          <th className="p-5">Deadline</th>
                          <th className="p-5">Status</th>
                          {user.role === 'Owner' && (
                            <>
                              <th className="p-5 text-right">Cost (PKR)</th>
                              <th className="p-5 text-right">Profit (PKR)</th>
                            </>
                          )}
                          {(user.role === 'Owner' || user.role === 'Hunter') && (
                            <th className="p-5 text-center">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-main text-sm text-text-main font-medium">
                        {visibleProjects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-white/1">
                            <td className="p-5 max-w-sm">
                              <p className="font-bold text-text-main text-base mb-1">{proj.name}</p>
                              <p className="text-xs text-accent-silver font-medium leading-relaxed">{proj.description}</p>
                            </td>
                            <td className="p-5 text-accent-silver">{proj.hunter}</td>
                            <td className="p-5 text-text-main font-semibold">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent" />
                                <span>{proj.deadline}</span>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusColor(proj.status)}`}>
                                {proj.status}
                              </span>
                            </td>
                            {user.role === 'Owner' && (
                              <>
                                <td className="p-5 text-right font-mono font-semibold">{(proj.cost || 0).toLocaleString()}</td>
                                <td className="p-5 text-right font-mono font-semibold text-emerald-400">{(proj.profit || 0).toLocaleString()}</td>
                              </>
                            )}
                            {(user.role === 'Owner' || user.role === 'Hunter') && (
                              <td className="p-5 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditProjModal(proj)}
                                    title="Edit Project"
                                    className="p-2 hover:bg-accent/15 hover:text-accent rounded-lg border border-transparent hover:border-accent/20 transition-all duration-200"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  {user.role === 'Owner' && (
                                    <button
                                      onClick={() => handleProjDelete(proj.id)}
                                      title="Delete Project"
                                      className="p-2 hover:bg-rose-500/15 hover:text-rose-400 rounded-lg border border-transparent hover:border-rose-500/20 transition-all duration-200"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB B: PROFILE DIRECTORY MANAGEMENT (Owner only) */}
            {user.role === 'Owner' && activeTab === 'users' && (
              <div className="glass-card rounded-3xl border border-border-main overflow-hidden animate-fadeIn">
                <div className="p-6 border-b border-border-main flex justify-between items-center">
                  <h3 className="font-display font-bold text-lg text-text-main uppercase tracking-wider">M-Tech Partner Directory</h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-white/5 border border-border-main rounded-full text-accent-silver">
                    {profiles.length} Partners
                  </span>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-main bg-white/2 text-[10px] font-bold uppercase tracking-wider text-accent-silver">
                        <th className="p-5">Partner Name</th>
                        <th className="p-5">Email Address</th>
                        <th className="p-5">Access Level</th>
                        <th className="p-5">Password Key</th>
                        <th className="p-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main text-sm text-text-main font-medium">
                      {profiles.map((prof) => (
                        <tr key={prof.id} className="hover:bg-white/1">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/5 border border-border-main rounded-full text-accent">
                                <User className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-text-main text-base">{prof.name} {prof.id === user.id && '(You)'}</span>
                            </div>
                          </td>
                          <td className="p-5 text-accent-silver">{prof.email}</td>
                          <td className="p-5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              prof.role === 'Owner' 
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                : prof.role === 'Developer'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {prof.role}
                            </span>
                          </td>
                          <td className="p-5 font-mono text-accent-silver">{prof.password}</td>
                          <td className="p-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditUserModal(prof)}
                                title="Edit Profile Credentials"
                                className="p-2 hover:bg-accent/15 hover:text-accent rounded-lg border border-transparent hover:border-accent/20 transition-all duration-200"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserDelete(prof.id)}
                                disabled={prof.id === user.id}
                                title="Remove Profile"
                                className="p-2 hover:bg-rose-500/15 hover:text-rose-400 rounded-lg border border-transparent hover:border-rose-500/20 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB C: QUOTATION MAKER (Owner only) */}
            {user.role === 'Owner' && activeTab === 'quotations' && (
              <QuotationMaker user={user} />
            )}
          </div>
        )}
      </div>


      {/* MODAL 1: PROJECT ADD/EDIT */}
      {showProjModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md">
          <div className="glass-card rounded-[32px] border border-border-main p-6 sm:p-8 w-full max-w-xl relative overflow-hidden shadow-2xl max-h-[calc(100vh-2rem)] md:max-h-[90vh] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-main flex-shrink-0">
              <h3 className="font-display font-bold text-xl text-text-main uppercase tracking-wider">
                {activeProject ? 'Edit Project Details' : 'Generate New Project'}
              </h3>
              <button onClick={() => setShowProjModal(false)} className="p-1 hover:bg-white/5 rounded-full text-accent-silver hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProjSubmit} className="flex flex-col gap-4 text-sm overflow-y-auto flex-1 pr-1 md:pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Project Name</label>
                  <input
                    type="text"
                    required
                    value={projFormData.name}
                    onChange={(e) => setProjFormData({ ...projFormData, name: e.target.value })}
                    placeholder="E.g. Inventory ERP System"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Deadline</label>
                  <input
                    type="date"
                    required
                    value={projFormData.deadline}
                    onChange={(e) => setProjFormData({ ...projFormData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Project Description</label>
                <textarea
                  required
                  rows="3"
                  value={projFormData.description}
                  onChange={(e) => setProjFormData({ ...projFormData, description: e.target.value })}
                  placeholder="Detail the scope and target delivery items..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Hunter Name (Sales Rep)</label>
                  <input
                    type="text"
                    required
                    disabled={user.role === 'Hunter'}
                    value={projFormData.hunter}
                    onChange={(e) => setProjFormData({ ...projFormData, hunter: e.target.value })}
                    placeholder="Rep who sourced the project"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors disabled:opacity-55"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Project Status</label>
                  <select
                    value={projFormData.status}
                    onChange={(e) => setProjFormData({ ...projFormData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                  >
                    <option value="Planning" className="bg-dark">Planning</option>
                    <option value="In Progress" className="bg-dark">In Progress</option>
                    <option value="Completed" className="bg-dark">Completed</option>
                  </select>
                </div>
              </div>

              {user.role === 'Owner' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border-main mt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Project Cost (PKR)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={projFormData.cost}
                      onChange={(e) => setProjFormData({ ...projFormData, cost: e.target.value })}
                      placeholder="Operational cost"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Project Profit (PKR)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={projFormData.profit}
                      onChange={(e) => setProjFormData({ ...projFormData, profit: e.target.value })}
                      placeholder="Net profit"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                data-cursor="magnetic"
                className="w-full py-4 bg-accent hover:bg-accent-blue text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md mt-4 transform active:scale-95"
              >
                {activeProject ? 'Save Changes' : 'Generate Project'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: USER PROFILE ADD/EDIT (Owner only) */}
      {showUserModal && user.role === 'Owner' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md">
          <div className="glass-card rounded-[32px] border border-border-main p-6 sm:p-8 w-full max-w-md relative overflow-hidden shadow-2xl max-h-[calc(100vh-2rem)] md:max-h-[90vh] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-main flex-shrink-0">
              <h3 className="font-display font-bold text-xl text-text-main uppercase tracking-wider">
                {activeProfile ? 'Modify Profile Credentials' : 'Create Partner Profile'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="p-1 hover:bg-white/5 rounded-full text-accent-silver hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="flex flex-col gap-4 text-sm overflow-y-auto flex-1 pr-1 md:pr-2">
              <div>
                <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="Usman / Zainab"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                  />
                  <User className="w-4 h-4 text-accent-silver absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="name@mtech.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                  />
                  <Mail className="w-4 h-4 text-accent-silver absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Security Password</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Enter security key"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors"
                  />
                  <Key className="w-4 h-4 text-accent-silver absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-accent-silver tracking-wider mb-1.5">Access Role</label>
                <div className="relative">
                  <select
                    value={userFormData.role}
                    disabled={activeProfile && activeProfile.id === user.id} // Prevent self-demotion
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border-main text-text-main outline-none focus:border-accent transition-colors disabled:opacity-55"
                  >
                    <option value="Owner" className="bg-dark">Owner (Full Admin Access)</option>
                    <option value="Developer" className="bg-dark">Developer (Scope Only, No Financials)</option>
                    <option value="Hunter" className="bg-dark">Hunter (Create/Edit Scope, No Financials)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                data-cursor="magnetic"
                className="w-full py-4 bg-accent hover:bg-accent-blue text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md mt-4 transform active:scale-95"
              >
                {activeProfile ? 'Save Profile' : 'Create Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
