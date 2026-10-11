import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { MapPin, AlertTriangle, CheckCircle2, Wrench, Zap, Droplets, Wifi } from 'lucide-react';

const HOTSPOTS = [
  { id:1, name:'Hostel Block A',  x:72,  y:38,  complaints:8, risk:'CRITICAL', issue:'Plumbing',      color:'#ef4444' },
  { id:2, name:'Hostel Block B',  x:72,  y:55,  complaints:5, risk:'MEDIUM',   issue:'Electrical',    color:'#f59e0b' },
  { id:3, name:'Mess Hall',       x:72,  y:70,  complaints:3, risk:'LOW',       issue:'Cleanliness',   color:'#22c55e' },
  { id:4, name:'Academic Block',  x:30,  y:28,  complaints:6, risk:'MEDIUM',   issue:'Wi-Fi & IT',    color:'#f59e0b' },
  { id:5, name:'Library',         x:18,  y:48,  complaints:1, risk:'LOW',       issue:'Furniture',     color:'#22c55e' },
  { id:6, name:'Sports Ground',   x:20,  y:72,  complaints:4, risk:'LOW',       issue:'Drainage',      color:'#22c55e' },
  { id:7, name:'Main Gate',       x:50,  y:90,  complaints:2, risk:'LOW',       issue:'Lighting',      color:'#22c55e' },
  { id:8, name:'Research Lab',    x:50,  y:28,  complaints:7, risk:'CRITICAL',  issue:'Electrical',    color:'#ef4444' },
];

const RISK_CONFIG = {
  CRITICAL: { bg:'bg-rose-50', border:'border-rose-300', text:'text-rose-700', badge:'bg-rose-100 text-rose-700', icon:AlertTriangle },
  MEDIUM:   { bg:'bg-amber-50', border:'border-amber-300', text:'text-amber-700', badge:'bg-amber-100 text-amber-700', icon:Wrench },
  LOW:      { bg:'bg-emerald-50', border:'border-emerald-300', text:'text-emerald-700', badge:'bg-emerald-100 text-emerald-700', icon:CheckCircle2 },
};

const ISSUE_ICONS = { Plumbing:'💧', Electrical:'⚡', 'Wi-Fi & IT':'📶', Cleanliness:'🧹', Furniture:'🪑', Drainage:'🌊', Lighting:'💡' };

export default function CampusMap() {
  const { complaints } = useCampus();
  const [selectedPin, setSelectedPin] = useState(null);
  const [mapFilter, setMapFilter]     = useState('ALL');

  const filtered = mapFilter === 'ALL' ? HOTSPOTS : HOTSPOTS.filter(h => h.risk === mapFilter);

  const totalComplaints = HOTSPOTS.reduce((s,h)=>s+h.complaints,0);
  const critical = HOTSPOTS.filter(h=>h.risk==='CRITICAL').length;

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden"
        style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f,#0f172a)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 20% 50%,#3b82f622,transparent 50%),radial-gradient(circle at 80% 20%,#7c3aed22,transparent 50%)'}}/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-3">
            <MapPin className="w-3.5 h-3.5"/> Campus Infrastructure Map
          </div>
          <h2 className="text-xl font-black">Trident Academy — Live Complaint Heatmap</h2>
          <p className="text-xs text-blue-200 mt-1">Hover / click pins to see complaint details per zone</p>
          <div className="flex gap-4 mt-4">
            {['ALL','CRITICAL','MEDIUM','LOW'].map(f=>(
              <button key={f} onClick={()=>setMapFilter(f)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${mapFilter===f?'bg-white text-slate-900 border-white':'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* SVG Campus Map */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-white text-xs font-bold">TAT Campus — Infrastructure Heatmap</span>
            </div>
            <div className="flex items-center gap-3">
              {[{label:'Critical',color:'#ef4444'},{label:'Medium',color:'#f59e0b'},{label:'Low',color:'#22c55e'}].map(l=>(
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{background:l.color}}/>
                  <span className="text-[10px] text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" style={{height:380}}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{position:'absolute',inset:0}}>
              {/* Background */}
              <rect width="100" height="100" fill="#0a1628"/>
              {/* Grid */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1a2744" strokeWidth="0.3"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)"/>
              {/* Campus boundary */}
              <rect x="5" y="5" width="90" height="90" fill="none" stroke="#1e3a5f" strokeWidth="0.5" rx="2"/>
              {/* Garden */}
              <rect x="30" y="50" width="25" height="20" fill="#052e16" stroke="#14532d" strokeWidth="0.3" rx="1"/>
              <text x="42" y="62" textAnchor="middle" fontSize="2.5" fill="#14532d" fontWeight="bold">Garden</text>
              {/* Main road */}
              <rect x="5" y="83" width="90" height="6" fill="#111d2e" stroke="#243450" strokeWidth="0.2"/>
              <line x1="5" y1="86" x2="95" y2="86" stroke="#2d4a6b" strokeWidth="0.3" strokeDasharray="3,3"/>
              <text x="50" y="87.5" textAnchor="middle" fontSize="2" fill="#334155" fontWeight="bold" letterSpacing="0.5">MAIN CAMPUS ROAD</text>
              {/* Buildings */}
              <rect x="22" y="22" width="20" height="12" fill="#172554" stroke="#3b82f655" strokeWidth="0.4" rx="1"/>
              <text x="32" y="29.5" textAnchor="middle" fontSize="2.5" fill="#93c5fd" fontWeight="bold">Academic A</text>
              <rect x="44" y="22" width="12" height="10" fill="#1e1b4b" stroke="#7c3aed55" strokeWidth="0.4" rx="1"/>
              <text x="50" y="28" textAnchor="middle" fontSize="2.2" fill="#a78bfa" fontWeight="bold">Research</text>
              <rect x="10" y="42" width="12" height="12" fill="#2e1065" stroke="#7c3aed55" strokeWidth="0.4" rx="1"/>
              <text x="16" y="50" textAnchor="middle" fontSize="2.2" fill="#c4b5fd" fontWeight="bold">Library</text>
              <rect x="62" y="30" width="20" height="15" fill="#0c4a6e" stroke="#06b6d455" strokeWidth="0.4" rx="1"/>
              <text x="72" y="39.5" textAnchor="middle" fontSize="2.2" fill="#67e8f9" fontWeight="bold">Hostel A</text>
              <rect x="62" y="49" width="20" height="12" fill="#064e3b" stroke="#10b98155" strokeWidth="0.4" rx="1"/>
              <text x="72" y="56.5" textAnchor="middle" fontSize="2.2" fill="#6ee7b7" fontWeight="bold">Hostel B</text>
              <rect x="62" y="65" width="16" height="10" fill="#431407" stroke="#f9731655" strokeWidth="0.4" rx="1"/>
              <text x="70" y="71.5" textAnchor="middle" fontSize="2.2" fill="#fdba74" fontWeight="bold">Mess</text>
              <rect x="10" y="64" width="18" height="12" fill="#0c4a6e" stroke="#06b6d444" strokeWidth="0.4" rx="1"/>
              <text x="19" y="71.5" textAnchor="middle" fontSize="2.2" fill="#7dd3fc" fontWeight="bold">Sports</text>
            </svg>

            {/* Interactive hotspot pins */}
            {filtered.map(h => (
              <button key={h.id}
                onClick={()=>setSelectedPin(selectedPin?.id===h.id ? null : h)}
                title={h.name}
                style={{
                  position:'absolute',
                  left:`${h.x}%`, top:`${h.y}%`,
                  transform:'translate(-50%,-50%)',
                  zIndex:10,
                }}>
                {/* Pulse ring */}
                <div style={{
                  position:'absolute',inset:-6,borderRadius:'50%',
                  background:`${h.color}25`,border:`1px solid ${h.color}44`,
                  animation:'pulse 2s infinite',
                }}/>
                {/* Pin */}
                <div style={{
                  width:22,height:22,borderRadius:'50%',
                  background:h.color,
                  border:'2px solid white',
                  boxShadow:`0 0 12px ${h.color}88`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:10,position:'relative',
                  transition:'transform 0.15s',
                  transform: selectedPin?.id===h.id ? 'scale(1.3)' : 'scale(1)',
                }}>
                  {ISSUE_ICONS[h.issue]}
                </div>

                {/* Tooltip */}
                {selectedPin?.id===h.id && (
                  <div style={{
                    position:'absolute',bottom:'calc(100% + 8px)',left:'50%',
                    transform:'translateX(-50%)',
                    background:'#0f172a',border:'1px solid #1e293b',
                    borderRadius:10,padding:'6px 10px',
                    minWidth:130,zIndex:20,
                    boxShadow:'0 8px 24px rgba(0,0,0,0.5)',
                  }}>
                    <div style={{color:'white',fontWeight:'bold',fontSize:10}}>{h.name}</div>
                    <div style={{color:h.color,fontSize:9,fontWeight:'bold',marginTop:2}}>{h.risk} RISK</div>
                    <div style={{color:'#94a3b8',fontSize:9}}>{h.issue} • {h.complaints} complaints</div>
                    <div style={{
                      position:'absolute',top:'100%',left:'50%',transform:'translateX(-50%)',
                      width:0,height:0,borderLeft:'5px solid transparent',
                      borderRight:'5px solid transparent',borderTop:'5px solid #1e293b',
                    }}/>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats panel */}
        <div className="space-y-3">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="stat-blue rounded-2xl p-3 text-center">
              <div className="text-2xl font-black">{totalComplaints}</div>
              <div className="text-[10px] opacity-80 font-bold mt-0.5">Total Issues</div>
            </div>
            <div className="stat-rose rounded-2xl p-3 text-center">
              <div className="text-2xl font-black">{critical}</div>
              <div className="text-[10px] opacity-80 font-bold mt-0.5">Critical Zones</div>
            </div>
          </div>

          {/* Hotspot list */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">All Zones</h4>
            {HOTSPOTS.sort((a,b)=>b.complaints-a.complaints).map(h=>{
              const cfg = RISK_CONFIG[h.risk];
              const Icon = cfg.icon;
              return (
                <button key={h.id} onClick={()=>setSelectedPin(selectedPin?.id===h.id?null:h)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${cfg.bg} ${cfg.border}`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{background:h.color+'22'}}>
                    {ISSUE_ICONS[h.issue]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{h.name}</div>
                    <div className={`text-[10px] font-bold ${cfg.text}`}>{h.issue}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black" style={{color:h.color}}>{h.complaints}</div>
                    <div className="text-[9px] text-slate-400">cases</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}