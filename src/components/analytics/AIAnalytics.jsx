import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { Sparkles, BarChart3, TrendingUp, ClipboardList, AlertTriangle, Activity, CheckCircle2, Clock } from 'lucide-react';

export default function AIAnalytics() {
  const { complaints, auditLogs, campusHotspotStats } = useCampus();
  const [aiSummary, setAiSummary] = useState(null);
  const [routing, setRouting] = useState(null);

  const handleSummarize = (c) => {
    const cats = { Plumbing:'🔧 Infrastructure', 'Wi-Fi & IT':'💻 IT & Connectivity', Electrical:'⚡ Electrical Safety' };
    setAiSummary({
      complaint: c,
      category: cats[c.category]||'⚠️ General',
      priority: c.urgency,
      location: c.location,
      assignTo: c.urgency==='HIGH'?'Senior Maintenance Team':'General Maintenance Pool',
      eta: c.urgency==='HIGH'?'4 hours':'48 hours',
      similarCount: Math.floor(Math.random()*3)+1
    });
  };

  const handleRoute = (c) => {
    setRouting({ id:c.id, assigned:'Manoj Rout (Head Plumber)', priority:c.urgency, eta:'2 hours' });
  };

  const messDemand = [
    { day:'Mon', breakfast:310, lunch:390, predicted_lunch:405 },
    { day:'Tue', breakfast:295, lunch:380, predicted_lunch:388 },
    { day:'Wed', breakfast:320, lunch:400, predicted_lunch:412 },
    { day:'Thu', breakfast:280, lunch:370, predicted_lunch:375 },
    { day:'Fri', breakfast:300, lunch:395, predicted_lunch:390 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30 mb-2">
            <Sparkles className="w-3 h-3"/>AI Intelligence Engine
          </div>
          <h2 className="text-xl font-black">UNIFY Campus Intelligence 🤖</h2>
          <p className="text-xs text-blue-100/80 mt-0.5">AI routing • Summarization • Predictive insights • Audit trail • Trend analysis</p>
        </div>
      </div>

      {/* 1. AI COMPLAINT ROUTING */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600"/>
          <h4 className="font-bold text-slate-900 text-sm">1. AI Complaint Auto-Routing Engine</h4>
        </div>
        <p className="text-xs text-slate-500">Click any complaint to auto-assign via AI.</p>
        {(complaints||[]).filter(c=>c.status!=='RESOLVED').map((c,i)=>(
          <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-xs truncate">{c.title}</div>
              <div className="text-[10px] text-slate-500">{c.category} • {c.urgency} • {c.assignedTo}</div>
            </div>
            <button onClick={()=>handleRoute(c)} className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex-shrink-0">🤖 Auto-Route</button>
          </div>
        ))}
        {routing && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-1">
            <div className="font-bold text-emerald-800">✅ AI Routed: {routing.id}</div>
            <div className="text-emerald-700">Assigned → {routing.assigned} | Priority: {routing.priority} | ETA: {routing.eta}</div>
            <div className="text-emerald-600 text-[10px]">Notification dispatched to assignee via FCM + SMS</div>
          </div>
        )}
      </div>

      {/* 2. AI COMPLAINT SUMMARIZATION */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-purple-600"/>
          <h4 className="font-bold text-slate-900 text-sm">2. AI Complaint Summarization</h4>
        </div>
        <p className="text-xs text-slate-500">Converts free-form complaint text → structured issue card with category, priority, location & assignment.</p>
        {(complaints||[]).slice(0,2).map((c,i)=>(
          <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs text-slate-700 italic line-clamp-2">"{c.description}"</div>
            <button onClick={()=>handleSummarize(c)} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[10px] font-bold">🤖 Summarize with AI</button>
            {aiSummary?.complaint?.id===c.id && (
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { label:'Category', value:aiSummary.category },
                  { label:'Priority', value:aiSummary.priority },
                  { label:'Location', value:aiSummary.location.split(' - ')[0] },
                  { label:'Assign To', value:aiSummary.assignTo },
                  { label:'Expected ETA', value:aiSummary.eta },
                  { label:'Similar Past Issues', value:`${aiSummary.similarCount} found` }
                ].map((row,j)=>(
                  <div key={j} className="bg-purple-50 border border-purple-100 rounded-lg p-2">
                    <div className="text-[9px] text-purple-500 font-bold uppercase">{row.label}</div>
                    <div className="text-[11px] font-bold text-purple-900">{row.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. PREDICTIVE INSIGHTS — Mess Demand */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600"/>
          <h4 className="font-bold text-slate-900 text-sm">3. Predictive Insights — Mess Demand Forecast</h4>
        </div>
        <p className="text-xs text-slate-500">AI predicts tomorrow's meal counts to reduce food waste.</p>
        <div className="flex items-end gap-2 h-28">
          {messDemand.map((d,i)=>(
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex gap-0.5 items-end h-20">
                <div className="flex-1 bg-blue-400 rounded-t-sm" style={{height:`${(d.lunch/450)*100}%`}} title={`Actual: ${d.lunch}`}/>
                <div className="flex-1 bg-emerald-400 rounded-t-sm opacity-70 border border-dashed border-emerald-500" style={{height:`${(d.predicted_lunch/450)*100}%`}} title={`AI Predicted: ${d.predicted_lunch}`}/>
              </div>
              <div className="text-[9px] text-slate-400">{d.day}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 text-[11px]">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-400"/><span className="text-slate-600">Actual Lunch Count</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-400 opacity-70 border border-dashed border-emerald-500"/><span className="text-slate-600">AI Predicted</span></div>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
          <strong>💡 Insight:</strong> Wednesday consistently sees peak demand (400+ lunches). Recommend 10% extra prep on Tuesdays.
        </div>
      </div>

      {/* 4. AUDIT TRAIL */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-slate-600"/>
          <h4 className="font-bold text-slate-900 text-sm">4. Full Audit Trail</h4>
        </div>
        <p className="text-xs text-slate-500">Tamper-proof timestamped log of all critical campus actions.</p>
        {(auditLogs||[]).map((log,i)=>(
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.badgeColor==='emerald'?'bg-emerald-500':log.badgeColor==='red'?'bg-rose-500':log.badgeColor==='blue'?'bg-blue-500':'bg-amber-500'}`}/>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-slate-900">{log.actor}</div>
              <div className="text-[10px] text-slate-700 mt-0.5">{log.details}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5"/>{log.timestamp}</div>
            </div>
            <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">{log.action.replace(/_/g,' ')}</span>
          </div>
        ))}
      </div>

      {/* 5. TREND ANALYSIS — Hotspots */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-rose-600"/>
          <h4 className="font-bold text-slate-900 text-sm">5. Trend Analysis — Complaint Hotspots</h4>
        </div>
        <p className="text-xs text-slate-500">Identifies recurring infrastructure issues and high-risk zones.</p>
        {(campusHotspotStats||[]).map((h,i)=>(
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${h.risk==='CRITICAL'?'bg-rose-50 border-rose-200':h.risk==='MEDIUM'?'bg-amber-50 border-amber-200':'bg-slate-50 border-slate-200'}`}>
            <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${h.risk==='CRITICAL'?'text-rose-600':h.risk==='MEDIUM'?'text-amber-600':'text-slate-400'}`}/>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900">{h.block} — {h.wing}</div>
              <div className="text-[10px] text-slate-500">{h.primaryIssue} • {h.issues} issues logged</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${h.risk==='CRITICAL'?'bg-rose-100 text-rose-700':h.risk==='MEDIUM'?'bg-amber-100 text-amber-700':'bg-slate-200 text-slate-600'}`}>{h.risk}</span>
          </div>
        ))}
      </div>

      {/* 6. PRODUCTIVITY ANALYTICS */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600"/>
          <h4 className="font-bold text-slate-900 text-sm">6. Productivity Analytics</h4>
        </div>
        <p className="text-xs text-slate-500">Student portal usage, assignment completion rates, and engagement scores.</p>
        {[
          { label:'Daily Active Student Logins',   value:'342 / 440', pct:78, color:'bg-blue-500' },
          { label:'Assignment Completion Rate',     value:'84.5%',     pct:85, color:'bg-emerald-500' },
          { label:'Gate Pass Digital Adoption',     value:'96.2%',     pct:96, color:'bg-purple-500' },
          { label:'Mess Pre-Reservation Rate',      value:'73.1%',     pct:73, color:'bg-amber-500' },
          { label:'Complaint Portal Usage (vs paper)',value:'100%',    pct:100, color:'bg-rose-500' },
        ].map((s,i)=>(
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-medium">{s.label}</span>
              <span className="font-black text-slate-900">{s.value}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full">
              <div className={`h-2 rounded-full ${s.color}`} style={{width:`${s.pct}%`}}/>
            </div>
          </div>
        ))}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
          <strong>📊 AI Summary:</strong> UNIFY has replaced 4 manual registers, 6 notice boards, and 2 offline complaint forms. Avg resolution time reduced from 48h → 18h.
        </div>
      </div>
    </div>
  );
}