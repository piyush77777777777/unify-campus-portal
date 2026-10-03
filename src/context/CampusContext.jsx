import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db as supaDB, isSupabaseLive } from '../services/supabase';
import { firestoreDB, isFirebaseLive, initFCM } from '../services/firebase';
import {
  initialPersonas,
  initialGatePasses,
  initialComplaints,
  initialNotices,
  initialMessData,
  initialAuditLogs,
  campusHotspotStats,
  busRoutes,
  examCalendar,
  initialTimetable,
  initialAssignments,
  initialRoomAssets,
  initialAntiRaggingReports,
  initialVisitorLogs,
  initialQuizzes,
  initialStudentReviews,
  initialStaffWorkload,
  initialFinanceData,
  initialPolicyCompliance
} from '../data/initialData';
import { useNetwork } from './NetworkContext';

const CampusContext = createContext();

export function CampusProvider({ children }) {
  const { isOffline, addToOfflineQueue, offlineQueue, clearQueue, showToast, networkMode } = useNetwork();

  // Active user persona: 'student' | 'warden' | 'guard' | 'messManager' | 'teacher'
  const VALID_ROLES = ['student','teacher','warden','guard','messManager','parent','principal'];

  const [activeRole, setActiveRole] = useState(() => {
    try {
      const r = localStorage.getItem('UNIFY_active_role');
      return (r && VALID_ROLES.includes(r)) ? r : 'student';
    } catch { return 'student'; }
  });

  // Current logged in user object
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('UNIFY_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate it has required fields
        if (parsed && parsed.role && VALID_ROLES.includes(parsed.role)) return parsed;
      }
    } catch { /* ignore corrupt data */ }
    return {
      name: "Piyush Kumar Dey",
      email: "piyush@igit.ac.in",
      role: "student",
      provider: "Demo",
      signedInAt: new Date().toLocaleTimeString()
    };
  });

  // View mode: Landing Page vs Dashboard — always start at landing if role seems broken
  const [isLandingPage, setIsLandingPage] = useState(() => {
    try {
      const mode = localStorage.getItem('UNIFY_view_mode');
      const role = localStorage.getItem('UNIFY_active_role');
      // Only skip landing page if both mode=app AND role is valid
      return !(mode === 'app' && role && VALID_ROLES.includes(role));
    } catch { return true; }
  });


  // Google Auth & Email Receipt Dialog States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTargetRole, setAuthTargetRole] = useState('student');
  const [emailReceipt, setEmailReceipt] = useState({
    isOpen: false,
    email: '',
    role: '',
    timestamp: '',
    token: ''
  });

  const [gatePasses, setGatePasses] = useState(() => {
    const saved = localStorage.getItem('UNIFY_gate_passes');
    return saved ? JSON.parse(saved) : initialGatePasses;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('UNIFY_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('UNIFY_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [messData, setMessData] = useState(() => {
    const saved = localStorage.getItem('UNIFY_mess_data');
    return saved ? JSON.parse(saved) : initialMessData;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('UNIFY_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Current active persona details
  const currentPersona = initialPersonas[activeRole] || initialPersonas.student;

  // Persist state
  useEffect(() => {
    localStorage.setItem('UNIFY_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('UNIFY_gate_passes', JSON.stringify(gatePasses));
  }, [gatePasses]);

  useEffect(() => {
    localStorage.setItem('UNIFY_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('UNIFY_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('UNIFY_mess_data', JSON.stringify(messData));
  }, [messData]);

  useEffect(() => {
    localStorage.setItem('UNIFY_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Sync offline items when network mode switches to online
  useEffect(() => {
    if (networkMode === 'online' && offlineQueue.length > 0) {
      showToast(`🔄 Connected! Synced ${offlineQueue.length} offline actions to UNIFY Server.`, 'success');
      
      // Process offline queue items
      offlineQueue.forEach(item => {
        if (item.type === 'NEW_COMPLAINT') {
          setComplaints(prev => [item.payload, ...prev]);
        } else if (item.type === 'NEW_GATE_PASS') {
          setGatePasses(prev => [item.payload, ...prev]);
        } else if (item.type === 'MEAL_POLL') {
          handleMealDecisionInternal(item.payload.decision);
        }
      });
      clearQueue();
    }
  }, [networkMode]);

  // Add an audit log entry
  const addAuditLog = (actor, action, details, badgeColor = 'blue') => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor,
      action,
      details,
      badgeColor
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // AI / Rule-based categorization helper for complaints
  const analyzeComplaintUrgencyAndDept = (text, category) => {
    const lower = (text + ' ' + category).toLowerCase();
    let autoDept = 'General Maintenance';
    let urgency = 'NORMAL';
    let slaHours = 24;

    if (lower.includes('leak') || lower.includes('tap') || lower.includes('water') || lower.includes('plumb') || lower.includes('flush')) {
      autoDept = 'Plumbing Maintenance';
      if (lower.includes('leak') || lower.includes('flood') || lower.includes('continuous')) {
        urgency = 'HIGH';
        slaHours = 12;
      }
    } else if (lower.includes('spark') || lower.includes('shock') || lower.includes('wire') || lower.includes('switch') || lower.includes('fan')) {
      autoDept = 'Electrical Maintenance';
      urgency = 'HIGH';
      slaHours = 6; // Fast response for electrical hazards
    } else if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('net') || lower.includes('router') || lower.includes('lan')) {
      autoDept = 'IT & Campus Network Cell';
      urgency = 'MEDIUM';
      slaHours = 24;
    } else if (lower.includes('bed') || lower.includes('table') || lower.includes('chair') || lower.includes('door') || lower.includes('lock')) {
      autoDept = 'Carpentry & Estate Office';
      urgency = 'LOW';
      slaHours = 48;
    }

    return { autoDept, urgency, slaHours };
  };

  // Gate Pass Actions
  const createGatePass = (data) => {
    const newPass = {
      id: `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentPersona.id,
      studentName: currentPersona.name,
      regNo: currentPersona.regNo,
      room: currentPersona.room,
      passType: data.passType || 'Day Outing',
      destination: data.destination,
      outTime: data.outTime || 'Today, 17:30',
      expectedInTime: data.expectedInTime || 'Today, 21:00',
      actualOutTime: null,
      actualInTime: null,
      status: 'PENDING',
      approvedBy: null,
      approvedAt: null,
      qrToken: `BPUT-GP-SECURE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      guardianAlertSent: false,
      emergencyPhone: data.emergencyPhone || currentPersona.guardianPhone,
      remarks: data.remarks || 'Standard Student Outing Request'
    };

    if (isOffline) {
      addToOfflineQueue({ type: 'NEW_GATE_PASS', payload: newPass });
      showToast('⚠️ Offline: Gate pass saved locally. Will sync when network restores.', 'warning');
      setGatePasses(prev => [newPass, ...prev]);
    } else {
      setGatePasses(prev => [newPass, ...prev]);
      addAuditLog(currentPersona.name, 'REQUESTED_GATE_PASS', `Submitted gate pass for ${newPass.destination}`, 'blue');
      showToast('✅ Gate pass requested. Sent to Chief Warden for 1-click approval.', 'success');
    }
    return newPass;
  };

  const approveGatePass = (passId, wardenRemarks = 'Approved by Chief Warden') => {
    setGatePasses(prev => prev.map(gp => {
      if (gp.id === passId) {
        return {
          ...gp,
          status: 'APPROVED',
          approvedBy: currentPersona.name,
          approvedAt: 'Just now',
          guardianAlertSent: true,
          remarks: wardenRemarks
        };
      }
      return gp;
    }));
    addAuditLog(currentPersona.name, 'APPROVED_GATE_PASS', `Approved gate pass ${passId}. SMS notification triggered to parent.`, 'emerald');
    showToast(`✅ Gate Pass ${passId} Approved! Dynamic QR is now active for security gate exit.`, 'success');
  };

  const rejectGatePass = (passId, reason = 'Curfew or academic hours conflict') => {
    setGatePasses(prev => prev.map(gp => {
      if (gp.id === passId) {
        return {
          ...gp,
          status: 'REJECTED',
          remarks: reason
        };
      }
      return gp;
    }));
    addAuditLog(currentPersona.name, 'REJECTED_GATE_PASS', `Rejected pass ${passId}: ${reason}`, 'red');
    showToast(`❌ Gate pass ${passId} rejected.`, 'error');
  };

  const scanGateExit = (passId) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGatePasses(prev => prev.map(gp => {
      if (gp.id === passId) {
        return {
          ...gp,
          status: 'CHECKED_OUT',
          actualOutTime: timeNow
        };
      }
      return gp;
    }));
    addAuditLog('Main Gate Security (Subedar Ram Singh)', 'SECURITY_SCAN_OUT', `Verified and allowed exit for ${passId} at ${timeNow}`, 'amber');
    showToast(`🚪 Security Check: Student Checked OUT at ${timeNow}. Barrier raised.`, 'success');
  };

  const scanGateEntry = (passId) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGatePasses(prev => prev.map(gp => {
      if (gp.id === passId) {
        return {
          ...gp,
          status: 'COMPLETED',
          actualInTime: timeNow
        };
      }
      return gp;
    }));
    addAuditLog('Main Gate Security (Subedar Ram Singh)', 'SECURITY_SCAN_IN', `Recorded safe campus return for ${passId} at ${timeNow}`, 'emerald');
    showToast(`🛡️ Student safely returned to campus at ${timeNow}.`, 'success');
  };

  // Complaint Actions
  const createComplaint = (data) => {
    const analysis = analyzeComplaintUrgencyAndDept(data.title + ' ' + data.description, data.category);

    const newTicket = {
      id: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      description: data.description,
      category: data.category || 'Hostel Maintenance',
      location: data.location || `${currentPersona.hostel} - Room ${currentPersona.room}`,
      urgency: data.urgency || analysis.urgency,
      reportedBy: `${currentPersona.name} (${currentPersona.room})`,
      studentId: currentPersona.id,
      reportedDaysAgo: 0,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      assignedTo: `Auto-routed to ${analysis.autoDept}`,
      slaBreached: false,
      slaTargetHours: analysis.slaHours,
      escalationLevel: 'Level 1: Auto-Dispatched',
      photoUrl: data.photoUrl || null,
      timeline: [
        {
          timestamp: 'Just now',
          note: `Ticket created via UNIFY. AI routed to ${analysis.autoDept} (SLA: ${analysis.slaHours}h).`,
          author: 'System Bot'
        }
      ]
    };

    if (isOffline) {
      addToOfflineQueue({ type: 'NEW_COMPLAINT', payload: newTicket });
      showToast('⚠️ Offline: Maintenance complaint saved locally. Will sync automatically once online.', 'warning');
      setComplaints(prev => [newTicket, ...prev]);
    } else {
      setComplaints(prev => [newTicket, ...prev]);
      addAuditLog(currentPersona.name, 'FILED_COMPLAINT', `Filed ticket: ${newTicket.title} (${newTicket.category})`, 'blue');
      showToast(`🛠️ Ticket ${newTicket.id} created! Routed to ${analysis.autoDept}.`, 'success');
    }
    return newTicket;
  };

  const updateComplaintStatus = (ticketId, newStatus, resolutionNote = '', feedbackRating = null) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === ticketId) {
        const updatedTimeline = [
          ...c.timeline,
          {
            timestamp: 'Just now',
            note: resolutionNote || `Status updated to ${newStatus} by ${currentPersona.name}`,
            author: currentPersona.name
          }
        ];
        return {
          ...c,
          status: newStatus,
          resolutionNote: resolutionNote || c.resolutionNote,
          feedbackRating: feedbackRating || c.feedbackRating,
          timeline: updatedTimeline
        };
      }
      return c;
    }));
    addAuditLog(currentPersona.name, 'UPDATED_TICKET', `Updated ticket ${ticketId} to status: ${newStatus}`, 'emerald');
    showToast(`Ticket ${ticketId} updated to ${newStatus}.`, 'info');
  };

  const escalateComplaint = (ticketId) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          status: 'ESCALATED',
          slaBreached: true,
          escalationLevel: 'Level 2: Chief Warden Direct Intervention',
          timeline: [
            ...c.timeline,
            {
              timestamp: 'Just now',
              note: `Urgent escalation triggered by ${currentPersona.name}. Chief Warden alerted.`,
              author: currentPersona.name
            }
          ]
        };
      }
      return c;
    }));
    addAuditLog(currentPersona.name, 'ESCALATED_TICKET', `Escalated ticket ${ticketId} to Chief Warden.`, 'red');
    showToast(`🚨 Ticket ${ticketId} escalated to Chief Warden with priority red badge.`, 'error');
  };

  // Mess Dining Actions
  const handleMealDecisionInternal = (decision) => {
    setMessData(prev => {
      const annapurna = prev.annapurnaMess;
      const wasOptIn = annapurna.userMealDecision === 'OPT_IN';
      const isNowOptIn = decision === 'OPT_IN';

      let newOptedIn = annapurna.optedInDinner;
      let newOptedOut = annapurna.optedOutDinner;

      if (wasOptIn && !isNowOptIn) {
        newOptedIn -= 1;
        newOptedOut += 1;
      } else if (!wasOptIn && isNowOptIn) {
        newOptedIn += 1;
        newOptedOut -= 1;
      }

      const foodSavedKg = +(newOptedOut * 0.30).toFixed(1); // approx 300g food saved per opted-out student
      const moneySaved = Math.round(newOptedOut * 36); // approx ₹36 raw material saved per dinner

      return {
        ...prev,
        annapurnaMess: {
          ...annapurna,
          userMealDecision: decision,
          optedInDinner: newOptedIn,
          optedOutDinner: newOptedOut,
          estimatedFoodSavedKg: foodSavedKg,
          estimatedCostSavedInr: moneySaved
        }
      };
    });
  };

  const toggleMealDecision = (decision) => {
    if (isOffline) {
      addToOfflineQueue({ type: 'MEAL_POLL', payload: { decision } });
      showToast('⚠️ Offline: Meal poll recorded locally. Will sync online.', 'warning');
    }
    handleMealDecisionInternal(decision);
    addAuditLog(currentPersona.name, 'MEAL_POLL', `Marked dinner decision: ${decision === 'OPT_IN' ? 'Eating Tonight' : 'Skip Meal'}`, 'purple');
    showToast(decision === 'OPT_IN' ? '🍽️ Meal token confirmed for dinner tonight.' : '🌱 Thank you! You helped save ~300g food and reduce mess waste.', 'success');
  };

  // Notice Actions
  const acknowledgeNotice = (noticeId) => {
    setNotices(prev => prev.map(n => {
      if (n.id === noticeId) {
        return {
          ...n,
          hasUserAcknowledged: true,
          acknowledgedCount: n.acknowledgedCount + 1
        };
      }
      return n;
    }));
    addAuditLog(currentPersona.name, 'ACKNOWLEDGED_NOTICE', `Acknowledged official notice ${noticeId}`, 'blue');
    showToast('👍 Acknowledgment recorded in the administrative compliance registry.', 'success');
  };

  const publishNotice = (noticeData) => {
    const newNotice = {
      id: `NOT-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: noticeData.title,
      content: noticeData.content,
      category: noticeData.category || 'General',
      priority: noticeData.priority || 'NORMAL',
      issuedBy: currentPersona.title || currentPersona.name,
      publishedDate: 'Just now',
      targets: {
        year: noticeData.targetYear || 'All',
        branch: noticeData.targetBranch || 'All',
        hostel: noticeData.targetHostel || 'All'
      },
      actionRequired: noticeData.actionRequired || false,
      actionLabel: noticeData.actionLabel || 'Acknowledge Notice',
      readCount: 1,
      totalTargetAudience: noticeData.estimatedAudience || 420,
      acknowledgedCount: 0,
      hasUserAcknowledged: false
    };

    setNotices(prev => [newNotice, ...prev]);
    addAuditLog(currentPersona.name, 'PUBLISHED_NOTICE', `Dispatched targeted broadcast: "${newNotice.title}"`, 'blue');
    showToast(`📢 Notice published! Targeted to ${newNotice.targets.hostel} / ${newNotice.targets.year}.`, 'success');
    return newNotice;
  };

  // Google Single Sign-On Authentication
  const loginWithGoogle = (email, role = 'student', customName = '') => {
    const persona = initialPersonas[role] || initialPersonas.student;
    const name = customName || persona.name;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const token = `AUTH-GOOGLE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const user = {
      name,
      email,
      role,
      avatar: persona.avatar,
      provider: 'Google',
      signedInAt: timestamp,
      token
    };

    setCurrentUser(user);
    setActiveRole(role);
    setIsLandingPage(false);
    localStorage.setItem('UNIFY_current_user', JSON.stringify(user));
    localStorage.setItem('UNIFY_active_role', role);
    localStorage.setItem('UNIFY_view_mode', 'app');

    addAuditLog(name, 'GOOGLE_SIGN_IN', `Signed in via Google OAuth (${email})`, 'emerald');
    showToast(`Signed in as ${name} (${email})`, 'success');

    // Trigger simulated security email receipt
    setEmailReceipt({
      isOpen: true,
      email,
      role,
      name,
      timestamp: `${new Date().toLocaleDateString()} at ${timestamp}`,
      token
    });
  };

  const logout = () => {
    const prevName = currentUser?.name || 'User';
    setCurrentUser(null);
    setIsLandingPage(true);
    localStorage.removeItem('UNIFY_current_user');
    localStorage.setItem('UNIFY_view_mode', 'landing');
    addAuditLog(prevName, 'SIGN_OUT', 'User signed out from session', 'amber');
    showToast('Signed out of UNIFY.', 'info');
  };

  return (
    <CampusContext.Provider value={{
      activeRole,
      setActiveRole,
      currentPersona,
      initialPersonas,
      gatePasses,
      complaints,
      notices,
      messData,
      auditLogs,
      campusHotspotStats,
      busRoutes,
      examCalendar,
      timetable: initialTimetable,
      assignments: initialAssignments,
      roomAssets: initialRoomAssets,
      antiRaggingReports: initialAntiRaggingReports,
      visitorLogs: initialVisitorLogs,
      quizzes: initialQuizzes,
      studentReviews: initialStudentReviews,
      staffWorkload: initialStaffWorkload,
      financeData: initialFinanceData,
      policyCompliance: initialPolicyCompliance,
      // Authentication & Landing State
      currentUser,
      setCurrentUser,
      isLandingPage,
      setIsLandingPage,
      authModalOpen,
      setAuthModalOpen,
      authTargetRole,
      setAuthTargetRole,
      emailReceipt,
      setEmailReceipt,
      loginWithGoogle,
      logout,
      // Actions
      createGatePass,
      approveGatePass,
      rejectGatePass,
      scanGateExit,
      scanGateEntry,
      createComplaint,
      updateComplaintStatus,
      escalateComplaint,
      toggleMealDecision,
      acknowledgeNotice,
      publishNotice,
      addAuditLog
    }}>
      {children}
    </CampusContext.Provider>
  );
}

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
