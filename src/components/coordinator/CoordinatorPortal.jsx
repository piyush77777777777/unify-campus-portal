import React, { useState } from "react";
import { CheckCircle2, X, Clock, Building2, Users, BookOpen, Bell, Filter, Edit3, Download, AlertTriangle, ChevronDown, Calendar, Star } from "lucide-react";

const DEPT = "CSE";

const DEPT_SESSIONS = [
  { id:"S001", course:"Data Structures",  faculty:"Dr. A. Panda",    group:"Y2-CSE", room:"LH1",    day:"MON", period:"P1", type:"Lecture" },
  { id:"S004", course:"CS Lab 1",        faculty:"Prof. S. Rath",   group:"Y2-CSE", room:"CSLAB1", day:"TUE", period:"P2", type:"Lab" },
  { id:"S005", course:"Machine Learning",faculty:"Prof. S. Rath",   group:"Y3-CSE", room:"LH1",    day:"TUE", period:"P6", type:"Lecture" },
  { id:"S008", course:"Networks",        faculty:"Prof. A. Mishra", group:"Y3-CSE", room:"CR201",  day:"THU", period:"P1", type:"Lecture" },
  { id:"S010", course:"Algorithms",      faculty:"Dr. A. Panda",    group:"Y3-CSE", room:"LH2",    day:"FRI", period:"P2", type:"Lecture" },
];

const PENDING_APPROVALS = [
  { id:"PA001", type:"Extra Class",      by:"Prof. S. Rath",    desc:"Extra ML session — Sat P2 LH1",           urgency:"LOW",    since:"Oct 30" },
  { id:"PA002", type:"Lab Booking",      by:"IEEE Club",        desc:"CS Lab 1 — Spectra Day 1 P10-P13",        urgency:"MEDIUM", since:"Oct 29" },
  { id:"PA003", type:"Room Booking",     by:"CS Dept",          desc:"CS Lab 2 — Nov 12 P6-P8, dept workshop",  urgency:"LOW",    since:"Oct 28" },
  { id:"PA004", type:"Faculty Request",  by:"Dr. A. Panda",     desc:"Reschedule DS Mon P1 → Thu P4",           urgency:"HIGH",   since:"Oct 31" },
];

const DEPT_ROOMS = [
  { id:"CSLAB1", name:"CS Lab 1", cap:40, booked:["TUE P2","FRI P6","FRI P7"] },
  { id:"CSLAB2", name:"CS Lab 2", cap:40, booked:["WED P6"] },
  { id:"CR201",  name:"CR 201",   cap:60, booked:["THU P1","THU P2"] },
];

function Badge({ label, color="blue" }) {
  const c = { blue:"bg-blue-100 text-blue-700",green:"bg-emerald-100 text-emerald-700",red:"bg-red-100 text-red-700",orange:"bg-orange-100 text-orange-700",yellow:"bg-yellow-100 text-yellow-700",slate:"bg-slate-100 text-slate-600",purple:"bg-violet-100 text-violet-700" };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c[color]||c.slate}`}>{label}</span>;
}

const PERIODS = ["P1","P2","P3","P4","P5","LUNCH","P6","P7","P8","P9"];
const DAYS = ["MON","TUE","WED","THU","FRI"];

export default function CoordinatorPortal() {
  const [tab, setTab] = useState("approvals");
  const [decisions, setDecisions] = useState({});
  const [expandedPA, setExpandedPA] = useState(null);

  const decide = (id, decision) => setDecisions(p => ({ ...p, [id]: decision }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-800 via-amber-800 to-yellow-700 text-white rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Users className="w-7 h-7 text-orange-200"/>
          </div>
          <div>
            <div className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">CIT — {DEPT} Department</div>
            <h2 className="text-2xl font-black">Department Coordinator Portal</h2>
            <p className="text-orange-200 text-xs">Approvals · Department timetable · Lab &amp; resource management</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-black">{PENDING_APPROVALS.filter(p=>!decisions[p.id]).length}</div>
            <div className="text-[10px] text-orange-200">Pending</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-black">{DEPT_SESSIONS.length}</div>
            <div className="text-[10px] text-orange-200">Dept Sessions</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-black">{DEPT_ROOMS.length}</div>
            <div className="text-[10px] text-orange-200">Labs / Rooms</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit flex-wrap">
        {[["approvals","📋 Approvals"],["timetable","📅 Dept Timetable"],["resources","🏛 Resources"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab===k?"bg-white text-orange-700 shadow":"text-slate-600 hover:text-slate-900"}`}>{l}</button>
        ))}
      </div>

      {/* ── APPROVALS ── */}
      {tab==="approvals" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">You can approve bookings of CSE department labs and faculty requests. <strong>You cannot approve your own requests.</strong></p>
          {PENDING_APPROVALS.map(p=>{
            const dec = decisions[p.id];
            return (
              <div key={p.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${dec==="approved"?"border-emerald-200":dec==="rejected"?"border-red-200":p.urgency==="HIGH"?"border-orange-200":"border-slate-200"}`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge label={p.type} color={p.type==="Lab Booking"?"purple":p.type==="Faculty Request"?"orange":"blue"}/>
                        <Badge label={p.urgency} color={p.urgency==="HIGH"?"red":p.urgency==="MEDIUM"?"orange":"slate"}/>
                        {dec && <Badge label={dec==="approved"?"✓ Approved":"✗ Rejected"} color={dec==="approved"?"green":"red"}/>}
                      </div>
                      <p className="text-sm font-black text-slate-800">{p.by}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Submitted: {p.since}</p>
                    </div>
                    {!dec && (
                      <div className="flex gap-2">
                        <button onClick={()=>decide(p.id,"rejected")}
                          className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100">Reject</button>
                        <button onClick={()=>decide(p.id,"approved")}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700">Approve</button>
                      </div>
                    )}
                  </div>

                  {/* Validation check shown before approving */}
                  {!dec && (
                    <div className="mt-3 p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"/>
                      Constraint check passed: No overlap with existing sessions. Room capacity verified.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DEPT TIMETABLE ── */}
      {tab==="timetable" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-black text-slate-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500"/>{DEPT} Department Timetable</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50">
              <Download className="w-3.5 h-3.5"/>Export PDF
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-bold text-slate-400 text-[11px]">PERIOD</th>
                    {DAYS.map(d=><th key={d} className="px-4 py-2.5 text-left font-bold text-slate-400 text-[11px]">{d}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {PERIODS.map(p=>{
                    if(p==="LUNCH") return (
                      <tr key="lunch" className="bg-amber-50">
                        <td colSpan={6} className="px-4 py-2 text-center text-[11px] font-bold text-amber-600">🍽 LUNCH (13:00–14:00)</td>
                      </tr>
                    );
                    return (
                      <tr key={p} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-400 text-[11px]">{p}</td>
                        {DAYS.map(day=>{
                          const s = DEPT_SESSIONS.find(x=>x.day===day && x.period===p);
                          return (
                            <td key={day} className="px-3 py-2">
                              {s ? (
                                <div className="rounded-xl p-2 text-[10px] bg-orange-50 border border-orange-100">
                                  <div className="font-black text-slate-800">{s.course}</div>
                                  <div className="text-slate-500">{s.room}</div>
                                  <div className="text-slate-400">{s.faculty.split(" ").slice(-1)[0]}</div>
                                  <Badge label={s.group} color="slate"/>
                                </div>
                              ) : <div className="text-slate-200 text-center">·</div>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Faculty workload in dept */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-black text-slate-800 mb-3">CSE Faculty Sessions This Week</h4>
            <div className="space-y-2">
              {["Dr. A. Panda","Prof. S. Rath","Prof. A. Mishra"].map(f=>{
                const count = DEPT_SESSIONS.filter(s=>s.faculty===f).length;
                return (
                  <div key={f} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-40">{f}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${(count/5)*100}%`, background:"linear-gradient(90deg,#f97316,#ea580c)" }}/>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{count} sessions</span>
                    {count>=4 && <Badge label="High load" color="orange"/>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── RESOURCES ── */}
      {tab==="resources" && (
        <div className="space-y-4">
          <h3 className="font-black text-slate-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-orange-500"/>Lab &amp; Room Resource Management</h3>
          {DEPT_ROOMS.map(r=>(
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-black text-slate-800">{r.name}</h4>
                  <p className="text-xs text-slate-500">Capacity: {r.cap} seats</p>
                </div>
                <button className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold rounded-xl hover:bg-orange-100">+ Book</button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {DAYS.map(d=>(
                  <div key={d}>
                    <div className="text-[10px] font-bold text-slate-400 text-center mb-1">{d}</div>
                    {["P1","P2","P3","P4","P5","P6","P7","P8"].map(p=>{
                      const busy = r.booked.includes(`${d} ${p}`);
                      return (
                        <div key={p} className={`h-4 mb-0.5 rounded text-[8px] flex items-center justify-center ${busy?"bg-red-400 text-white":"bg-emerald-100 text-emerald-600"}`}>
                          {busy?"●":"○"}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block"/>Occupied</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 inline-block"/>Available</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
