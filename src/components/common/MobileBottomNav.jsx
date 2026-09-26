import React from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  LayoutDashboard, ShieldCheck, Wrench, Utensils,
  Bell, Calendar, Bus, BookOpen, BarChart3, AlertTriangle, Sparkles
} from 'lucide-react';

const NAV_CONFIG = {
  student: [
    { id: 'dashboard',  label: 'Home',      icon: LayoutDashboard },
    { id: 'gatePass',   label: 'Gate Pass', icon: ShieldCheck },
    { id: 'mess',       label: 'Mess',      icon: Utensils },
    { id: 'notices',    label: 'Notices',   icon: Bell },
    { id: 'busTracker', label: 'Bus',       icon: Bus },
  ],
  teacher: [
    { id: 'dashboard', label: 'Home',     icon: LayoutDashboard },
    { id: 'notices',   label: 'Notices',  icon: Bell },
    { id: 'calendar',  label: 'Calendar', icon: Calendar },
  ],
  warden: [
    { id: 'admin',       label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gatePass',    label: 'Approvals', icon: ShieldCheck },
    { id: 'complaints',  label: 'Issues',    icon: Wrench },
    { id: 'notices',     label: 'Notices',   icon: Bell },
    { id: 'aiAnalytics', label: 'AI',        icon: Sparkles },
  ],
  guard: [
    { id: 'dashboard', label: 'Terminal', icon: ShieldCheck },
    { id: 'notices',   label: 'Alerts',  icon: Bell },
  ],
  messManager: [
    { id: 'mess',    label: 'Mess',    icon: Utensils },
    { id: 'notices', label: 'Notices', icon: Bell },
  ],
  parent: [
    { id: 'dashboard',  label: 'Home', icon: LayoutDashboard },
    { id: 'busTracker', label: 'Bus',  icon: Bus },
  ],
  principal: [
    { id: 'dashboard',   label: 'Home',    icon: LayoutDashboard },
    { id: 'admin',       label: 'Reports', icon: BarChart3 },
    { id: 'notices',     label: 'Notices', icon: Bell },
    { id: 'aiAnalytics', label: 'AI',      icon: Sparkles },
  ]
};

const ROLE_ACCENT = {
  student:     'text-blue-600 bg-blue-50',
  teacher:     'text-purple-600 bg-purple-50',
  warden:      'text-indigo-600 bg-indigo-50',
  guard:       'text-amber-600 bg-amber-50',
  messManager: 'text-emerald-600 bg-emerald-50',
  parent:      'text-teal-600 bg-teal-50',
  principal:   'text-rose-600 bg-rose-50',
};

export default function MobileBottomNav({ activeTab, setActiveTab, notices }) {
  const { activeRole } = useCampus();
  const items = NAV_CONFIG[activeRole] || NAV_CONFIG.student;
  const accent = ROLE_ACCENT[activeRole] || 'text-blue-600 bg-blue-50';
  const unread = (notices || []).filter(n => !n.hasUserAcknowledged && n.actionRequired).length;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl">
      {/* Safe area spacer for notch phones */}
      <div className="flex items-stretch justify-around px-1" style={{ paddingBottom: 'env(safe-area-inset-bottom, 4px)' }}>
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showBadge = item.id === 'notices' && unread > 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 min-h-[56px] transition-all relative ${
                isActive ? 'opacity-100' : 'opacity-60 active:opacity-100'
              }`}
            >
              <div className={`relative flex items-center justify-center w-10 h-6 rounded-full transition-all ${isActive ? accent : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? accent.split(' ')[0] : 'text-slate-500'}`} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? accent.split(' ')[0] : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${accent.split(' ')[0].replace('text-', 'bg-')}`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}