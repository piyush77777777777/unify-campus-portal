import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  GraduationCap, Building2, Shield, Utensils, BookOpen,
  Users, ShieldCheck, Bell, FileText, Wrench, MapPin, CheckCircle2
} from 'lucide-react';

const PORTALS = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    description: 'Attendance, Gate Pass, Mess, Documents & Notices',
    color: 'bg-blue-600',
    ring: 'ring-blue-500',
    gradient: 'from-blue-600 to-indigo-600',
    lightBg: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    id: 'teacher',
    label: 'Faculty',
    icon: BookOpen,
    description: 'Class Schedule, Attendance Review & Leave Requests',
    color: 'bg-purple-600',
    ring: 'ring-purple-500',
    gradient: 'from-purple-600 to-indigo-600',
    lightBg: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    id: 'warden',
    label: 'Hostel Warden',
    icon: Building2,
    description: 'Gate Pass Approvals, Complaints & Hostel Management',
    color: 'bg-indigo-600',
    ring: 'ring-indigo-500',
    gradient: 'from-indigo-600 to-slate-700',
    lightBg: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  },
  {
    id: 'guard',
    label: 'Security Officer',
    icon: Shield,
    description: 'QR Gate Scanner, Entry/Exit Log & Alerts',
    color: 'bg-amber-600',
    ring: 'ring-amber-500',
    gradient: 'from-amber-600 to-orange-600',
    lightBg: 'bg-amber-50 border-amber-200 text-amber-700'
  },
  {
    id: 'messManager',
    label: 'Mess Supervisor',
    icon: Utensils,
    description: 'Menu Management, Meal Poll & Feedback Dashboard',
    color: 'bg-emerald-600',
    ring: 'ring-emerald-500',
    gradient: 'from-emerald-600 to-teal-600',
    lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  },
  {
    id: 'parent',
    label: 'Parent / Guardian',
    icon: Users,
    description: "Ward's Attendance, Gate Pass History & Fee Status",
    color: 'bg-teal-600',
    ring: 'ring-teal-500',
    gradient: 'from-teal-600 to-cyan-600',
    lightBg: 'bg-teal-50 border-teal-200 text-teal-700'
  },
  {
    id: 'principal',
    label: 'Principal & Director',
    icon: Building2,
    description: 'Campus KPIs, Department Overview & Escalation Queue',
    color: 'bg-rose-700',
    ring: 'ring-rose-600',
    gradient: 'from-rose-700 to-slate-800',
    lightBg: 'bg-rose-50 border-rose-200 text-rose-700'
  }
];

export default function LandingPage() {
  const { setAuthModalOpen, setAuthTargetRole } = useCampus();
  const [hoveredPortal, setHoveredPortal] = useState(null);

  const handleSignIn = (portalId) => {
    setAuthTargetRole(portalId);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Top Navbar ───────────────────────────────────── */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-0.5 w-8 h-8 p-1 bg-slate-900 rounded-xl">
            <div className="bg-blue-400 rounded-sm" />
            <div className="bg-amber-400 rounded-sm" />
            <div className="bg-emerald-400 rounded-sm" />
            <div className="bg-cyan-400 rounded-sm" />
          </div>
          <div>
            <span className="font-black text-lg text-slate-900 tracking-tight">UNIFY</span>
            <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Smart Campus Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="hidden sm:inline font-semibold">Secured by Google OAuth 2.0</span>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Smart Campus Management System
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
            One Platform.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Every Campus Role.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Unified digital portal for Students, Faculty, Wardens, Security, Mess Staff, Parents and Administration — all in one place, secured with Google.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { icon: ShieldCheck, text: 'Digital Gate Pass' },
              { icon: Bell, text: 'Smart Notifications' },
              { icon: FileText, text: 'Instant Documents' },
              { icon: Wrench, text: 'Complaint Tracker' },
              { icon: MapPin, text: 'Live Bus Tracker' },
              { icon: CheckCircle2, text: 'Attendance System' }
            ].map(({ icon: Icon, text }, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90">
                <Icon className="w-3.5 h-3.5 text-blue-300" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Portal Selection ─────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Select Your Portal</h2>
          <p className="text-sm text-slate-500 mt-2">
            Sign in with your official Google account. Your email will be permanently linked to your portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            const isHovered = hoveredPortal === portal.id;
            return (
              <div
                key={portal.id}
                onMouseEnter={() => setHoveredPortal(portal.id)}
                onMouseLeave={() => setHoveredPortal(null)}
                className={`group bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-lg ${
                  isHovered ? 'border-slate-900 -translate-y-0.5' : 'border-slate-200'
                }`}
                onClick={() => handleSignIn(portal.id)}
              >
                {/* Card top accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${portal.gradient}`} />

                <div className="p-5">
                  {/* Icon + label */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${portal.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${portal.lightBg}`}>
                      {portal.label}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base mb-1">{portal.label} Portal</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">{portal.description}</p>

                  {/* Sign in button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSignIn(portal.id); }}
                    className={`w-full py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${portal.gradient} hover:opacity-90 shadow-md`}
                  >
                    {/* Google G */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="white" fillOpacity="0.9" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="white" fillOpacity="0.75" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="white" fillOpacity="0.6" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="white" fillOpacity="0.85" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Sign in as {portal.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security notice */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Each Google account is locked to one portal only</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Identity verified with your Institution ID</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <span>End-to-end encrypted sessions</span>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white mt-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6 p-0.5 bg-slate-900 rounded-lg">
              <div className="bg-blue-400 rounded-xs" />
              <div className="bg-amber-400 rounded-xs" />
              <div className="bg-emerald-400 rounded-xs" />
              <div className="bg-cyan-400 rounded-xs" />
            </div>
            <span className="font-black text-slate-800">UNIFY</span>
            <span className="text-slate-400 text-xs">— Smart Campus Portal</span>
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            Secured with Google OAuth 2.0 &nbsp;•&nbsp; All data encrypted &nbsp;•&nbsp; Offline-ready PWA
          </div>
        </div>
      </footer>
    </div>
  );
}