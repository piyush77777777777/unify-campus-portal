import React, { useState } from "react";
import { CheckCircle2, BookOpen, Save, Users } from "lucide-react";

const SESSIONS=[
  {id:"s1",subject:"Operating Systems",code:"CST301",section:"CSE-A",room:"B-301",time:"09:00-10:00"},
  {id:"s2",subject:"Algorithms",code:"CST302",section:"CSE-B",room:"B-302",time:"10:00-11:00"},
  {id:"s3",subject:"Machine Learning",code:"CSE401",section:"CSE-A",room:"B-303",time:"02:00-04:00"},
];
const ROLL=[
  {regNo:"2201106145",name:"Piyush Kumar Dey",attended:38,total:42},
  {regNo:"2201106098",name:"Rohan Samal",attended:28,total:42},
  {regNo:"2201106201",name:"Priya Dash",attended:36,total:42},
  {regNo:"2201106312",name:"Amit Jena",attended:30,total:42},
  {regNo:"2201106401",name:"Sneha Patra",attended:40,total:42},
  {regNo:"2201106502",name:"Bibhuti Bhusan",attended:35,total:42},
  {regNo:"2201106603",name:"Deepika Mohapatra",attended:42,total:42},
  {regNo:"2201106704",name:"Rajan Mishra",attended:25,total:42},
  {regNo:"2201106805",name:"Suman Das",attended:37,total:42},
  {regNo:"2201106906",name:"Kavitha Nair",attended:41,total:42},
];

export default function ClassAttendance(){
  const [session,setSession]=useState(null);
  const [att,setAtt]=useState({});
  const [saved,setSaved]=useState(false);
  const [q,setQ]=useState("");

  const start=(s)=>{setSession(s);const a={};ROLL.forEach(r=>{a[r.regNo]=null;});setAtt(a);setSaved(false);};
  const mark=(rn,v)=>setAtt(a=>({...a,[rn]:v}));
  const markAll=(v)=>{const a={};ROLL.forEach(r=>{a[r.regNo]=v;});setAtt(a);};
  const P=Object.values(att).filter(v=>v==="P").length;
  const A=Object.values(att).filter(v=>v==="A").length;
  const L=Object.values(att).filter(v=>v==="L").length;
  const marked=Object.values(att).filter(v=>v!==null).length;
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);};
  const filtered=ROLL.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.regNo.includes(q));

  if(!session) return(
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-500/30 mb-3">
          <BookOpen className="w-3.5 h-3.5"/> Per-Class Attendance — No QR Code Needed
        </div>
        <h2 className="text-2xl font-black">Take Class Attendance 📋</h2>
        <p className="text-xs text-emerald-100/80 mt-1">Mark P / A / L per student per class — real-time sync</p>
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900">Select Class Session</h3>
        {SESSIONS.map(s=>(
          <button key={s.id} onClick={()=>start(s)} className="w-full bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 hover:shadow-md text-left transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{s.subject} <span className="text-xs font-mono text-slate-400 ml-1">{s.code}</span></div>
                <div className="text-xs text-slate-500 mt-1">{s.section} • Room {s.room} • {s.time}</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold group-hover:bg-emerald-700 transition-all">Start →</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return(
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="font-black text-xl">{session.subject}</div>
        <div className="text-xs text-emerald-100/80 mt-1">{session.section} • Room {session.room} • {session.time}</div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-xl font-black text-emerald-300">{P}</div><div className="text-xs text-emerald-200">Present</div></div>
          <div className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-xl font-black text-red-300">{A}</div><div className="text-xs text-red-200">Absent</div></div>
          <div className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-xl font-black text-amber-300">{L}</div><div className="text-xs text-amber-200">Late</div></div>
          <div className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-xl font-black">{ROLL.length-marked}</div><div className="text-xs text-emerald-200">Pending</div></div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={()=>markAll("P")} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">✓ All Present</button>
        <button onClick={()=>markAll("A")} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">✗ All Absent</button>
        <button onClick={()=>setSession(null)} className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold">← Back</button>
      </div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search student..." className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
      <div className="space-y-2">
        {filtered.map(s=>{
          const pct=Math.round((s.attended/s.total)*100);
          const np=att[s.regNo]==="P"?Math.round(((s.attended+1)/(s.total+1))*100):att[s.regNo]==="A"?Math.round((s.attended/(s.total+1))*100):pct;
          const st=att[s.regNo];
          return(
            <div key={s.regNo} className={`bg-white rounded-2xl p-4 border-2 transition-all ${st==="P"?"border-emerald-400 bg-emerald-50/30":st==="A"?"border-red-300 bg-red-50/30":st==="L"?"border-amber-300 bg-amber-50/30":"border-slate-200"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 flex-shrink-0">{s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm truncate">{s.name}</div>
                  <div className="text-[10px] text-slate-500">{s.regNo}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-16 bg-slate-100 rounded-full"><div className={`h-1 rounded-full ${np>=75?"bg-emerald-500":np>=60?"bg-amber-500":"bg-red-500"}`} style={{width:`${np}%`}}/></div>
                    <span className={`text-[10px] font-bold ${np>=75?"text-emerald-700":np>=60?"text-amber-700":"text-red-700"}`}>{np}%</span>
                    {np<75&&<span className="text-[9px] text-red-600 font-bold">⚠ Below cutoff</span>}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {["P","A","L"].map(v=>(
                    <button key={v} onClick={()=>mark(s.regNo,v)} className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${st===v?(v==="P"?"bg-emerald-500 text-white shadow-md":v==="A"?"bg-red-500 text-white shadow-md":"bg-amber-500 text-white shadow-md"):"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{v}</button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={save} className={`w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${saved?"bg-emerald-500":"bg-emerald-600 hover:bg-emerald-700"}`}>
        {saved?<><CheckCircle2 className="w-5 h-5"/> Attendance Saved!</>:<><Save className="w-5 h-5"/> Save Attendance ({marked}/{ROLL.length} marked)</>}
      </button>
    </div>
  );
}