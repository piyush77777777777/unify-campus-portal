import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import StudentSOSModal from './StudentSOSModal';
import {
  LayoutDashboard, Clock, BookOpen, FileText, CreditCard,
  Wrench, Package, Utensils, Bell, BarChart3, ShieldAlert,
  CheckCircle2, AlertTriangle, ChevronRight, TrendingUp,
  Calendar, Star, Lock, Home, Activity
} from 'lucide-react';

const TABS = [
  { id: 'home',      label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'timetable', label: 'Timetable',    icon: Clock },
  { id: 'progress',  label: 'Progress',     icon: BarChart3 },
  { id: 'assign',    label: 'Assignments',  icon: BookOpen },
  { id: 'fees',      label: 'Fees',         icon: CreditCard },
  { id: 'assets',    label: 'Room Assets',  icon: Package },
  { id: 'ragging',   label: 'Anti-Ragging', icon: ShieldAlert },
];

export default function StudentDashboard({ onNavigateTab }) {
  const { currentPersona, timetable, assignments, roomAssets, antiRaggingReports, notices } = useCampus();
  const [tab, setTab] = useState('home');
  const [sosOpen, setSosOpen] = useState(false);
  const [ragForm, setRagForm] = useState({ type: '', location: '', desc: '', anonymous: true });
  const [ragSent, setRagSent] = useState(false);

  const p = currentPersona;
  const att = p.attendance || {};

  const feeItems = [
    { label: 'Tuition Fee (2026-27)', amount: 45000, paid: true, date: 'Aug 12' },
    { label: 'Hostel Rent (Sem 6)',   amount: 12000, paid: true, date: 'Aug 14' },
    { label: 'Mess Dues (Sept)',       amount: 3200,  paid: false, due: 'Sep 30' },
    { label: 'Exam Registration Fee', amount: 800,   paid: false, due: 'Sep 28' },
  ];

  const statusColor = s => ({
    SUBMITTED: 'bg-emerald-100 text-emerald-700',
    PENDING:   'bg-amber-100 text-amber-700',
    IN_REVIEW: 'bg-blue-100 text-blue-700',
    UPCOMING:  'bg-slate-100 text-slate-600',
  }[s] || 'bg-slate-100 text-slate-600');

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── SOS Hero Button ── */}
      <button onClick={() => setSosOpen(true)}
        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-500/30 active:scale-[0.99] transition-all">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-black text-sm">🚨 EMERGENCY SOS</div>
          <div className="text-xs text-rose-100">Instantly alerts Teacher • Security • Dean with your GPS</div>
        </div>
        <ChevronRight className="w-4 h-4 opacity-70" />
      </button>

      {/* ── Sub-tab bar ── */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              tab === id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ══ HOME / Dashboard ══ */}
      {tab === 'home' && (
        <div className="space-y-4">
          {/* Hero card */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30 mb-2">
                <Activity className="w-3 h-3" />Student Portal
              </div>
              <h2 className="text-xl font-black">Welcome, {p.name} 👋</h2>
              <p className="text-xs text-blue-100/80 mt-0.5">{p.regNo} • {p.branch} • {p.year}</p>
              <p className="text-xs text-blue-100/60 mt-0.5">{p.hostel} • Room {p.room}</p>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
                {[
                  { label: 'Attendance', value: `${att.overall}%`, color: att.overall >= 75 ? 'text-emerald-300' : 'text-rose-300' },
                  { label: 'Safe Bunks',  value: att.safeBunksRemaining, color: 'text-amber-300' },
                  { label: 'Pending Dues', value: feeItems.filter(f=>!f.paid).length, color: 'text-rose-300' }
                ].map((k,i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                    <div className="text-[10px] text-blue-200">{k.label}</div>
                    <div className={`text-lg font-black ${k.color}`}>{k.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance per subject */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">📊 Subject-wise Attendance</h3>
            {(att.subjects || []).map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{s.name}</span>
                  <span className={`font-bold ${s.percentage >= 80 ? 'text-emerald-700' : s.percentage >= 75 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {s.attended}/{s.total} ({s.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div className={`h-1.5 rounded-full transition-all ${s.percentage >= 80 ? 'bg-emerald-500' : s.percentage >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${s.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Gate Pass',   icon: Lock,     tab: 'gatePass',   color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { label: 'Notices',     icon: Bell,     tab: 'notices',    color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { label: 'Mess Menu',   icon: Utensils, tab: 'mess',       color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { label: 'Documents',   icon: FileText, tab: 'documents',  color: 'bg-amber-50 border-amber-200 text-amber-700' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <button key={i} onClick={() => onNavigateTab(a.tab)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border font-bold text-xs transition-all active:scale-95 ${a.color}`}>
                  <Icon className="w-5 h-5" />
                  {a.label}
                </button>
              );
            })}
          </div>

          {/* Upcoming assignment preview */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">📋 Upcoming Deadlines</h3>
              <button onClick={() => setTab('assign')} className="text-[11px] text-blue-600 font-bold">View All</button>
            </div>
            {(assignments || []).filter(a => a.status !== 'SUBMITTED').slice(0, 3).map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${a.status === 'PENDING' ? 'bg-amber-400' : a.status === 'IN_REVIEW' ? 'bg-blue-400' : 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{a.title}</div>
                  <div className="text-[10px] text-slate-500">{a.subject} • Due {a.deadline}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(a.status)}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TIMETABLE ══ */}
      {tab === 'timetable' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-indigo-800 to-blue-900 text-white rounded-2xl p-4">
            <h3 className="font-black">📅 Today's Timetable</h3>
            <p className="text-xs text-indigo-200 mt-0.5">Thursday, Sep 25, 2026 — Semester 6</p>
          </div>
          {(timetable || []).map((cls, i) => (
            <div key={i} className={`flex gap-3 p-4 rounded-2xl border transition-all ${
              cls.status === 'Ongoing' ? 'bg-blue-50 border-blue-300' :
              cls.isSubstitute ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'
            }`}>
              <div className="flex-shrink-0 text-right w-20">
                <div className="text-[10px] font-bold text-slate-500">{cls.time.split(' - ')[0]}</div>
                <div className="text-[10px] text-slate-400">{cls.time.split(' - ')[1]}</div>
                {cls.status === 'Ongoing' && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black animate-pulse">LIVE</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-sm leading-tight">{cls.subject}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{cls.faculty} • {cls.room}</div>
                {cls.isSubstitute && (
                  <div className="mt-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full w-fit">
                    🔄 Substitute: {cls.substituteNote}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ ACADEMIC PROGRESS ══ */}
      {tab === 'progress' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-2xl p-4">
            <h3 className="font-black">🎓 Academic Progress Tracker</h3>
            <p className="text-xs text-purple-200 mt-0.5">Grades, attendance & feedback summary</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SGPA (Sem 5)', value: '8.4', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
              { label: 'CGPA Overall', value: '8.1', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
              { label: 'Rank in Class', value: '#7 / 60', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
              { label: 'Assignments Due', value: (assignments||[]).filter(a=>a.status==='PENDING').length, icon: BookOpen, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' }
            ].map((k, i) => {
              const Icon = k.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl border ${k.bg}`}>
                  <Icon className={`w-5 h-5 ${k.color} mb-2`} />
                  <div className={`text-xl font-black ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{k.label}</div>
                </div>
              );
            })}
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Subject Grades</h4>
            {[
              { sub: 'Operating Systems', grade: 'A+', marks: 92, att: 90 },
              { sub: 'DBMS', grade: 'A', marks: 85, att: 84 },
              { sub: 'Algorithms', grade: 'B+', marks: 78, att: 80 },
              { sub: 'Computer Networks', grade: 'B+', marks: 76, att: 80.5 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center flex-shrink-0">{s.grade}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate">{s.sub}</div>
                  <div className="text-[10px] text-slate-500">{s.marks}/100 marks • {s.att}% attendance</div>
                </div>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${s.marks}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ ASSIGNMENTS ══ */}
      {tab === 'assign' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-2xl p-4">
            <h3 className="font-black">📋 Assignments & Deadlines</h3>
            <p className="text-xs text-amber-100 mt-0.5">{(assignments||[]).filter(a=>a.status!=='SUBMITTED').length} pending • {(assignments||[]).filter(a=>a.status==='SUBMITTED').length} submitted</p>
          </div>
          {(assignments || []).map((a, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(a.status)}`}>{a.status}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1 leading-tight">{a.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{a.subject} • {a.weight} • Due: <strong className="text-slate-700">{a.deadline}</strong></p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Progress</span><span className="font-bold">{a.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className={`h-2 rounded-full transition-all ${a.progress >= 100 ? 'bg-emerald-500' : a.progress >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${a.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ FEES ══ */}
      {tab === 'fees' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4">
            <h3 className="font-black">💳 Fee Status & Payment Reminders</h3>
            <p className="text-xs text-emerald-100 mt-0.5">{feeItems.filter(f=>!f.paid).length} pending payment(s)</p>
          </div>
          {feeItems.map((f, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${f.paid ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div>
                <div className="font-bold text-slate-900 text-sm">{f.label}</div>
                <div className="text-[11px] text-slate-500">{f.paid ? `Paid on ${f.date}` : `⚠️ Due: ${f.due}`}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900">₹{f.amount.toLocaleString()}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {f.paid ? 'PAID' : 'PENDING'}
                </span>
              </div>
            </div>
          ))}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
            ⚠️ Clear all dues before Sep 30, 2026 to receive your Hall Ticket.
          </div>
        </div>
      )}

      {/* ══ ROOM ASSETS ══ */}
      {tab === 'assets' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-4">
            <h3 className="font-black">🏠 Room {p.room} — Asset & Maintenance Log</h3>
            <p className="text-xs text-slate-300 mt-0.5">{p.hostel}</p>
          </div>
          {(roomAssets || []).map((a, i) => (
            <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${a.status === 'Operational' ? 'bg-white border-slate-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.status === 'Operational' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                {a.status === 'Operational'
                  ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  : <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-sm leading-tight">{a.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{a.assetId}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Last serviced: {a.lastServiced} • {a.condition}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${a.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {a.status === 'Operational' ? 'OK' : 'Needs Check'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ══ ANTI-RAGGING ══ */}
      {tab === 'ragging' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-900 to-red-900 text-white rounded-2xl p-4">
            <h3 className="font-black">🛡️ Anti-Ragging Reporting System</h3>
            <p className="text-xs text-rose-100 mt-0.5">Direct to Dean & Anti-Ragging Cell • Anonymous option available</p>
          </div>

          {ragSent ? (
            <div className="text-center py-10 space-y-3 bg-white rounded-2xl border border-emerald-200 p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-black text-slate-900">Report Submitted</h4>
              <p className="text-xs text-slate-500">Sent to Dean of Student Welfare & Anti-Ragging Cell. Your identity {ragForm.anonymous ? 'is fully protected' : 'has been shared'}.</p>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800">
                📞 National Anti-Ragging Helpline: <strong>1800-180-5522</strong> (Free, 24×7)
              </div>
              <button onClick={() => { setRagSent(false); setRagForm({ type: '', location: '', desc: '', anonymous: true }); }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
                Submit Another Report
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">File an Incident Report</h4>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 cursor-pointer">
                <input type="checkbox" checked={ragForm.anonymous} onChange={e => setRagForm(p => ({ ...p, anonymous: e.target.checked }))} className="w-4 h-4 accent-rose-600" />
                <span className="text-xs font-bold text-rose-800">🛡️ Submit Anonymously (your name will NOT be disclosed)</span>
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type of Incident *</label>
                <select value={ragForm.type} onChange={e => setRagForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none">
                  <option value="">Select incident type</option>
                  <option>Verbal Abuse / Harassment</option>
                  <option>Physical Ragging / Intimidation</option>
                  <option>Cyberbullying / Online Harassment</option>
                  <option>Forced Activity / Senior Pressure</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                <input type="text" placeholder="e.g. Block A Ground Floor, Canteen, Late Night Corridor..."
                  value={ragForm.location} onChange={e => setRagForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Describe the Incident *</label>
                <textarea rows={4} placeholder="Describe what happened — as much or as little as you're comfortable sharing..."
                  value={ragForm.desc} onChange={e => setRagForm(p => ({ ...p, desc: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none" />
              </div>

              <button disabled={!ragForm.type || !ragForm.location || !ragForm.desc}
                onClick={() => setRagSent(true)}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold transition-all">
                🚨 Submit to Dean & Anti-Ragging Cell
              </button>

              <div className="text-center text-[11px] text-slate-400">
                National Anti-Ragging Helpline: <strong>1800-180-5522</strong>
              </div>
            </div>
          )}

          {(antiRaggingReports || []).length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-rose-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">📋 Active Campus Cases (Anonymised)</h4>
              {(antiRaggingReports || []).map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-rose-500">{r.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'INVESTIGATING' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>{r.status}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{r.type}</div>
                  <div className="text-[10px] text-slate-500">{r.location} • {r.timestamp}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Action: {r.actionTaken}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <StudentSOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}