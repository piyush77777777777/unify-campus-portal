import React, { useState } from "react";
import { Star, Send, CheckCircle2, Lock, AlertTriangle } from "lucide-react";

const TEACHERS=[
  {id:"t1",name:"Dr. Avinash Kumar",subject:"Operating Systems",code:"CST301",avg:4.3,total:38},
  {id:"t2",name:"Prof. M. Behera",subject:"Algorithms",code:"CST302",avg:4.1,total:35},
  {id:"t3",name:"Prof. S. Panda",subject:"DBMS",code:"CST303",avg:4.5,total:41},
  {id:"t4",name:"Prof. A. Mohanty",subject:"Software Engineering",code:"CST304",avg:3.8,total:30},
  {id:"t5",name:"Dr. R. Nayak",subject:"Computer Networks",code:"CST305",avg:4.2,total:37},
  {id:"t6",name:"Dr. P. Das",subject:"Machine Learning",code:"CSE401",avg:4.7,total:42},
];
const CRITERIA=[
  {key:"teaching",label:"Teaching Quality",hint:"Explanation clarity, examples, engagement"},
  {key:"punctual",label:"Punctuality & Regularity",hint:"On time, consistent attendance"},
  {key:"knowledge",label:"Subject Knowledge",hint:"Depth, accuracy, updated content"},
  {key:"support",label:"Student Support",hint:"Doubt clearing, approachability"},
  {key:"material",label:"Study Material",hint:"Notes, slides, references provided"},
];
const ATTENDANCE=84.5;

export default function TeacherFeedback(){
  const [selected,setSelected]=useState(null);
  const [ratings,setRatings]=useState({});
  const [comment,setComment]=useState("");
  const [anon,setAnon]=useState(true);
  const [submitted,setSubmitted]=useState([]);
  const [done,setDone]=useState(false);

  const allRated=CRITERIA.every(c=>ratings[c.key]);
  const avg=allRated?(Object.values(ratings).reduce((s,v)=>s+v,0)/CRITERIA.length).toFixed(1):null;

  const submit=()=>{
    if(!allRated)return;
    setSubmitted(p=>[...p,selected.id]);setDone(true);
    setTimeout(()=>{setDone(false);setSelected(null);setRatings({});setComment("");},3000);
  };

  if(ATTENDANCE<75) return(
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white rounded-3xl p-8 text-center shadow-xl">
        <Lock className="w-14 h-14 text-slate-400 mx-auto mb-4"/>
        <h2 className="text-2xl font-black text-slate-200">Feedback Locked 🔒</h2>
        <p className="text-sm text-slate-400 mt-2">Your attendance: <strong className="text-red-400">{ATTENDANCE}%</strong></p>
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-2"/>
          <p className="text-xs text-red-300">Minimum <strong>75% attendance</strong> required to submit teacher feedback.</p>
        </div>
      </div>
    </div>
  );

  if(selected) return(
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="font-black text-xl">{selected.name}</div>
        <div className="text-xs text-amber-100/80 mt-1">{selected.subject} • {selected.code}</div>
        {avg&&<div className="mt-2 text-3xl font-black text-amber-300">{avg} ⭐</div>}
      </div>
      {done?(
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3"/>
          <h3 className="font-black text-slate-900 text-xl">Feedback Submitted!</h3>
          <p className="text-xs text-slate-500 mt-2">{anon?"Submitted anonymously.":""} Thank you for helping improve teaching quality.</p>
        </div>
      ):(
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Rate {selected.name}</h3>
            <button onClick={()=>{setSelected(null);setRatings({});}} className="text-xs text-blue-600 font-bold">← Back</button>
          </div>
          {CRITERIA.map(c=>(
            <div key={c.key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">{c.label}</label>
                {ratings[c.key]&&<span className="text-xs font-black text-amber-600">{ratings[c.key]}/5</span>}
              </div>
              <p className="text-[10px] text-slate-400 mb-2">{c.hint}</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(v=>(
                  <button key={v} onClick={()=>setRatings(r=>({...r,[c.key]:v}))}
                    className={`flex-1 py-2.5 rounded-xl transition-all font-bold ${ratings[c.key]>=v?"bg-amber-400 text-white shadow shadow-amber-200":"bg-slate-100 text-slate-400 hover:bg-amber-100"}`}>
                    <Star className={`w-4 h-4 mx-auto ${ratings[c.key]>=v?"fill-white":"fill-transparent"}`}/>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Comments (optional)</label>
            <textarea rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your experience, suggestions for improvement..." className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"/>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anon" checked={anon} onChange={e=>setAnon(e.target.checked)} className="w-4 h-4 accent-amber-500"/>
            <label htmlFor="anon" className="text-xs text-slate-600 font-medium">Submit anonymously (recommended)</label>
          </div>
          <button onClick={submit} disabled={!allRated} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all">
            <Send className="w-4 h-4"/> Submit Feedback
          </button>
        </div>
      )}
    </div>
  );

  return(
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-500/30 mb-3">
          <Star className="w-3.5 h-3.5"/> Attendance: {ATTENDANCE}% ✓ Eligible
        </div>
        <h2 className="text-2xl font-black">Teacher Feedback System ⭐</h2>
        <p className="text-xs text-amber-100/80 mt-1">Anonymous • Confidential • Impactful — Only 75%+ attendance students can submit</p>
      </div>
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0"/>
        <p className="text-xs text-emerald-800"><strong>You are eligible!</strong> Your {ATTENDANCE}% attendance meets the 75% minimum requirement to give feedback.</p>
      </div>
      <div className="space-y-3">
        {TEACHERS.map(t=>(
          <div key={t.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${submitted.includes(t.id)?"border-emerald-300 bg-emerald-50/30":"border-slate-200 hover:border-amber-300 hover:shadow-md"}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                  {submitted.includes(t.id)&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">✓ Submitted</span>}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{t.subject} • {t.code}</div>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500"/>
                  <span className="text-xs font-bold text-slate-700">{t.avg}</span>
                  <span className="text-xs text-slate-400">({t.total} ratings)</span>
                </div>
              </div>
              {!submitted.includes(t.id)?(
                <button onClick={()=>{setSelected(t);setRatings({});setComment("");setDone(false);}} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex-shrink-0">Rate</button>
              ):(
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0"/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}