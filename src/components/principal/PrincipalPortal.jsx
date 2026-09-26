import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  Building2, Users, TrendingUp, AlertTriangle, BarChart3,
  ShieldCheck, Sparkles, CreditCard, Star, CheckCircle2,
  Clock, Send, Activity
} from 'lucide-react';

const TABS = [
  { id:'overview',    label:'Overview',    icon: Building2 },
  { id:'staff',       label:'Staff',       icon: Users },
  { id:'performance', label:'Depts',       icon: BarChart3 },
  { id:'finance',     label:'Finance',     icon: CreditCard },
  { id:'compliance',  label:'Compliance',  icon: ShieldCheck },
  { id:'staffing',    label:'Staffing AI', icon: Sparkles },
  { id:'feedback',    label:'Analytics',   icon: TrendingUp },
];

export default function PrincipalPortal() {
  const { complaints, notices, staffWorkload, financeData, policyCompliance } = useCampus();
  const [tab, setTab] = useState('overview');
  const [broadcastForm, setBroadcastForm] = useState({ title:'', msg:'', target:'All Students', schedule:'now' });
  const [broadcastSent, setBroadcastSent] = useState(false);

  const deptStats = [
    { dept:'Computer Science & Engg.',  students:240, avgAtt:83, complaints:12, resolved:10 },
    { dept:'Electrical Engineering',    students:180, avgAtt:79, complaints:8,  resolved:7  },
    { dept:'Mechanical Engineering',    students:200, avgAtt:76, complaints:15, resolved:11 },
    { dept:'Civil Engineering',         students:160, avgAtt:81, complaints:5,  resolved:5  }
  ];
  const escalated = (complaints||[]).filter(c=>c.status==='ESCALATED');
  const totalStudents = deptStats.reduce((s,d)=>s+d.students,0);

  const predictedShortages = [
    { subject:'Machine Learning (CST401)', date:'Oct 8-12', risk:'HIGH', suggested:'Dr. K. C. Patra or Dr. R. Panda' },
    { subject:'Computer Networks (CST304)', date:'Oct 20', risk:'MEDIUM', suggested:'Prof. B. Dash (available)' },
  ];

  const feedbackTrend = [
    { month:'Jul', studentSat:78, teacherSat:82 },
    { month:'Aug', studentSat:81, teacherSat:85 },
    { month:'Sep', studentSat:84, teacherSat:83 },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-500/30 mb-2">
            <Building2 className="w-3 h-3"/>Principal & Director
          </div>
          <h2 className="text-xl font-black">Welcome, Prof. D. K. Mishra 🎓</h2>
          <p className="text-xs text-rose-100/80 mt-0.5">Principal & Director • Office of the Principal</p>
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10">
            {[
              { label:'Total Students', value:totalStudents, color:'text-white' },
              { label:'Avg Attendance', value:'80%',         color:'text-emerald-300' },
              { label:'Escalated Issues', value:escalated.length, color:'text-rose-300' },
              { label:'Compliance Score', value:'94%',        color:'text-blue-300' }
            ].map((k,i)=>(
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                <div className="text-[9px] text-rose-200">{k.label}</div>
                <div className={`text-lg font-black ${k.color}`}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {TABS.map(({id,label,icon:Icon})=>(
          <button key={id} onClick={()=>setTab(id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${tab===id?'bg-white text-rose-700 shadow-sm':'text-slate-500 hover:text-slate-800'}`}>
            <Icon className="w-3 h-3"/>{label}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW (Broadcast + Escalated) ══ */}
      {tab==='overview' && (
        <div className="space-y-4">
          {/* Broadcast */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            {broadcastSent?(
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto"/>
                <h4 className="font-black text-slate-900">Announcement Dispatched!</h4>
                <p className="text-xs text-slate-500">Push notification + SMS sent to all targeted users.</p>
                <button onClick={()=>setBroadcastSent(false)} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">Send Another</button>
              </div>
            ):(
              <>
                <h4 className="font-bold text-slate-900 text-sm">📢 Broadcast Announcement</h4>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select value={broadcastForm.target} onChange={e=>setBroadcastForm(p=>({...p,target:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400">
                    <option>All Students</option><option>All Faculty</option><option>All Hostel Residents</option>
                    <option>CSE Department</option><option>Final Year Students</option><option>All Campus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                  <input type="text" placeholder="e.g. Exam Postponement Notice" value={broadcastForm.title}
                    onChange={e=>setBroadcastForm(p=>({...p,title:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                  <textarea rows={3} placeholder="Type announcement..." value={broadcastForm.msg}
                    onChange={e=>setBroadcastForm(p=>({...p,msg:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 resize-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery</label>
                  <select value={broadcastForm.schedule} onChange={e=>setBroadcastForm(p=>({...p,schedule:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400">
                    <option value="now">Send Immediately</option>
                    <option value="tomorrow_9am">Schedule: Tomorrow 9 AM</option>
                    <option value="custom">Schedule: Custom Time</option>
                  </select>
                </div>
                <button disabled={!broadcastForm.title||!broadcastForm.msg} onClick={()=>setBroadcastSent(true)}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
                  <Send className="w-3.5 h-3.5"/>
                  {broadcastForm.schedule==='now'?'Broadcast Now (FCM + SMS)':'Schedule Announcement'}
                </button>
              </>
            )}
          </div>

          {/* Escalated issues */}
          {escalated.length>0 && (
            <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600"/>
                <h4 className="font-bold text-slate-900 text-sm">Escalated Issues Requiring Intervention</h4>
              </div>
              {escalated.map(c=>(
                <div key={c.id} className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-rose-600">{c.id}</span>
                      <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                      <div className="text-xs text-slate-500">{c.location} • {c.reportedDaysAgo}d old</div>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full animate-pulse">{c.status}</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all">
                    Issue Principal Directive
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"/>
            <div className="text-xs text-blue-900">
              <strong>AI Campus Intelligence:</strong> Overall attendance 80%, above 75% cutoff. Mechanical Engineering requires attention. 92% complaints resolved within SLA — highest record this semester.
            </div>
          </div>
        </div>
      )}

      {/* ══ STAFF WORKLOAD ══ */}
      {tab==='staff' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">👩‍🏫 Staff Workload Monitoring</h4>
          <p className="text-xs text-slate-500">Who is teaching, resolving, and performing</p>
          {(staffWorkload||[]).map((s,i)=>(
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                  <div className="text-[11px] text-slate-500">{s.role}</div>
                </div>
                <span className={`text-sm font-black ${parseInt(s.performanceScore)>=95?'text-emerald-700':parseInt(s.performanceScore)>=90?'text-blue-700':'text-amber-700'}`}>
                  {s.performanceScore}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label:'Teaching Hrs',  value:`${s.teachingHours}h` },
                  { label:'Tickets Assigned', value:s.assignedTickets },
                  { label:'Tickets Resolved', value:s.resolvedTickets }
                ].map((k,j)=>(
                  <div key={j} className="bg-white border border-slate-200 rounded-lg p-1.5">
                    <div className="text-[9px] text-slate-500">{k.label}</div>
                    <div className="text-xs font-black text-slate-800">{k.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ DEPT PERFORMANCE ══ */}
      {tab==='performance' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">🏛️ Department Performance Comparison</h4>
            <p className="text-xs text-slate-500 mt-0.5">Attendance, complaint resolution & overall status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Students</th>
                  <th className="py-2.5 px-3">Avg Att.</th>
                  <th className="py-2.5 px-3">Complaints</th>
                  <th className="py-2.5 px-3">Resolution</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptStats.map((d,i)=>{
                  const resRate=Math.round((d.resolved/d.complaints)*100);
                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{d.dept}</td>
                      <td className="py-3 px-3">{d.students}</td>
                      <td className="py-3 px-3"><span className={`font-extrabold ${d.avgAtt>=80?'text-emerald-700':d.avgAtt>=75?'text-amber-700':'text-rose-700'}`}>{d.avgAtt}%</span></td>
                      <td className="py-3 px-3">{d.complaints}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 bg-slate-100 rounded-full">
                            <div className={`h-1.5 rounded-full ${resRate>=80?'bg-emerald-500':'bg-amber-500'}`} style={{width:`${resRate}%`}}/>
                          </div>
                          <span className="font-bold">{resRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.avgAtt>=80?'bg-emerald-100 text-emerald-700':d.avgAtt>=75?'bg-amber-100 text-amber-700':'bg-rose-100 text-rose-700'}`}>
                          {d.avgAtt>=80?'Excellent':d.avgAtt>=75?'Satisfactory':'Attention'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ FINANCE ══ */}
      {tab==='finance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">💰 Integrated Finance Module</h4>
            {financeData && [
              { label:'Total Fee Collection (2026-27)', value:`₹${(financeData.totalFeeCollection/100000).toFixed(1)}L`, sub:`${financeData.feeCollectionRate}% collected`, good:true },
              { label:'Scholarships Disbursed',         value:`₹${(financeData.scholarshipsDisbursed/100000).toFixed(1)}L`, sub:'To eligible students', good:true },
              { label:'Hostel Rent Collected',          value:`₹${(financeData.hostelRentCollected/100000).toFixed(1)}L`, sub:'This semester', good:true },
              { label:'Mess Billing Collected',         value:`₹${(financeData.messBillingCollected/100000).toFixed(1)}L`, sub:'Annapurna Mess', good:true },
              { label:'Pending Dues (Students)',        value:financeData.pendingDuesCount, sub:'Students with arrears', good:false },
            ].map((f,i)=>(
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${f.good?'bg-emerald-50 border-emerald-200':'bg-rose-50 border-rose-200'}`}>
                <div>
                  <div className="text-xs font-bold text-slate-900">{f.label}</div>
                  <div className="text-[11px] text-slate-500">{f.sub}</div>
                </div>
                <div className={`font-black text-lg ${f.good?'text-emerald-700':'text-rose-700'}`}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ COMPLIANCE ══ */}
      {tab==='compliance' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">📋 Policy Compliance Tracker</h4>
          <p className="text-xs text-slate-500">Anti-ragging, attendance minimums, grievance redressal, bus & mess</p>
          {policyCompliance && Object.entries(policyCompliance).map(([key,val],i)=>{
            const label = {
              antiRaggingCompliance:'Anti-Ragging Compliance',
              attendanceCutoffCompliance:'Attendance Cutoff Adherence',
              grievanceRedressalRate:'Grievance Redressal Rate',
              scholarshipDisbursalRate:'Scholarship Disbursal Rate',
              hostelCapacityUtilized:'Hostel Capacity Utilized',
              busTransportEfficiency:'Bus Transport Efficiency'
            }[key]||key;
            const good = val >= 90;
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{label}</span>
                  <span className={`font-black ${good?'text-emerald-700':'text-amber-700'}`}>{val}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className={`h-2 rounded-full transition-all ${good?'bg-emerald-500':'bg-amber-500'}`} style={{width:`${val}%`}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ AI PREDICTIVE STAFFING ══ */}
      {tab==='staffing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600"/>
              <h4 className="font-bold text-slate-900 text-sm">🤖 AI Predictive Staffing Engine</h4>
            </div>
            <p className="text-xs text-slate-500">Forecasts potential faculty shortages and auto-suggests substitutes based on workload & leave patterns.</p>
            {predictedShortages.map((ps,i)=>(
              <div key={i} className={`p-4 rounded-xl border ${ps.risk==='HIGH'?'bg-rose-50 border-rose-200':'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{ps.subject}</div>
                    <div className="text-[11px] text-slate-500">Predicted absence window: {ps.date}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ps.risk==='HIGH'?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>{ps.risk} RISK</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <Sparkles className="w-3 h-3"/>
                  <span>AI Suggests: {ps.suggested}</span>
                </div>
                <button className="mt-2 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold">Assign Substitute</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ FEEDBACK ANALYTICS ══ */}
      {tab==='feedback' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">📈 Student & Teacher Satisfaction Trends</h4>
            <div className="flex items-end gap-4 h-32">
              {feedbackTrend.map((d,i)=>(
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end h-24">
                    <div className="flex-1 bg-blue-400 rounded-t" style={{height:`${d.studentSat}%`}} title={`Students: ${d.studentSat}%`}/>
                    <div className="flex-1 bg-purple-400 rounded-t" style={{height:`${d.teacherSat}%`}} title={`Teachers: ${d.teacherSat}%`}/>
                  </div>
                  <div className="text-[9px] text-slate-500">{d.month}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-[11px]">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-400"/><span className="text-slate-600">Student Satisfaction</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-400"/><span className="text-slate-600">Teacher Satisfaction</span></div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"/>
            <div className="text-xs text-emerald-900">
              <strong>AI Insight:</strong> Student satisfaction rose 6% after faster complaint resolution (now averaging 18h vs 36h last semester). Recommend expanding maintenance staff by 2 to sustain SLA.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}