import React, { useState, useEffect, useRef } from "react";
import {
  Brain, Zap, AlertTriangle, CheckCircle2, Clock, Users, MapPin,
  BarChart3, Swords, Mic, Shield, RefreshCw, FlaskConical,
  Flame, ChevronRight, ChevronDown, X, Send, Star, TrendingUp,
  Calendar, BookOpen, Activity, Bell, Eye, LayoutDashboard,
  Building2, UserCheck, GraduationCap, Cpu, Target, Award,
  ArrowRight, ArrowUpRight, Play, Pause, Volume2, RotateCcw,
  MessageSquare, Lightbulb, HelpCircle, ThumbsUp, ThumbsDown,
  Filter, Download, Upload, Settings, Plus, Minus, Edit3,
  Navigation, Layers, Grid3x3, Hash, Sparkles
} from "lucide-react";

// ── DATA ────────────────────────────────────────────────────────────────────

const ROOMS = [
  { id:"R101", name:"Room 101", cap:60, type:"Lecture", building:"Block A", floor:1 },
  { id:"R102", name:"Room 102", cap:60, type:"Lecture", building:"Block A", floor:1 },
  { id:"R201", name:"Room 201", cap:80, type:"Lecture", building:"Block A", floor:2 },
  { id:"R202", name:"Room 202", cap:80, type:"Lecture", building:"Block A", floor:2 },
  { id:"LAB1", name:"CS Lab 1", cap:40, type:"Lab",     building:"Block B", floor:1 },
  { id:"LAB2", name:"CS Lab 2", cap:40, type:"Lab",     building:"Block B", floor:1 },
  { id:"LAB3", name:"ECE Lab",  cap:40, type:"Lab",     building:"Block C", floor:1 },
  { id:"SEM1", name:"Seminar Hall", cap:120, type:"Seminar", building:"Block D", floor:0 },
  { id:"AUD",  name:"Auditorium",   cap:400, type:"Auditorium", building:"Main", floor:0 },
];

const FACULTY = [
  { id:"F01", name:"Dr. Avinash Panda",    dept:"CSE", subjects:["Data Structures","Algorithms","DBMS"], load:18, max:20 },
  { id:"F02", name:"Prof. Smita Rath",      dept:"CSE", subjects:["Machine Learning","AI","Python"],       load:16, max:20 },
  { id:"F03", name:"Dr. Rakesh Mohanty",    dept:"ECE", subjects:["Digital Circuits","VLSI","Signals"],    load:14, max:20 },
  { id:"F04", name:"Prof. Lipsa Swain",     dept:"MATH",subjects:["Engineering Math","Statistics"],        load:20, max:20 },
  { id:"F05", name:"Dr. Suresh Behera",     dept:"PHY", subjects:["Applied Physics","Optics"],             load:12, max:20 },
  { id:"F06", name:"Prof. Anjali Mishra",   dept:"CSE", subjects:["OS","Computer Networks","Cloud"],       load:17, max:20 },
];

const SLOTS = ["9:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"];
const DAYS  = ["MON","TUE","WED","THU","FRI","SAT"];

const INIT_TIMETABLE = [
  { id:"S01", day:"MON", slot:"9:00",  room:"R101", faculty:"Dr. Avinash Panda",  subject:"Data Structures", dept:"CSE",  students:55, clashes:0 },
  { id:"S02", day:"MON", slot:"10:00", room:"LAB1", faculty:"Prof. Smita Rath",   subject:"ML Lab",           dept:"CSE",  students:38, clashes:0 },
  { id:"S03", day:"MON", slot:"11:00", room:"R201", faculty:"Prof. Lipsa Swain",  subject:"Eng. Math",        dept:"MATH", students:75, clashes:0 },
  { id:"S04", day:"MON", slot:"14:00", room:"R102", faculty:"Prof. Anjali Mishra",subject:"OS",               dept:"CSE",  students:58, clashes:0 },
  { id:"S05", day:"TUE", slot:"9:00",  room:"R201", faculty:"Prof. Smita Rath",   subject:"Machine Learning", dept:"CSE",  students:62, clashes:0 },
  { id:"S06", day:"TUE", slot:"10:00", room:"LAB2", faculty:"Dr. Suresh Behera",  subject:"Physics Lab",      dept:"PHY",  students:36, clashes:0 },
  { id:"S07", day:"TUE", slot:"11:00", room:"R101", faculty:"Dr. Avinash Panda",  subject:"Algorithms",       dept:"CSE",  students:52, clashes:0 },
  { id:"S08", day:"WED", slot:"9:00",  room:"R202", faculty:"Dr. Rakesh Mohanty", subject:"Digital Circuits", dept:"ECE",  students:70, clashes:0 },
  { id:"S09", day:"WED", slot:"10:00", room:"R101", faculty:"Prof. Anjali Mishra",subject:"Networks",         dept:"CSE",  students:55, clashes:0 },
  { id:"S10", day:"THU", slot:"14:00", room:"LAB3", faculty:"Dr. Rakesh Mohanty", subject:"VLSI Lab",         dept:"ECE",  students:34, clashes:0 },
  { id:"S11", day:"FRI", slot:"9:00",  room:"SEM1", faculty:"Dr. Avinash Panda",  subject:"DBMS",             dept:"CSE",  students:110, clashes:0 },
  { id:"S12", day:"FRI", slot:"10:00", room:"R201", faculty:"Prof. Lipsa Swain",  subject:"Statistics",       dept:"MATH", students:68, clashes:0 },
];

const EVENTS = [
  { name:"Spectra 2026 — Tech Fest",      date:"Nov 15-17", type:"Fest",  venue:"Auditorium", status:"Confirmed" },
  { name:"Mid-Semester Examinations",      date:"Nov 5-12",  type:"Exam",  venue:"Multiple",   status:"Scheduled" },
  { name:"AI Workshop — Industry Connect", date:"Nov 3",     type:"Workshop", venue:"SEM1",    status:"Pending" },
  { name:"Annual Sports Meet",             date:"Nov 22-24", type:"Sports",venue:"Ground",     status:"Confirmed" },
  { name:"Alumni Guest Lecture Series",    date:"Nov 8",     type:"Talk",  venue:"R201",       status:"Confirmed" },
];

const PENDING_APPROVALS = [
  { id:"PA01", type:"Room Booking",    by:"CSE Dept",    desc:"Lab 1 on Nov 3, 2:00-5:00 PM",   urgency:"HIGH" },
  { id:"PA02", type:"Faculty Leave",   by:"Dr. Panda",   desc:"Nov 5-6 leave — reschedule DS",   urgency:"MEDIUM" },
  { id:"PA03", type:"Timetable Change",by:"HOD CSE",     desc:"Swap Mon 9AM & Tue 9AM slots",    urgency:"LOW" },
  { id:"PA04", type:"Extra Class",     by:"Prof. Rath",  desc:"ML extra class Sat 10AM in R201", urgency:"MEDIUM" },
];

const AI_CHAT_RESPONSES = {
  "book lab": "✅ CS Lab 1 is available on **Saturday 10AM–12PM**. Shall I book it for ML extra class?",
  "reschedule": "🔄 Dr. Panda's **Data Structures (Mon 9AM)** can be moved to **Thu 10AM in Room 102** with 0 clashes. Confirm?",
  "who teaches ml": "🤖 **Prof. Smita Rath** teaches Machine Learning — Tue 9AM in Room 201, 62 students enrolled.",
  "clash": "⚠️ Found **1 potential clash**: Dr. Panda is booked on Mon 9AM AND requested leave Nov 5 which is a Monday.",
  "empty slots": "📊 **12 empty slots** this week. Largest gap: Thu 11AM–1PM in Room 201 (cap 80, empty).",
  "exam schedule": "📅 Mid-Sem exams: **Nov 5-12**. 4 CSE papers, 2 ECE papers. Seating plan auto-generated.",
  "spectra": "🎉 **Spectra 2026** scheduled Nov 15-17 in Auditorium. 12 sessions blocked. 3 faculty judges confirmed.",
  "default": "🤖 I understood your request. Let me analyze the schedule database... **Tip:** Try asking about room booking, faculty leave, clashes, or exam scheduling!",
};

const SCHEDULE_A = { name:"Current Schedule",  penalty:47, clashes:2, gaps:8, utilization:72, healthScore:68 };
const SCHEDULE_B = { name:"OR-Tools Optimized", penalty:12, clashes:0, gaps:3, utilization:89, healthScore:94 };
const SCHEDULE_C = { name:"Compact Schedule",  penalty:28, clashes:0, gaps:5, utilization:83, healthScore:81 };

const ANALYTICS_DATA = {
  utilization: [72, 68, 85, 91, 77, 45],
  workload:    { "Dr. Panda":18, "Prof. Rath":16, "Dr. Mohanty":14, "Prof. Swain":20, "Dr. Behera":12, "Prof. Mishra":17 },
  peakHours:   [45, 82, 91, 65, 38, 70, 55, 20],
};

// ── TABS CONFIG ──────────────────────────────────────────────────────────────

const TABS = [
  { key:"command",    label:"Command Center",     icon:LayoutDashboard, color:"from-blue-600 to-indigo-600" },
  { key:"schedule",   label:"Scheduling Engine",  icon:Cpu,             color:"from-violet-600 to-purple-600" },
  { key:"ai",         label:"AI Copilot",         icon:Brain,           color:"from-emerald-600 to-teal-600" },
  { key:"reschedule", label:"Rescheduling",        icon:RefreshCw,       color:"from-orange-500 to-amber-500" },
  { key:"impact",     label:"Impact Analysis",    icon:Activity,        color:"from-red-500 to-rose-500" },
  { key:"explainai",  label:"Explainable AI",     icon:Lightbulb,       color:"from-yellow-500 to-orange-500" },
  { key:"twin",       label:"Digital Twin",       icon:Layers,          color:"from-cyan-500 to-blue-500" },
  { key:"analytics",  label:"Analytics",          icon:BarChart3,       color:"from-pink-500 to-rose-500" },
  { key:"battle",     label:"Battle Mode",        icon:Swords,          color:"from-slate-700 to-slate-900" },
  { key:"emergency",  label:"Emergency Mode",     icon:Flame,           color:"from-red-600 to-red-900" },
  { key:"voice",      label:"Voice AI",           icon:Mic,             color:"from-indigo-500 to-violet-500" },
];

// ── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color="blue", icon: Icon, trend }) {
  const colors = {
    blue:    "from-blue-50 to-indigo-50 border-blue-200 text-blue-700",
    green:   "from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700",
    orange:  "from-orange-50 to-amber-50 border-orange-200 text-orange-700",
    red:     "from-red-50 to-rose-50 border-red-200 text-red-700",
    purple:  "from-violet-50 to-purple-50 border-violet-200 text-violet-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4 flex flex-col gap-1`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</span>
        {Icon && <Icon className="w-4 h-4 opacity-60"/>}
      </div>
      <div className="text-2xl font-black">{value}</div>
      {sub && <div className="text-[11px] opacity-70">{sub}</div>}
      {trend && <div className={`text-[11px] font-bold flex items-center gap-1 ${trend > 0 ? "text-emerald-600":"text-red-500"}`}>
        <TrendingUp className="w-3 h-3"/> {trend > 0 ? "+" : ""}{trend}% vs last week
      </div>}
    </div>
  );
}

function Badge({ label, color="blue" }) {
  const c = { blue:"bg-blue-100 text-blue-700", green:"bg-emerald-100 text-emerald-700",
              red:"bg-red-100 text-red-700", orange:"bg-orange-100 text-orange-700",
              purple:"bg-violet-100 text-violet-700", slate:"bg-slate-100 text-slate-600" };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c[color]}`}>{label}</span>;
}

// ── COMMAND CENTER ───────────────────────────────────────────────────────────

function CommandCenter() {
  const now = new Date();
  const currentSlotIdx = Math.min(Math.floor((now.getHours() - 9)), 7);
  const liveClasses = INIT_TIMETABLE.filter(s => s.day === DAYS[now.getDay() - 1]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Live Classes" value={liveClasses.length} sub="right now on campus" color="blue" icon={BookOpen} trend={8}/>
        <StatCard label="Faculty Active" value="5/6" sub="1 on leave today" color="green" icon={UserCheck}/>
        <StatCard label="Room Occupancy" value="72%" sub="6/9 rooms in use" color="orange" icon={Building2}/>
        <StatCard label="Schedule Health" value="68/100" sub="2 clashes detected" color="red" icon={Activity} trend={-3}/>
      </div>

      {/* Live Room Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600"/>Live Room Status</h3>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{now.toLocaleTimeString("en-IN", {hour:"2-digit",minute:"2-digit"})}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>{["Room","Type","Cap","Status","Ongoing Class","Faculty"].map(h => <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-500 text-[11px] uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ROOMS.map(r => {
                const cls = INIT_TIMETABLE.find(s => s.room === r.id);
                const occupied = !!cls;
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800">{r.name}</td>
                    <td className="px-4 py-3"><Badge label={r.type} color={r.type==="Lab"?"purple":r.type==="Seminar"?"orange":"blue"}/></td>
                    <td className="px-4 py-3 text-slate-600">{r.cap}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${occupied?"bg-green-100 text-green-700":"bg-slate-100 text-slate-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${occupied?"bg-green-500 animate-pulse":"bg-slate-300"}`}/>
                        {occupied ? "Occupied" : "Available"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{cls?.subject || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{cls?.faculty?.split(" ").slice(-1)[0] || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-600"/><h3 className="font-black text-slate-800">Spectra Events &amp; Exams</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {EVENTS.map(e => (
              <div key={e.name} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-800">{e.name}</div>
                  <div className="text-[11px] text-slate-400">{e.date} · {e.venue}</div>
                </div>
                <Badge label={e.status} color={e.status==="Confirmed"?"green":e.status==="Pending"?"orange":"blue"}/>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-orange-500"/><h3 className="font-black text-slate-800">Pending Approvals</h3></div>
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">{PENDING_APPROVALS.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {PENDING_APPROVALS.map(p => (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">{p.type}</div>
                  <div className="text-xs font-bold text-slate-800">{p.by}</div>
                  <div className="text-[11px] text-slate-400">{p.desc}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge label={p.urgency} color={p.urgency==="HIGH"?"red":p.urgency==="MEDIUM"?"orange":"slate"}/>
                  <div className="flex gap-1">
                    <button className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold hover:bg-green-200">✓</button>
                    <button className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold hover:bg-red-200">✗</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-pink-500"/>Utilization Dashboard — This Week</h3>
        <div className="space-y-3">
          {DAYS.map((d, i) => {
            const pct = ANALYTICS_DATA.utilization[i];
            return (
              <div key={d} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-10">{d}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width:`${pct}%`, background: pct > 80 ? "linear-gradient(90deg,#10b981,#059669)" : pct > 60 ? "linear-gradient(90deg,#3b82f6,#6366f1)" : "linear-gradient(90deg,#f59e0b,#f97316)" }}/>
                </div>
                <span className="text-xs font-black text-slate-700 w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── SCHEDULING ENGINE ────────────────────────────────────────────────────────

function SchedulingEngine() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timetable, setTimetable] = useState(INIT_TIMETABLE);
  const [filter, setFilter] = useState("ALL");
  const [log, setLog] = useState([]);

  const runOptimizer = () => {
    setRunning(true); setProgress(0); setLog([]);
    const steps = [
      "Initializing OR-Tools constraint solver…",
      "Loading faculty availability constraints…",
      "Loading room capacity constraints…",
      "Loading student group constraints…",
      "Detecting clashes in current schedule…",
      "Running backtracking search (depth-first)…",
      "Applying soft constraints (preferred slots)…",
      "Minimizing gap penalty function…",
      "Validating final schedule — 0 hard violations…",
      "✅ Optimization complete! Score improved: 68 → 94",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setProgress(Math.round(((i + 1) / steps.length) * 100));
      setLog(prev => [...prev, steps[i]]);
      i++;
      if (i >= steps.length) { clearInterval(interval); setRunning(false); }
    }, 500);
  };

  const days = filter === "ALL" ? DAYS : [filter];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Sessions" value={timetable.length} color="blue" icon={Hash}/>
        <StatCard label="Clashes" value={timetable.filter(s=>s.clashes>0).length} color="red" icon={AlertTriangle}/>
        <StatCard label="Rooms Used" value={new Set(timetable.map(s=>s.room)).size} color="purple" icon={Building2}/>
        <StatCard label="Health Score" value="68/100" color="orange" icon={Activity}/>
      </div>

      {/* OR-Tools Runner */}
      <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-violet-300"/>
              <h3 className="font-black text-lg">OR-Tools Constraint Solver</h3>
            </div>
            <p className="text-violet-200 text-xs">Google OR-Tools CP-SAT · Clash-free · Constraint Propagation</p>
          </div>
          <button onClick={runOptimizer} disabled={running}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-violet-900 font-black text-sm hover:bg-violet-50 disabled:opacity-60 transition-all shadow-lg">
            {running ? <><RefreshCw className="w-4 h-4 animate-spin"/> Running…</> : <><Zap className="w-4 h-4"/> Run Optimizer</>}
          </button>
        </div>

        {(running || log.length > 0) && (
          <div className="mt-5">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width:`${progress}%` }}/>
            </div>
            <div className="bg-black/30 rounded-xl p-3 font-mono text-xs text-violet-200 space-y-1 max-h-36 overflow-y-auto">
              {log.map((l, i) => <div key={i} className={l.startsWith("✅") ? "text-emerald-400 font-bold" : ""}>{"> "}{l}</div>)}
            </div>
          </div>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-black text-slate-800 flex items-center gap-2"><Grid3x3 className="w-4 h-4 text-violet-600"/>Clash-Free Timetable Grid</h3>
          <div className="flex gap-2 flex-wrap">
            {["ALL",...DAYS].map(d => (
              <button key={d} onClick={() => setFilter(d)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${filter===d?"bg-violet-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{d}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold text-slate-500 text-[11px]">TIME</th>
                {days.map(d => <th key={d} className="px-4 py-2.5 text-left font-bold text-slate-500 text-[11px]">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {SLOTS.map(slot => (
                <tr key={slot} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-400 text-[11px]">{slot}</td>
                  {days.map(day => {
                    const s = timetable.find(x => x.day===day && x.slot===slot);
                    return (
                      <td key={day} className="px-4 py-2">
                        {s ? (
                          <div className={`rounded-xl p-2 text-[10px] border ${s.clashes > 0 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
                            <div className="font-black text-slate-800 truncate">{s.subject}</div>
                            <div className="text-slate-500 truncate">{s.room}</div>
                            <div className="text-slate-400 truncate">{s.faculty.split(" ").slice(-1)[0]}</div>
                            {s.clashes > 0 && <div className="text-red-600 font-bold">⚠ Clash</div>}
                          </div>
                        ) : <div className="text-slate-200 text-center">—</div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Constraint Validation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/>Constraint Validation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label:"No faculty double-booking",   pass:true },
            { label:"Room capacity not exceeded",  pass:true },
            { label:"No student group conflicts",  pass:false, detail:"2 groups clash Tue 9AM" },
            { label:"Faculty max workload (20h)",  pass:false, detail:"Prof. Swain at 20/20h" },
            { label:"Exam buffer period clear",    pass:true },
            { label:"Lab classes only in labs",    pass:true },
          ].map(c => (
            <div key={c.label} className={`flex items-start gap-3 p-3 rounded-xl border ${c.pass?"bg-emerald-50 border-emerald-200":"bg-red-50 border-red-200"}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${c.pass?"bg-emerald-500":"bg-red-500"}`}>
                {c.pass ? <CheckCircle2 className="w-3 h-3 text-white"/> : <X className="w-3 h-3 text-white"/>}
              </div>
              <div>
                <div className={`text-xs font-bold ${c.pass?"text-emerald-800":"text-red-800"}`}>{c.label}</div>
                {c.detail && <div className="text-[10px] text-red-600 mt-0.5">{c.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI COPILOT ───────────────────────────────────────────────────────────────

function AICopilot() {
  const [messages, setMessages] = useState([
    { role:"ai", text:"👋 Namaste! I'm **UNIFY AI**, your scheduling copilot. Ask me anything in English or Hinglish!\n\nTry: *\"Who teaches ML?\"* or *\"Book lab for Saturday\"* or *\"Koi clash hai kya?\"*" }
  ]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("EN");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(p => [...p, { role:"user", text:userMsg }]);
    setInput("");
    setTimeout(() => {
      const key = Object.keys(AI_CHAT_RESPONSES).find(k => userMsg.toLowerCase().includes(k));
      const reply = AI_CHAT_RESPONSES[key] || AI_CHAT_RESPONSES.default;
      setMessages(p => [...p, { role:"ai", text:reply }]);
    }, 800);
  };

  const hinglishPrompts = [
    "Aaj kaun sa room free hai?",
    "Dr. Panda ki class kab hai?",
    "Koi clash hai kya is week mein?",
    "Saturday ko extra class book kar",
    "ML ka exam kab hai?",
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Brain className="w-7 h-7 text-emerald-300"/>
          </div>
          <div>
            <h3 className="font-black text-xl">UNIFY AI Scheduling Copilot</h3>
            <p className="text-emerald-200 text-xs">English · Hinglish · Natural Language Room Booking</p>
          </div>
          <div className="ml-auto flex gap-2">
            {["EN","HI","MIX"].map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang===l?"bg-white text-emerald-900":"bg-white/10 text-white hover:bg-white/20"}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Hinglish prompts */}
      <div className="flex gap-2 flex-wrap">
        {hinglishPrompts.map(p => (
          <button key={p} onClick={() => { setInput(p); }}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-all">
            {p}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                m.role==="user"
                  ? "bg-emerald-600 text-white rounded-br-sm"
                  : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}>
                {m.text.split("\n").map((line, li) => (
                  <p key={li} className={li > 0 ? "mt-1" : ""}
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") }}/>
                ))}
              </div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div className="border-t border-slate-100 p-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && send()}
            placeholder={lang==="HI" ? "Apna sawaal likhein…" : lang==="MIX" ? "Kuch bhi poocho, English ya Hinglish…" : "Ask anything about schedule, rooms, faculty…"}
            className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"/>
          <button onClick={send} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all">
            <Send className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Booking Assistant */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-600"/>Quick Booking Assistant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label:"CS Lab 1", avail:"Sat 10AM free", tag:"Available", color:"green" },
            { label:"Room 201", avail:"Mon-Fri all booked", tag:"Busy", color:"red" },
            { label:"Seminar Hall", avail:"Fri 2PM free", tag:"Available", color:"green" },
          ].map(r => (
            <div key={r.label} className={`p-3 rounded-xl border-2 ${r.tag==="Available"?"border-emerald-200 bg-emerald-50":"border-red-200 bg-red-50"}`}>
              <div className="font-bold text-sm text-slate-800">{r.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{r.avail}</div>
              {r.tag==="Available" && (
                <button className="mt-2 w-full py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-700">Book Now</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RESCHEDULING ENGINE ──────────────────────────────────────────────────────

function ReschedulingEngine() {
  const [scenario, setScenario] = useState(null);
  const [approved, setApproved] = useState([]);

  const scenarios = [
    {
      id:"R1", type:"Faculty Leave", icon:"👨‍🏫", urgency:"HIGH",
      desc:"Dr. Avinash Panda on leave Nov 5–6 (Monday–Tuesday)",
      affected:["S01 Data Structures Mon 9AM","S07 Algorithms Tue 11AM"],
      proposal:[
        { from:"Mon 9AM R101 (DS)", to:"Thu 10AM R102 (DS)", penalty:0 },
        { from:"Tue 11AM R101 (Algo)", to:"Sat 9AM R102 (Algo)", penalty:2 },
      ],
      movements:2, risk:"LOW",
    },
    {
      id:"R2", type:"Room Closure", icon:"🚪", urgency:"MEDIUM",
      desc:"Room 201 closed for renovation Nov 8–10",
      affected:["S05 ML Tue 9AM R201","S12 Statistics Fri 10AM R201"],
      proposal:[
        { from:"Tue 9AM R201 (ML)", to:"Tue 9AM SEM1 (ML)", penalty:0 },
        { from:"Fri 10AM R201 (Stat)", to:"Fri 10AM R202 (Stat)", penalty:0 },
      ],
      movements:2, risk:"LOW",
    },
    {
      id:"R3", type:"New Session", icon:"➕", urgency:"LOW",
      desc:"Add extra ML session on Saturday 10AM",
      affected:[],
      proposal:[{ from:"(new)", to:"Sat 10AM R201 (ML Extra)", penalty:0 }],
      movements:1, risk:"NONE",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Pending Changes" value={scenarios.length} color="orange" icon={RefreshCw}/>
        <StatCard label="Auto-Resolved" value={approved.length} color="green" icon={CheckCircle2}/>
        <StatCard label="Min. Movement" value="2 sessions" color="blue" icon={Target}/>
      </div>

      <div className="space-y-3">
        {scenarios.map(s => (
          <div key={s.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${s.urgency==="HIGH"?"border-red-200":s.urgency==="MEDIUM"?"border-orange-200":"border-slate-200"}`}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800">{s.type}</span>
                      <Badge label={s.urgency} color={s.urgency==="HIGH"?"red":s.urgency==="MEDIUM"?"orange":"slate"}/>
                      {approved.includes(s.id) && <Badge label="✓ Approved" color="green"/>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
                <button onClick={() => setScenario(scenario===s.id ? null : s.id)}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold rounded-xl transition-all">
                  {scenario===s.id ? "Hide" : "View Recovery Plan"}
                </button>
              </div>

              {/* Affected sessions */}
              {s.affected.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.affected.map(a => <span key={a} className="text-[10px] bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-full">{a}</span>)}
                </div>
              )}
            </div>

            {/* Recovery Plan */}
            {scenario === s.id && (
              <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500"/>Auto Recovery Plan — Minimal Session Movement</h4>
                {s.proposal.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-3 text-xs">
                    <span className="text-red-500 font-bold flex-shrink-0">{p.from}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0"/>
                    <span className="text-emerald-600 font-bold flex-1">{p.to}</span>
                    <Badge label={`Penalty: ${p.penalty}`} color={p.penalty===0?"green":"orange"}/>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span>Movements: <strong>{s.movements}</strong></span>
                    <span>Risk: <strong className={s.risk==="NONE"?"text-emerald-600":"text-amber-600"}>{s.risk}</strong></span>
                  </div>
                  {!approved.includes(s.id) ? (
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200">Reject</button>
                      <button onClick={() => setApproved(p => [...p, s.id])}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700">Approve &amp; Apply</button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/>Applied to schedule</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── IMPACT ANALYSIS ──────────────────────────────────────────────────────────

function ImpactAnalysis() {
  const [scenario] = useState({
    change: "Dr. Avinash Panda Leave — Nov 5 (Monday)",
    affectedFaculty: [{ name:"Dr. Avinash Panda", sessions:2, hours:2 }],
    affectedStudents: 107,
    affectedRooms: ["R101","R102"],
    riskScore: 34,
    sessionMoves: 2,
    before: INIT_TIMETABLE.slice(0, 4),
    after: [
      { ...INIT_TIMETABLE[0], day:"THU", slot:"10:00", room:"R102" },
      { ...INIT_TIMETABLE[6], day:"SAT", slot:"9:00" },
    ],
  });

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-red-900 to-rose-900 text-white rounded-2xl p-5">
        <h3 className="font-black text-xl flex items-center gap-2"><Activity className="w-5 h-5"/>Impact Analysis System</h3>
        <p className="text-red-200 text-xs mt-1">Analyzing: <strong>{scenario.change}</strong></p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Affected Faculty" value={scenario.affectedFaculty.length} color="orange" icon={UserCheck}/>
        <StatCard label="Affected Students" value={scenario.affectedStudents} color="red" icon={Users}/>
        <StatCard label="Session Moves" value={scenario.sessionMoves} color="blue" icon={RefreshCw}/>
      </div>

      {/* Risk Score */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-3">Risk Score</h4>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                strokeDasharray={`${scenario.riskScore} ${100-scenario.riskScore}`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-black text-amber-500">{scenario.riskScore}</span>
              <span className="text-[9px] text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            {[["Faculty disruption","HIGH",80],["Student impact","MEDIUM",45],["Room conflicts","LOW",15],["Overall risk","MEDIUM",34]].map(([label, sev, val]) => (
              <div key={label}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-600">{label}</span>
                  <Badge label={sev} color={sev==="HIGH"?"red":sev==="MEDIUM"?"orange":"slate"}/>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${val}%`, background: val>60?"#ef4444":val>30?"#f59e0b":"#10b981" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Before vs After */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4">Before vs After Comparison</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1"><X className="w-3.5 h-3.5"/>Before (Conflict)</div>
            <div className="space-y-2">
              {scenario.before.slice(0,3).map(s => (
                <div key={s.id} className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px]">
                  <div className="font-bold text-slate-800">{s.subject}</div>
                  <div className="text-slate-500">{s.day} {s.slot} · {s.room}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/>After (Resolved)</div>
            <div className="space-y-2">
              {scenario.after.map(s => (
                <div key={s.id} className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px]">
                  <div className="font-bold text-slate-800">{s.subject}</div>
                  <div className="text-slate-500">{s.day} {s.slot} · {s.room}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EXPLAINABLE AI ───────────────────────────────────────────────────────────

function ExplainableAI() {
  const [selected, setSelected] = useState(null);
  const explanations = [
    {
      q:"Why this slot? (DS Mon 9AM R101)",
      icon:"🎯",
      answer:"Room 101 selected because: (1) Capacity 60 ≥ class size 55 ✓ (2) No faculty conflict Mon 9AM ✓ (3) No student group overlap ✓ (4) Dr. Panda prefers morning slots (soft constraint) ✓. This slot scores 97/100.",
      constraints:["Room cap OK","No clash","Faculty pref","Student group free"],
    },
    {
      q:"Why rejected? (DS in Auditorium)",
      icon:"❌",
      answer:"Auditorium (cap 400) rejected for Data Structures (55 students) because: (1) Utilization ratio 55/400 = 13.75% — fails min-utilization constraint of 50% (2) Higher-priority requests from Spectra 2026 have first claim (3) AV cost penalty +8 applied.",
      constraints:["Under-utilized","Spectra priority","Cost penalty"],
    },
    {
      q:"Why this room? (ML in R201)",
      icon:"🏫",
      answer:"Room 201 (cap 80) chosen for ML (62 students) because: utilization 77.5% — optimal range [70%-90%] ✓. Lab 1 was considered but type mismatch (Lab vs Lecture) ✗. Room 101 excluded — already booked Tue 9AM.",
      constraints:["Optimal utilization","Type match","Not double-booked"],
    },
    {
      q:"Why this priority? (Exam over class)",
      icon:"📊",
      answer:"Mid-Sem Exam given priority over regular class because: (1) Exam priority weight = 100 vs Class weight = 60 (2) Exam dates fixed by Academic Calendar — hard constraint (3) Rescheduling classes has 5x lower penalty than rescheduling exams.",
      constraints:["Priority weights","Hard constraint","Penalty ratio"],
    },
    {
      q:"Why rejected? (New session Sat 8AM)",
      icon:"⏰",
      answer:"Saturday 8AM rejected because: (1) Institute policy — no classes before 9AM (hard constraint) (2) Faculty union agreement excludes early Saturday slots (3) Hostel students need commute time — soft constraint violated.",
      constraints:["Institute policy","Faculty agreement","Student welfare"],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-yellow-900 to-orange-900 text-white rounded-2xl p-5">
        <h3 className="font-black text-xl flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-300"/>Explainable AI — Why?</h3>
        <p className="text-yellow-200 text-xs mt-1">Full transparency into every scheduling decision</p>
      </div>

      <div className="space-y-3">
        {explanations.map((e, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setSelected(selected===i ? null : i)}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{e.icon}</span>
                <span className="text-sm font-bold text-slate-800">{e.q}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${selected===i?"rotate-180":""}`}/>
            </button>
            {selected === i && (
              <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{e.answer}</p>
                <div className="flex flex-wrap gap-2">
                  {e.constraints.map(c => (
                    <span key={c} className="text-[10px] bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-bold">{c}</span>
                  ))}
                </div>
                <div className="mt-3 flex gap-3">
                  <button className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600"><ThumbsUp className="w-3.5 h-3.5"/> Helpful</button>
                  <button className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-500"><ThumbsDown className="w-3.5 h-3.5"/> Not helpful</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DIGITAL TWIN ─────────────────────────────────────────────────────────────

function DigitalTwin() {
  const [selected, setSelected] = useState(null);
  const heatData = ROOMS.map(r => {
    const sessions = INIT_TIMETABLE.filter(s => s.room === r.id).length;
    const pct = Math.round((sessions / 8) * 100);
    return { ...r, sessions, pct };
  });

  const getColor = (pct) => {
    if (pct >= 70) return "#ef4444";
    if (pct >= 40) return "#f59e0b";
    if (pct >= 20) return "#3b82f6";
    return "#e2e8f0";
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white rounded-2xl p-5">
        <h3 className="font-black text-xl flex items-center gap-2"><Layers className="w-5 h-5 text-cyan-300"/>Digital Twin Campus</h3>
        <p className="text-cyan-200 text-xs mt-1">Live occupancy heatmap · Real-time booking tracker</p>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-1">Room Occupancy Heatmap</h4>
        <p className="text-xs text-slate-400 mb-4">Click a room for detailed availability</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {heatData.map(r => (
            <button key={r.id} onClick={() => setSelected(selected===r.id ? null : r.id)}
              className={`rounded-2xl p-3 text-center border-2 transition-all ${selected===r.id?"border-blue-500 scale-105 shadow-lg":"border-transparent hover:scale-102"}`}
              style={{ background: `${getColor(r.pct)}22`, borderColor: selected===r.id ? "#3b82f6" : `${getColor(r.pct)}44` }}>
              <div className="text-lg mb-1">{r.type==="Lab"?"🔬":r.type==="Seminar"?"🎤":r.type==="Auditorium"?"🏟":"🏛"}</div>
              <div className="text-[10px] font-black text-slate-700">{r.name}</div>
              <div className="text-[10px] text-slate-500">{r.cap} seats</div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width:`${r.pct}%`, background:getColor(r.pct) }}/>
              </div>
              <div className="text-[10px] font-bold mt-1" style={{ color:getColor(r.pct) }}>{r.pct}%</div>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-500">
          {[["#ef4444","High (>70%)"],["#f59e0b","Medium (40-70%)"],["#3b82f6","Low (20-40%)"],["#e2e8f0","Empty"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1"><span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:c }}/>{l}</div>
          ))}
        </div>
      </div>

      {/* Room detail */}
      {selected && (() => {
        const r = heatData.find(x => x.id === selected);
        const sessions = INIT_TIMETABLE.filter(s => s.room === selected);
        return (
          <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-800">{r.name} — Venue Availability</h4>
              <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-slate-400"/></button>
            </div>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Type: <strong>{r.type}</strong></span>
              <span>Capacity: <strong>{r.cap}</strong></span>
              <span>Building: <strong>{r.building}</strong></span>
              <span>Floor: <strong>{r.floor}</strong></span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SLOTS.map(slot => {
                const s = sessions.find(x => x.slot === slot);
                return (
                  <div key={slot} className={`p-2 rounded-xl text-[10px] text-center ${s?"bg-red-50 border border-red-200":"bg-emerald-50 border border-emerald-200"}`}>
                    <div className="font-bold text-slate-600">{slot}</div>
                    <div className={`font-bold ${s?"text-red-600":"text-emerald-600"}`}>{s ? s.subject : "FREE"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── ANALYTICS ────────────────────────────────────────────────────────────────

function Analytics() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Schedule Health" value="68/100" sub="2 constraints violated" color="orange" icon={Activity} trend={-3}/>
        <StatCard label="Avg Room Util." value="72%" sub="Target: 80%" color="blue" icon={Building2} trend={5}/>
        <StatCard label="Peak Hour" value="10–11 AM" sub="91% occupancy" color="purple" icon={TrendingUp}/>
      </div>

      {/* Faculty Workload */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-pink-500"/>Faculty Workload (hrs/week)</h4>
        <div className="space-y-3">
          {Object.entries(ANALYTICS_DATA.workload).map(([name, hrs]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-36 truncate">{name}</span>
              <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full flex items-center pl-2 transition-all"
                  style={{ width:`${(hrs/20)*100}%`, background: hrs>=20?"linear-gradient(90deg,#ef4444,#dc2626)":hrs>=16?"linear-gradient(90deg,#f59e0b,#d97706)":"linear-gradient(90deg,#10b981,#059669)" }}>
                  <span className="text-[10px] text-white font-bold">{hrs}h</span>
                </div>
              </div>
              <Badge label={hrs>=20?"Overloaded":hrs>=16?"High":"Optimal"} color={hrs>=20?"red":hrs>=16?"orange":"green"}/>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-500"/>Peak Campus Hours</h4>
        <div className="flex items-end gap-2 h-36">
          {SLOTS.map((slot, i) => {
            const val = ANALYTICS_DATA.peakHours[i];
            return (
              <div key={slot} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-slate-500 font-bold">{val}%</span>
                <div className="w-full rounded-t-lg transition-all"
                  style={{ height:`${val * 1.1}px`, background: val>80?"linear-gradient(180deg,#ef4444,#f97316)":val>60?"linear-gradient(180deg,#3b82f6,#6366f1)":"linear-gradient(180deg,#10b981,#14b8a6)" }}/>
                <span className="text-[9px] text-slate-400">{slot.split(":")[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500"/>AI Optimization Suggestions</h4>
        <div className="space-y-3">
          {[
            { icon:"📦", title:"Consolidate Thursday gaps", desc:"Thu has 5 empty slots. Move 2 sessions from Wed to fill — saves ₹12K/year in room operational cost.", gain:"+6 health pts" },
            { icon:"⚖", title:"Rebalance Prof. Swain workload", desc:"Prof. Swain at max 20h. Redistribute Statistics sections across 2 faculty to reduce burnout risk.", gain:"+8 health pts" },
            { icon:"🔄", title:"Flip Tue 9AM & Thu 9AM", desc:"Swapping these two sessions eliminates 1 student group clash with 0 additional movement penalty.", gain:"+5 health pts" },
          ].map(s => (
            <div key={s.title} className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-800">{s.title}</span>
                  <Badge label={s.gain} color="green"/>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
              </div>
              <button className="self-start px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg hover:bg-amber-600 flex-shrink-0">Apply</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BATTLE MODE ──────────────────────────────────────────────────────────────

function BattleMode() {
  const [winner, setWinner] = useState(null);
  const schedules = [SCHEDULE_A, SCHEDULE_B, SCHEDULE_C];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5">
        <h3 className="font-black text-2xl flex items-center gap-2"><Swords className="w-6 h-6 text-yellow-400"/>⚔ Schedule Battle Mode</h3>
        <p className="text-slate-300 text-xs mt-1">Compare multiple schedule variants — pick the champion</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {schedules.map((s, i) => (
          <div key={s.name}
            className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition-all cursor-pointer ${winner===i?"border-yellow-400 shadow-yellow-200/50 shadow-lg scale-105":"border-slate-200 hover:border-slate-300"}`}
            onClick={() => setWinner(i)}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500">{["🔴 Schedule A","🔵 Schedule B","🟢 Schedule C"][i]}</span>
              {winner===i && <span className="text-xs font-black text-yellow-600 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>Best</span>}
            </div>
            <h4 className="font-black text-slate-800 text-sm mb-4">{s.name}</h4>
            {[
              ["Health Score", s.healthScore, 100, s.healthScore>80?"green":s.healthScore>60?"orange":"red"],
              ["Utilization",  s.utilization, 100, "blue"],
              ["Penalty",      100-s.penalty, 100, s.penalty<20?"green":s.penalty<40?"orange":"red"],
              ["Clashes",      (2-s.clashes)*50, 100, s.clashes===0?"green":"red"],
            ].map(([label, val, max, color]) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-slate-700">{label==="Clashes"?`${s.clashes} clashes`:label==="Penalty"?`${s.penalty} pts`:label==="Utilization"?`${s.utilization}%`:`${s.healthScore}/100`}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width:`${(val/max)*100}%`, background: color==="green"?"#10b981":color==="orange"?"#f59e0b":color==="red"?"#ef4444":"#3b82f6" }}/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {winner !== null && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-5">
          <h4 className="font-black text-amber-800 flex items-center gap-2 text-lg">
            <Award className="w-5 h-5 text-yellow-500"/>🏆 Recommendation: {schedules[winner].name}
          </h4>
          <p className="text-amber-700 text-sm mt-2">
            {winner===1
              ? "OR-Tools Optimized Schedule eliminates all clashes, achieves 89% room utilization and reduces penalty score from 47 to 12. Strongly recommended for deployment."
              : winner===2
              ? "Compact Schedule achieves good balance with no clashes and 83% utilization. Suitable if faculty prefer fewer sessions per day."
              : "Current Schedule has 2 clashes and lowest health score. Use the OR-Tools optimizer to improve before next week."}
          </p>
          <button className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all">
            Deploy {schedules[winner].name}
          </button>
        </div>
      )}
    </div>
  );
}

// ── EMERGENCY MODE ───────────────────────────────────────────────────────────

function EmergencyMode() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const triggerEmergency = () => {
    setActive(true);
    let c = 5;
    setCountdown(c);
    const iv = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) { clearInterval(iv); setCountdown(null); }
    }, 1000);
  };

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl p-6 text-white transition-all ${active ? "bg-red-600 animate-pulse" : "bg-gradient-to-r from-red-900 to-red-800"}`}>
        <div className="flex items-center gap-3">
          <Flame className={`w-8 h-8 ${active?"text-white animate-bounce":"text-red-300"}`}/>
          <div>
            <h3 className="font-black text-2xl">🚨 Emergency Mode</h3>
            <p className="text-red-200 text-xs">{active ? "EMERGENCY ACTIVE — Auto-rescheduling in progress…" : "One-click crisis handling for schedule emergencies"}</p>
          </div>
          {countdown !== null && (
            <div className="ml-auto text-6xl font-black text-white">{countdown}</div>
          )}
        </div>
        {!active && (
          <button onClick={triggerEmergency}
            className="mt-4 px-6 py-3 bg-white text-red-700 font-black rounded-xl hover:bg-red-50 transition-all shadow-lg flex items-center gap-2">
            <Zap className="w-4 h-4"/> Activate Emergency Mode
          </button>
        )}
      </div>

      {active && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-5 space-y-3">
            <h4 className="font-black text-red-700 flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin"/>Auto Recovery in Progress</h4>
            {[
              { label:"Detecting all affected sessions", done:true },
              { label:"Canceling conflicting room bookings", done:true },
              { label:"Finding alternative slots (OR-Tools)", done:true },
              { label:"Notifying all affected faculty via SMS", done:countdown===null },
              { label:"Notifying all affected students via app", done:countdown===null },
              { label:"Regenerating printable schedule", done:countdown===null },
            ].map(step => (
              <div key={step.label} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done?"bg-emerald-500":"bg-slate-200"}`}>
                  {step.done ? <CheckCircle2 className="w-3.5 h-3.5 text-white"/> : <div className="w-2 h-2 rounded-full bg-slate-400"/>}
                </div>
                <span className={step.done ? "text-slate-800 font-bold" : "text-slate-400"}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crisis Scenarios */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4">Preset Crisis Scenarios</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon:"🌊", label:"Flood / Weather Emergency", desc:"Cancel all classes, auto-notify students" },
            { icon:"💡", label:"Power Outage — Block A", desc:"Move all Block A classes to other blocks" },
            { icon:"🤒", label:"Mass Faculty Absence", desc:"Consolidate sessions, find substitutes" },
            { icon:"🔥", label:"Fire Drill (Scheduled)", desc:"Clear schedules for 2 hours, auto-resume" },
          ].map(s => (
            <button key={s.label} className="p-4 text-left rounded-xl border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all group">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xs font-black text-slate-800 group-hover:text-red-700">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VOICE AI ─────────────────────────────────────────────────────────────────

function VoiceAI() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState(null);
  const [lang, setLang] = useState("EN");

  const commands = {
    EN: ["Book CS Lab for Saturday","Reschedule Monday 9AM class","Show empty slots today","Who teaches Machine Learning?"],
    HI: ["Aaj ke empty rooms dikhao","ML class kab hai?","Lab book karo Saturday ke liye","Clashes kaunse hain?"],
    MIX: ["Bhai, Saturday ko lab free hai kya?","Koi clash toh nahi na?","ML ka room change karo","Schedule optimize kar do"],
  };

  const mockListen = (cmd) => {
    setTranscript(cmd);
    setListening(false);
    setTimeout(() => {
      const key = Object.keys(AI_CHAT_RESPONSES).find(k => cmd.toLowerCase().includes(k));
      setResponse(AI_CHAT_RESPONSES[key] || AI_CHAT_RESPONSES.default);
    }, 600);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-900 to-violet-900 text-white rounded-2xl p-6">
        <h3 className="font-black text-2xl flex items-center gap-2"><Mic className="w-6 h-6 text-indigo-300"/>🎤 Voice AI Scheduling</h3>
        <p className="text-indigo-200 text-xs mt-1">Speak in Hindi · English · Hinglish</p>
        <div className="flex gap-2 mt-4">
          {["EN","HI","MIX"].map(l => (
            <button key={l} onClick={() => { setLang(l); setTranscript(""); setResponse(null); }}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${lang===l?"bg-white text-indigo-900":"bg-white/10 text-white hover:bg-white/20"}`}>
              {l==="EN"?"🇬🇧 English":l==="HI"?"🇮🇳 Hindi":"🌐 Hinglish"}
            </button>
          ))}
        </div>
      </div>

      {/* Mic Button */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-4">
        <button onClick={() => setListening(l => !l)}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${listening?"bg-red-500 scale-110 animate-pulse":"bg-indigo-600 hover:bg-indigo-700"}`}>
          <Mic className="w-12 h-12 text-white"/>
        </button>
        <p className="text-sm font-bold text-slate-600">
          {listening ? "🎙 Listening… speak now" : "Tap to speak"}
        </p>
        {transcript && (
          <div className="bg-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700">
            "{transcript}"
          </div>
        )}
        {response && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-800 max-w-xs text-center"
            dangerouslySetInnerHTML={{ __html: response.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }}/>
        )}
      </div>

      {/* Sample Commands */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2"><Volume2 className="w-4 h-4 text-indigo-500"/>Try these commands</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {commands[lang].map(cmd => (
            <button key={cmd} onClick={() => mockListen(cmd)}
              className="text-left p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 hover:bg-indigo-100 transition-all flex items-center gap-2">
              <Mic className="w-3 h-3 text-indigo-400 flex-shrink-0"/>"{cmd}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function UnifyScheduler() {
  const [activeTab, setActiveTab] = useState("command");

  const renderContent = () => {
    switch (activeTab) {
      case "command":    return <CommandCenter/>;
      case "schedule":   return <SchedulingEngine/>;
      case "ai":         return <AICopilot/>;
      case "reschedule": return <ReschedulingEngine/>;
      case "impact":     return <ImpactAnalysis/>;
      case "explainai":  return <ExplainableAI/>;
      case "twin":       return <DigitalTwin/>;
      case "analytics":  return <Analytics/>;
      case "battle":     return <BattleMode/>;
      case "emergency":  return <EmergencyMode/>;
      case "voice":      return <VoiceAI/>;
      default:           return <CommandCenter/>;
    }
  };

  const active = TABS.find(t => t.key === activeTab);

  return (
    <div className="space-y-4">
      {/* Top hero bar */}
      <div className={`bg-gradient-to-r ${active?.color || "from-blue-600 to-indigo-600"} text-white rounded-3xl p-5 shadow-xl`}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              {active && <active.icon className="w-5 h-5"/>}
            </div>
            <div>
              <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">UNIFY Smart Campus</div>
              <h2 className="text-xl font-black">{active?.label}</h2>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-bold">Trident Academy of Technology</span>
            <span className="text-[10px] bg-emerald-400/30 border border-emerald-300/40 px-2 py-1 rounded-full font-bold">● Live</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation — scrollable */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-2 min-w-max pb-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all flex-shrink-0 ${
                activeTab === t.key
                  ? `bg-gradient-to-r ${t.color} text-white shadow-md`
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>
              <t.icon className="w-3.5 h-3.5"/>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </div>
  );
}
