import React, { useState, useEffect } from 'react';
import { ShieldCheck, Bell, FileText, Wrench, MapPin, CheckCircle2, ArrowRight, Sparkles, Zap, Users, Star } from 'lucide-react';
import GoogleAuthModal from '../auth/GoogleAuthModal';
import { useCampus } from '../../context/CampusContext';

const PORTALS = [
  { id:'student',     emoji:'🎓', label:'Student',     desc:'Attendance, gate pass, fees, mess, hostel & more', gradient:'from-blue-500 to-indigo-600',    glow:'shadow-blue-500/30',   ring:'ring-blue-400' },
  { id:'teacher',     emoji:'📚', label:'Teacher',     desc:'Classes, leave, grading, polls & workload',        gradient:'from-violet-500 to-purple-600',   glow:'shadow-violet-500/30', ring:'ring-violet-400' },
  { id:'warden',      emoji:'🏠', label:'Warden',      desc:'Hostel gate passes, complaints & room records',    gradient:'from-emerald-500 to-teal-600',    glow:'shadow-emerald-500/30',ring:'ring-emerald-400' },
  { id:'guard',       emoji:'🛡️', label:'Security',    desc:'QR scan, visitor logs & campus security audit',    gradient:'from-slate-600 to-slate-800',     glow:'shadow-slate-500/30',  ring:'ring-slate-400' },
  { id:'messManager', emoji:'🍽️', label:'Mess',        desc:'Menu, feedback, reservations & nutrition',         gradient:'from-orange-500 to-amber-500',    glow:'shadow-orange-500/30', ring:'ring-orange-400' },
  { id:'parent',      emoji:'👨‍👩‍👧', label:'Parent',     desc:'Ward attendance, fee status & gate pass history',  gradient:'from-teal-500 to-cyan-500',       glow:'shadow-teal-500/30',   ring:'ring-teal-400' },
  { id:'principal',   emoji:'🎯', label:'Principal',   desc:'Campus analytics, staffing AI & policy compliance',gradient:'from-rose-500 to-pink-600',       glow:'shadow-rose-500/30',   ring:'ring-rose-400' },
];

const FEATURES = [
  { icon:'⚡', text:'Real-time QR Gate Pass' },
  { icon:'📍', text:'Live GPS Bus Tracker' },
  { icon:'🤖', text:'AI Complaint Routing' },
  { icon:'🔔', text:'Smart Push Notifications' },
  { icon:'📊', text:'Campus Analytics Dashboard' },
  { icon:'🚨', text:'Emergency SOS System' },
  { icon:'🗳️', text:'Live Polls & Quizzes' },
  { icon:'🗺️', text:'Campus Hotspot Map' },
];

// ── Unique animated UNIFY Logo ───────────────────────────────────
function UnifyLogo({ size = 'md' }) {
  const s = size === 'lg' ? { wrap: 'w-14 h-14', dots: 'w-5 h-5', text: 'text-2xl', sub: 'text-xs' }
           : size === 'sm' ? { wrap: 'w-7 h-7', dots: 'w-2.5 h-2.5', text: 'text-base', sub: 'hidden' }
           : { wrap: 'w-10 h-10', dots: 'w-3.5 h-3.5', text: 'text-xl', sub: 'text-[10px]' };
  return (
    <div className="flex items-center gap-2.5">
      {/* Hexagonal orbit logo */}
      <div className={`relative ${s.wrap} flex-shrink-0`}>
        <svg viewBox="0 0 56 56" className="w-full h-full drop-shadow-lg">
          {/* Outer hex */}
          <polygon points="28,2 52,15 52,41 28,54 4,41 4,15"
            fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinejoin="round"/>
          {/* Inner hex */}
          <polygon points="28,12 44,21 44,35 28,44 12,35 12,21"
            fill="url(#logoGrad)" opacity="0.15"/>
          {/* Center U shape */}
          <text x="28" y="35" textAnchor="middle" fontSize="20" fontWeight="900"
            fill="url(#logoGrad)" fontFamily="system-ui,sans-serif">U</text>
          {/* Orbit dot */}
          <circle cx="28" cy="4" r="3" fill="#3b82f6">
            <animateTransform attributeName="transform" type="rotate"
              from="0 28 28" to="360 28 28" dur="4s" repeatCount="indefinite"/>
          </circle>
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6"/>
              <stop offset="50%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div>
        <div className={`font-black tracking-tight ${s.text} bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent`}>
          UNIFY
        </div>
        <div className={`font-bold text-slate-400 uppercase tracking-widest ${s.sub}`}>Smart Campus</div>
      </div>
    </div>
  );
}

// ── Floating particle background ────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div key={i}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            width: `${4 + (i % 5) * 6}px`,
            height: `${4 + (i % 5) * 6}px`,
            left: `${5 + (i * 47) % 90}%`,
            top: `${5 + (i * 37) % 85}%`,
            background: ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b'][i % 5],
            animationDelay: `${(i * 0.4) % 4}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { setIsLandingPage, loginWithGoogle } = useCampus();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [hoveredPortal, setHoveredPortal] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handlePortalClick = (portalId) => {
    setSelectedRole(portalId);
    setModalOpen(true);
  };

  const handleLogin = (role, user) => {
    loginWithGoogle(user.email || (role + '@igit.ac.in'), role, user.name || '');
    setIsLandingPage(false);
    setModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease forwards; }
        .shimmer-text {
          background: linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#3b82f6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .card-glow { transition: all 0.3s; }
        .card-glow:hover { transform: translateY(-6px) scale(1.02); }
        .grid-bg {
          background-image: linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-white/5 backdrop-blur-xl bg-[#030712]/80 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <UnifyLogo size="md" />
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>LIVE
          </span>
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all">
            Sign In <ArrowRight className="w-3.5 h-3.5"/>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="relative min-h-screen flex items-center justify-center grid-bg pt-16">
        <Particles/>

        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-[128px] pointer-events-none"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[96px] pointer-events-none"/>

        <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400"/>
            AI-Powered Smart Campus System
            <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-500/30 text-[10px] font-black">NEW</span>
          </div>

          {/* Hero heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6">
            <span className="block text-white">Campus life,</span>
            <span className="block shimmer-text mt-1">unified.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            One intelligent portal for every role — Students, Faculty, Wardens, Security, Parents & Administration. AI-powered, real-time, and offline-ready.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {FEATURES.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all cursor-default">
                <span>{f.icon}</span>{f.text}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => setModalOpen(true)}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 text-white font-black text-sm shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all">
              <Zap className="w-4 h-4"/>
              Get Started — It's Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500"/>
              <span>Secured with Google OAuth 2.0</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/5">
            {[{ v:'7', l:'Portals' }, { v:'60+', l:'Features' }, { v:'AI', l:'Powered' }, { v:'PWA', l:'Offline Ready' }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{s.v}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PORTAL CARDS ── */}
      <div className="relative py-24 px-4 sm:px-8 bg-[#030712]">
        <div className="absolute inset-0 grid-bg opacity-50"/>
        <div className="relative max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Choose Your Portal
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Click your role — sign in once with Google. Your email locks to your portal forever.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PORTALS.map((portal, i) => (
              <button key={portal.id}
                onMouseEnter={() => setHoveredPortal(portal.id)}
                onMouseLeave={() => setHoveredPortal(null)}
                onClick={() => handlePortalClick(portal.id)}
                className={`card-glow group relative text-left p-5 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  hoveredPortal === portal.id
                    ? `border-transparent ring-2 ${portal.ring} bg-white/5 shadow-2xl ${portal.glow}`
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/5'
                }`}
                style={{ animationDelay: `${i * 0.08}s` }}>

                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${portal.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}/>

                {/* Glow behind emoji */}
                <div className={`absolute top-3 right-3 w-16 h-16 rounded-full bg-gradient-to-r ${portal.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity`}/>

                <div className="text-3xl mb-3">{portal.emoji}</div>
                <h3 className="font-black text-white text-base mb-1 group-hover:text-white">
                  {portal.label} Portal
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-400 transition-colors mb-4">
                  {portal.desc}
                </p>

                <div className={`flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${portal.gradient} bg-clip-text text-transparent`}>
                  Sign in with Google
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-blue-400"/>
                </div>
              </button>
            ))}
          </div>

          {/* One-time lock notice */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-600">
            {[
              { icon: ShieldCheck, c:'text-emerald-500', t:'1 Google account = 1 portal only' },
              { icon: Zap,         c:'text-blue-500',   t:'Role verified by Institution ID' },
              { icon: Star,        c:'text-violet-500', t:'End-to-end encrypted sessions' },
            ].map((i, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <i.icon className={`w-4 h-4 ${i.c}`}/>{i.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#030712] px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <UnifyLogo size="sm"/>
          <div className="text-[11px] text-slate-600 text-center">
            © 2026 UNIFY • BUG FINDERS • BPUT Hackathon PS-07 &nbsp;•&nbsp; Secured &nbsp;•&nbsp; PWA Ready
          </div>
        </div>
      </footer>

      {/* ── MODAL — pass selectedRole so Step 1 is SKIPPED ── */}
      {modalOpen && (
        <GoogleAuthModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedRole(null); }}
          onLogin={handleLogin}
          initialRole={selectedRole}
        />
      )}
    </div>
  );
}