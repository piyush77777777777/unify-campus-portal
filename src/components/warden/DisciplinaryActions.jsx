import React, { useState } from "react";
import { Shield, AlertTriangle, Send, CheckCircle2, User, Bell, Clock } from "lucide-react";

const STUDENTS=[
  {regNo:"2201106145",name:"Piyush Kumar Dey",room:"B-304",hostel:"Aryabhatta Hall",parentPhone:"+91 94370 12345"},
  {regNo:"2201106098",name:"Rohan Samal",room:"A-112",hostel:"Aryabhatta Hall",parentPhone:"+91 98765 43210"},
  {regNo:"2201106201",name:"Priya Dash",room:"C-205",hostel:"Saraswati Hall",parentPhone:"+91 91234 56789"},
  {regNo:"2201106312",name:"Amit Jena",room:"B-108",hostel:"Aryabhatta Hall",parentPhone:"+91 87654 32109"},
];
const OFFENCES=[
  {label:"Smoking/Tobacco in Campus",fine:500,severity:"HIGH"},
  {label:"Alcohol/Drinking in Campus",fine:2000,severity:"CRITICAL"},
  {label:"Ragging / Bullying",fine:5000,severity:"CRITICAL"},
  {label:"Gate Pass Violation (Drinking/Smoking Outside)",fine:1500,severity:"CRITICAL"},
  {label:"Late Night Outing without Pass",fine:300,severity:"MEDIUM"},
  {label:"Unauthorized Absence",fine:200,severity:"MEDIUM"},
  {label:"Property Damage",fine:1000,severity:"HIGH"},
  {label:"Dress Code Violation",fine:100,severity:"LOW"},
  {label:"Noise Disturbance / Quarrel",fine:300,severity:"MEDIUM"},
];
const SEV={CRITICAL:"bg-red-100 text-red-700 border-red-200",HIGH:"bg-orange-100 text-orange-700 border-orange-200",MEDIUM:"bg-amber-100 text-amber-700 border-amber-200",LOW:"bg-slate-100 text-slate-600 border-slate-200"};

export default function DisciplinaryActions(){
  const [records,setRecords]=useState([
    {id:"DISC-001",student:"Rohan Samal",regNo:"2201106098",offence:"Alcohol/Drinking in Campus",fine:2000,date:"Oct 8, 2026",severity:"CRITICAL",notified:true},
    {id:"DISC-002",student:"Amit Jena",regNo:"2201106312",offence:"Gate Pass Violation (Drinking/Smoking Outside)",fine:1500,date:"Oct 6, 2026",severity:"CRITICAL",notified:true},
  ]);
  const [tab,setTab]=useState("records");
  const [form,setForm]=useState({regNo:"",offence:"",customFine:"",remarks:""});
  const [issued,setIssued]=useState(false);

  const stu=STUDENTS.find(s=>s.regNo===form.regNo);
  const off=OFFENCES.find(o=>o.label===form.offence);
  const finalFine=form.customFine||off?.fine||0;

  const handleIssue=()=>{
    if(!form.regNo||!form.offence)return;
    const r={id:`DISC-00${records.length+3}`,student:stu?.name||form.regNo,regNo:form.regNo,offence:form.offence,fine:Number(finalFine),date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),severity:off?.severity||"MEDIUM",notified:true};
    setRecords(p=>[r,...p]);setIssued(true);
    setTimeout(()=>{setIssued(false);setForm({regNo:"",offence:"",customFine:"",remarks:""});},3000);
  };

  return(
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-bold border border-red-500/30 mb-3">
          <Shield className="w-3.5 h-3.5"/> Warden — Disciplinary Control Panel
        </div>
        <h2 className="text-2xl font-black">Disciplinary Actions & Fines 🚫</h2>
        <p className="text-xs text-red-100/80 mt-1">Issue fines for misconduct — auto-notifies parents via SMS & Email</p>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-xl font-black">{records.length}</div><div className="text-xs text-red-200">Total Cases</div></div>
          <div className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-xl font-black text-red-300">{records.filter(r=>r.severity==="CRITICAL").length}</div><div className="text-xs text-red-200">Critical</div></div>
          <div className="bg-white/10 rounded-2xl p-3 text-center"><div className="text-xl font-black text-amber-300">₹{records.reduce((s,r)=>s+r.fine,0).toLocaleString()}</div><div className="text-xs text-red-200">Total Fines</div></div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {["records","issue"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab===t?"bg-white text-red-700 shadow":"text-slate-600 hover:text-slate-900"}`}>
            {t==="issue"?"Issue Fine / Action":"Records"}
          </button>
        ))}
      </div>

      {tab==="records"&&(
        <div className="space-y-3">
          {records.map(r=>(
            <div key={r.id} className={`bg-white rounded-2xl p-5 border-2 shadow-sm ${r.severity==="CRITICAL"?"border-red-200":r.severity==="HIGH"?"border-orange-200":"border-slate-200"}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400">{r.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${SEV[r.severity]}`}>{r.severity}</span>
                    {r.notified&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1"><Bell className="w-2.5 h-2.5"/>Parent Notified</span>}
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{r.student} <span className="text-slate-400 font-normal text-xs">({r.regNo})</span></div>
                  <div className="text-sm text-slate-600 mt-0.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0"/>{r.offence}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-black text-red-700">₹{r.fine.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end"><Clock className="w-3 h-3"/>{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="issue"&&(
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 max-w-lg space-y-5">
          {issued?(
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600"/></div>
              <h3 className="font-bold text-slate-900">Fine Issued!</h3>
              <p className="text-xs text-slate-500">Parent has been notified via SMS & Email. Record saved to system.</p>
            </div>
          ):(
            <>
              <h3 className="font-bold text-slate-900">Issue Disciplinary Fine</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
                <select value={form.regNo} onChange={e=>setForm(p=>({...p,regNo:e.target.value}))} className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none">
                  <option value="">-- Select Student --</option>
                  {STUDENTS.map(s=><option key={s.regNo} value={s.regNo}>{s.name} ({s.regNo}) — Room {s.room}</option>)}
                </select>
              </div>
              {stu&&<div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center gap-3"><User className="w-5 h-5 text-blue-600"/><div className="text-xs"><div className="font-bold text-blue-900">{stu.name}</div><div className="text-blue-700">{stu.hostel} • Room {stu.room}</div><div className="text-blue-600 font-bold">Parent: {stu.parentPhone}</div></div></div>}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offence Type</label>
                <select value={form.offence} onChange={e=>setForm(p=>({...p,offence:e.target.value,customFine:""}))} className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none">
                  <option value="">-- Select Offence --</option>
                  {OFFENCES.map(o=><option key={o.label} value={o.label}>{o.label} — ₹{o.fine} ({o.severity})</option>)}
                </select>
              </div>
              {off&&<div className={`p-3 rounded-2xl border ${SEV[off.severity]} flex items-center gap-2`}><AlertTriangle className="w-4 h-4"/><div className="text-xs font-bold">Fine: ₹{off.fine} — Severity: {off.severity}</div></div>}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Override Fine Amount (₹)</label>
                <input type="number" value={form.customFine} onChange={e=>setForm(p=>({...p,customFine:e.target.value}))} placeholder={off?.fine||"e.g. 500"} className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Incident Details / Evidence</label>
                <textarea rows={3} value={form.remarks} onChange={e=>setForm(p=>({...p,remarks:e.target.value}))} placeholder="Describe the incident in detail (time, place, witnesses)..." className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none resize-none"/>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
                <Bell className="w-3.5 h-3.5 inline mr-1"/><strong>Auto-notification:</strong> SMS + Email sent to parent immediately after issuing fine.
              </div>
              <button onClick={handleIssue} disabled={!form.regNo||!form.offence} className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
                <Send className="w-4 h-4"/> Issue Fine & Notify Parent
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}