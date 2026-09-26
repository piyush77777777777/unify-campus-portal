import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  BookOpen, Users, Calendar, ClipboardList, CheckCircle2, AlertTriangle,
  Clock, TrendingUp, Send, BarChart3, MessageSquare, Upload, Star, Zap
} from 'lucide-react';

const TABS = [
  { id:'overview',  label:'Overview',   icon: BookOpen },
  { id:'schedule',  label:'Schedule',   icon: Clock },
  { id:'students',  label:'Students',   icon: Users },
  { id:'quizzes',   label:'Polls',      icon: Zap },
  { id:'assign',    label:'Assignments',icon: Upload },
  { id:'workload',  label:'Workload',   icon: BarChart3 },
  { id:'analytics', label:'Analytics',  icon: TrendingUp },
  { id:'leave',     label:'Leave',      icon: Calendar },
];

export default function TeacherDashboard() {
  const { currentPersona, studentReviews, quizzes, staffWorkload } = useCampus();
  const [tab, setTab] = useState('overview');
  const [leaveForm, setLeaveForm] = useState({ reason:'', date:'', type:'Sick Leave', substitute:'' });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [assignUploaded, setAssignUploaded] = useState(false);
  const [assignForm, setAssignForm] = useState({ subject:'', title:'', deadline:'', marks:'' });

  const p = currentPersona;
  const classes = p.classes || [];
  const todaySchedule = [
    { time:'9:00 AM',  subject:'Operating Systems',        section:'CSE-A', room:'Room 401', done:true },
    { time:'11:00 AM', subject:'Algorithms',               section:'CSE-B', room:'Room 302', done:true },
    { time:'2:00 PM',  subject:'Machine Learning Lab',     section:'CSE-A', room:'CS Lab 3', done:false },
    { time:'4:00 PM',  subject:'Office Hours / Mentoring', section:'All',   room:'Staff Room 2', done:false }
  ];
  const lowAtt = (studentReviews||[]).filter(s => s.attendancePct < 75);
  const q = (quizzes||[])[0];

  const feedbackData = [
    { week:'W1', engagement:72 }, { week:'W2', engagement:78 },
    { week:'W3', engagement:81 }, { week:'W4', engagement:75 }, { week:'W5', engagement:88 }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30 mb-2">
            <BookOpen className="w-3 h-3" />Faculty Portal
          </div>
          <h2 className="text-xl font-black">Welcome, {p.name} 📚</h2>
          <p className="text-xs text-purple-100/80 mt-0.5">{p.title} • {p.department}</p>
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10">
            {[
              { label:'Classes Today', value: todaySchedule.length, sub: `${todaySchedule.filter(c=>c.done).length} done` },
              { label:'Students', value: classes.reduce((s,c)=>s+c.totalStudents,0), sub:`${classes.length} sections` },
              { label:'Low Attendance', value: lowAtt.length, sub:'Below 75%' },
              { label:'Leave Balance', value: (p.workload?.leaveBalance?.casual||8), sub:'Casual leaves' }
            ].map((k,i)=>(
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                <div className="text-[9px] text-purple-200">{k.label}</div>
                <div className="text-lg font-black text-white">{k.value}</div>
                <div className="text-[9px] text-purple-300">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {TABS.map(({id,label,icon:Icon})=>(
          <button key={id} onClick={()=>setTab(id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${tab===id?'bg-white text-purple-700 shadow-sm':'text-slate-500 hover:text-slate-800'}`}>
            <Icon className="w-3 h-3"/>{label}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW ══ */}
      {tab==='overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {classes.map((cls)=>(
            <div key={cls.code} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{cls.code}</span>
                  <h4 className="font-bold text-slate-900 mt-1 text-sm">{cls.name}</h4>
                  <p className="text-xs text-slate-500">{cls.section} • {cls.totalStudents} students</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${cls.avgAttendance>=80?'bg-emerald-100 text-emerald-700':cls.avgAttendance>=75?'bg-amber-100 text-amber-700':'bg-rose-100 text-rose-700'}`}>
                  {cls.avgAttendance}%
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${cls.avgAttendance>=80?'bg-emerald-500':cls.avgAttendance>=75?'bg-amber-500':'bg-rose-500'}`} style={{width:`${cls.avgAttendance}%`}} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ SCHEDULE ══ */}
      {tab==='schedule' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900">Today's Schedule</h3>
          {todaySchedule.map((cls,i)=>(
            <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${cls.done?'bg-emerald-50 border-emerald-200':'bg-slate-50 border-slate-200'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.done?'bg-emerald-100':'bg-blue-100'}`}>
                {cls.done?<CheckCircle2 className="w-5 h-5 text-emerald-600"/>:<Clock className="w-5 h-5 text-blue-600"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-sm truncate">{cls.subject}</div>
                <div className="text-[11px] text-slate-500">{cls.section} • {cls.room}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-700">{cls.time}</div>
                <div className={`text-[10px] font-bold ${cls.done?'text-emerald-600':'text-blue-600'}`}>{cls.done?'Done':'Upcoming'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ STUDENTS (Review + Low Attendance) ══ */}
      {tab==='students' && (
        <div className="space-y-4">
          {lowAtt.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">⚠️ Students Below 75% Attendance</h4>
              {lowAtt.map((s,i)=>(
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm">{s.studentName}</div>
                    <div className="text-[10px] text-slate-500">{s.regNo} • {s.subject}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-rose-700">{s.attendancePct}%</div>
                    <button className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold mt-0.5">Alert</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">📊 Student Performance Reviews</h4>
            {(studentReviews||[]).map((s,i)=>(
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{s.studentName}</div>
                    <div className="text-[10px] text-slate-500">{s.regNo} • {s.subject}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-purple-700">{s.grade}</span>
                    <span className="text-xs text-slate-700">{s.marks}/100</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 italic">"{s.feedback}"</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ LIVE QUIZ / POLL ══ */}
      {tab==='quizzes' && (
        <div className="space-y-4">
          {q && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">🎯 {q.subject} — Live Poll</h4>
                <button onClick={()=>setActiveQuiz(!activeQuiz)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${activeQuiz?'bg-rose-600 text-white':'bg-purple-600 text-white'}`}>
                  {activeQuiz?'Stop Poll':'Launch Poll'}
                </button>
              </div>
              <div className={`px-3 py-2 rounded-xl text-xs font-bold border ${activeQuiz?'bg-emerald-50 border-emerald-300 text-emerald-700 animate-pulse':'bg-slate-50 border-slate-200 text-slate-500'}`}>
                {activeQuiz?`🟢 LIVE — ${q.totalResponses} responses received`:'⏸ Poll inactive — launch to start collecting responses'}
              </div>
              <p className="text-sm font-bold text-slate-900">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt,i)=>{
                  const total = q.results.reduce((a,b)=>a+b,0);
                  const pct = Math.round((q.results[i]/total)*100);
                  return (
                    <div key={i} className={`relative p-3 rounded-xl border overflow-hidden ${i===q.correctIndex?'border-emerald-400 bg-emerald-50':'border-slate-200 bg-slate-50'}`}>
                      <div className="absolute left-0 top-0 bottom-0 bg-purple-100 transition-all" style={{width:`${pct}%`}} />
                      <div className="relative flex justify-between text-xs">
                        <span className={`font-bold ${i===q.correctIndex?'text-emerald-800':'text-slate-800'}`}>{opt}{i===q.correctIndex?' ✓':''}</span>
                        <span className="font-black text-slate-700">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">➕ Create New Quiz / Poll</h4>
            <input className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400" placeholder="Question..." />
            {[1,2,3,4].map(n=>(
              <input key={n} className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400" placeholder={`Option ${n}...`} />
            ))}
            <button className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold">Launch Quiz to Class</button>
          </div>
        </div>
      )}

      {/* ══ ASSIGNMENT UPLOAD ══ */}
      {tab==='assign' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          {assignUploaded ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600"/>
              </div>
              <h4 className="font-black text-slate-900">Assignment Posted!</h4>
              <p className="text-xs text-slate-500">Students have been notified via FCM push & SMS.</p>
              <button onClick={()=>setAssignUploaded(false)} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">Post Another</button>
            </div>
          ):(
            <>
              <h4 className="font-bold text-slate-900 text-sm">📤 Upload Assignment</h4>
              {[['Subject', 'subject', 'e.g. Operating Systems'],['Assignment Title','title','Enter title...'],['Deadline','deadline','e.g. Oct 10, 2026'],['Maximum Marks','marks','e.g. 20']].map(([lbl,key,ph])=>(
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{lbl}</label>
                  <input type="text" placeholder={ph} value={assignForm[key]} onChange={e=>setAssignForm(p=>({...p,[key]:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment File / Description</label>
                <textarea rows={3} placeholder="Type assignment details or instructions..." className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 resize-none"/>
              </div>
              <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-5 text-center">
                <div>
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1"/>
                  <div className="text-xs text-slate-500 font-medium">Drag PDF/DOCX here or click to browse</div>
                </div>
              </div>
              <button onClick={()=>assignUploaded||setAssignUploaded(true)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all">
                <Upload className="w-3.5 h-3.5 inline mr-1"/>Post Assignment to Students
              </button>
            </>
          )}
        </div>
      )}

      {/* ══ WORKLOAD ══ */}
      {tab==='workload' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">📊 Faculty Workload Dashboard</h4>
            {[
              { label:'Weekly Teaching Hours', value:`${p.workload?.weeklyHours||18} hrs`, max:24, pct:75 },
              { label:'Lab Hours / Week',       value:`${p.workload?.labHours||6} hrs`,  max:12, pct:50 },
              { label:'Substitutions This Sem', value: p.workload?.substitutionsThisSem||2, max:10, pct:20 },
            ].map((w,i)=>(
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{w.label}</span>
                  <span className="font-black text-slate-900">{w.value}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-2 rounded-full bg-purple-500" style={{width:`${w.pct}%`}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">🏖️ Leave Balance</h4>
            {Object.entries(p.workload?.leaveBalance||{casual:8,sick:10,duty:5}).map(([type,count])=>(
              <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 capitalize">{type} Leave</span>
                <span className="font-black text-purple-700">{count} days remaining</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ ANALYTICS ══ */}
      {tab==='analytics' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">📈 Student Engagement Analytics</h4>
            <p className="text-xs text-slate-500">Weekly classroom engagement trend (poll responses, assignment submissions)</p>
            <div className="flex items-end gap-2 h-28">
              {feedbackData.map((d,i)=>(
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[9px] font-bold text-slate-600">{d.engagement}%</div>
                  <div className="w-full bg-purple-500 rounded-t-lg transition-all" style={{height:`${d.engagement}%`}}/>
                  <div className="text-[9px] text-slate-400">{d.week}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3">🤖 AI-Assisted Grading (MCQ)</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl border border-purple-200">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0"/>
                <span>52 responses auto-graded for Quiz QZ-01 • Accuracy: 98.2%</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0"/>
                <span>Plagiarism check: 1 assignment flagged (62% similarity) — Review required</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ LEAVE REQUEST ══ */}
      {tab==='leave' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-lg">
          {leaveSubmitted?(
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600"/>
              </div>
              <h3 className="font-black text-slate-900">Leave Request Submitted!</h3>
              <p className="text-xs text-slate-500">Sent to HOD & Principal. Class reassignment notification dispatched to substitute faculty.</p>
              <button onClick={()=>setLeaveSubmitted(false)} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">Submit Another</button>
            </div>
          ):(
            <>
              <h3 className="font-bold text-slate-900 text-sm">📋 Faculty Leave Application</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
                <select value={leaveForm.type} onChange={e=>setLeaveForm(p=>({...p,type:e.target.value}))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400">
                  <option>Sick Leave</option><option>Casual Leave</option>
                  <option>Emergency Leave</option><option>Conference / Workshop</option><option>Academic Duty</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Absence</label>
                <input type="date" value={leaveForm.date} onChange={e=>setLeaveForm(p=>({...p,date:e.target.value}))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Substitute Arrangement</label>
                <input type="text" placeholder="e.g. Dr. Rajan Panda will cover OS class" value={leaveForm.substitute}
                  onChange={e=>setLeaveForm(p=>({...p,substitute:e.target.value}))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason *</label>
                <textarea rows={3} value={leaveForm.reason} onChange={e=>setLeaveForm(p=>({...p,reason:e.target.value}))}
                  placeholder="Brief reason..." className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 resize-none"/>
              </div>
              <button onClick={()=>leaveForm.reason&&leaveForm.date&&setLeaveSubmitted(true)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
                <Send className="w-3.5 h-3.5"/>Submit to HOD & Principal
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}