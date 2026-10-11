import React, { useState } from "react";
import { Shield, AlertTriangle, Send, CheckCircle2, User, Bell, Clock, MessageSquare, X, ChevronDown } from "lucide-react";

const STUDENTS = [
  { regNo:"2201106145", name:"Piyush Kumar Dey",   room:"B-304", hostel:"Aryabhatta Hall", parentPhone:"+91 94370 12345", parentEmail:"ramesh.dey@gmail.com",    parentName:"Mr. Ramesh Dey" },
  { regNo:"2201106098", name:"Rohan Samal",         room:"A-112", hostel:"Aryabhatta Hall", parentPhone:"+91 98765 43210", parentEmail:"samal.parent@gmail.com",  parentName:"Mr. Bikash Samal" },
  { regNo:"2201106201", name:"Priya Dash",           room:"C-205", hostel:"Saraswati Hall",  parentPhone:"+91 91234 56789", parentEmail:"dash.parent@gmail.com",   parentName:"Mrs. Sunita Dash" },
  { regNo:"2201106312", name:"Amit Jena",            room:"B-108", hostel:"Aryabhatta Hall", parentPhone:"+91 87654 32109", parentEmail:"jena.parent@gmail.com",   parentName:"Mr. Prakash Jena" },
  { regNo:"2201106401", name:"Suresh Mishra",        room:"B-210", hostel:"Aryabhatta Hall", parentPhone:"+91 76543 21098", parentEmail:"mishra.parent@gmail.com", parentName:"Mr. Gopal Mishra" },
];

const OFFENCES = [
  { label:"Smoking / Tobacco in Campus",                 fine:500,  severity:"HIGH",     emoji:"🚬", action:"Academic warning + ₹500 fine. Repeat offence leads to suspension." },
  { label:"Alcohol / Drinking in Campus",                fine:2000, severity:"CRITICAL",  emoji:"🍺", action:"Immediate fine ₹2000. Student put under probation. Parents called." },
  { label:"Drinking Outside Campus (Gate Pass Misuse)",  fine:1500, severity:"CRITICAL",  emoji:"🍻", action:"Fine ₹1500. Gate pass privileges revoked for 30 days." },
  { label:"Ragging / Bullying",                         fine:5000, severity:"CRITICAL",  emoji:"⚠️", action:"Anti-ragging fine ₹5000. Police intimation. Suspension pending." },
  { label:"Late Night Return Without Pass",              fine:300,  severity:"MEDIUM",    emoji:"🌙", action:"Fine ₹300. Written warning to parent." },
  { label:"Unauthorized Absence from Hostel",           fine:200,  severity:"MEDIUM",    emoji:"🚷", action:"Fine ₹200. Attendance marked absent for those days." },
  { label:"Property Damage / Vandalism",                fine:1000, severity:"HIGH",      emoji:"🔨", action:"Fine ₹1000 + cost of repair. Written apology mandatory." },
  { label:"Noise Disturbance / Quarrel",                fine:300,  severity:"MEDIUM",    emoji:"🔊", action:"Fine ₹300. Community service 2 hours." },
  { label:"Dress Code Violation",                       fine:100,  severity:"LOW",       emoji:"👕", action:"Fine ₹100. Written warning." },
  { label:"Drug Possession / Narcotics",                fine:10000,severity:"CRITICAL",  emoji:"💊", action:"Fine ₹10,000. Immediate suspension. Police FIR filed." },
];

const SEV = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  HIGH:     "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM:   "bg-amber-100 text-amber-700 border-amber-200",
  LOW:      "bg-slate-100 text-slate-600 border-slate-200",
};

const SEV_DOT = {
  CRITICAL: "bg-red-500",
  HIGH:     "bg-orange-500",
  MEDIUM:   "bg-amber-500",
  LOW:      "bg-slate-400",
};

// Build parent SMS/email notification message
function buildNotification(stu, off, finalFine, remarks, date) {
  return `Dear ${stu.parentName},

This is an official notice from Trident Academy of Technology, Bhubaneswar.

We regret to inform you that your child ${stu.name} (Reg. No. ${stu.regNo}), residing in Room ${stu.room}, ${stu.hostel}, has been found involved in a serious misconduct on ${date}.

OFFENCE: ${off.label}
SEVERITY: ${off.severity}
FINE IMPOSED: ₹${Number(finalFine).toLocaleString()}
INCIDENT: ${remarks || "As observed and reported by hostel warden staff."}

ACTION TAKEN: ${off.action}

The fine of ₹${Number(finalFine).toLocaleString()} must be paid at the hostel office within 7 days. Failure to pay may result in further disciplinary action including suspension.

Please contact the Chief Warden at warden@tat.ac.in or call +91-674-XXXXXXXX for any queries.

Regards,
Chief Warden
Trident Academy of Technology`;
}

export default function DisciplinaryActions() {
  const [records, setRecords] = useState([
    { id:"DISC-001", student:"Rohan Samal",  regNo:"2201106098", offence:"Alcohol / Drinking in Campus",               fine:2000, date:"Oct 8, 2026",  severity:"CRITICAL", notified:true, remarks:"Found drinking in room A-112 at 11 PM." },
    { id:"DISC-002", student:"Amit Jena",    regNo:"2201106312", offence:"Drinking Outside Campus (Gate Pass Misuse)",  fine:1500, date:"Oct 6, 2026",  severity:"CRITICAL", notified:true, remarks:"Returned intoxicated after gate pass outing." },
    { id:"DISC-003", student:"Suresh Mishra",regNo:"2201106401", offence:"Smoking / Tobacco in Campus",                fine:500,  date:"Oct 5, 2026",  severity:"HIGH",     notified:true, remarks:"Caught smoking behind sports complex." },
  ]);

  const [tab,        setTab]        = useState("records");
  const [form,       setForm]       = useState({ regNo:"", offence:"", customFine:"", remarks:"" });
  const [issued,     setIssued]     = useState(null);   // holds the issued record for preview
  const [expandRec,  setExpandRec]  = useState(null);   // expanded record id
  const [showNotif,  setShowNotif]  = useState(null);   // record to show notification preview

  const stu       = STUDENTS.find(s => s.regNo === form.regNo);
  const off       = OFFENCES.find(o => o.label === form.offence);
  const finalFine = form.customFine || off?.fine || 0;

  const handleIssue = () => {
    if (!form.regNo || !form.offence) return;
    const date = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
    const r = {
      id:       `DISC-00${records.length + 4}`,
      student:  stu?.name || form.regNo,
      regNo:    form.regNo,
      offence:  form.offence,
      fine:     Number(finalFine),
      date,
      severity: off?.severity || "MEDIUM",
      notified: true,
      remarks:  form.remarks,
      stuObj:   stu,
      offObj:   off,
    };
    setRecords(p => [r, ...p]);
    setIssued(r);
  };

  const resetForm = () => {
    setForm({ regNo:"", offence:"", customFine:"", remarks:"" });
    setIssued(null);
    setTab("records");
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-bold border border-red-500/30 mb-3">
          <Shield className="w-3.5 h-3.5"/> Warden — Disciplinary Control Panel
        </div>
        <h2 className="text-2xl font-black">Misconduct &amp; Disciplinary Actions 🚫</h2>
        <p className="text-xs text-red-100/80 mt-1">
          File complaints · Issue fines · Auto-notify parents via SMS &amp; Email
        </p>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-black">{records.length}</div>
            <div className="text-xs text-red-200">Total Cases</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-black text-red-300">{records.filter(r => r.severity === "CRITICAL").length}</div>
            <div className="text-xs text-red-200">Critical 🔴</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-black text-amber-300">₹{records.reduce((s,r) => s + r.fine, 0).toLocaleString()}</div>
            <div className="text-xs text-red-200">Total Fines</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { key:"records", label:"📋 Case Records" },
          { key:"issue",   label:"⚡ File Complaint / Issue Fine" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
              ${tab === t.key ? "bg-white text-red-700 shadow" : "text-slate-600 hover:text-slate-900"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RECORDS TAB ──────────────────────────────────────── */}
      {tab === "records" && (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden
              ${r.severity==="CRITICAL"?"border-red-200":r.severity==="HIGH"?"border-orange-200":"border-slate-200"}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono text-slate-400">{r.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${SEV[r.severity]}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${SEV_DOT[r.severity]}`}/>
                        {r.severity}
                      </span>
                      {r.notified && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <Bell className="w-2.5 h-2.5"/> Parent Notified
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900">
                      {r.student} <span className="text-slate-400 font-normal text-xs">({r.regNo})</span>
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0"/>
                      {r.offence}
                    </div>
                    {r.remarks && (
                      <div className="text-[11px] text-slate-400 mt-1 italic">"{r.remarks}"</div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-black text-red-700">₹{r.fine.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3"/> {r.date}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setShowNotif(showNotif === r.id ? null : r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 transition-all">
                    <Bell className="w-3 h-3"/> View Parent Notification
                  </button>
                </div>
              </div>

              {/* Parent notification preview */}
              {showNotif === r.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">📧 Parent Notification Sent</span>
                    <button onClick={() => setShowNotif(null)}>
                      <X className="w-3.5 h-3.5 text-slate-400"/>
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 text-[11px] text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                    {buildNotification(
                      STUDENTS.find(s => s.regNo === r.regNo) || { name:r.student, regNo:r.regNo, room:"—", hostel:"—", parentName:"Parent/Guardian", parentPhone:"—" },
                      OFFENCES.find(o => o.label === r.offence) || { label:r.offence, action:"Disciplinary action taken.", severity:r.severity },
                      r.fine, r.remarks, r.date
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-[10px] font-bold">
                      ✓ SMS Sent to {STUDENTS.find(s=>s.regNo===r.regNo)?.parentPhone || "+91 XXXXXXXXXX"}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold">
                      ✓ Email to {STUDENTS.find(s=>s.regNo===r.regNo)?.parentEmail || "parent@email.com"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── ISSUE FINE TAB ───────────────────────────────────── */}
      {tab === "issue" && (
        <div className="max-w-lg space-y-4">

          {/* Success screen */}
          {issued ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-red-200 space-y-4">
              <div className="text-center space-y-3 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-red-600"/>
                </div>
                <h3 className="font-black text-slate-900 text-lg">Fine Issued Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Case <strong>{issued.id}</strong> filed. Parent notified via SMS &amp; Email.
                </p>
                <div className="inline-block bg-red-50 border border-red-200 rounded-2xl px-6 py-3">
                  <div className="text-xs text-red-500 font-bold">FINE AMOUNT</div>
                  <div className="text-3xl font-black text-red-700">₹{issued.fine.toLocaleString()}</div>
                </div>
              </div>

              {/* Notification preview */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2">📧 Parent Notification Sent:</div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 text-[11px] text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-52 overflow-y-auto">
                  {buildNotification(issued.stuObj || STUDENTS.find(s=>s.regNo===issued.regNo) || {name:issued.student,regNo:issued.regNo,room:"—",hostel:"—",parentName:"Parent/Guardian",parentPhone:"—"}, issued.offObj || {label:issued.offence,action:"Disciplinary action taken.",severity:issued.severity}, issued.fine, issued.remarks, issued.date)}
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-[10px] font-bold animate-pulse">
                    ✓ SMS Sent to {issued.stuObj?.parentPhone || "+91 XXXXXXXXXX"}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold">
                    ✓ Email to {issued.stuObj?.parentEmail || "parent@email.com"}
                  </div>
                </div>
              </div>

              <button onClick={resetForm}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all">
                File Another Complaint
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600"/>
                <h3 className="font-bold text-slate-900">File Misconduct Complaint &amp; Issue Fine</h3>
              </div>

              {/* Student select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student *</label>
                <select value={form.regNo} onChange={e => setForm(p => ({...p, regNo:e.target.value}))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none">
                  <option value="">-- Select Student --</option>
                  {STUDENTS.map(s => (
                    <option key={s.regNo} value={s.regNo}>{s.name} ({s.regNo}) — Room {s.room}</option>
                  ))}
                </select>
              </div>

              {/* Student info card */}
              {stu && (
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-700"/>
                  </div>
                  <div className="text-xs flex-1">
                    <div className="font-black text-blue-900">{stu.name}</div>
                    <div className="text-blue-700">{stu.hostel} · Room {stu.room}</div>
                    <div className="text-blue-600 font-bold mt-0.5">
                      👨‍👩‍👦 Parent: {stu.parentName} · {stu.parentPhone}
                    </div>
                  </div>
                </div>
              )}

              {/* Offence type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offence / Misconduct Type *</label>
                <select value={form.offence} onChange={e => setForm(p => ({...p, offence:e.target.value, customFine:""}))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none">
                  <option value="">-- Select Offence --</option>
                  {OFFENCES.map(o => (
                    <option key={o.label} value={o.label}>{o.emoji} {o.label} — ₹{o.fine} ({o.severity})</option>
                  ))}
                </select>
              </div>

              {/* Offence details */}
              {off && (
                <div className={`p-3 rounded-2xl border ${SEV[off.severity]} space-y-1`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
                    <div className="text-xs font-black">
                      {off.emoji} {off.label}
                    </div>
                    <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full border ${SEV[off.severity]}`}>
                      {off.severity}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold">Fine: ₹{off.fine.toLocaleString()}</div>
                  <div className="text-[10px] opacity-80">{off.action}</div>
                </div>
              )}

              {/* Override fine */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fine Amount (₹) {off && <span className="text-slate-400 font-normal">— default ₹{off.fine}</span>}
                </label>
                <input type="number" value={form.customFine}
                  onChange={e => setForm(p => ({...p, customFine:e.target.value}))}
                  placeholder={off?.fine?.toString() || "Enter fine amount"}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"/>
              </div>

              {/* Incident description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Incident Description / Evidence *</label>
                <textarea rows={3} value={form.remarks}
                  onChange={e => setForm(p => ({...p, remarks:e.target.value}))}
                  placeholder="Describe: where, when, who reported, any witnesses, evidence found..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none resize-none"/>
              </div>

              {/* Notification preview banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1">
                  <Bell className="w-3.5 h-3.5"/>
                  Auto Parent Notification — Preview
                </div>
                {stu ? (
                  <div className="text-[10px] text-amber-700 space-y-0.5">
                    <div>📱 SMS → <strong>{stu.parentPhone}</strong></div>
                    <div>📧 Email → <strong>{stu.parentEmail}</strong></div>
                    <div className="mt-1 italic text-amber-600">
                      "Dear {stu.parentName}, your child {stu.name} has been fined ₹{finalFine || (off?.fine) || "___"} for {off?.label || "misconduct"} at TAT Campus on {new Date().toLocaleDateString("en-IN")}…"
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-amber-600">Select a student to preview the notification</div>
                )}
              </div>

              {/* Submit */}
              <button onClick={handleIssue}
                disabled={!form.regNo || !form.offence}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/25">
                <Send className="w-4 h-4"/>
                Issue Fine &amp; Notify Parent Immediately
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}