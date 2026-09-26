import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { Shield, QrCode, CheckCircle2, XCircle, Clock, Users, AlertTriangle, BarChart3, UserPlus, Activity, Eye } from 'lucide-react';

const TABS = [
  { id:'scanner',  label:'QR Scanner',     icon: QrCode },
  { id:'visitors', label:'Visitor Logs',   icon: Users },
  { id:'prereg',   label:'Pre-Register',   icon: UserPlus },
  { id:'audit',    label:'Security Audit', icon: BarChart3 },
];

export default function GuardTerminal() {
  const { currentPersona, visitorLogs, gatePasses } = useCampus();
  const [tab, setTab] = useState('scanner');
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [preRegForm, setPreRegForm] = useState({ name:'', phone:'', visiting:'', date:'', purpose:'' });
  const [preRegSent, setPreRegSent] = useState(false);

  const p = currentPersona;

  const handleScan = () => {
    if (!qrInput.trim()) return;
    const token = qrInput.trim().toUpperCase();
    const pass = (gatePasses||[]).find(gp => gp.qrToken === token || gp.id === token);
    if (pass) {
      setScanResult({ found:true, pass });
    } else {
      setScanResult({ found:false, token });
    }
    setQrInput('');
  };

  const demoScan = (token) => {
    const pass = (gatePasses||[]).find(gp => gp.qrToken === token);
    setScanResult(pass ? { found:true, pass } : { found:false, token });
  };

  const auditStats = [
    { label:'Total Entries Today',    value: 284, icon: Activity, color:'text-blue-600',   bg:'bg-blue-50 border-blue-200' },
    { label:'Total Exits Today',      value: 261, icon: Shield,   color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200' },
    { label:'Currently On Campus',    value: 23,  icon: Users,    color:'text-purple-600',  bg:'bg-purple-50 border-purple-200' },
    { label:'Alerts / Overdue',       value: (gatePasses||[]).filter(gp=>gp.status==='OVERDUE').length, icon:AlertTriangle, color:'text-rose-600', bg:'bg-rose-50 border-rose-200' },
    { label:'Visitors On Campus',     value: (visitorLogs||[]).filter(v=>v.status==='ON_CAMPUS').length, icon: Eye, color:'text-amber-600', bg:'bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-500/30 mb-2">
            <Shield className="w-3 h-3"/>Security Command Post
          </div>
          <h2 className="text-xl font-black">Gate Control — {p.name} 🛡️</h2>
          <p className="text-xs text-amber-100/80 mt-0.5">{p.post} • Shift: {p.shift}</p>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
            {[
              { label:'Approved Passes', value:(gatePasses||[]).filter(gp=>gp.status==='APPROVED').length },
              { label:'Checked Out',     value:(gatePasses||[]).filter(gp=>gp.status==='CHECKED_OUT').length },
              { label:'Overdue',         value:(gatePasses||[]).filter(gp=>gp.status==='OVERDUE').length }
            ].map((k,i)=>(
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                <div className="text-[9px] text-amber-200">{k.label}</div>
                <div className="text-lg font-black text-white">{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {TABS.map(({id,label,icon:Icon})=>(
          <button key={id} onClick={()=>setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${tab===id?'bg-white text-amber-700 shadow-sm':'text-slate-500 hover:text-slate-800'}`}>
            <Icon className="w-3 h-3"/>{label}
          </button>
        ))}
      </div>

      {/* ══ QR SCANNER ══ */}
      {tab==='scanner' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><QrCode className="w-4 h-4 text-amber-600"/>QR / Token Verification</h4>
            <div className="flex gap-2">
              <input value={qrInput} onChange={e=>setQrInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleScan()}
                placeholder="Scan QR or type pass ID / token..."
                className="flex-1 p-3 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 font-mono"/>
              <button onClick={handleScan} className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all">VERIFY</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <p className="text-[11px] text-slate-500 w-full">Demo — click to scan:</p>
              {(gatePasses||[]).map(gp=>(
                <button key={gp.id} onClick={()=>demoScan(gp.qrToken)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 border border-slate-200 text-[10px] font-mono text-slate-700 transition-all">
                  {gp.id}
                </button>
              ))}
            </div>
          </div>

          {scanResult && (
            <div className={`bg-white rounded-2xl p-5 border-2 shadow-sm space-y-3 ${scanResult.found&&scanResult.pass.status==='APPROVED'?'border-emerald-400':'border-rose-400'}`}>
              <div className={`flex items-center gap-3 p-4 rounded-xl ${scanResult.found&&scanResult.pass.status==='APPROVED'?'bg-emerald-50':'bg-rose-50'}`}>
                {scanResult.found && scanResult.pass.status==='APPROVED'
                  ? <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0"/>
                  : <XCircle className="w-8 h-8 text-rose-600 flex-shrink-0"/>
                }
                <div>
                  <div className={`font-black text-base ${scanResult.found&&scanResult.pass.status==='APPROVED'?'text-emerald-800':'text-rose-800'}`}>
                    {!scanResult.found ? '❌ INVALID TOKEN — Deny Entry'
                     : scanResult.pass.status==='APPROVED' ? '✅ VERIFIED — Permit Exit'
                     : scanResult.pass.status==='CHECKED_OUT' ? '⚠️ Already Checked Out'
                     : scanResult.pass.status==='OVERDUE' ? '🚨 OVERDUE PASS — Alert Warden'
                     : `STATUS: ${scanResult.pass.status}`}
                  </div>
                  {!scanResult.found && <div className="text-xs text-rose-600 mt-0.5">Token not found in system</div>}
                </div>
              </div>
              {scanResult.found && scanResult.pass && (
                <div className="space-y-2 text-xs">
                  {[
                    { label:'Student', value:`${scanResult.pass.studentName} (${scanResult.pass.regNo})` },
                    { label:'Room', value:scanResult.pass.room },
                    { label:'Destination', value:scanResult.pass.destination },
                    { label:'Return By', value:scanResult.pass.expectedInTime },
                    { label:'Approved By', value:scanResult.pass.approvedBy },
                    { label:'Emergency Contact', value:scanResult.pass.emergencyPhone },
                  ].map((row,i)=>(
                    <div key={i} className="flex gap-2 py-1 border-b border-slate-100 last:border-0">
                      <span className="w-28 text-slate-500 font-medium flex-shrink-0">{row.label}</span>
                      <span className="font-bold text-slate-900">{row.value}</span>
                    </div>
                  ))}
                  {scanResult.pass.approvalChain && (
                    <div className="flex gap-2 py-1">
                      <span className="w-28 text-slate-500 font-medium flex-shrink-0">Approval Chain</span>
                      <div className="flex flex-wrap gap-1">
                        {scanResult.pass.approvalChain.map((step,i)=>(
                          <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">{step}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {scanResult.pass.status==='APPROVED' && (
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all">✅ Confirm Exit — Open Barrier</button>
                      <button className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all">📞 Log Entry Return</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ VISITOR LOGS ══ */}
      {tab==='visitors' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">👥 Live Visitor Entry & Gate Log</h4>
            {(visitorLogs||[]).map((v,i)=>(
              <div key={i} className={`p-4 rounded-xl border ${v.status==='ON_CAMPUS'?'bg-blue-50 border-blue-200':'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{v.visitorName}</div>
                    <div className="text-[11px] text-slate-500">{v.relation} • Visiting: {v.visiting}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{v.phone} • Vehicle: {v.vehicleNo}</div>
                    <div className="text-[10px] text-slate-500 mt-1">In: {v.inTime}{v.outTime?` → Out: ${v.outTime}`:' → Still On Campus'}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status==='ON_CAMPUS'?'bg-blue-100 text-blue-700 animate-pulse':'bg-slate-200 text-slate-600'}`}>
                      {v.status==='ON_CAMPUS'?'ON CAMPUS':'CHECKED OUT'}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400">{v.passBadge}</div>
                  </div>
                </div>
                {v.status==='ON_CAMPUS' && (
                  <button className="mt-2 w-full py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold">Log Exit & Open Gate</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ VISITOR PRE-REGISTRATION ══ */}
      {tab==='prereg' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          {preRegSent?(
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto"/>
              <h4 className="font-black text-slate-900">Pre-Registration Complete</h4>
              <p className="text-xs text-slate-500">A QR code entry pass has been sent to the visitor's mobile number. Guard shift will be notified automatically.</p>
              <button onClick={()=>setPreRegSent(false)} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold">Register Another</button>
            </div>
          ):(
            <>
              <h4 className="font-bold text-slate-900 text-sm">📲 Visitor Pre-Registration</h4>
              <p className="text-xs text-slate-500">Pre-register visitors so they receive a QR code before arriving at gate.</p>
              {[['Visitor Name','name','Full name...'],['Phone Number','phone','+91 XXXXX XXXXX'],['Visiting (Student/Staff)','visiting','Who are they visiting?'],['Visit Date','date','date'],['Purpose of Visit','purpose','e.g. Parent meeting, vendor delivery...']].map(([lbl,key,ph])=>(
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{lbl}</label>
                  <input type={key==='date'?'date':'text'} placeholder={ph} value={preRegForm[key]}
                    onChange={e=>setPreRegForm(p=>({...p,[key]:e.target.value}))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"/>
                </div>
              ))}
              <button disabled={!preRegForm.name||!preRegForm.phone} onClick={()=>setPreRegSent(true)}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold transition-all">
                📲 Generate & Send Visitor QR Pass
              </button>
            </>
          )}
        </div>
      )}

      {/* ══ SECURITY AUDIT DASHBOARD ══ */}
      {tab==='audit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {auditStats.map((s,i)=>{
              const Icon = s.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl border ${s.bg}`}>
                  <Icon className={`w-5 h-5 ${s.color} mb-2`}/>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">🚨 Overdue Pass Alerts</h4>
            {(gatePasses||[]).filter(gp=>gp.status==='OVERDUE').map((gp,i)=>(
              <div key={i} className="p-4 rounded-xl bg-rose-50 border border-rose-300 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-rose-900">{gp.studentName}</div>
                  <span className="text-[10px] font-black text-white bg-rose-600 px-2 py-0.5 rounded-full animate-pulse">OVERDUE</span>
                </div>
                <div className="text-[11px] text-rose-700">Room {gp.room} • Was due: {gp.expectedInTime}</div>
                <div className="text-[11px] text-slate-600">{gp.destination}</div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold">Alert Warden</button>
                  <a href={`tel:${gp.emergencyPhone}`} className="flex-1 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-bold text-center">📞 Call Guardian</a>
                </div>
              </div>
            ))}
            {(gatePasses||[]).filter(gp=>gp.status==='OVERDUE').length===0 && (
              <div className="py-8 text-center text-xs text-slate-500">✅ No overdue passes right now. All clear.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}