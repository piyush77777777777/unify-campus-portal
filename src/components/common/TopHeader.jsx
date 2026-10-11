import React, { useState, useRef, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, ChevronRight, LogOut, Mail, ShieldCheck, Bell } from 'lucide-react';

const PAGE_TITLES = {
  dashboard:   'Dashboard',
  gatePass:    'Gate Pass',
  complaints:  'Complaints & Maintenance',
  documents:   'Documents & Certificates',
  mess:        'Mess & Dining',
  notices:     'Notices & Alerts',
  admin:       'Admin Dashboard',
  calendar:    'Academic Calendar',
  busTracker:  'Bus Tracker',
  ussdDemo:    'Feature Phone Access',
  adoptionNote:'Adoption Blueprint'
};

const ROLE_LABELS = {
  student:     'Student',
  teacher:     'Faculty',
  warden:      'Hostel Warden',
  guard:       'Security Officer',
  messManager: 'Mess Supervisor',
  parent:      'Parent / Guardian',
  principal:   'Principal'
};

const ROLE_COLORS = {
  student:     'ring-blue-500',
  teacher:     'ring-purple-500',
  warden:      'ring-indigo-500',
  guard:       'ring-amber-500',
  messManager: 'ring-emerald-500',
  parent:      'ring-teal-500',
  principal:   'ring-rose-500'
};

const ROLE_BADGE = {
  student:     'bg-blue-50 text-blue-700 border-blue-200',
  teacher:     'bg-purple-50 text-purple-700 border-purple-200',
  warden:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  guard:       'bg-amber-50 text-amber-700 border-amber-200',
  messManager: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  parent:      'bg-teal-50 text-teal-700 border-teal-200',
  principal:   'bg-rose-50 text-rose-700 border-rose-200'
};

export default function TopHeader({ activeTab, setMobileOpen }) {
  const { currentPersona, activeRole, currentUser, logout, notices } = useCampus();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = (notices||[]).filter(n => !n.hasUserAcknowledged && n.actionRequired).length;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = currentUser?.name || currentPersona.name;
  const displayEmail = currentUser?.email || '';
  const displayAvatar = currentPersona.avatar;
  const roleLabel = ROLE_LABELS[activeRole] || activeRole;
  const ringColor = ROLE_COLORS[activeRole] || 'ring-slate-400';
  const badgeClass = ROLE_BADGE[activeRole] || 'bg-slate-50 text-slate-600 border-slate-200';

  const headerGrad = {
    student:     'linear-gradient(90deg,#1e3a8a,#2563eb,#0284c7)',
    teacher:     'linear-gradient(90deg,#3b0764,#6d28d9,#7c3aed)',
    warden:      'linear-gradient(90deg,#4c0519,#be123c,#e11d48)',
    guard:       'linear-gradient(90deg,#052e16,#15803d,#16a34a)',
    messManager: 'linear-gradient(90deg,#431407,#c2410c,#ea580c)',
    parent:      'linear-gradient(90deg,#134e4a,#0d9488,#14b8a6)',
    principal:   'linear-gradient(90deg,#1c1917,#57534e,#a8a29e)',
  }[activeRole] || 'linear-gradient(90deg,#1e3a8a,#3b82f6)';

  return (
    <header className="sticky top-0 z-20 shadow-lg px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3"
      style={{background: headerGrad}}>

      {/* Left: Mobile menu + breadcrumb + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-white/80 hover:bg-white/10 border border-white/20 flex-shrink-0">
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-white/60 font-medium">
            <span className="font-bold text-white/80">UNIFY</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-bold capitalize truncate">{PAGE_TITLES[activeTab] || activeTab}</span>
          </div>
          <h1 className="text-sm sm:text-base font-black text-white leading-tight truncate drop-shadow">
            {PAGE_TITLES[activeTab] || 'UNIFY Portal'}
          </h1>
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Notification bell */}
        <div className="relative">
          <button className="p-2.5 rounded-xl text-white/80 hover:bg-white/15 border border-white/20 transition-all touch-manipulation">
            <Bell className="w-4.5 h-4.5" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center badge-grad">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Profile avatar */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`relative p-0.5 rounded-full ring-2 ring-white/40 hover:ring-white/80 hover:opacity-90 transition-all shadow-md`}>
            <img src={displayAvatar} alt={displayName}
              className="w-9 h-9 rounded-full object-cover" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">

              {/* Profile header */}
              <div className="p-4 border-b border-slate-100" style={{background: headerGrad}}>
                <div className="flex items-center gap-3">
                  <img src={displayAvatar} alt={displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/60" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{displayName}</div>
                    {displayEmail && (
                      <div className="text-[11px] text-white/70 truncate">{displayEmail}</div>
                    )}
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white border border-white/30">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified sign-in indicator */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-emerald-700">Signed in via Google</span>
                  {currentUser?.signedInAt && <span className="text-slate-400 ml-1">at {currentUser.signedInAt}</span>}
                </div>
              </div>

              {/* Portal lock notice */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Your account is locked to the <strong>{roleLabel} portal</strong>. Portal switching is not permitted.
                  </p>
                </div>
              </div>

              {/* Sign out */}
              <div className="p-2">
                <button onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-rose-600 hover:bg-rose-50 transition-all font-bold text-sm">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}