import React, { useState } from "react";
import { Calendar, Building2, CheckCircle2, X, Clock, AlertTriangle, Send, Star, Bell, Zap, Filter, Eye, Hash, Users, ArrowRight } from "lucide-react";

// Priority rules per spec Section 4
const PRIORITY = ["Exams","Regular Classes","Institute Events","Guest Lectures","Department Events","Club Events"];

const ROOMS_AVAIL = [
  { id:"AUD",  name:"Auditorium",        cap:400, type:"Auditorium",   periods:["P10","P11","P12","P13"] },
  { id:"SH1",  name:"Seminar Hall 1",    cap:150, type:"Seminar Hall",  periods:["P6","P7","P8","P9","P10","P11"] },
  { id:"SH2",  name:"Seminar Hall 2",    cap:100, type:"Seminar Hall",  periods:["P6","P7","P8","P9","P10","P11"] },
  { id:"OAT",  name:"Open-Air Theatre",  cap:300, type:"Open-Air",      periods:["P6","P7","P8","P9","P10","P11","P12"] },
  { id:"CSLAB1",name:"CS Lab 1",         cap:40,  type:"CS Lab",        periods:["P6","P7","P8"] },
  { id:"CSLAB2",name:"CS Lab 2",         cap:40,  type:"CS Lab",        periods:["P6","P7","P8"] },
  { id:"LH1",  name:"Lecture Hall 1",    cap:120, type:"Lecture Hall",  periods:["P10","P11"] },
];

const SPECTRA_REQUESTS = [
  { id:"SR001", club:"IEEE Student Chapter", event:"Hackathon 2026",    venue:"CS Lab 1 & 2", date:"Spectra Day 1",     period:"P10-P13", size:80,  priority:"Club Events",    status:"approved",   reason:"Available in P10-P13, fits within lab capacity, no class conflict." },
  { id:"SR002", club:"Robotics Club",        event:"Bot Wars",          venue:"Open-Air Theatre",date:"Spectra Day 2",  period:"P10-P13", size:200, priority:"Club Events",    status:"approved",   reason:"OAT available, capacity 300 ≥ 200, evening slot clear." },
  { id:"SR003", club:"Music Society",        event:"Battle of Bands",   venue:"Auditorium",   date:"Spectra Day 1",     period:"P10-P12", size:350, priority:"Club Events",    status:"conflict",   reason:"Auditorium P10-P12 Day 1 already booked by Drama Club (submitted earlier). Suggest: OAT P10-P12." },
  { id:"SR004", club:"Drama Club",           event:"Street Play Finals",venue:"Auditorium",   date:"Spectra Day 1",     period:"P10-P12", size:300, priority:"Club Events",    status:"approved",   reason:"First valid request for AUD P10-P12 Day 1. Capacity 400 ≥ 300. Approved." },
  { id:"SR005", club:"Tech Talk Team",       event:"Industry Talk",     venue:"Seminar Hall 1",date:"Spectra Day 2",    period:"P6-P8",   size:120, priority:"Guest Lectures", status:"approved",   reason:"Guest lecture has priority 4 > Club Events (6). SH1 available P6-P8." },
  { id:"SR006", club:"CSE Dept",             event:"Alumni Session",    venue:"Seminar Hall 2",date:"Spectra Day 3",    period:"P6-P8",   size:90,  priority:"Department Events",status:"approved",  reason:"SH2 free that slot. Dept event priority 5 confirmed." },
  { id:"SR007", club:"Photography Club",     event:"Photo Walk",        venue:"Open-Air Theatre",date:"Spectra Day 3",  period:"P10-P11", size:60,  priority:"Club Events",    status:"approved",   reason:"OAT free P10-P11 Day 3." },
  { id:"SR008", club:"Quiz Club",            event:"Inter-College Quiz", venue:"Lecture Hall 1", date:"Spectra Day 2",  period:"P10-P11", size:100, priority:"Club Events",    status:"rejected",   reason:"LH1 is reserved for midsem buffer sessions P10-P11 on Spectra Day 2. Alternative: SH2 P10-P11 (cap 100 = size, check if adequate)." },
  { id:"SR009", club:"Cancelled",            event:"Flash Mob",         venue:"OAT",           date:"Spectra Day 1",    period:"P9",      size:150, priority:"Club Events",    status:"cancelled",  reason:"Request cancelled by club representative on Oct 28." },
  { id:"SR010", club:"Cultural Committee",   event:"Spectra Inauguration",venue:"Auditorium",  date:"Spectra Day 1",   period:"P1-P3",   size:400, priority:"Institute Events",status:"approved",   reason:"Institute event (priority 3) — automatically approved. Main AUD allocated." },
];

const MY_BOOKINGS = [
  { id:"CB001", event:"Coding Contest",  venue:"CS Lab 1", date:"Nov 8",  period:"P10-P13", status:"pending",  size:38 },
  { id:"CB002", event:"Tech Talk",       venue:"SH2",      date:"Nov 10", period:"P6-P8",   status:"approved", size:80 },
];

function Badge({ label, color="blue" }) {
  const c = { blue:"bg-blue-100 text-blue-700", green:"bg-emerald-100 text-emerald-700", red:"bg-red-100 text-red-700", orange:"bg-orange-100 text-orange-700", yellow:"bg-yellow-100 text-yellow-700", slate:"bg-slate-100 text-slate-600", purple:"bg-violet-100 text-violet-700" };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c[color]||c.slate}`}>{label}</span>;
}

function statusColor(s) { return s==="approved"?"green":s==="rejected"?"red":s==="conflict"?"orange":s==="cancelled"?"slate":"yellow"; }
function statusLabel(s) { return s==="approved"?"✓ Approved":s==="rejected"?"✗ Rejected":s==="conflict"?"⚠ Alternative Suggested":s==="cancelled"?"— Cancelled":"⏳ Pending"; }

export default function ClubPortal() {
  const [tab, setTab] = useState("spectra");
  const [form, setForm] = useState({ event:"", venue:"", date:"", period:"", size:"", type:"Club Events", notes:"" });
  const [submitted, setSubmitted] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiParsed, setAiParsed] = useState(null);
  const [filter, setFilter] = useState("all");

  // Simulate NLP parsing of plain English / Hinglish venue request
  const parseAIRequest = () => {
    if (!aiInput.trim()) return;
    const lower = aiInput.toLowerCase();
    const parsed = {
      event:  lower.includes("hackathon") ? "Hackathon" : lower.includes("quiz") ? "Quiz Competition" : lower.includes("band") ? "Battle of Bands" : "Club Event",
      venue:  lower.includes("auditorium") || lower.includes("audi") ? "Auditorium" : lower.includes("lab") ? "CS Lab 1" : lower.includes("seminar") || lower.includes("hall") ? "Seminar Hall 1" : lower.includes("open") || lower.includes("oat") ? "Open-Air Theatre" : "Seminar Hall 1",
      date:   lower.includes("spectra") ? "Spectra Day 1" : lower.includes("friday") ? "Nov 14" : "Nov 10",
      period: lower.includes("evening") || lower.includes("sham") ? "P10-P12" : lower.includes("afternoon") ? "P6-P8" : "P10-P12",
      size:   lower.includes("100") ? "100" : lower.includes("200") ? "200" : lower.includes("50") ? "50" : "80",
      type:   lower.includes("department") ? "Department Events" : lower.includes("guest") ? "Guest Lectures" : "Club Events",
    };
    setAiParsed(parsed);
    setForm(parsed);
  };

  const filteredRequests = filter==="all" ? SPECTRA_REQUESTS : SPECTRA_REQUESTS.filter(r=>r.status===filter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Star className="w-7 h-7 text-yellow-300"/>
          </div>
          <div>
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">CIT — Spectra Week</div>
            <h2 className="text-2xl font-black">Club &amp; Event Portal</h2>
            <p className="text-purple-200 text-xs">Venue booking · Spectra requests · Event management</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            [SPECTRA_REQUESTS.filter(r=>r.status==="approved").length, "Approved"],
            [SPECTRA_REQUESTS.filter(r=>r.status==="rejected").length, "Rejected"],
            [SPECTRA_REQUESTS.filter(r=>r.status==="conflict").length, "Alt. Suggested"],
            [SPECTRA_REQUESTS.filter(r=>r.status==="cancelled").length,"Cancelled"],
          ].map(([v,l])=>(
            <div key={l} className="bg-white/10 rounded-2xl p-3 text-center">
              <div className="text-xl font-black">{v}</div>
              <div className="text-[10px] text-purple-200">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit flex-wrap">
        {[["spectra","⭐ Spectra Decisions"],["book","📝 Book a Venue"],["mybookings","My Bookings"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab===k?"bg-white text-violet-700 shadow":"text-slate-600 hover:text-slate-900"}`}>{l}</button>
        ))}
      </div>

      {/* ── SPECTRA DECISIONS ── */}
      {tab==="spectra" && (
        <div className="space-y-4">
          {/* Priority legend */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-black text-slate-600 mb-2">📋 Priority Order (per CIT Booking Rules)</p>
            <div className="flex flex-wrap gap-2">
              {PRIORITY.map((p,i)=>(
                <div key={p} className="flex items-center gap-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded-full px-2 py-1 font-bold text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-black">{i+1}</span>
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all","approved","rejected","conflict","cancelled"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all ${filter===f?"bg-violet-600 text-white":"bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f}</button>
            ))}
          </div>

          {/* Request cards */}
          <div className="space-y-3">
            {filteredRequests.map(r=>(
              <div key={r.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 ${r.status==="approved"?"border-emerald-200":r.status==="rejected"?"border-red-200":r.status==="conflict"?"border-orange-200":"border-slate-200"}`}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono text-slate-400">{r.id}</span>
                      <Badge label={statusLabel(r.status)} color={statusColor(r.status)}/>
                      <Badge label={r.priority} color={r.priority==="Institute Events"?"blue":r.priority==="Guest Lectures"?"purple":r.priority==="Department Events"?"orange":"slate"}/>
                    </div>
                    <h4 className="font-black text-slate-800">{r.event}</h4>
                    <p className="text-xs text-slate-500">{r.club}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-500">
                      <span>📍 {r.venue}</span>
                      <span>📅 {r.date}</span>
                      <span>⏰ {r.period}</span>
                      <span>👥 {r.size} attendees</span>
                    </div>
                  </div>
                </div>
                <div className={`mt-3 p-3 rounded-xl text-[11px] leading-relaxed ${r.status==="approved"?"bg-emerald-50 text-emerald-800":r.status==="rejected"?"bg-red-50 text-red-800":r.status==="conflict"?"bg-orange-50 text-orange-800":"bg-slate-50 text-slate-600"}`}>
                  <strong>Decision reason:</strong> {r.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOOK A VENUE ── */}
      {tab==="book" && (
        <div className="space-y-4">
          {/* AI NLP parser */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-5">
            <h3 className="font-black text-lg flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-300"/>AI Request Parser — English / Hinglish</h3>
            <p className="text-emerald-200 text-xs mt-1">Type your booking request naturally — AI will parse it into a structured form</p>
            <div className="mt-3 flex gap-2">
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)}
                placeholder='e.g. "Audi book karo Spectra Day 1 evening ke liye 300 log hain" or "Need CS Lab 1 for hackathon on Nov 8 from 6PM"'
                className="flex-1 p-2.5 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:bg-white/20"/>
              <button onClick={parseAIRequest} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-sm font-bold transition-all">
                <Send className="w-4 h-4"/>
              </button>
            </div>
            {aiParsed && (
              <div className="mt-3 bg-white/10 rounded-xl p-3 text-xs space-y-1">
                <p className="font-bold text-emerald-300 mb-2">✅ Parsed — review and edit below:</p>
                {Object.entries(aiParsed).map(([k,v])=>(
                  <div key={k} className="flex gap-2"><span className="text-white/60 w-16 capitalize">{k}:</span><span className="font-bold">{v}</span></div>
                ))}
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 flex-wrap">
            {["Book audi for Spectra evening","CS Lab 1 for hackathon P10-P13","Seminar hall for guest lecture P6-P8"].map(p=>(
              <button key={p} onClick={()=>setAiInput(p)}
                className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold rounded-xl hover:bg-purple-100">{p}</button>
            ))}
          </div>

          {/* Booking form */}
          {submitted ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto"/>
              <h3 className="font-black text-slate-800 text-lg">Booking Request Submitted!</h3>
              <p className="text-xs text-slate-500">Your request for <strong>{form.event}</strong> at <strong>{form.venue}</strong> is under review.<br/>Priority: <strong>{form.type}</strong> · You'll be notified within 24 hours.</p>
              <button onClick={()=>{ setSubmitted(false); setForm({ event:"",venue:"",date:"",period:"",size:"",type:"Club Events",notes:"" }); setAiParsed(null); setAiInput(""); }}
                className="px-5 py-2 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 text-sm">Submit Another</button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-black text-slate-800">Venue Booking Form</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key:"event",  label:"Event Name *",         placeholder:"e.g. Hackathon 2026" },
                  { key:"size",   label:"Expected Attendees *",  placeholder:"e.g. 80" },
                  { key:"date",   label:"Date / Spectra Day *",  placeholder:"e.g. Spectra Day 1 / Nov 8" },
                  { key:"period", label:"Period / Time Slot *",  placeholder:"e.g. P10-P12 / 6PM-10PM" },
                ].map(f=>(
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{f.label}</label>
                    <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                      placeholder={f.placeholder} className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none"/>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Venue *</label>
                  <select value={form.venue} onChange={e=>setForm(p=>({...p,venue:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none">
                    <option value="">-- Select Venue --</option>
                    {ROOMS_AVAIL.map(r=><option key={r.id} value={r.name}>{r.name} (cap {r.cap})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Type (Priority)</label>
                  <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none">
                    {PRIORITY.slice(2).map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
                <textarea rows={2} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                  placeholder="Any special requirements, equipment needed, accessibility…"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none resize-none"/>
              </div>

              {/* Conflict pre-check */}
              {form.venue && form.date && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0"/>
                  <span className="text-blue-700"><strong>Availability check:</strong> {form.venue} appears free on {form.date||"selected date"} {form.period}. Final validation runs on submit.</span>
                </div>
              )}

              <button onClick={()=>{ if(form.event&&form.venue&&form.date&&form.period&&form.size) setSubmitted(true); }}
                disabled={!form.event||!form.venue||!form.date||!form.period||!form.size}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-black rounded-xl text-sm transition-all">
                Submit Booking Request
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── MY BOOKINGS ── */}
      {tab==="mybookings" && (
        <div className="space-y-3">
          {MY_BOOKINGS.map(b=>(
            <div key={b.id} className={`bg-white rounded-2xl border-2 p-5 ${b.status==="approved"?"border-emerald-200":"border-yellow-200"}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={b.status==="approved"?"✓ Approved":"⏳ Pending"} color={b.status==="approved"?"green":"yellow"}/>
                    <span className="text-[10px] font-mono text-slate-400">{b.id}</span>
                  </div>
                  <h4 className="font-black text-slate-800">{b.event}</h4>
                  <div className="flex gap-3 mt-1 text-[11px] text-slate-500">
                    <span>📍 {b.venue}</span>
                    <span>📅 {b.date}</span>
                    <span>⏰ {b.period}</span>
                    <span>👥 {b.size}</span>
                  </div>
                </div>
                {b.status==="pending" && (
                  <button className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
