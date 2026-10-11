import React, { useState, useEffect, useRef } from "react";
import { useCampus } from "../../context/CampusContext";
import { Bus, MapPin, Clock, Users, Navigation, Activity, Phone, AlertCircle } from "lucide-react";

// ── Route data with real 2D map coordinates ──────────────────────────────────
const BUS_ROUTES = [
  {
    id: "B1", name: "Campus Circular", color: "#3b82f6", textColor: "#1d4ed8",
    driver: "Santosh Kumar", phone: "9437001234", plate: "OD-02-B-1001",
    capacity: 42, occupancy: 28, status: "ON TIME", nextArrival: 3,
    stops: [
      { name: "Main Gate",      x: 50, y: 82, passed: true  },
      { name: "Academic Block", x: 30, y: 62, passed: true  },
      { name: "Library",        x: 18, y: 42, passed: false, current: true },
      { name: "Hostel A",       x: 72, y: 32, passed: false },
      { name: "Hostel B",       x: 82, y: 52, passed: false },
      { name: "Mess Hall",      x: 72, y: 68, passed: false },
      { name: "Main Gate",      x: 50, y: 82, passed: false },
    ],
    // SVG path through the stops
    path: "M 50,82 L 30,62 L 18,42 L 72,32 L 82,52 L 72,68 L 50,82",
    progressPct: 28, // % along full path where bus currently is
  },
  {
    id: "B2", name: "City Express", color: "#10b981", textColor: "#047857",
    driver: "Ravi Das", phone: "9437005678", plate: "OD-02-B-1002",
    capacity: 54, occupancy: 41, status: "ON TIME", nextArrival: 12,
    stops: [
      { name: "Main Gate",        x: 50, y: 82, passed: true  },
      { name: "Rourkela Station", x: 15, y: 55, passed: false, current: true },
      { name: "City Market",      x: 15, y: 30, passed: false },
      { name: "District Hospital",x: 50, y: 18, passed: false },
      { name: "Main Gate",        x: 50, y: 82, passed: false },
    ],
    path: "M 50,82 L 15,55 L 15,30 L 50,18 L 50,82",
    progressPct: 22,
  },
  {
    id: "B3", name: "Lab Shuttle", color: "#f59e0b", textColor: "#b45309",
    driver: "Birju Singh", phone: "9437009012", plate: "OD-02-B-1003",
    capacity: 30, occupancy: 12, status: "DELAYED", nextArrival: 7,
    stops: [
      { name: "Hostel A",     x: 72, y: 32, passed: false, current: true },
      { name: "Hostel B",     x: 82, y: 52, passed: false },
      { name: "Research Lab", x: 50, y: 22, passed: false },
      { name: "Canteen",      x: 30, y: 48, passed: false },
      { name: "Hostel A",     x: 72, y: 32, passed: false },
    ],
    path: "M 72,32 L 82,52 L 50,22 L 30,48 L 72,32",
    progressPct: 5,
  },
];

// Interpolate point along SVG path at a given percentage
function getBusPosition(stops, pct) {
  if (!stops.length) return { x: 50, y: 50 };
  const totalSegments = stops.length - 1;
  const progress = (pct / 100) * totalSegments;
  const seg = Math.min(Math.floor(progress), totalSegments - 1);
  const t = progress - seg;
  const a = stops[seg];
  const b = stops[Math.min(seg + 1, stops.length - 1)];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// Campus map landmark data for the SVG
const LANDMARKS = [
  { label: "Academic Block", x: 24, y: 60, w: 14, h: 10, color: "#172554" },
  { label: "Library",        x: 10, y: 38, w: 12, h: 10, color: "#2e1065" },
  { label: "Hostel A",       x: 66, y: 25, w: 14, h: 12, color: "#064e3b" },
  { label: "Hostel B",       x: 78, y: 44, w: 12, h: 12, color: "#065f46" },
  { label: "Mess Hall",      x: 62, y: 62, w: 14, h: 10, color: "#431407" },
  { label: "Research Lab",   x: 38, y: 14, w: 16, h: 12, color: "#1e1b4b" },
  { label: "Canteen",        x: 22, y: 42, w: 12, h: 8,  color: "#7c2d12" },
  { label: "Sports Ground",  x: 12, y: 64, w: 16, h: 16, color: "#052e16" },
];

export default function BusTracker() {
  const [sel, setSel]   = useState("B1");
  const [tick, setTick] = useState(0);
  const [busPos, setBusPos] = useState({});
  const [etaMap, setEtaMap] = useState({});

  // Tick every second — move bus, count down ETA
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Update bus positions and ETAs smoothly
  useEffect(() => {
    const newPos = {};
    const newEta = {};
    BUS_ROUTES.forEach(r => {
      // Bus moves ~0.03% per second along path
      const pct = (r.progressPct + tick * 0.04) % 100;
      newPos[r.id] = getBusPosition(r.stops, pct);
      // ETA counts down from nextArrival
      newEta[r.id] = Math.max(1, r.nextArrival - Math.floor(tick / 60));
    });
    setBusPos(newPos);
    setEtaMap(newEta);
  }, [tick]);

  const active  = BUS_ROUTES.find(r => r.id === sel) || BUS_ROUTES[0];
  const pos     = busPos[active.id] || { x: 50, y: 50 };
  const eta     = etaMap[active.id] || active.nextArrival;
  const occPct  = Math.round((active.occupancy / active.capacity) * 100);
  const currentStop = active.stops.find(s => s.current);

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden"
        style={{background:"linear-gradient(135deg,#064e3b,#065f46,#0f172a)"}}>
        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30 mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse"/> Live GPS Bus Tracker
          </div>
          <h2 className="text-xl font-black">TAT Campus Transport System</h2>
          <p className="text-xs text-emerald-200 mt-1">Trident Academy of Technology — Real-time bus tracking</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {BUS_ROUTES.map(r => (
              <button key={r.id} onClick={() => setSel(r.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${sel===r.id ? "bg-white text-slate-900 border-white shadow" : "bg-white/10 text-white border-white/25 hover:bg-white/20"}`}>
                <div className="w-2 h-2 rounded-full" style={{background: r.color}}/>
                {r.id} · {r.name}
                {r.status === "DELAYED" && <span className="text-amber-300 text-[9px] font-black">LATE</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── 2D MAP ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-xl">

          {/* Map topbar */}
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-white text-xs font-bold">{active.id} · {active.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold animate-pulse" style={{color: active.color}}>● LIVE</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active.status==="ON TIME" ? "bg-emerald-900/60 text-emerald-300" : "bg-amber-900/60 text-amber-300"}`}>
                {active.status}
              </span>
            </div>
          </div>

          {/* SVG map */}
          <div style={{position:"relative", height: 340}}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
              style={{position:"absolute", inset:0}}>

              {/* Dark road background */}
              <rect width="100" height="100" fill="#0f172a"/>

              {/* Grid */}
              <defs>
                <pattern id="btgrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#btgrid)"/>

              {/* Campus boundary */}
              <rect x="5" y="5" width="90" height="90" fill="none" stroke="#1e3a5f" strokeWidth="0.6" rx="2"/>

              {/* Roads (white lines = streets) */}
              <line x1="5"  y1="82" x2="95" y2="82" stroke="#1e293b" strokeWidth="3"/>
              <line x1="50" y1="5"  x2="50" y2="95" stroke="#1e293b" strokeWidth="2"/>
              <line x1="5"  y1="55" x2="95" y2="55" stroke="#1e293b" strokeWidth="1.5"/>
              <line x1="5"  y1="30" x2="95" y2="30" stroke="#1e293b" strokeWidth="1"/>

              {/* Main road labels */}
              <text x="75" y="80.5" fontSize="2" fill="#334155" fontWeight="bold">MAIN ROAD</text>

              {/* Landmarks */}
              {LANDMARKS.map((lm, i) => (
                <g key={i}>
                  <rect x={lm.x} y={lm.y} width={lm.w} height={lm.h}
                    fill={lm.color} stroke="#334155" strokeWidth="0.3" rx="0.8"/>
                  <text x={lm.x + lm.w/2} y={lm.y + lm.h/2 + 0.8}
                    textAnchor="middle" fontSize="1.8" fill="#94a3b8" fontWeight="bold">
                    {lm.label}
                  </text>
                </g>
              ))}

              {/* Main gate */}
              <rect x="44" y="88" width="12" height="5" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.4" rx="1"/>
              <text x="50" y="91.5" textAnchor="middle" fontSize="2" fill="white" fontWeight="bold">MAIN GATE</text>

              {/* All routes (dimmed) */}
              {BUS_ROUTES.filter(r => r.id !== active.id).map(r => (
                <path key={r.id} d={r.path} fill="none"
                  stroke={r.color} strokeWidth="0.5" strokeOpacity="0.25"
                  strokeDasharray="2,2"/>
              ))}

              {/* Active route path — dashed full */}
              <path d={active.path} fill="none"
                stroke={active.color} strokeWidth="1.2" strokeOpacity="0.3"
                strokeDasharray="3,2"/>

              {/* Active route — progress (solid) */}
              {active.stops.slice(0, active.stops.findIndex(s => s.current) + 1).map((_, i, arr) => {
                if (i === 0) return null;
                const a = active.stops[i-1], b = active.stops[i];
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={active.color} strokeWidth="1.5" strokeOpacity="0.9"/>;
              })}

              {/* Stop markers */}
              {active.stops.map((stop, i) => {
                const isDup = active.stops.findIndex(s => s.name === stop.name && s.x === stop.x && s.y === stop.y) !== i;
                if (isDup) return null;
                return (
                  <g key={i}>
                    <circle cx={stop.x} cy={stop.y} r={stop.current ? 2.5 : 1.8}
                      fill={stop.passed || stop.current ? active.color : "#1e293b"}
                      stroke="white" strokeWidth="0.6"/>
                    {stop.current && (
                      <circle cx={stop.x} cy={stop.y} r="4" fill="none"
                        stroke={active.color} strokeWidth="0.5" strokeOpacity="0.5"/>
                    )}
                    <text x={stop.x} y={stop.y - 3.5} textAnchor="middle"
                      fontSize="2" fill="white" fontWeight="bold"
                      style={{textShadow:"0 0 4px #000"}}>
                      {stop.name}
                    </text>
                  </g>
                );
              })}

              {/* Bus icon — animated, moves along path */}
              <g transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Glow ring */}
                <circle r="4.5" fill={active.color} fillOpacity="0.2"/>
                <circle r="3.2" fill={active.color} stroke="white" strokeWidth="0.8"/>
                {/* Bus symbol */}
                <rect x="-1.8" y="-1.2" width="3.6" height="2.4" fill="white" rx="0.4"/>
                <rect x="-1.2" y="-0.8" width="1" height="1" fill={active.color} rx="0.2"/>
                <rect x="0.2" y="-0.8" width="1" height="1" fill={active.color} rx="0.2"/>
                <circle cx="-1.0" cy="1.1" r="0.5" fill="#0f172a"/>
                <circle cx="1.0"  cy="1.1" r="0.5" fill="#0f172a"/>
                {/* Pulse ring */}
                <circle r="5" fill="none" stroke={active.color} strokeWidth="0.5"
                  strokeOpacity={tick % 2 === 0 ? 0.8 : 0.2}/>
              </g>

            </svg>

            {/* ETA overlay bottom */}
            <div style={{
              position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)",
              background:"rgba(15,23,42,0.92)",
              border: `1px solid ${active.color}44`,
              borderRadius:12, padding:"6px 16px", whiteSpace:"nowrap",
              display:"flex", alignItems:"center", gap:8,
            }}>
              <div style={{width:8, height:8, borderRadius:"50%", background:active.color, animation:"ping 1s infinite"}}/>
              <span style={{color:"white", fontWeight:"bold", fontSize:12}}>
                Bus {active.id} arrives in
              </span>
              <span style={{color:active.color, fontWeight:900, fontSize:14}}>{eta} min</span>
              <span style={{color:"#64748b", fontSize:10}}>• {currentStop?.name || active.stops[0].name}</span>
            </div>
          </div>
        </div>

        {/* ── INFO PANEL ──────────────────────────────────────────── */}
        <div className="space-y-3">

          {/* ETA card */}
          <div className="rounded-2xl p-4 text-white shadow-lg"
            style={{background:`linear-gradient(135deg,${active.color}dd,${active.color}88)`}}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold opacity-80">Next Arrival at Main Gate</span>
              <Activity className="w-4 h-4 animate-pulse"/>
            </div>
            <div className="text-4xl font-black">{eta}<span className="text-lg font-bold ml-1">min</span></div>
            <div className="text-xs opacity-75 mt-1">Bus {active.id} · {active.plate}</div>
            <div className="mt-3 text-xs opacity-80 flex items-center gap-1.5">
              <MapPin className="w-3 h-3"/> Currently at: <strong>{currentStop?.name || "En route"}</strong>
            </div>
          </div>

          {/* Bus details */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Bus Info</h4>
            {[
              ["Route",   active.name],
              ["Plate",   active.plate],
              ["Driver",  active.driver],
              ["Status",  active.status],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{k}</span>
                <span className={`text-xs font-bold ${k==="Status" ? (v==="ON TIME"?"text-emerald-600":"text-amber-600") : "text-slate-900"}`}>{v}</span>
              </div>
            ))}
            {/* Occupancy bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1"><Users className="w-3 h-3"/> Occupancy</span>
                <span className={`font-bold ${occPct>85?"text-rose-600":occPct>60?"text-amber-600":"text-emerald-600"}`}>
                  {active.occupancy}/{active.capacity}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${occPct>85?"bg-rose-500":occPct>60?"bg-amber-500":"bg-emerald-500"}`}
                  style={{width:`${occPct}%`}}/>
              </div>
              <div className="text-[10px] text-slate-400 text-right mt-0.5">{active.capacity-active.occupancy} seats available</div>
            </div>
            {/* Call driver */}
            <a href={`tel:${active.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold text-white"
              style={{background: active.color}}>
              <Phone className="w-3.5 h-3.5"/> Call Driver: {active.phone}
            </a>
          </div>

          {/* All routes summary */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">All Routes</h4>
            {BUS_ROUTES.map(r => {
              const rEta = etaMap[r.id] || r.nextArrival;
              return (
                <button key={r.id} onClick={() => setSel(r.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${sel===r.id ? "border-slate-300 bg-slate-50" : "border-transparent hover:bg-slate-50"}`}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{background:r.color+"20", border:`1px solid ${r.color}40`}}>
                    <Bus className="w-4 h-4" style={{color:r.color}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{r.id} · {r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.stops.length-1} stops</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black" style={{color:r.color}}>{rEta}m</div>
                    <div className={`text-[9px] font-bold ${r.status==="ON TIME"?"text-emerald-600":"text-amber-600"}`}>{r.status}</div>
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