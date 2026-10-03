import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  Bell, CheckCircle2, AlertTriangle, Clock, Send, BarChart3,
  MessageSquare, Filter, Moon, Calendar, Zap, Users
} from 'lucide-react';

const PRIORITY_CONFIG = {
  HIGH:   { color:'text-rose-700',   bg:'bg-rose-50 border-rose-300',   dot:'bg-rose-500'   },
  MEDIUM: { color:'text-amber-700',  bg:'bg-amber-50 border-amber-300', dot:'bg-amber-500'  },
  NORMAL: { color:'text-blue-700',   bg:'bg-blue-50 border-blue-200',   dot:'bg-blue-400'   },
};

export default function NoticeBoard() {
  const { notices, activeRole, acknowledgeNotice, publishNotice, currentPersona } = useCampus();
  const [filter, setFilter] = useState('ALL');
  const [composeOpen, setComposeOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const [form, setForm] = useState({
    title:'', content:'', priority:'NORMAL', target:'All Students',
    channels:['FCM Push'], scheduleType:'now', scheduleTime:''
  });
  const [sent, setSent] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [ratings, setRatings] = useState({});

  const canPublish = ['warden','teacher','principal','messManager'].includes(activeRole);
  const filtered = filter === 'ALL' ? (notices||[]) : (notices||[]).filter(n => n.priority === filter);

  const handlePublish = () => {
    if (!form.title || !form.content) return;
    publishNotice({
      title: form.title, content: form.content,
      priority: form.priority, target: form.target,
      sender: currentPersona?.name || 'Admin',
      date: new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
      channels: form.channels, actionRequired: form.priority === 'HIGH',
      hasUserAcknowledged: false, readReceiptsCount: 0, totalTargetUsers: 440,
      quietHoursExempt: form.priority === 'HIGH'
    });
    setSent(true);
    setTimeout(() => { setSent(false); setComposeOpen(false); setForm({ title:'', content:'', priority:'NORMAL', target:'All Students', channels:['FCM Push'], scheduleType:'now', scheduleTime:'' }); }, 2500);
  };

  const toggleChannel = (ch) => setForm(p => ({
    ...p, channels: p.channels.includes(ch) ? p.channels.filter(c=>c!==ch) : [...p.channels, ch]
  }));

  const totalNotices = (notices||[]).length;
  const avgReadRate = Math.round(((notices||[]).reduce((s,n)=> s+(n.readReceiptsCount||0),0) / (notices||[]).reduce((s,n)=> s+(n.totalTargetUsers||1),0))*100);
  const highPriority = (notices||[]).filter(n=>n.priority==='HIGH').length;
  const unread = (notices||[]).filter(n=>!n.hasUserAcknowledged&&n.actionRequired).length;

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30 mb-2">
            <Bell className="w-3 h-3"/>Communication Hub
          </div>
          <h2 className="text-xl font-black">Digital Notice Board 📢</h2>
          <p className="text-xs text-blue-100/80 mt-0.5">Targeted push • SMS fallback • Read receipts • Analytics</p>
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10">
            {[
              { label:'Total Notices', value:totalNotices },
              { label:'Avg Read Rate', value:`${avgReadRate}%` },
              { label:'High Priority', value:highPriority },
              { label:'Pending Action', value:unread }
            ].map((k,i)=>(
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                <div className="text-[9px] text-blue-200">{k.label}</div>
                <div className="text-base font-black text-white">{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {['ALL','HIGH','MEDIUM','NORMAL'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter===f?'bg-white text-blue-700 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
              {f==='ALL'?'All':f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {/* Quiet mode toggle */}
          <button onClick={()=>setQuietMode(!quietMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${quietMode?'bg-slate-800 text-white border-slate-700':'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            <Moon className="w-3.5 h-3.5"/>
            {quietMode?'Quiet ON':'Quiet Hours'}
          </button>
          {/* Analytics */}
          <button onClick={()=>setAnalyticsOpen(!analyticsOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition-all">
            <BarChart3 className="w-3.5 h-3.5"/>Analytics
          </button>
          {/* Compose */}
          {canPublish && (
            <button onClick={()=>setComposeOpen(!composeOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all">
              <Send className="w-3.5 h-3.5"/>Compose
            </button>
          )}
        </div>
      </div>

      {/* Quiet hours notice */}
      {quietMode && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white">
          <Moon className="w-5 h-5 text-slate-300 flex-shrink-0"/>
          <div>
            <div className="text-sm font-bold">Quiet Hours Active (10 PM – 7 AM)</div>
            <div className="text-xs text-slate-400">Non-urgent notifications are paused. Emergency & HIGH priority alerts will still get through.</div>
          </div>
        </div>
      )}

      {/* Analytics panel */}
      {analyticsOpen && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-600"/>Notification Analytics</h4>
          <div className="space-y-3">
            {(notices||[]).map((n,i)=>{
              const rate = n.totalTargetUsers ? Math.round((n.readReceiptsCount/n.totalTargetUsers)*100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate flex-1 mr-2">{n.title}</span>
                    <span className="font-black text-slate-900 flex-shrink-0">{rate}% read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full">
                      <div className={`h-2 rounded-full ${rate>=80?'bg-emerald-500':rate>=50?'bg-blue-500':'bg-amber-500'}`} style={{width:`${rate}%`}}/>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{n.readReceiptsCount}/{n.totalTargetUsers}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {(n.channels||[]).map((ch,j)=>(
                      <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{ch}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compose panel */}
      {composeOpen && canPublish && (
        <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm space-y-4">
          {sent ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto"/>
              <h4 className="font-black text-slate-900">Notice Published!</h4>
              <p className="text-xs text-slate-500">Dispatched via {form.channels.join(', ')} to {form.target}.</p>
            </div>
          ):(
            <>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Send className="w-4 h-4 text-blue-600"/>Compose & Send Notice</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400">
                    <option>NORMAL</option><option>MEDIUM</option><option>HIGH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select value={form.target} onChange={e=>setForm(p=>({...p,target:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400">
                    <option>All Students</option><option>Hostel Residents</option>
                    <option>CSE Department</option><option>Final Year</option>
                    <option>All Faculty</option><option>All Campus</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}
                  placeholder="Clear, specific title..." className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Content *</label>
                <textarea rows={3} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))}
                  placeholder="Full notice content..." className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 resize-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Delivery Channels</label>
                <div className="flex gap-2 flex-wrap">
                  {['📱 FCM Push','💬 SMS','✉️ Email'].map(ch=>(
                    <label key={ch} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${form.channels.includes(ch)?'bg-blue-50 border-blue-400 text-blue-700':'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <input type="checkbox" checked={form.channels.includes(ch)} onChange={()=>toggleChannel(ch)} className="w-3.5 h-3.5 accent-blue-600"/>
                      {ch}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Schedule</label>
                <select value={form.scheduleType} onChange={e=>setForm(p=>({...p,scheduleType:e.target.value}))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="now">Send Immediately</option>
                  <option value="tomorrow">Schedule: Tomorrow 9 AM</option>
                  <option value="custom">Schedule: Custom Time</option>
                </select>
              </div>
              {form.scheduleType==='custom' && (
                <input type="datetime-local" value={form.scheduleTime} onChange={e=>setForm(p=>({...p,scheduleTime:e.target.value}))}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"/>
              )}
              <button onClick={handlePublish} disabled={!form.title||!form.content}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
                <Send className="w-3.5 h-3.5"/>
                {form.scheduleType==='now'?`Publish Now via ${form.channels.length} channel(s)`:'Schedule Notice'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Notice list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">No notices found.</div>
        )}
        {filtered.map((notice, i) => {
          const cfg = PRIORITY_CONFIG[notice.priority] || PRIORITY_CONFIG.NORMAL;
          const readRate = notice.totalTargetUsers ? Math.round((notice.readReceiptsCount/notice.totalTargetUsers)*100) : 0;
          return (
            <div key={i} className={`bg-white rounded-2xl p-4 border-l-4 shadow-sm space-y-3 ${notice.priority==='HIGH'?'border-l-rose-500':notice.priority==='MEDIUM'?'border-l-amber-500':'border-l-blue-400'} border border-slate-200`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}/>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                      {notice.priority}
                    </span>
                    {notice.quietHoursExempt && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300">EXEMPT FROM QUIET HOURS</span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{notice.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notice.content}</p>
                </div>
                {notice.hasUserAcknowledged
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"/>
                  : notice.actionRequired && <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse"/>
                }
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{notice.target}</span>
                <span>•</span>
                <span>{notice.sender}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{notice.date}</span>
              </div>

              {/* Channels */}
              <div className="flex gap-1.5 flex-wrap">
                {(notice.channels||[]).map((ch,j)=>(
                  <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">{ch}</span>
                ))}
              </div>

              {/* Read receipt bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Read receipts</span>
                  <span className="font-bold text-slate-700">{notice.readReceiptsCount}/{notice.totalTargetUsers} ({readRate}%)</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div className={`h-1.5 rounded-full transition-all ${readRate>=80?'bg-emerald-500':readRate>=50?'bg-blue-400':'bg-amber-400'}`} style={{width:`${readRate}%`}}/>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {!notice.hasUserAcknowledged && notice.actionRequired && (
                  <button onClick={()=>acknowledgeNotice(notice.id)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all">
                    ✅ Mark as Read
                  </button>
                )}
                {notice.hasUserAcknowledged && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5"/>Acknowledged
                  </span>
                )}
                {/* Feedback after complaint resolution */}
                {notice.priority==='NORMAL' && !ratings[notice.id] && (
                  <button onClick={()=>setFeedbackModal(notice.id)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <MessageSquare className="w-3 h-3 inline mr-1"/>Rate
                  </button>
                )}
                {ratings[notice.id] && (
                  <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                    {'⭐'.repeat(ratings[notice.id])} Rated
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={()=>setFeedbackModal(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4" onClick={e=>e.stopPropagation()}>
            <h4 className="font-black text-slate-900">Rate this notification</h4>
            <p className="text-xs text-slate-500">Was this notice useful and clear?</p>
            <div className="flex gap-3 justify-center">
              {[1,2,3,4,5].map(star=>(
                <button key={star} onClick={()=>{ setRatings(r=>({...r,[feedbackModal]:star})); setFeedbackModal(null); }}
                  className="text-3xl transition-transform hover:scale-125 active:scale-110">
                  {ratings[feedbackModal]>=star?'⭐':'☆'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}