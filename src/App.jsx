import React, { useState } from 'react';
import { NetworkProvider } from './context/NetworkContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CampusProvider, useCampus } from './context/CampusContext';
import Sidebar from './components/common/Sidebar';
import TopHeader from './components/common/TopHeader';
import MobileBottomNav from './components/common/MobileBottomNav';
import OfflineBanner from './components/common/OfflineBanner';
import Toast from './components/common/Toast';

import LandingPage from './components/landing/LandingPage';
import GoogleAuthModal from './components/auth/GoogleAuthModal';
import EmailReceiptModal from './components/auth/EmailReceiptModal';

import StudentDashboard from './components/student/StudentDashboard';
import GuardTerminal from './components/security/GuardTerminal';
import AdminDashboard from './components/admin/AdminDashboard';
import MessView from './components/student/MessView';
import NoticeBoard from './components/notices/NoticeBoard';
import USSDSimulator from './components/accessibility/USSDSimulator';
import AdoptionRoadmap from './components/adoption/AdoptionRoadmap';

import TeacherDashboard from './components/teacher/TeacherDashboard';
import ParentPortal from './components/parent/ParentPortal';
import PrincipalPortal from './components/principal/PrincipalPortal';
import CalendarView from './components/campus/CalendarView';
import BusTracker from './components/campus/BusTracker';
import CampusMap from './components/campus/CampusMap';
import AIAnalytics from './components/analytics/AIAnalytics';

import GatePassModal from './components/student/GatePassModal';
import ComplaintModal from './components/student/ComplaintModal';
import DocumentModal from './components/student/DocumentModal';
import EmergencyAlertModal from './components/common/EmergencyAlertModal';
import CampusBotModal from './components/common/CampusBotModal';

// ─── Auto-clear stale localStorage on version change ───────────────────────
const APP_VERSION = '2.7';
try {
  const storedVersion = localStorage.getItem('UNIFY_version');
  if (storedVersion !== APP_VERSION) {
    ['UNIFY_gate_passes','UNIFY_complaints','UNIFY_notices','UNIFY_mess_data','UNIFY_audit_logs','UNIFY_current_user'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('UNIFY_version', APP_VERSION);
  }
} catch {}
// ────────────────────────────────────────────────────────────────────────────

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeRole, isLandingPage, notices } = useCampus();
  const { t } = useLanguage();

  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [botModalOpen, setBotModalOpen] = useState(false);

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <LandingPage />
        <GoogleAuthModal />
        <EmailReceiptModal />
        <Toast />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (activeRole === 'guard') return <GuardTerminal />;
        if (activeRole === 'warden') return <AdminDashboard />;
        if (activeRole === 'messManager') return <MessView />;
        if (activeRole === 'teacher') return <TeacherDashboard />;
        if (activeRole === 'parent') return <ParentPortal />;
        if (activeRole === 'principal') return <PrincipalPortal />;
        return <StudentDashboard onNavigateTab={setActiveTab} />;

      case 'gatePass':
        if (activeRole === 'guard') return <GuardTerminal />;
        if (activeRole === 'warden') return <AdminDashboard />;
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('gatePass.title')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t('gatePass.subtitle')}</p>
              </div>
              <button onClick={() => setGatePassModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                + Request Gate Pass
              </button>
            </div>
            <StudentDashboard onNavigateTab={setActiveTab} />
          </div>
        );

      case 'complaints':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('complaints.title')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t('complaints.subtitle')}</p>
              </div>
              <button onClick={() => setComplaintModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                + Report Issue
              </button>
            </div>
            <AdminDashboard />
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('documents.title')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t('documents.subtitle')}</p>
              </div>
              <button onClick={() => setDocModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95">
                Generate Bonafide / NOC
              </button>
            </div>
            <StudentDashboard onNavigateTab={setActiveTab} />
          </div>
        );

      case 'mess':        return <MessView />;
      case 'notices':     return <NoticeBoard />;
      case 'admin':       return <AdminDashboard />;
      case 'ussdDemo':    return <USSDSimulator />;
      case 'adoptionNote':return <AdoptionRoadmap />;
      case 'calendar':    return <CalendarView />;
      case 'busTracker':  return <BusTracker />;
      case 'aiAnalytics': return <AIAnalytics />;
      default:            return <StudentDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-blue-500 selection:text-white">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <TopHeader activeTab={activeTab} setMobileOpen={setMobileMenuOpen} />
        <OfflineBanner />

        {/* Extra bottom padding on mobile so content clears bottom nav bar */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-8">
          {renderTabContent()}
        </main>

        {/* Desktop footer — hidden on mobile */}
        <footer className="hidden lg:block bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">UNIFY</span>
              <span>•</span>
              <span>Smart Campus Management System</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Offline PWA Ready
            </span>
          </div>
        </footer>
      </div>

      {/* Mobile bottom navigation — only visible on phones/tablets */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notices={notices}
      />

      {/* Modals */}
      <GatePassModal isOpen={gatePassModalOpen} onClose={() => setGatePassModalOpen(false)} />
      <ComplaintModal isOpen={complaintModalOpen} onClose={() => setComplaintModalOpen(false)} />
      <DocumentModal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} />
      <EmergencyAlertModal isOpen={emergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} />
      <CampusBotModal isOpen={botModalOpen} onClose={() => setBotModalOpen(false)} onNavigate={setActiveTab} />
      <GoogleAuthModal />
      <EmailReceiptModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <NetworkProvider>
      <LanguageProvider>
        <CampusProvider>
          <MainApp />
        </CampusProvider>
      </LanguageProvider>
    </NetworkProvider>
  );
}