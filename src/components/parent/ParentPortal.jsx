import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { User, TrendingUp, Bell, CheckCircle2, Activity, Users, MapPin } from 'lucide-react';
import BusTracker from '../campus/BusTracker';

export default function ParentPortal() {
  const { gatePasses } = useCampus();
  const [activeTab, setActiveTab] = useState('overview');

  const ward = {
    name: 'Piyush Mohapatra', regNo: '2201106145', branch: 'Computer Science & Engineering',
    year: '3rd Year (6th Sem)', hostel: 'Aryabhatta Hall of Residence', room: 'B-304',
    attendance: 84.5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  const fees = [
    { label: 'Tuition Fee (2026-27)',  amount: 45000, paid: true,  date: 'Aug 12, 2026' },
    { label: 'Hostel Rent (Sem 6)',    amount: 12000, paid: true,  date: 'Aug 14, 2026' },
    { label: 'Mess Dues (Sept)',       amount: 3200,  paid: false, due: 'Sep 30, 2026'  },
    { label: 'Library Fine',           amount: 0,     paid: true,  date: 'Cleared'      }
  ];

  const subjects = [
    { name: 'Operating Systems', pct: 90 }, { name: 'DBMS', pct: 84 },
    { name: 'Algorithms', pct: 80 },        { name: 'Computer Networks', pct: 80 }
  ];

  const wardPasses = (gatePasses||[]).filter(gp => gp.regNo === '2201106145');

  const TABS = [
    { id: 'overview',    label: 'Overview'    },
    { id: 'fees',        label: 'Fees'        },
    { id: 'gate_passes', label: 'Gate Passes' },
    { id: 'bus_tracker', label: '🚌 Bus Tracker' },
    { id: 'alerts',      label: 'Alerts'      }
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-bold border border-teal-500/30 mb-3">
            <Users className="w-3.5 h-3.5" /><span>Parent / Guardian Portal</span>
          </div>
          <h2 className="text-2xl font-black">Good Day, Mr. Ramesh Mohapatra 👨‍👦</h2>
          <p className="text-xs text-teal-100/90 mt-1">Monitoring ward: <strong>{ward.name}</strong> • {ward.branch}</p>
          <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-white/10">
            {[
              { label: 'Attendance',  value: `${ward.attendance}%`, sub: 'Above 75% cutoff ✓', color: 'text-emerald-300', sc: 'text-emerald-400' },
              { label: 'Gate Passes', value: wardPasses.length,     sub: 'This semester',       color: 'text-white',       sc: 'text-blue-300'    },
              { label: 'Fee Status',  value: 'Cleared',             sub: 'No dues pending',     color: 'text-emerald-300', sc: 'text-emerald-400' }
            ].map((k, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center">
                <div className="text-[11px] text-teal-200">{k.label}</div>
                <div className={`text-xl font-black ${k.color}`}>{k.value}</div>
                <div className={`text-[10px] ${k.sc}`}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ward details */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900">Ward Details</h4>
            <div className="flex items-center gap-3">
              <img src={ward.avatar} alt={ward.name} className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <div className="font-bold text-slate-900">{ward.name}</div>
                <div className="text-xs text-slate-500">{ward.regNo}</div>
                <div className="text-xs text-slate-500">{ward.year} • {ward.branch}</div>
                <div className="text-xs text-slate-500">{ward.hostel} • Room {ward.room}</div>
              </div>
            </div>
          </div>
          {/* Subject attendance */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900">Subject-wise Attendance</h4>
            {subjects.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700">{s.name}</span>
                  <span className={`font-bold ${s.pct >= 80 ? 'text-emerald-700' : s.pct >= 75 ? 'text-amber-700' : 'text-rose-700'}`}>{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div className={`h-1.5 rounded-full ${s.pct >= 80 ? 'bg-emerald-500' : s.pct >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Fees ── */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900">Fee & Dues Status</h3>
          {fees.map((f, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${f.paid ? 'bg-emerald-50/40 border-emerald-200' : 'bg-amber-50/40 border-amber-300'}`}>
              <div>
                <div className="font-bold text-slate-900 text-sm">{f.label}</div>
                <div className="text-[11px] text-slate-500">{f.paid ? `Paid on ${f.date}` : `Due: ${f.due}`}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900">{f.amount > 0 ? `₹${f.amount.toLocaleString()}` : '₹0'}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {f.paid ? 'PAID' : 'PENDING'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Gate Passes ── */}
      {activeTab === 'gate_passes' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900">Ward's Gate Pass History</h3>
          {wardPasses.length > 0 ? wardPasses.map(gp => (
            <div key={gp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{gp.id}</span>
                  <div className="font-bold text-slate-900 text-sm">{gp.destination}</div>
                  <div className="text-xs text-slate-500">Out: {gp.outTime} → Return by: {gp.expectedInTime}</div>
                  {gp.approvedBy && <div className="text-[11px] text-emerald-700 mt-1">Approved by: {gp.approvedBy}</div>}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  gp.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  gp.status === 'OVERDUE'  ? 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>{gp.status}</span>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center text-xs text-slate-500">No gate pass history found for your ward.</div>
          )}
        </div>
      )}

      {/* ── Bus Tracker ── */}
      {activeTab === 'bus_tracker' && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-teal-900 text-sm">Track Campus Buses</div>
              <div className="text-xs text-teal-700 mt-0.5">
                Monitor live bus locations and arrival times. Know when your ward's bus is arriving at the campus gate.
              </div>
            </div>
          </div>
          <BusTracker />
        </div>
      )}

      {/* ── Alerts (read-only, no publish) ── */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Campus Alerts</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Read-only — managed by administration</span>
          </div>
          {[
            { icon: CheckCircle2, msg: 'Gate pass GP-2026-8891 approved by Chief Warden', time: 'Today 2:15 PM', type: 'success' },
            { icon: Bell,         msg: 'Exam form fill-up deadline: September 25th',       time: 'Yesterday',   type: 'info'    },
            { icon: TrendingUp,   msg: 'Semester attendance updated: 84.5% (Above 75% cutoff)', time: '2 days ago', type: 'success' }
          ].map((a, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border ${a.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'}`}>
              <a.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${a.type === 'success' ? 'text-emerald-600' : 'text-blue-600'}`} />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-800">{a.msg}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}