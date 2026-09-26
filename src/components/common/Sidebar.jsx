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

  const unreadCount = notices.filter(n => !n.hasUserAcknowledged && n.actionRequired).length;

  // ── Role-specific navigation items ──────────────────────
  const getNavSections = () => {
    if (activeRole === 'student') {
      return [
        {
          category: 'MY PORTAL',
          items: [
            { id: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
            { id: 'gatePass',   label: 'Gate Pass',       icon: ShieldCheck },
            { id: 'complaints', label: 'Complaints',      icon: Wrench },
            { id: 'documents',  label: 'Documents',       icon: FileText },
            { id: 'mess',       label: 'Mess & Food',     icon: Utensils },
          ]
        },
        {
          category: 'CAMPUS LIFE',
          items: [
            { id: 'calendar',   label: 'Exam Calendar',   icon: Calendar },
            { id: 'busTracker', label: 'Live Bus Tracker',icon: Bus },
            { id: 'notices',    label: 'Notice Board',    icon: Bell, badge: unreadCount },
            { id: 'campusMap',  label: 'Campus Hotspot Map', icon: Building2 },
          ]
        }
      ];
    }
    if (activeRole === 'teacher') {
      return [{ category: 'FACULTY PORTAL', items: [
        { id: 'dashboard',   label: 'Faculty Dashboard',  icon: LayoutDashboard },
        { id: 'notices',     label: 'Notices',            icon: Bell, badge: unreadCount },
        { id: 'calendar',    label: 'Academic Calendar',  icon: Calendar },
        { id: 'aiAnalytics', label: 'AI Analytics',       icon: Sparkles },
      ]}];
    }
    if (activeRole === 'warden') {
      return [{ category: 'WARDEN PORTAL', items: [
        { id: 'admin',      label: 'Admin Dashboard',    icon: LayoutDashboard },
        { id: 'gatePass',   label: 'Gate Pass Approvals',icon: ShieldCheck },
        { id: 'complaints', label: 'Complaints',         icon: Wrench },
        { id: 'notices',    label: 'Notices',            icon: Bell, badge: unreadCount },
        { id: 'aiAnalytics',label: 'AI Analytics',       icon: Sparkles },
      ]}];
    }
    if (activeRole === 'guard') {
      return [{ category: 'SECURITY PORTAL', items: [
        { id: 'dashboard', label: 'Security Terminal', icon: ShieldCheck },
        { id: 'notices',   label: 'Alerts & Notices',  icon: Bell, badge: unreadCount },
      ]}];
    }
    if (activeRole === 'messManager') {
      return [{ category: 'MESS PORTAL', items: [
        { id: 'mess',    label: 'Mess Dashboard', icon: Utensils },
        { id: 'notices', label: 'Notices',        icon: Bell, badge: unreadCount },
      ]}];
    }
    if (activeRole === 'teacher') {
      return [{ category: 'FACULTY PORTAL', items: [
        { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
        { id: 'notices',   label: 'Notices',           icon: Bell, badge: unreadCount },
      ]}];
    }
    if (activeRole === 'parent') {
      return [{ category: 'PARENT PORTAL', items: [
        { id: 'dashboard',  label: "Ward's Overview",  icon: LayoutDashboard },
        { id: 'busTracker', label: 'Live Bus Tracker', icon: Shield },
      ]}];
    }
    if (activeRole === 'principal') {
      return [{ category: 'PRINCIPAL PORTAL', items: [
        { id: 'dashboard',   label: 'Command Overview',  icon: LayoutDashboard },
        { id: 'admin',       label: 'Analytics',         icon: BarChart3 },
        { id: 'notices',     label: 'Notices',           icon: Bell, badge: unreadCount },
        { id: 'aiAnalytics', label: 'AI Intelligence',   icon: Sparkles },
        { id: 'calendar',    label: 'Academic Calendar', icon: Calendar },
      ]}];
    }
    // default / admin
    return [{ category: 'ADMIN', items: [
      { id: 'admin',     label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'notices',   label: 'Notices', icon: Bell, badge: unreadCount },
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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none border-r border-slate-800">

      {/* App Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-1 w-9 h-9 p-1 bg-slate-800 rounded-xl border border-slate-700 shadow-md flex-shrink-0">
            <div className="bg-blue-500 rounded-sm"></div>
            <div className="bg-amber-500 rounded-sm"></div>
            <div className="bg-emerald-500 rounded-sm"></div>
            <div className="bg-cyan-500 rounded-sm"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white">UNIFY</span>
              <span className="text-[9px] font-bold px-1.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30">v2.6</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold truncate">Smart Campus Portal</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Signed in as</span>
        <div className="text-xs font-extrabold text-white mt-0.5">{roleLabel}</div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 mt-2">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">{sec.category}</span>
            <div className="space-y-0.5 mt-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { setActiveTab(item.id); if (setMobileOpen) setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group text-left ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}>
                    {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full" />}
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-1.5 text-[9px] font-extrabold bg-rose-500 text-white rounded-full">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Network + Language + Profile */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
        {/* Controls row */}
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
          <div className="flex items-center gap-1 bg-slate-800/90 rounded-lg px-2 py-1 border border-slate-700">
            <Globe className="w-3 h-3 text-slate-400" />
            <select value={currentLang} onChange={e => setCurrentLang(e.target.value)}
              className="bg-transparent text-[11px] text-white border-none focus:outline-none cursor-pointer font-semibold">
              <option value="en">EN</option>
              <option value="or">ଓଡ଼ିଆ</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        {/* Profile card — static, NO switcher */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <img src={currentPersona.avatar} alt={currentPersona.name}
            className={`w-8 h-8 rounded-full object-cover ring-2 ${roleColor} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate leading-tight">{currentPersona.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{roleLabel}</div>
          </div>
          <button onClick={logout}
            title="Sign out"
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