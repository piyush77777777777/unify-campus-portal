import React, { useState, useRef, useEffect } from "react";
import { Calendar, Clock, Send, CheckCircle2, X, Brain, BookOpen, AlertTriangle, Bell, Plus, Edit3, Mic, Lightbulb, ChevronDown } from "lucide-react";

const MY_SESSIONS = [
  { id:"S001", course:"Data Structures",  group:"Y2-CSE", room:"LH1",    day:"MON", period:"P1(08:00)", type:"Lecture" },
  { id:"S007", course:"Algorithms",       group:"Y3-CSE", room:"LH2",    day:"FRI", period:"P2(09:00)", type:"Lecture" },
  { id:"S010", course:"DBMS",             group:"Y2-CSE", room:"CR201",  day:"WED", period:"P4(11:00)", type:"Lecture" },
  { id:"S011", course:"CS Lab",           group:"Y2-CSE", room:"CSLAB1", day:"TUE", period:"P2(09:00)", type:"Lab" },
];

const PERIODS = ["P1(08:00)","P2(09:00)","P3(10:00)","P4(11:00)","P5(12:00)","LUNCH","P6(14:00)","P7(15:00)","P8(16:00)","P9(17:00)"];
const DAYS = ["MON","TUE","WED","THU","FRI"];

const AI_REPLIES = {
  "extra class": "✅ I found an available slot: **THU P7 in Room CR103** (cap 60, Y2-CSE free that period). Shall I submit this as an extra class request to Admin for approval?",
  "leave":       "📋 To mark leave for **Mon Nov 10**: Your sessions S001 (DS Mon P1) will be flagged for rescheduling. Admin will be notified. Proposed reschedule: **THU P4 LH2** (0 clashes). Confirm?",
  "reschedule":  "🔄 Rescheduling DS from **Mon P1** to **Thu P4**: validated — no faculty clash, room LH2 free, Y2-CSE free that slot. Penalty: 0. Submit to Admin for approval?",
  "clash":       "⚠ Checking your schedule… No hard clashes found. However, you have **2 sessions on Friday** (P2 + P6) with no break — soft constraint violation (−2 pts). Want me to suggest a swap?",
  "friday":      "📅 Your Friday sessions: Algorithms P2 in LH2. You have P3-P5 free. Then no P6 session. Light day — only 1 session!",
  "unavailability": "🚫 To block **Mon P1 and P2**: I'll mark these as unavailable in the system. Existing session S001 (Mon P1) conflicts — needs rescheduling first. Proceed?",
  "default":     "🤖 Understood! Let me check the schedule database… **Tip:** Try asking me to *book an extra class*, *request leave*, *reschedule a session*, or *check my conflicts*."
};

const HINGLISH_PROMPTS = [
  "Monday ko leave chahiye mujhe",
  "Extra class book karo CS ke liye",
  "Mera schedule check karo clashes ke liye",
  "Friday ko koi class nahi rakhna",
  "DS class ko Thursday pe shift karo",
];

export default function CITFacultyPortal() {
  const [tab, setTab] = useState("timetable");

  // AI Chat
  const [messages, setMessages] = useState([
    { role:"ai", text:"👋 Hello! I'm your **AI Scheduling Copilot**. I can help you request extra classes, mark leave, reschedule sessions, and check conflicts.\n\nAsk in English or Hinglish!" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const txt = input.trim();
    setMessages(p => [...p, { role:"user", text:txt }]);
    setInput("");
    setTimeout(() => {
      const key = Object.keys(AI_REPLIES).find(k => txt.toLowerCase().includes(k));
      setMessages(p => [...p, { role:"ai", text: AI_REPLIES[key] || AI_REPLIES.default }]);
    }, 700);
  };

  // Leave request form
  const [leaveForm, setLeaveForm] = useState({ from:"", to:"", reason:"", type:"Personal" });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Extra class form
  const [extraForm, setExtraForm] = useState({ course:"", group:"", day:"", period:"", room:"", note:"" });
  const [extraSubmitted, setExtraSubmitted] = useState(false);

  // Unavailability
  const [unavail, setUnavail] = useState([{ day:"MON", period:"P1", saved:false }]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-cyan-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-7 h-7 text-teal-300"/>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-teal-300 uppercase tracking-widest">CIT — Faculty Portal</div>
            <h2 className="text-2xl font-black">Dr. A. Panda — CSE Department</h2>
            <p className="text-teal-200 text-xs">My timetable · Leave &amp; unavailability · Extra class · AI Copilot</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-teal-200">Weekly load</div>
            <div className="text-2xl font-black">{MY_SESSIONS.length}<span className="text-sm font-normal text-teal-300"> / 20h</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit flex-wrap">
        {[["timetable","📅 My Timetable"],["extra","➕ Extra Class"],["leave","🏖 Leave Request"],["unavail","🚫 Unavailability"],["ai","🤖 AI Copilot"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${tab===k?"bg-white text-teal-700 shadow":"text-slate-600 hover:text-slate-900"}`}>{l}</button>
        ))}
      </div>

      {/* ── TIMETABLE ── */}
      {tab==="timetable" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-500"/>My Weekly Schedule</h3>
              <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-1 rounded-full font-bold">{MY_SESSIONS.length} sessions this week</span>
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
                        <td colSpan={6} className="px-4 py-2 text-center text-[11px] font-bold text-amber-600">🍽 LUNCH (13:00–14:00)</td>
                      </tr>
                    );
                    return (
                      <tr key={p} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-400 text-[11px] whitespace-nowrap">{p}</td>
                        {DAYS.map(day=>{
                          const period = p.split("(")[0];
                          const s = MY_SESSIONS.find(x=>x.day===day && x.period===p);
                          return (
                            <td key={day} className="px-3 py-2">
                              {s ? (
                                <div className="rounded-xl p-2.5 text-[10px] bg-teal-50 border border-teal-200">
                                  <div className="font-black text-slate-800">{s.course}</div>
                                  <div className="text-slate-500">{s.room}</div>
                                  <div className="text-teal-600 font-bold">{s.group}</div>
                                  <div className="mt-1">
                                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${s.type==="Lab"?"bg-purple-100 text-purple-700":"bg-blue-100 text-blue-700"}`}>{s.type}</span>
                                  </div>
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

          {/* Session list */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-black text-slate-800 mb-3">Session Details</h4>
            <div className="space-y-2">
              {MY_SESSIONS.map(s=>(
                <div key={s.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${s.type==="Lab"?"bg-purple-100":"bg-teal-100"}`}>
                      <BookOpen className={`w-4 h-4 ${s.type==="Lab"?"text-purple-600":"text-teal-600"}`}/>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800">{s.course}</div>
                      <div className="text-[11px] text-slate-500">{s.day} · {s.period} · {s.room} · {s.group}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.type==="Lab"?"bg-purple-100 text-purple-700":"bg-teal-100 text-teal-700"}`}>{s.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EXTRA CLASS ── */}
      {tab==="extra" && (
        <div className="max-w-lg">
          {extraSubmitted ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto"/>
              <h3 className="font-black text-slate-800 text-lg">Extra Class Requested!</h3>
              <p className="text-xs text-slate-500">Sent to Admin &amp; Department Coordinator for approval.<br/>The scheduling engine will validate constraints before applying.</p>
              <button onClick={()=>{ setExtraSubmitted(false); setExtraForm({ course:"",group:"",day:"",period:"",room:"",note:"" }); }}
                className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl text-sm hover:bg-teal-700">Submit Another</button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2"><Plus className="w-4 h-4 text-teal-500"/>Request Extra / Makeup Class</h3>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                ℹ All manually scheduled extra sessions are strictly validated against hard constraints by the scheduling engine before Admin approval.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key:"course", label:"Course *",       placeholder:"e.g. Data Structures" },
                  { key:"group",  label:"Student Group *", placeholder:"e.g. Y2-CSE" },
                  { key:"note",   label:"Reason",          placeholder:"e.g. Missed class due to leave" },
                ].map(f=>(
                  <div key={f.key} className={f.key==="note"?"sm:col-span-2":""}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{f.label}</label>
                    <input value={extraForm[f.key]} onChange={e=>setExtraForm(p=>({...p,[f.key]:e.target.value}))}
                      placeholder={f.placeholder} className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"/>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Day</label>
                  <select value={extraForm.day} onChange={e=>setExtraForm(p=>({...p,day:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none">
                    <option value="">-- Any day --</option>
                    {DAYS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Period</label>
                  <select value={extraForm.period} onChange={e=>setExtraForm(p=>({...p,period:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none">
                    <option value="">-- Any period --</option>
                    {["P1","P2","P3","P4","P5","P6","P7","P8","P9"].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Constraint check preview */}
              {extraForm.course && extraForm.group && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <p className="text-[11px] font-black text-emerald-800">Pre-submission Constraint Check:</p>
                  {[
                    "No existing session for this faculty at selected slot",
                    "No student group conflict detected",
                    "Room capacity check will run on submission",
                    "Daily teaching limit (4h) within bounds",
                  ].map(c=>(
                    <div key={c} className="flex items-center gap-2 text-[11px] text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0"/>
                      {c}
                    </div>
                  ))}
                </div>
              )}

              <button onClick={()=>{ if(extraForm.course&&extraForm.group) setExtraSubmitted(true); }}
                disabled={!extraForm.course||!extraForm.group}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-black rounded-xl text-sm transition-all">
                Submit Extra Class Request
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── LEAVE REQUEST ── */}
      {tab==="leave" && (
        <div className="max-w-lg">
          {leaveSubmitted ? (
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto"/>
              <h3 className="font-black text-slate-800 text-lg">Leave Request Submitted!</h3>
              <p className="text-xs text-slate-500">Admin has been notified. Affected sessions will be flagged for auto-rescheduling. You'll be notified once approved.</p>
              <button onClick={()=>{ setLeaveSubmitted(false); setLeaveForm({ from:"",to:"",reason:"",type:"Personal" }); }}
                className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700">Submit Another</button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/>Faculty Leave Request</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
                <div className="flex gap-2 flex-wrap">
                  {["Personal","Medical","Conference","Other"].map(t=>(
                    <button key={t} onClick={()=>setLeaveForm(p=>({...p,type:t}))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${leaveForm.type===t?"bg-teal-600 text-white border-teal-600":"bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">From Date *</label>
                  <input type="date" value={leaveForm.from} onChange={e=>setLeaveForm(p=>({...p,from:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">To Date *</label>
                  <input type="date" value={leaveForm.to} onChange={e=>setLeaveForm(p=>({...p,to:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason *</label>
                <textarea rows={3} value={leaveForm.reason} onChange={e=>setLeaveForm(p=>({...p,reason:e.target.value}))}
                  placeholder="Briefly describe the reason for leave…"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none resize-none"/>
              </div>

              {leaveForm.from && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-800">
                  <p className="font-bold mb-1">⚠ Sessions affected by leave:</p>
                  {MY_SESSIONS.slice(0,2).map(s=>(
                    <div key={s.id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"/>
                      {s.course} — {s.day} {s.period} → Will be flagged for rescheduling
                    </div>
                  ))}
                  <p className="mt-1 text-orange-600">Rescheduling proposals will be auto-generated and sent to Admin.</p>
                </div>
              )}

              <button onClick={()=>{ if(leaveForm.from&&leaveForm.reason) setLeaveSubmitted(true); }}
                disabled={!leaveForm.from||!leaveForm.reason}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-black rounded-xl text-sm transition-all">
                Submit Leave Request
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── UNAVAILABILITY ── */}
      {tab==="unavail" && (
        <div className="max-w-lg space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2"><X className="w-4 h-4 text-red-500"/>Mark Unavailability</h3>
            <p className="text-xs text-slate-500">Mark periods when you cannot take sessions. The scheduler will treat these as hard constraints — no sessions will be assigned at these times.</p>

            {unavail.map((u,i)=>(
              <div key={i} className="flex items-center gap-3">
                <select value={u.day} onChange={e=>setUnavail(prev=>prev.map((x,j)=>j===i?{...x,day:e.target.value}:x))}
                  className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400">
                  {DAYS.map(d=><option key={d}>{d}</option>)}
                </select>
                <select value={u.period} onChange={e=>setUnavail(prev=>prev.map((x,j)=>j===i?{...x,period:e.target.value}:x))}
                  className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400">
                  {["P1","P2","P3","P4","P5","P6","P7","P8","P9"].map(p=><option key={p}>{p}</option>)}
                </select>
                {u.saved ? (
                  <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1 flex-shrink-0"><CheckCircle2 className="w-3.5 h-3.5"/>Saved</span>
                ) : (
                  <button onClick={()=>setUnavail(prev=>prev.map((x,j)=>j===i?{...x,saved:true}:x))}
                    className="px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 flex-shrink-0">Save</button>
                )}
                <button onClick={()=>setUnavail(prev=>prev.filter((_,j)=>j!==i))}>
                  <X className="w-4 h-4 text-slate-400 hover:text-red-500"/>
                </button>
              </div>
            ))}

            <button onClick={()=>setUnavail(p=>[...p,{day:"MON",period:"P1",saved:false}])}
              className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700">
              <Plus className="w-4 h-4"/>Add another period
            </button>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700">
              ✅ Saved unavailability periods are instantly reflected in the constraint solver. Any existing sessions in those slots will be flagged for rescheduling.
            </div>
          </div>
        </div>
      )}

      {/* ── AI COPILOT ── */}
      {tab==="ai" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5">
            <h3 className="font-black text-xl flex items-center gap-2"><Brain className="w-5 h-5 text-emerald-300"/>AI Scheduling Copilot</h3>
            <p className="text-emerald-200 text-xs mt-1">Ask in English or Hinglish · All AI proposals are code-validated before submission</p>
            <div className="mt-3 p-2.5 bg-white/10 rounded-xl text-[10px] text-emerald-200 flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"/>
              <span><strong>Important:</strong> The AI reads your request and suggests options, but every schedule change is validated by the constraint engine — the AI cannot bypass any hard constraint.</span>
            </div>
          </div>

          {/* Hinglish quick prompts */}
          <div className="flex gap-2 flex-wrap">
            {HINGLISH_PROMPTS.map(p=>(
              <button key={p} onClick={()=>setInput(p)}
                className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-xl hover:bg-emerald-100">{p}</button>
            ))}
          </div>

          {/* Chat */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {messages.map((m,i)=>(
                <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                  <div className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${m.role==="user"?"bg-teal-600 text-white rounded-br-sm":"bg-slate-100 text-slate-800 rounded-bl-sm"}`}>
                    {m.text.split("\n").map((line,li)=>(
                      <p key={li} className={li>0?"mt-1":""}
                        dangerouslySetInnerHTML={{ __html:line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>") }}/>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}/>
            </div>
            <div className="border-t border-slate-100 p-3 flex gap-2">
              <button onClick={()=>setListening(l=>!l)}
                className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${listening?"bg-red-500 text-white animate-pulse":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                <Mic className="w-4 h-4"/>
              </button>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
                placeholder="Ask in English or Hinglish…"
                className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"/>
              <button onClick={sendMsg} className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all">
                <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>

          {/* Explainable AI section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500"/>Ask Why — Explainable AI</h4>
            <div className="space-y-2">
              {[
                { q:"Why is my DS class at P1 (8 AM)?", a:"Data Structures for Y2-CSE was placed at P1 MON because: LH1 is free, no group conflict, and your availability starts P1. Soft constraint note: P1 has slightly lower student alertness — consider requesting a swap to P2 if preferred." },
                { q:"Why was my extra class request placed in CR103?", a:"CS Lab was unavailable (booked by Y3-CSE). Classrooms CR101 and CR102 were occupied by concurrent sessions. CR103 (cap 60) was the next available room matching the session type (Lecture) and size (52 students)." },
              ].map((item,i)=>(
                <details key={i} className="bg-yellow-50 border border-yellow-200 rounded-xl overflow-hidden">
                  <summary className="px-4 py-3 text-xs font-bold text-slate-700 cursor-pointer hover:bg-yellow-100">❓ {item.q}</summary>
                  <div className="px-4 pb-3 text-[11px] text-slate-600 leading-relaxed border-t border-yellow-200 pt-2">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
