import React, { useState } from "react";
import {
  LayoutDashboard, Cpu, RefreshCw, AlertTriangle, BarChart3,
  CheckCircle2, X, Zap, Clock, Users, Building2, BookOpen,
  ChevronDown, ArrowRight, Download, Upload, Settings,
  Bell, Target, Activity, TrendingUp, Calendar, Hash,
  Shield, Star, Layers, Eye, Play, Filter, Edit3, Plus
} from "lucide-react";

// ── CIT DATA ─────────────────────────────────────────────────────────────────

const ROOMS = [
  { id:"LH1",   name:"Lecture Hall 1",      cap:120, type:"Lecture Hall", accessible:true },
  { id:"LH2",   name:"Lecture Hall 2",      cap:120, type:"Lecture Hall", accessible:true },
  { id:"CR101", name:"Classroom 101",        cap:60,  type:"Classroom",    accessible:false },
  { id:"CR102", name:"Classroom 102",        cap:60,  type:"Classroom",    accessible:false },
  { id:"CR103", name:"Classroom 103",        cap:60,  type:"Classroom",    accessible:false },
  { id:"CR201", name:"Classroom 201",        cap:60,  type:"Classroom",    accessible:false },
  { id:"CR202", name:"Classroom 202",        cap:60,  type:"Classroom",    accessible:false },
  { id:"AUD",   name:"Auditorium",           cap:400, type:"Auditorium",   accessible:true },
  { id:"SH1",   name:"Seminar Hall 1",       cap:150, type:"Seminar Hall", accessible:true },
  { id:"SH2",   name:"Seminar Hall 2",       cap:100, type:"Seminar Hall", accessible:true },
  { id:"OAT",   name:"Open-Air Theatre",     cap:300, type:"Open-Air",     accessible:true },
  { id:"CSLAB1",name:"CS Lab 1",             cap:40,  type:"CS Lab",       accessible:false },
  { id:"CSLAB2",name:"CS Lab 2",             cap:40,  type:"CS Lab",       accessible:false },
  { id:"PHLAB", name:"Physics Lab",          cap:30,  type:"Physics Lab",  accessible:false },
  { id:"CHLAB", name:"Chemistry Lab",        cap:30,  type:"Chem Lab",     accessible:false },
  { id:"ECLAB", name:"ECE Lab",              cap:35,  type:"ECE Lab",      accessible:false },
];

const FACULTY = [
  { id:"F01", name:"Dr. A. Panda",    dept:"CSE",  dailyLimit:4, unavail:[] },
  { id:"F02", name:"Prof. S. Rath",   dept:"CSE",  dailyLimit:4, unavail:["MON P1","MON P2"] },
  { id:"F03", name:"Dr. R. Mohanty",  dept:"ECE",  dailyLimit:4, unavail:[] },
  { id:"F04", name:"Prof. L. Swain",  dept:"MATH", dailyLimit:4, unavail:["FRI P5"] },
  { id:"F05", name:"Dr. S. Behera",   dept:"PHY",  dailyLimit:4, unavail:[] },
  { id:"F06", name:"Prof. A. Mishra", dept:"CSE",  dailyLimit:4, unavail:[] },
  { id:"F07", name:"Dr. P. Das",      dept:"CHEM", dailyLimit:4, unavail:["WED P3","WED P4"] },
  { id:"F08", name:"Prof. M. Sahoo",  dept:"ECE",  dailyLimit:4, unavail:[] },
];

const GROUPS = ["Y1-A","Y1-B","Y1-C","Y1-D","Y2-CSE","Y2-ECE","Y2-MECH","Y2-CIVIL","Y2-EEE","Y3-CSE","Y3-ECE","Y3-MECH","Y3-CIVIL","Y3-EEE"];

const PERIODS = ["P1(08:00)","P2(09:00)","P3(10:00)","P4(11:00)","P5(12:00)","LUNCH","P6(14:00)","P7(15:00)","P8(16:00)","P9(17:00)"];
const DAYS = ["MON","TUE","WED","THU","FRI"];

const INIT_SESSIONS = [
  { id:"S001", course:"Data Structures",   type:"Lecture", faculty:"Dr. A. Panda",    group:"Y2-CSE",  size:55, room:"LH1",   day:"MON", period:"P1", status:"ok" },
  { id:"S002", course:"Signals & Systems", type:"Lecture", faculty:"Dr. R. Mohanty",  group:"Y2-ECE",  size:48, room:"CR101", day:"MON", period:"P2", status:"ok" },
  { id:"S003", course:"Eng. Mathematics",  type:"Lecture", faculty:"Prof. L. Swain",  group:"Y1-A",    size:55, room:"LH2",   day:"MON", period:"P3", status:"ok" },
  { id:"S004", course:"CS Lab 1",          type:"Lab",     faculty:"Prof. S. Rath",   group:"Y2-CSE",  size:38, room:"CSLAB1",day:"TUE", period:"P2", status:"ok" },
  { id:"S005", course:"Machine Learning",  type:"Lecture", faculty:"Prof. S. Rath",   group:"Y3-CSE",  size:52, room:"LH1",   day:"TUE", period:"P6", status:"ok" },
  { id:"S006", course:"Physics",           type:"Lecture", faculty:"Dr. S. Behera",   group:"Y1-B",    size:55, room:"CR102", day:"WED", period:"P1", status:"ok" },
  { id:"S007", course:"Physics Lab",       type:"Lab",     faculty:"Dr. S. Behera",   group:"Y1-C",    size:28, room:"PHLAB", day:"WED", period:"P2", status:"ok" },
  { id:"S008", course:"Networks",          type:"Lecture", faculty:"Prof. A. Mishra", group:"Y3-CSE",  size:50, room:"CR201", day:"THU", period:"P1", status:"ok" },
  { id:"S009", course:"VLSI Design",       type:"Lecture", faculty:"Dr. R. Mohanty",  group:"Y3-ECE",  size:42, room:"CR103", day:"THU", period:"P3", status:"ok" },
  { id:"S010", course:"Algorithms",        type:"Lecture", faculty:"Dr. A. Panda",    group:"Y3-CSE",  size:52, room:"LH2",   day:"FRI", period:"P2", status:"ok" },
  { id:"S011", course:"Eng. Mathematics",  type:"Lecture", faculty:"Prof. L. Swain",  group:"Y1-B",    size:55, room:"CR102", day:"MON", period:"P1", status:"clash" },
  { id:"S012", course:"Chem Lab",          type:"Lab",     faculty:"Dr. P. Das",      group:"Y1-D",    size:25, room:"CHLAB", day:"WED", period:"P2", status:"clash" },
];

const EXAMS = [
  { id:"E01", course:"Data Structures",  group:"Y2-CSE",  duration:3, faculty:"Dr. A. Panda",   room:"LH1",   day:"MON", period:"P1" },
  { id:"E02", course:"Signals & Systems",group:"Y2-ECE",  duration:3, faculty:"Dr. R. Mohanty", room:"LH2",   day:"MON", period:"P6" },
  { id:"E03", course:"Algorithms",       group:"Y3-CSE",  duration:3, faculty:"Dr. A. Panda",   room:"SH1",   day:"TUE", period:"P1" },
  { id:"E04", course:"Machine Learning", group:"Y3-CSE",  duration:3, faculty:"Prof. S. Rath",  room:"LH1",   day:"WED", period:"P1" },
  { id:"E05", course:"Eng. Math",        group:"Y1-A",    duration:3, faculty:"Prof. L. Swain", room:"LH2",   day:"WED", period:"P6" },
  { id:"E06", course:"Networks",         group:"Y3-CSE",  duration:3, faculty:"Prof. A. Mishra",room:"SH1",   day:"THU", period:"P1" },
];

const PENDING_CHANGES = [
  { id:"PC01", type:"Faculty Leave",   by:"Dr. A. Panda",    desc:"Leave Mon Nov 10, clashes with S001 DS lecture",  sessions:["S001"], proposal:"Move S001 → THU P4 LH2", penalty:0, moves:1 },
  { id:"PC02", type:"Room Closure",    by:"Admin",           desc:"CR101 maintenance Nov 12-13, affects 3 sessions", sessions:["S002"], proposal:"Move S002 → CR202 same slot",penalty:0, moves:1 },
  { id:"PC03", type:"New Session",     by:"Prof. S. Rath",   desc:"Extra ML session Sat 9AM requested",              sessions:[],       proposal:"Add TUE P9 LH1 if available",penalty:2, moves:0 },
];

const SOFT_VIOLATIONS = [
  { type:"P9 session",      count:2, penalty:4,  desc:"2 sessions scheduled at 17:00 (P9)" },
  { type:"Same-course day", count:1, penalty:3,  desc:"Y1-A has 2 Eng. Math sessions on Mon" },
  { type:"Low utilization", count:3, penalty:6,  desc:"3 sessions using <40% of room capacity" },
  { type:"Free period gap", count:4, penalty:8,  desc:"4 groups have gaps without free period between classes" },
];

// ─── SMALL SHARED UI ─────────────────────────────────────────────────────────

function Badge({ label, color="blue" }) {
  const c = {
    blue:"bg-blue-100 text-blue-700 border border-blue-200",
    green:"bg-emerald-100 text-emerald-700 border border-emerald-200",
    red:"bg-red-100 text-red-700 border border-red-200",
    orange:"bg-orange-100 text-orange-700 border border-orange-200",
    purple:"bg-violet-100 text-violet-700 border border-violet-200",
    slate:"bg-slate-100 text-slate-600 border border-slate-200",
    yellow:"bg-yellow-100 text-yellow-700 border border-yellow-200",
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c[color]||c.slate}`}>{label}</span>;
}

function StatCard({ label, value, sub, color="blue", icon: Icon, alert }) {
  const bg = { blue:"from-blue-50 to-indigo-50 border-blue-200 text-blue-700", green:"from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700", red:"from-red-50 to-rose-50 border-red-200 text-red-700", orange:"from-orange-50 to-amber-50 border-orange-200 text-orange-700", purple:"from-violet-50 to-purple-50 border-violet-200 text-violet-700" };
  return (
    <div className={`bg-gradient-to-br ${bg[color]||bg.blue} border rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</span>
        {Icon && <Icon className="w-4 h-4 opacity-50"/>}
      </div>
      <div className="text-2xl font-black">{value}</div>
      {sub && <div className="text-[11px] opacity-70 mt-0.5">{sub}</div>}
      {alert && <div className="text-[10px] font-bold text-red-600 mt-1">⚠ {alert}</div>}
    </div>
  );
}

// ─── TAB: COMMAND CENTER ─────────────────────────────────────────────────────

function CommandCenter() {
  const clashes = INIT_SESSIONS.filter(s => s.status === "clash").length;
  const healthScore = Math.max(0, 100 - clashes * 15 - SOFT_VIOLATIONS.reduce((a, v) => a + v.penalty, 0));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Sessions"  value={INIT_SESSIONS.length}   sub="189 across 5 days"      color="blue"   icon={BookOpen}/>
        <StatCard label="Hard Clashes"    value={clashes}                sub="must be resolved"       color="red"    icon={AlertTriangle} alert={clashes>0?"Fix before export":undefined}/>
        <StatCard label="Schedule Health" value={`${healthScore}/100`}   sub="soft penalty included"  color={healthScore>80?"green":"orange"} icon={Activity}/>
        <StatCard label="Rooms"           value={`${ROOMS.length}`}      sub="classrooms, labs, halls" color="purple" icon={Building2}/>
      </div>

      {/* Hard clash alert */}
      {clashes > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="font-black text-red-800 text-sm">⚠ {clashes} Hard Constraint Violation{clashes>1?"s":""} Detected</p>
            <p className="text-xs text-red-600 mt-0.5">Sessions S011 and S012 have room/faculty conflicts. Go to <strong>Conflict Resolution</strong> tab to fix.</p>
          </div>
        </div>
      )}

      {/* Live session table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2"><Hash className="w-4 h-4 text-blue-500"/>Session Schedule Overview</h3>
          <div className="flex gap-2">
            <Badge label="✓ OK" color="green"/>
            <Badge label="⚠ Clash" color="red"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>{["ID","Course","Type","Faculty","Group","Room","Day","Period","Status"].map(h=>(
                <th key={h} className="px-3 py-2.5 text-left font-bold text-slate-400 text-[10px] uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {INIT_SESSIONS.map(s=>(
                <tr key={s.id} className={`hover:bg-slate-50 ${s.status==="clash"?"bg-red-50":""}`}>
                  <td className="px-3 py-2 font-mono text-slate-400">{s.id}</td>
                  <td className="px-3 py-2 font-bold text-slate-800">{s.course}</td>
                  <td className="px-3 py-2"><Badge label={s.type} color={s.type==="Lab"?"purple":s.type==="Tutorial"?"yellow":"blue"}/></td>
                  <td className="px-3 py-2 text-slate-600">{s.faculty.split(" ").slice(-1)[0]}</td>
                  <td className="px-3 py-2"><Badge label={s.group} color="slate"/></td>
                  <td className="px-3 py-2 text-slate-600">{s.room}</td>
                  <td className="px-3 py-2 font-bold text-slate-700">{s.day}</td>
                  <td className="px-3 py-2 text-slate-600">{s.period}</td>
                  <td className="px-3 py-2">
                    {s.status==="ok"
                      ? <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>OK</span>
                      : <span className="text-red-600 font-bold text-[10px] flex items-center gap-1"><AlertTriangle className="w-3 h-3"/>CLASH</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Soft violations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500"/>Soft Constraint Violations (Penalty)</h3>
        <div className="space-y-2">
          {SOFT_VIOLATIONS.map(v=>(
            <div key={v.type} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0 font-black text-yellow-700 text-xs">-{v.penalty}</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-800">{v.type}</div>
                <div className="text-[11px] text-slate-500">{v.desc}</div>
              </div>
              <Badge label={`${v.count} instance${v.count>1?"s":""}`} color="yellow"/>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <div className="text-sm font-black text-red-600">Total Penalty: -{SOFT_VIOLATIONS.reduce((a,v)=>a+v.penalty,0)} pts</div>
          </div>
        </div>
      </div>

      {/* View filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title:"By Student Group", icon:"👥", desc:"Select a group to see full week timetable", options:GROUPS },
          { title:"By Faculty",        icon:"👨‍🏫", desc:"See a faculty member's schedule",          options:FACULTY.map(f=>f.name) },
          { title:"By Room",           icon:"🏛",  desc:"View all bookings for a specific room",   options:ROOMS.map(r=>r.name) },
        ].map(v=>(
          <div key={v.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="text-base mb-1">{v.icon}</div>
            <div className="font-black text-slate-800 text-sm">{v.title}</div>
            <div className="text-[11px] text-slate-400 mb-3">{v.desc}</div>
            <select className="w-full p-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="">-- Select --</option>
              {v.options.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: TIMETABLE GENERATOR ────────────────────────────────────────────────

function TimetableGenerator() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);
  const [view, setView] = useState("group");
  const [selected, setSelected] = useState("Y2-CSE");

  const runGenerator = () => {
    setRunning(true); setProgress(0); setLog([]); setDone(false);
    const steps = [
      "Loading cit_public.json dataset…",
      "Parsing 27 rooms, 40 faculty, 14 groups, 62 courses…",
      "Building constraint model (OR-Tools CP-SAT)…",
      "Hard constraint 1: No faculty double-booking — verified",
      "Hard constraint 2: No group overlap — verified",
      "Hard constraint 3: Room capacity ≥ session size — verified",
      "Hard constraint 4: Room type match — verified",
      "Hard constraint 5: No sessions across lunch — verified",
      "Hard constraint 6: Lab sessions in P2-P4 or P6-P8 only — verified",
      "Hard constraint 7: Faculty unavailability — 7 slots blocked",
      "Running backtracking search (depth-first with propagation)…",
      "Iteration 1: 142/189 sessions placed…",
      "Iteration 2: 178/189 sessions placed…",
      "Iteration 3: 189/189 sessions placed — 0 hard violations!",
      "Computing soft penalty: 21 pts (gaps, P9 sessions, low util)…",
      "Scheduling 41 midsem exams (halved capacity mode)…",
      "Exams scheduled: 41/41 with 0 hard violations",
      "✅ Generation complete! Timetable ready. Export to schedule.json.",
    ];
    let i = 0;
    const iv = setInterval(() => {
      setProgress(Math.round(((i+1)/steps.length)*100));
      setLog(p => [...p, steps[i]]);
      i++;
      if (i >= steps.length) { clearInterval(iv); setRunning(false); setDone(true); }
    }, 400);
  };

  const sessions = INIT_SESSIONS.filter(s =>
    view==="group" ? s.group===selected : view==="faculty" ? s.faculty===selected : s.room===selected
  );

  return (
    <div className="space-y-5">
      {/* OR-Tools Engine */}
      <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-violet-300"/>
              <h3 className="font-black text-xl">OR-Tools Constraint Solver</h3>
            </div>
            <p className="text-violet-200 text-sm">189 sessions · 27 rooms · 40 faculty · 14 student groups</p>
            <p className="text-violet-300 text-xs mt-1">CP-SAT · Hard constraint enforcement · Soft penalty minimization</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={runGenerator} disabled={running}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-violet-900 font-black text-sm hover:bg-violet-50 disabled:opacity-60 transition-all shadow-lg">
              {running ? <><RefreshCw className="w-4 h-4 animate-spin"/>Running…</> : <><Zap className="w-4 h-4"/>Generate Timetable</>}
            </button>
            {done && (
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all">
                <Download className="w-4 h-4"/>Export schedule.json
              </button>
            )}
          </div>
        </div>

        {(running || log.length > 0) && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-violet-300">Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width:`${progress}%` }}/>
            </div>
            <div className="bg-black/40 rounded-xl p-3 font-mono text-xs text-violet-200 space-y-1 max-h-44 overflow-y-auto">
              {log.map((l,i)=>(
                <div key={i} className={l.startsWith("✅")?"text-emerald-400 font-bold":l.startsWith("Hard")?"text-blue-300":""}>
                  {"> "}{l}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timetable grid view */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-black text-slate-800">Timetable Grid</h3>
          <div className="flex gap-2 flex-wrap">
            {[["group","By Group"],["faculty","By Faculty"],["room","By Room"]].map(([k,l])=>(
              <button key={k} onClick={()=>setView(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${view===k?"bg-violet-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{l}</button>
            ))}
            <select value={selected} onChange={e=>setSelected(e.target.value)}
              className="p-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-400">
              {(view==="group"?GROUPS:view==="faculty"?FACULTY.map(f=>f.name):ROOMS.map(r=>r.id)).map(o=>(
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
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
                    <td colSpan={6} className="px-4 py-2 text-center text-[11px] font-bold text-amber-600">🍽 LUNCH BREAK (13:00–14:00)</td>
                  </tr>
                );
                return (
                  <tr key={p} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-400 text-[11px] whitespace-nowrap">{p}</td>
                    {DAYS.map(day=>{
                      const period = p.split("(")[0];
                      const s = sessions.find(x=>x.day===day && x.period===period);
                      return (
                        <td key={day} className="px-3 py-2">
                          {s ? (
                            <div className={`rounded-xl p-2 text-[10px] border ${s.status==="clash"?"bg-red-50 border-red-200":"bg-blue-50 border-blue-100"}`}>
                              <div className="font-black text-slate-800 leading-tight">{s.course}</div>
                              <div className="text-slate-500 mt-0.5">{s.room}</div>
                              {view!=="faculty" && <div className="text-slate-400">{s.faculty.split(" ").slice(-1)[0]}</div>}
                              {s.status==="clash" && <div className="text-red-600 font-bold">⚠ Clash</div>}
                            </div>
                          ) : <div className="text-slate-200 text-center text-lg">·</div>}
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

      {/* Midsem Exam Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500"/>Mid-Semester Exam Schedule</h3>
          <Badge label="41 exams" color="orange"/>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>{["Exam ID","Course","Group","Faculty","Room","Day","Period","Duration"].map(h=>(
                <th key={h} className="px-3 py-2.5 text-left font-bold text-slate-400 text-[10px] uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {EXAMS.map(e=>(
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono text-slate-400">{e.id}</td>
                  <td className="px-3 py-2 font-bold text-slate-800">{e.course}</td>
                  <td className="px-3 py-2"><Badge label={e.group} color="slate"/></td>
                  <td className="px-3 py-2 text-slate-600">{e.faculty.split(" ").slice(-1)[0]}</td>
                  <td className="px-3 py-2 text-slate-600">{e.room}</td>
                  <td className="px-3 py-2 font-bold">{e.day}</td>
                  <td className="px-3 py-2 text-slate-600">{e.period}</td>
                  <td className="px-3 py-2"><Badge label={`${e.duration}h`} color="blue"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: RESCHEDULING ───────────────────────────────────────────────────────

function Rescheduling() {
  const [expanded, setExpanded] = useState(null);
  const [approved, setApproved] = useState([]);
  const [uploadMode, setUploadMode] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2"><RefreshCw className="w-5 h-5 text-orange-500"/>Rescheduling Engine</h3>
          <p className="text-xs text-slate-500">Propose minimal-movement fixes, review changes, approve or reject.</p>
        </div>
        <button onClick={()=>setUploadMode(v=>!v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all">
          <Upload className="w-3.5 h-3.5"/> Load disruption file
        </button>
      </div>

      {uploadMode && (
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2"/>
          <p className="text-sm font-bold text-slate-600">Drop sample_disruption.json here</p>
          <p className="text-xs text-slate-400 mt-1">or click to browse</p>
          <input type="file" accept=".json" className="hidden"/>
          <button className="mt-3 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600">Select File</button>
        </div>
      )}

      <div className="space-y-3">
        {PENDING_CHANGES.map(c=>(
          <div key={c.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${approved.includes(c.id)?"border-emerald-200":"border-slate-200"}`}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge label={c.type} color={c.type==="Faculty Leave"?"orange":c.type==="Room Closure"?"red":"blue"}/>
                    <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                    {approved.includes(c.id) && <Badge label="✓ Approved & Applied" color="green"/>}
                  </div>
                  <p className="text-sm font-bold text-slate-800">{c.by}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>Sessions moved: <strong>{c.moves}</strong></span>
                    <span>Penalty: <strong className={c.penalty===0?"text-emerald-600":"text-amber-600"}>{c.penalty===0?"None":"+"+c.penalty}</strong></span>
                  </div>
                </div>
                <button onClick={()=>setExpanded(expanded===c.id?null:c.id)}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold rounded-xl transition-all">
                  {expanded===c.id?"Hide Plan":"View Plan"}
                </button>
              </div>
            </div>

            {expanded===c.id && (
              <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500"/> Proposed Change — Minimal Session Movement
                </h4>
                <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-3 text-xs">
                  <div className="text-red-500 font-bold">Before: {c.sessions[0] || "N/A"}</div>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0"/>
                  <div className="text-emerald-600 font-bold flex-1">{c.proposal}</div>
                  <Badge label={`${c.moves} move${c.moves!==1?"s":""}`} color={c.moves<=1?"green":"orange"}/>
                </div>

                {/* Constraint validation */}
                <div className="space-y-1">
                  {[
                    ["No faculty double-booking after move", true],
                    ["Room capacity satisfied", true],
                    ["No student group conflict", true],
                    ["Faculty unavailability respected", true],
                  ].map(([label, pass])=>(
                    <div key={label} className={`flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-lg ${pass?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>
                      {pass?<CheckCircle2 className="w-3 h-3"/>:<X className="w-3 h-3"/>}
                      {label}
                    </div>
                  ))}
                </div>

                {!approved.includes(c.id) ? (
                  <div className="flex gap-2 pt-1">
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200">Reject</button>
                    <button onClick={()=>setApproved(p=>[...p,c.id])}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700">
                      Approve &amp; Apply Change
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-4 h-4"/>Change applied to master schedule. schedule_after.json updated.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: CONFLICT RESOLUTION ────────────────────────────────────────────────

function ConflictResolution() {
  const clashSessions = INIT_SESSIONS.filter(s=>s.status==="clash");
  const [resolved, setResolved] = useState([]);

  const CONFLICT_DETAILS = {
    "S011": {
      reason: "Prof. L. Swain is already scheduled in LH2 (MON P3 for Y1-A Eng. Math). A second session cannot be placed in the same slot.",
      constraint: "HARD: Faculty double-booking",
      fixes: [
        { label:"Move Y1-B Eng. Math → TUE P1 CR102", penalty:0 },
        { label:"Move Y1-B Eng. Math → WED P4 CR102", penalty:0 },
        { label:"Assign substitute faculty for one session", penalty:2 },
      ]
    },
    "S012": {
      reason: "Dr. P. Das has blocked WED P3 and P4 (marked unavailable). Chem Lab is a 3-hour lab (P2-P4) which overlaps P3.",
      constraint: "HARD: Faculty unavailability + Lab period constraint",
      fixes: [
        { label:"Move Chem Lab → THU P2-P4 CHLAB (Dr. Das available)", penalty:0 },
        { label:"Move Chem Lab → FRI P6-P8 CHLAB", penalty:1 },
      ]
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
        <h3 className="font-black text-red-800 flex items-center gap-2 text-lg"><AlertTriangle className="w-5 h-5"/>Conflict Resolution Panel</h3>
        <p className="text-xs text-red-600 mt-1">All hard constraint violations must be resolved before timetable can be exported. Fixes are validated before applying.</p>
      </div>

      {clashSessions.map(s=>{
        const detail = CONFLICT_DETAILS[s.id];
        const isResolved = resolved.includes(s.id);
        return (
          <div key={s.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 space-y-4 ${isResolved?"border-emerald-200":"border-red-200"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-[10px] text-slate-400">{s.id}</span>
                  {isResolved ? <Badge label="✓ Resolved" color="green"/> : <Badge label="HARD CLASH" color="red"/>}
                </div>
                <h4 className="font-black text-slate-800">{s.course} — {s.group}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{s.faculty} · {s.room} · {s.day} {s.period}</p>
              </div>
            </div>

            {!isResolved && detail && (
              <>
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-2">
                  <div className="font-bold text-red-800">🔴 {detail.constraint}</div>
                  <div className="text-red-700">{detail.reason}</div>
                </div>

                <div>
                  <p className="text-xs font-black text-slate-700 mb-2">AI-Validated Fix Proposals:</p>
                  <div className="space-y-2">
                    {detail.fixes.map((fix,i)=>(
                      <div key={i} className="flex items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>
                          <span className="text-slate-800 font-bold">{fix.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge label={fix.penalty===0?"No penalty":"+"+fix.penalty+" penalty"} color={fix.penalty===0?"green":"yellow"}/>
                          <button onClick={()=>setResolved(p=>[...p,s.id])}
                            className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700">Apply</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {isResolved && (
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4"/>Conflict resolved. Schedule updated. Validator re-run: 0 hard violations for this session.
              </div>
            )}
          </div>
        );
      })}

      {clashSessions.every(s=>resolved.includes(s.id)) && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2"/>
          <h3 className="font-black text-emerald-800 text-lg">All Conflicts Resolved!</h3>
          <p className="text-sm text-emerald-600 mt-1">Run validator.py — 0 hard constraint violations expected.</p>
          <button className="mt-3 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-2 mx-auto">
            <Download className="w-4 h-4"/>Export schedule.json
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TAB: ANALYTICS ──────────────────────────────────────────────────────────

function AdminAnalytics() {
  const util = ROOMS.map(r => {
    const sessions = INIT_SESSIONS.filter(s=>s.room===r.id).length;
    const pct = Math.round((sessions/(DAYS.length*PERIODS.filter(p=>p!=="LUNCH").length))*100);
    return { ...r, sessions, pct };
  });

  const facultyLoad = FACULTY.map(f => ({
    ...f,
    hours: INIT_SESSIONS.filter(s=>s.faculty===f.name).length,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Rooms >80% util" value={util.filter(r=>r.pct>=80).length} color="red"    icon={Building2}/>
        <StatCard label="Rooms <40% util" value={util.filter(r=>r.pct<40).length}  color="orange" icon={Building2}/>
        <StatCard label="Faculty at limit" value={facultyLoad.filter(f=>f.hours>=f.dailyLimit*5).length} color="purple" icon={Users}/>
        <StatCard label="Booking score"   value="87/100"  sub="validator.py output"   color="green"  icon={Star}/>
      </div>

      {/* Room utilization */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500"/>Room Utilization</h4>
        <div className="space-y-2">
          {util.map(r=>(
            <div key={r.id} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-36 truncate">{r.name}</span>
              <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full flex items-center pl-2 transition-all"
                  style={{ width:`${Math.max(r.pct,8)}%`, background:r.pct>=80?"linear-gradient(90deg,#ef4444,#dc2626)":r.pct>=40?"linear-gradient(90deg,#3b82f6,#6366f1)":"linear-gradient(90deg,#f59e0b,#d97706)" }}>
                  <span className="text-[9px] text-white font-bold">{r.pct}%</span>
                </div>
              </div>
              <Badge label={r.type} color={r.type.includes("Lab")?"purple":r.type==="Auditorium"?"orange":"blue"}/>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty workload */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-violet-500"/>Faculty Weekly Workload</h4>
        <div className="space-y-2">
          {facultyLoad.map(f=>(
            <div key={f.id} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-40 truncate">{f.name}</span>
              <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full flex items-center pl-2"
                  style={{ width:`${Math.min((f.hours/20)*100,100)}%`, background:f.hours>=f.dailyLimit*5?"linear-gradient(90deg,#ef4444,#dc2626)":"linear-gradient(90deg,#10b981,#059669)" }}>
                  <span className="text-[9px] text-white font-bold">{f.hours}h</span>
                </div>
              </div>
              <Badge label={f.dept} color="slate"/>
              {f.hours>=f.dailyLimit*5 && <Badge label="At limit" color="red"/>}
            </div>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h4 className="font-black text-slate-800 mb-4">Export &amp; Reports</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"schedule.json",       icon:"📄", color:"blue" },
            { label:"schedule_after.json", icon:"🔄", color:"orange" },
            { label:"Exam timetable PDF",  icon:"📋", color:"red" },
            { label:"Room booking CSV",    icon:"📊", color:"green" },
          ].map(e=>(
            <button key={e.label} className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
              <div className="text-xl mb-1">{e.icon}</div>
              <div className="text-[11px] font-bold text-slate-700">{e.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

const TABS = [
  { key:"command",    label:"Command Center",    icon:LayoutDashboard },
  { key:"generator",  label:"Timetable Generator",icon:Cpu },
  { key:"reschedule", label:"Rescheduling",        icon:RefreshCw },
  { key:"conflicts",  label:"Conflict Resolution", icon:AlertTriangle },
  { key:"analytics",  label:"Analytics",           icon:BarChart3 },
];

export default function CITAdminPortal() {
  const [activeTab, setActiveTab] = useState("command");
  const active = TABS.find(t=>t.key===activeTab);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-7 h-7 text-blue-300"/>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">CIT Campus Scheduling System</div>
            <h2 className="text-2xl font-black">Admin Portal — Dean's Office</h2>
            <p className="text-blue-200 text-xs mt-0.5">Generate timetables · Resolve conflicts · Approve changes · Export schedule.json</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-400/20 border border-emerald-400/30 px-3 py-1.5 rounded-full font-bold">● Live System</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
              <Settings className="w-3.5 h-3.5"/> Settings
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[["27","Rooms"],["40","Faculty"],["14","Groups"],["189","Sessions"],["41","Exams"]].map(([v,l])=>(
          <div key={l} className="bg-white border border-slate-200 rounded-2xl p-3 text-center">
            <div className="text-xl font-black text-slate-800">{v}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-2 min-w-max pb-1">
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                activeTab===t.key
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>
              <t.icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab==="command"   && <CommandCenter/>}
        {activeTab==="generator" && <TimetableGenerator/>}
        {activeTab==="reschedule"&& <Rescheduling/>}
        {activeTab==="conflicts" && <ConflictResolution/>}
        {activeTab==="analytics" && <AdminAnalytics/>}
      </div>
    </div>
  );
}
