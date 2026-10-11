import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNetwork } from '../../context/NetworkContext';
import {
  GraduationCap, LayoutDashboard, ShieldCheck, Wrench, FileText,
  Utensils, Bell, BarChart3, Smartphone, BookOpen,
  Building2, Shield, Globe, X, Users, LogOut, Sparkles, Bus, Calendar
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { activeRole, currentPersona, notices, logout } = useCampus();
  const { currentLang, setCurrentLang } = useLanguage();
  const { networkMode, setNetworkMode } = useNetwork();

  const unreadCount = (notices||[]).filter(n => !n.hasUserAcknowledged && n.actionRequired).length;

  // ── Role-specific navigation items ──────────────────────
  const getNavSections = () => {
    if (activeRole === 'student') {
      return [
        {
          category: 'MY PORTAL',
          items: [
            { id: 'dashboard',      label: 'Dashboard',         icon: LayoutDashboard },
            { id: 'timetable',      label: 'My Timetable',      icon: BookOpen },
            { id: 'gatePass',       label: 'Gate Pass',         icon: ShieldCheck },
            { id: 'complaints',     label: 'Complaints',        icon: Wrench },
            { id: 'documents',      label: 'Documents',         icon: FileText },
            { id: 'mess',           label: 'Mess & Food',       icon: Utensils },
            { id: 'teacherFeedback',label: 'Rate Teachers ⭐',  icon: Sparkles },
          ]
        },
        {
          category: 'CAMPUS LIFE',
          items: [
            { id: 'campusNav',  label: '3D Campus Map 🗺',  icon: Building2 },
            { id: 'calendar',   label: 'Exam Calendar',    icon: Calendar },
            { id: 'busTracker', label: 'Live Bus Tracker', icon: Bus },
            { id: 'notices',    label: 'Notice Board',     icon: Bell, badge: unreadCount },
          ]
        }
      ];
    }
    if (activeRole === 'teacher') {
      return [{ category: 'FACULTY PORTAL', items: [
        { id: 'dashboard',      label: 'Faculty Dashboard',  icon: LayoutDashboard },
        { id: 'classAttendance',label: 'Take Attendance 📋', icon: Users },
        { id: 'notices',        label: 'Notices',            icon: Bell, badge: unreadCount },
        { id: 'calendar',       label: 'Academic Calendar',  icon: Calendar },
        { id: 'aiAnalytics',    label: 'AI Analytics',       icon: Sparkles },
      ]}];
    }
    if (activeRole === 'warden') {
      return [{ category: 'WARDEN PORTAL', items: [
        { id: 'admin',          label: 'Admin Dashboard',     icon: LayoutDashboard },
        { id: 'gatePass',       label: 'Gate Pass Approvals', icon: ShieldCheck },
        { id: 'disciplinary',   label: 'Disciplinary & Fines',icon: Shield },
        { id: 'complaints',     label: 'Complaints',          icon: Wrench },
        { id: 'notices',        label: 'Notices',             icon: Bell, badge: unreadCount },
        { id: 'aiAnalytics',    label: 'AI Analytics',        icon: Sparkles },
      ]}];
    }
    if (activeRole === 'guard') {
      return [{ category: 'SECURITY PORTAL', items: [
        { id: 'dashboard',  label: 'Security Terminal', icon: ShieldCheck },
        { id: 'campusNav',  label: '3D Campus Map',     icon: Building2 },
        { id: 'notices',    label: 'Alerts & Notices',  icon: Bell, badge: unreadCount },
      ]}];
    }
    if (activeRole === 'messManager') {
      return [{ category: 'MESS PORTAL', items: [
        { id: 'mess',    label: 'Mess Dashboard', icon: Utensils },
        { id: 'notices', label: 'Notices',        icon: Bell, badge: unreadCount },
      ]}];
    }
    if (activeRole === 'parent') {
      return [{ category: 'PARENT PORTAL', items: [
        { id: 'dashboard',  label: "Ward's Overview",  icon: LayoutDashboard },
        { id: 'campusNav',  label: '3D Campus Map',    icon: Building2 },
        { id: 'busTracker', label: 'Live Bus Tracker', icon: Bus },
      ]}];
    }
    if (activeRole === 'principal') {
      return [{ category: 'PRINCIPAL PORTAL', items: [
        { id: 'dashboard',   label: 'Command Overview',  icon: LayoutDashboard },
        { id: 'admin',       label: 'Analytics',         icon: BarChart3 },
        { id: 'disciplinary',label: 'Disciplinary Cases',icon: Shield },
        { id: 'notices',     label: 'Notices',           icon: Bell, badge: unreadCount },
        { id: 'aiAnalytics', label: 'AI Intelligence',   icon: Sparkles },
        { id: 'calendar',    label: 'Academic Calendar', icon: Calendar },
      ]}];
    }
    // default / admin
    return [{ category: 'ADMIN', items: [
      { id: 'admin',   label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'notices', label: 'Notices',         icon: Bell, badge: unreadCount },
    ]}];
  };


  const roleLabel = {
    student: 'Student Portal',
    teacher: 'Faculty Portal',
    warden: 'Warden & Admin',
    guard: 'Security Officer',
    messManager: 'Mess Supervisor',
    parent: 'Parent Portal',
    principal: 'Principal & Director'
  }[activeRole] || 'User';

  const roleColor = {
    student: 'ring-blue-500/50',
    teacher: 'ring-purple-500/50',
    warden: 'ring-indigo-500/50',
    guard: 'ring-amber-500/50',
    messManager: 'ring-emerald-500/50',
    parent: 'ring-teal-500/50',
    principal: 'ring-rose-500/50'
  }[activeRole] || 'ring-slate-500/50';

  const sections = getNavSections();

  const sidebarClass = {
    student:     'sidebar-student',
    teacher:     'sidebar-teacher',
    warden:      'sidebar-warden',
    guard:       'sidebar-guard',
    messManager: 'sidebar-mess',
    parent:      'sidebar-parent',
    principal:   'sidebar-principal',
  }[activeRole] || 'sidebar-default';

  const activeGrad = {
    student:     'linear-gradient(135deg,#1e40af,#3b82f6,#06b6d4)',
    teacher:     'linear-gradient(135deg,#4c1d95,#7c3aed,#8b5cf6)',
    warden:      'linear-gradient(135deg,#881337,#f43f5e,#fb7185)',
    guard:       'linear-gradient(135deg,#064e3b,#10b981,#6ee7b7)',
    messManager: 'linear-gradient(135deg,#7c2d12,#f97316,#fdba74)',
    parent:      'linear-gradient(135deg,#134e4a,#14b8a6,#5eead4)',
    principal:   'linear-gradient(135deg,#1c1917,#78716c,#d6d3d1)',
  }[activeRole] || 'linear-gradient(135deg,#1e40af,#3b82f6)';

  const roleBadgeStyle = {
    student:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
    teacher:     'bg-purple-500/20 text-purple-300 border-purple-500/30',
    warden:      'bg-rose-500/20 text-rose-300 border-rose-500/30',
    guard:       'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    messManager: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    parent:      'bg-teal-500/20 text-teal-300 border-teal-500/30',
    principal:   'bg-stone-500/20 text-stone-300 border-stone-500/30',
  }[activeRole] || 'bg-slate-700/60 text-slate-300 border-slate-600/60';

  const sidebarContent = (
    <div className={`flex flex-col h-full text-slate-300 select-none border-r border-white/5 ${sidebarClass}`}>

      {/* Brand Header */}
      <div className="p-4 border-b border-white/8" style={{background:"rgba(0,0,0,0.25)"}}>
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-1 w-9 h-9 p-1 rounded-xl border border-white/10 flex-shrink-0 shadow-lg"
            style={{background:"rgba(255,255,255,0.08)"}}>
            <div style={{background:"linear-gradient(135deg,#3b82f6,#06b6d4)",borderRadius:2}}/>
            <div style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",borderRadius:2}}/>
            <div style={{background:"linear-gradient(135deg,#10b981,#6ee7b7)",borderRadius:2}}/>
            <div style={{background:"linear-gradient(135deg,#7c3aed,#3b82f6)",borderRadius:2}}/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white" style={{textShadow:"0 0 20px rgba(255,255,255,0.3)"}}>UNIFY</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border" style={{background:"linear-gradient(135deg,#1e40af44,#7c3aed44)",borderColor:"rgba(255,255,255,0.15)",color:"#93c5fd"}}>v2.7</span>
            </div>
            <p className="text-[10px] font-bold truncate" style={{background:"linear-gradient(90deg,#6ee7b7,#67e8f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Smart Campus Portal</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role Badge */}
      <div className={`mx-3 mt-3 px-3 py-2 rounded-xl border text-center ${roleBadgeStyle}`} style={{background:"rgba(0,0,0,0.2)"}}>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Signed in as</span>
        <div className="text-xs font-extrabold text-white mt-0.5">{roleLabel}</div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 mt-2">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider uppercase opacity-40">{sec.category}</span>
            <div className="space-y-0.5 mt-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { setActiveTab(item.id); if (setMobileOpen) setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group text-left"
                    style={isActive ? {
                      background: activeGrad,
                      color: "white",
                      fontWeight: 700,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
                    } : {color:"rgba(255,255,255,0.65)"}}>
                    {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white/70 rounded-r-full" style={{boxShadow:"0 0 6px white"}}/>}
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="badge-grad">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Network + Language + Profile */}
      <div className="p-3 border-t border-white/8 space-y-3" style={{background:"rgba(0,0,0,0.3)"}}>
        <div className="flex items-center justify-between gap-2">
          <select value={networkMode} onChange={e => setNetworkMode(e.target.value)}
            className={`rounded-lg px-2 py-1 text-[11px] font-bold border cursor-pointer outline-none flex-1 ${
              networkMode === 'online'  ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
              networkMode === 'slow2g' ? 'bg-amber-950 text-amber-300 border-amber-700' :
              'bg-rose-950 text-rose-300 border-rose-700'
            }`}>
            <option value="online">🟢 Online</option>
            <option value="slow2g">🟡 Slow 2G</option>
            <option value="offline">🔴 Offline</option>
          </select>
          <div className="flex items-center gap-1 rounded-lg px-2 py-1 border border-white/10" style={{background:"rgba(255,255,255,0.06)"}}>
            <Globe className="w-3 h-3 text-slate-400" />
            <select value={currentLang} onChange={e => setCurrentLang(e.target.value)}
              className="bg-transparent text-[11px] text-white border-none focus:outline-none cursor-pointer font-semibold">
              <option value="en">EN</option>
              <option value="or">ଓଡ଼ିଆ</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl border border-white/10" style={{background:"rgba(255,255,255,0.06)"}}>
          <img src={currentPersona.avatar} alt={currentPersona.name}
            className={`w-8 h-8 rounded-full object-cover ring-2 ${roleColor} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate leading-tight">{currentPersona.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{roleLabel}</div>
          </div>
          <button onClick={logout} title="Sign out"
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex-shrink-0">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-shrink-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}