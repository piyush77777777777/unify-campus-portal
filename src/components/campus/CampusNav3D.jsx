import React, { useState } from "react";
import { Search, MapPin, X, Navigation, Layers } from "lucide-react";

// SVG scanline pattern id referenced in defs below
const SCAN_ID = "scanlines";

// ── Isometric projection ────────────────────────────────────────────────────
const S = 20; // scale
const iso = (wx, wy, wz = 0) => [
  (wx - wy) * S * 0.866,
  (wx + wy) * S * 0.5 - wz * S
];
const pt = (wx, wy, wz = 0) => iso(wx, wy, wz).join(",");

// ── Campus buildings in grid coords (17 col × 13 row ground) ────────────────
const BUILDINGS = [
  {
    id:"blockA", name:"Academic Block A", short:"Block A",
    col:1, row:1, w:4, d:3, floors:4,
    top:"#60a5fa", east:"#1d4ed8", south:"#1e40af",
    amenities:["Lecture Halls","CSE Labs","Faculty Cabins","Smart Boards"],
    rooms:{0:["101 - CSE Lab","102 - Lecture Hall","HOD Office"],
           1:["201 - AI Lab","202 - Networks Lab","Class"],
           2:["301 - DS Lab","302 - Seminar Hall"],
           3:["401 - Project Lab","Research Room"]},
    desc:"Main academic building, 4 floors, 40+ classrooms and labs."
  },
  {
    id:"blockB", name:"Academic Block B", short:"Block B",
    col:7.5, row:1, w:3.5, d:3, floors:3,
    top:"#a78bfa", east:"#6d28d9", south:"#5b21b6",
    amenities:["Electronics Lab","Electrical Lab","Workshop","Drawing Hall"],
    rooms:{0:["Drawing Hall","Basic Elec Lab","Workshop"],
           1:["Electronics Lab","Class","Staff Room"],
           2:["Project Room","Class"]},
    desc:"Engineering labs block with workshops and electrical labs."
  },
  {
    id:"library", name:"Central Library", short:"Library",
    col:12.5, row:1, w:3.5, d:2.5, floors:3,
    top:"#22d3ee", east:"#0e7490", south:"#155e75",
    amenities:["50k+ Books","Digital Section","Study Cabins","Journals"],
    rooms:{0:["Issue Counter","Digital Library","Newspapers"],
           1:["Reference Hall","Journals Section","Group Study"],
           2:["Rare Books","Silent Zone","Research Cabins"]},
    desc:"Central library with 50,000+ books and digital resources."
  },
  {
    id:"admin", name:"Admin & Principal", short:"Admin",
    col:1, row:7, w:4, d:2.5, floors:2,
    top:"#f87171", east:"#b91c1c", south:"#991b1b",
    amenities:["Principal Office","Exam Cell","Accounts","Registrar"],
    rooms:{0:["Reception","Accounts","Registrar","Exam Cell"],
           1:["Principal Office","VP Office","Board Room"]},
    desc:"Administrative hub — principal office, exam cell, student services."
  },
  {
    id:"mess", name:"Mess & Dining Hall", short:"Mess",
    col:7.5, row:7, w:3.5, d:2.5, floors:1,
    top:"#fbbf24", east:"#b45309", south:"#92400e",
    amenities:["800 Capacity","Veg & Non-Veg","Canteen","Tuck Shop"],
    rooms:{0:["Main Dining Hall","Veg Counter","Non-Veg Counter","Canteen","Manager Office"]},
    desc:"Central mess hall serving 1000+ students daily."
  },
  {
    id:"hostel", name:"Aryabhatta Hostel", short:"Hostel",
    col:12.5, row:5, w:3.5, d:5, floors:4,
    top:"#34d399", east:"#047857", south:"#065f46",
    amenities:["300 Rooms","Common Room","Laundry","24hr Water"],
    rooms:{0:["Warden Office","Visitor Room","Store Room"],
           1:["Rooms 101-130","Common Room"],
           2:["Rooms 201-230","Study Room"],
           3:["Rooms 301-330","Gym"]},
    desc:"Main boys hostel with 300+ rooms and all facilities."
  },
  {
    id:"sports", name:"Sports Complex", short:"Sports",
    col:1, row:10.5, w:6, d:2, floors:1,
    top:"#2dd4bf", east:"#0f766e", south:"#134e4a",
    amenities:["Cricket Ground","Football","Basketball","Indoor Gym"],
    rooms:{0:["Main Ground","Basketball Court","Indoor Stadium","Gym","Changing Rooms"]},
    desc:"Full sports complex with outdoor and indoor facilities."
  },
  {
    id:"research", name:"R&I Lab", short:"R&I Lab",
    col:8.5, row:10, w:3.5, d:2.5, floors:2,
    top:"#c084fc", east:"#7e22ce", south:"#6b21a8",
    amenities:["IoT Lab","AI Studio","3D Printing","Incubation"],
    rooms:{0:["IoT Lab","Robotics Lab","3D Print Room","Workshop"],
           1:["AI Studio","Incubation Cell","Server Room"]},
    desc:"State-of-the-art research lab with IoT, AI studio and incubation."
  },
];

const DESTS = [
  { label:"CSE Lab 201",       building:"blockA",  floor:1, time:"3 min", distance:"180m", tag:"Lab" },
  { label:"AI & ML Studio",    building:"research", floor:1, time:"5 min", distance:"320m", tag:"Lab" },
  { label:"Central Library",   building:"library",  floor:0, time:"4 min", distance:"260m", tag:"Library" },
  { label:"Mess Hall",         building:"mess",     floor:0, time:"2 min", distance:"150m", tag:"Food" },
  { label:"Principal Office",  building:"admin",    floor:1, time:"3 min", distance:"200m", tag:"Admin" },
  { label:"Electronics Lab",   building:"blockB",   floor:1, time:"4 min", distance:"250m", tag:"Lab" },
];
const TAGS = {
  Lab:"bg-purple-100 text-purple-700", Library:"bg-indigo-100 text-indigo-700",
  Admin:"bg-amber-100 text-amber-700", Food:"bg-orange-100 text-orange-700",
};

// ── Isometric Building component ────────────────────────────────────────────
function IsoBuilding({ b, isSelected, onClick }) {
  const { col, row, w, d, floors } = b;
  const h = floors * 1.4;

  const topFace  = [pt(col,row,h), pt(col+w,row,h), pt(col+w,row+d,h), pt(col,row+d,h)].join(" ");
  const eastFace = [pt(col+w,row,0), pt(col+w,row+d,0), pt(col+w,row+d,h), pt(col+w,row,h)].join(" ");
  const southFace= [pt(col,row+d,0), pt(col+w,row+d,0), pt(col+w,row+d,h), pt(col,row+d,h)].join(" ");

  // Floor lines on south face
  const southLines = Array.from({length: floors - 1}, (_, i) => {
    const fh = (h / floors) * (i + 1);
    return [pt(col, row+d, fh), pt(col+w, row+d, fh)].join(" ");
  });

  const [lx, ly] = iso(col + w / 2, row + d / 2, h + 0.5);

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Glow on select */}
      {isSelected && (
        <polygon points={topFace} fill={b.top}
          style={{ filter: `drop-shadow(0 0 10px ${b.top})` }} opacity="0.5" />
      )}

      {/* East wall — semi-transparent */}
      <polygon points={eastFace} fill={b.east} opacity="0.55"
        stroke={isSelected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"} strokeWidth="0.4" />
      {/* East wall scanlines */}
      <polygon points={eastFace} fill="url(#scanlines)" opacity="0.35" />

      {/* South wall — semi-transparent */}
      <polygon points={southFace} fill={b.south} opacity="0.55"
        stroke={isSelected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"} strokeWidth="0.4" />
      {/* South wall scanlines */}
      <polygon points={southFace} fill="url(#scanlines)" opacity="0.35" />

      {/* Floor divider lines */}
      {southLines.map((pts, i) => (
        <polyline key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      ))}

      {/* Roof — semi-transparent */}
      <polygon points={topFace} fill={isSelected ? "white" : b.top} opacity={isSelected ? 0.75 : 0.6}
        stroke={isSelected ? "white" : "rgba(255,255,255,0.5)"} strokeWidth={isSelected ? 0.7 : 0.3} />
      {/* Roof scanlines */}
      <polygon points={topFace} fill="url(#scanlines)" opacity="0.2" />

      {/* Label */}
      <text x={lx} y={ly} textAnchor="middle" fontSize="9" fontWeight="bold"
        fill={isSelected ? b.top : "#fff"}
        style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,1))", pointerEvents: "none" }}>
        {b.short}
      </text>
      <text x={lx} y={ly + 10} textAnchor="middle" fontSize="7"
        fill="rgba(255,255,255,0.8)" style={{ pointerEvents: "none" }}>
        {b.floors}F
      </text>
    </g>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CampusNav3D() {
  const [selB,   setSelB]   = useState(null);
  const [selF,   setSelF]   = useState(0);
  const [search, setSearch] = useState("");
  const [nav,    setNav]    = useState(false);
  const [step,   setStep]   = useState(0);

  const filtered = search.length > 1
    ? DESTS.filter(d => d.label.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  // Ground polygon
  const gnd = [pt(0,0), pt(17,0), pt(17,13), pt(0,13)].join(" ");

  // Roads
  const roadH = [pt(0,5.5), pt(17,5.5), pt(17,6.5), pt(0,6.5)].join(" ");
  const roadV = [pt(6.5,0), pt(7.5,0), pt(7.5,13), pt(6.5,13)].join(" ");

  // Gardens
  const g1 = [pt(7.5,3.5), pt(8.5,3.5), pt(8.5,4.5), pt(7.5,4.5)].join(" ");
  const g2 = [pt(7.5,7.5), pt(8.5,7.5), pt(8.5,8.5), pt(7.5,8.5)].join(" ");

  // Sort buildings painter's order (back=low col+row first)
  const sorted = [...BUILDINGS].sort((a, b) => (a.col + a.row) - (b.col + b.row));

  // Main gate position
  const [gx, gy] = iso(2, 5.5, 0);

  const dirs = selB
    ? ["Exit Main Gate", `Walk towards ${selB.name}`, "Enter through main entrance", `Go to Floor ${selF + 1}`, "You have arrived! ✓"]
    : [];

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="rounded-2xl p-4 text-white"
        style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f,#0f172a)" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-300">3D ISOMETRIC CAMPUS MAP</span>
        </div>
        <h2 className="text-lg font-black">Trident Academy of Technology</h2>
        <p className="text-xs text-slate-400 mt-0.5">Click any building to view details • Isometric 3D view</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search room, lab, office…"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {search && <button onClick={() => { setSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="w-4 h-4 text-slate-400" /></button>}
        {filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-1 shadow-xl z-20 overflow-hidden">
            {filtered.map((d, i) => (
              <button key={i} onClick={() => {
                const b = BUILDINGS.find(b => b.id === d.building);
                setSelB(b); setSelF(d.floor); setSearch(d.label);
              }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-left border-b border-slate-100 last:border-0">
                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900">{d.label}</div>
                  <div className="text-xs text-slate-400">{d.time} · {d.distance}</div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${TAGS[d.tag] || ""}`}>{d.tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── 3D ISOMETRIC SVG MAP ─────────────────────────────── */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
          style={{ background: "#080d1a" }}>

          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <span className="text-white text-xs font-bold">📍 TAT Campus — 3D Isometric Map</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-bold">LIVE</span>
            </div>
          </div>

          <svg viewBox="-240 -100 520 430" width="100%" style={{ display: "block" }}>
            {/* Sky background */}
            <defs>
              <radialGradient id="bgGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#0c1a3a" />
                <stop offset="100%" stopColor="#050a14" />
              </radialGradient>
              {/* Scanline pattern — horizontal lines for X-ray glass effect */}
              <pattern id="scanlines" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(0,20,60,0.25)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect x="-240" y="-100" width="520" height="430" fill="url(#bgGrad)" />

            {/* Ground plane */}
            <polygon points={gnd} fill="#0d1f35" stroke="#1e3a5f" strokeWidth="0.5" />

            {/* Grid lines */}
            {Array.from({ length: 18 }, (_, i) => {
              const [ax, ay] = iso(i, 0); const [bx, by] = iso(i, 13);
              return <line key={`gv${i}`} x1={ax} y1={ay} x2={bx} y2={by} stroke="#1a2f4a" strokeWidth="0.4" />;
            })}
            {Array.from({ length: 14 }, (_, i) => {
              const [ax, ay] = iso(0, i); const [bx, by] = iso(17, i);
              return <line key={`gh${i}`} x1={ax} y1={ay} x2={bx} y2={by} stroke="#1a2f4a" strokeWidth="0.4" />;
            })}

            {/* Roads */}
            <polygon points={roadH} fill="#1e293b" opacity="0.95" />
            <polygon points={roadV} fill="#1e293b" opacity="0.95" />
            {/* Road center lines */}
            {(() => { const [ax,ay]=iso(0,6); const [bx,by]=iso(17,6); return <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#334155" strokeWidth="0.4" strokeDasharray="3,2"/>; })()}
            {(() => { const [ax,ay]=iso(7,0); const [bx,by]=iso(7,13); return <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#334155" strokeWidth="0.4" strokeDasharray="3,2"/>; })()}

            {/* Road labels */}
            {(() => { const [x,y]=iso(3,6.3); return <text x={x} y={y} fontSize="6" fill="#475569" fontWeight="bold" textAnchor="middle">MAIN ROAD</text>; })()}
            {(() => { const [x,y]=iso(7.3,3); return <text x={x} y={y} fontSize="6" fill="#475569" fontWeight="bold" textAnchor="middle" transform={`rotate(-30,${iso(7.3,3)[0]},${iso(7.3,3)[1]})`}>CROSS ROAD</text>; })()}

            {/* Gardens */}
            <polygon points={g1} fill="#14532d" opacity="0.8" />
            <polygon points={g2} fill="#14532d" opacity="0.8" />
            {(() => { const [x,y]=iso(8,4); return <text x={x} y={y} fontSize="7" textAnchor="middle">🌳</text>; })()}
            {(() => { const [x,y]=iso(8,8); return <text x={x} y={y} fontSize="7" textAnchor="middle">🌳</text>; })()}

            {/* Parking */}
            {(() => {
              const pts = [pt(1,11), pt(4,11), pt(4,13), pt(1,13)].join(" ");
              const [x,y] = iso(2.5, 12);
              return <>
                <polygon points={pts} fill="#1e293b" opacity="0.6" />
                <text x={x} y={y} fontSize="7" fill="#64748b" fontWeight="bold" textAnchor="middle">P</text>
              </>;
            })()}

            {/* Buildings — sorted back to front */}
            {sorted.map(b => (
              <IsoBuilding key={b.id} b={b}
                isSelected={selB?.id === b.id}
                onClick={() => { setSelB(s => s?.id === b.id ? null : b); setSelF(0); setNav(false); }} />
            ))}

            {/* Main Gate */}
            <polygon points={[pt(2,5.5), pt(4,5.5), pt(4,6.5), pt(2,6.5)].join(" ")}
              fill="#1d4ed8" opacity="0.9" />
            <text x={gx} y={gy + 4} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">GATE</text>

            {/* Compass */}
            {(() => {
              const [cx, cy] = iso(16.5, 0.5, 0);
              return (
                <g transform={`translate(${cx},${cy})`}>
                  <circle r="12" fill="rgba(15,23,42,0.85)" stroke="#1e3a5f" strokeWidth="0.5" />
                  <text x="0" y="-5" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">N</text>
                  <polygon points="0,-10 2,-4 0,-2 -2,-4" fill="#ef4444" />
                  <polygon points="0,10 2,4 0,2 -2,4" fill="#475569" />
                  <text x="0" y="14" textAnchor="middle" fontSize="5" fill="#64748b">S</text>
                </g>
              );
            })()}

            {/* Hint text */}
            {(() => { const [x,y]=iso(8.5,13.5); return <text x={x} y={y+10} textAnchor="middle" fontSize="8" fill="rgba(100,150,200,0.6)" fontWeight="bold">CLICK A BUILDING TO VIEW INFO</text>; })()}
          </svg>

          {/* Legend */}
          <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-1.5">
            {BUILDINGS.map(b => (
              <button key={b.id}
                onClick={() => { setSelB(s => s?.id === b.id ? null : b); setSelF(0); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                style={selB?.id === b.id
                  ? { background: b.top, color: "#0f172a" }
                  : { background: "rgba(255,255,255,0.07)", color: "#94a3b8" }}>
                <div className="w-2 h-2 rounded-sm" style={{ background: b.top }} />
                {b.short}
              </button>
            ))}
          </div>
        </div>

        {/* ── INFO PANEL ────────────────────────────────────────── */}
        <div className="space-y-3">
          {selB ? (
            <div className="bg-white rounded-2xl border-2 shadow-lg overflow-hidden"
              style={{ borderColor: selB.top + "88" }}>
              {/* Header */}
              <div className="p-4 text-white relative" style={{ background: `linear-gradient(135deg,${selB.east},${selB.south})` }}>
                <button onClick={() => { setSelB(null); setNav(false); }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                <h3 className="font-black text-base pr-7">{selB.name}</h3>
                <p className="text-xs opacity-80 mt-0.5">{selB.floors} Floors · TAT Campus</p>
                <p className="text-[10px] opacity-70 mt-1">{selB.desc}</p>
              </div>
              <div className="p-3 space-y-3">
                {/* Amenities */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Facilities</p>
                  <div className="flex flex-wrap gap-1">
                    {selB.amenities.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ background: selB.east }}>✓ {a}</span>
                    ))}
                  </div>
                </div>
                {/* Floor select */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Floor Explorer</p>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: selB.floors }, (_, i) => (
                      <button key={i} onClick={() => setSelF(i)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-black transition-all"
                        style={selF === i ? { background: selB.east, color: "white" } : { background: "#f1f5f9", color: "#475569" }}>
                        F{i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold">Floor {selF + 1} Rooms</p>
                    {(selB.rooms[selF] || []).map((room, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: selB.top }} />
                        {room}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Navigation */}
                {!nav ? (
                  <button onClick={() => { setNav(true); setStep(0); }}
                    className="w-full py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2"
                    style={{ background: selB.east }}>
                    <Navigation className="w-3.5 h-3.5" /> Navigate Here
                  </button>
                ) : (
                  <div className="p-3 rounded-xl border-2 space-y-2"
                    style={{ background: selB.top + "10", borderColor: selB.top + "44" }}>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold" style={{ color: selB.east }}>Step {step + 1}/{dirs.length}</span>
                      <button onClick={() => { setNav(false); setStep(0); }} className="text-[10px] text-slate-400">✕</button>
                    </div>
                    <div className="text-xs font-bold text-slate-900">→ {dirs[step]}</div>
                    <div className="flex gap-2">
                      {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-1.5 rounded-lg bg-slate-100 text-xs font-bold">← Back</button>}
                      {step < dirs.length - 1
                        ? <button onClick={() => setStep(s => s + 1)} className="flex-1 py-1.5 rounded-lg text-white text-xs font-bold" style={{ background: selB.east }}>Next →</button>
                        : <div className="flex-1 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold text-center">🏁 Arrived!</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-bold text-slate-700">Quick Access</p>
              </div>
              <div className="space-y-1.5">
                {DESTS.map((d, i) => (
                  <button key={i} onClick={() => {
                    const b = BUILDINGS.find(b => b.id === d.building);
                    setSelB(b); setSelF(d.floor);
                  }} className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 text-left transition-all">
                    <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{d.label}</div>
                      <div className="text-[10px] text-slate-400">{d.time} · {d.distance}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TAGS[d.tag] || ""}`}>{d.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All buildings */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">All Buildings</p>
            <div className="space-y-1">
              {BUILDINGS.map(b => (
                <button key={b.id} onClick={() => { setSelB(s => s?.id === b.id ? null : b); setSelF(0); }}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition-all"
                  style={selB?.id === b.id ? { background: b.east } : {}}>
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: b.top }} />
                  <span className="text-xs font-bold flex-1 truncate"
                    style={{ color: selB?.id === b.id ? "white" : "#334155" }}>{b.name}</span>
                  <span className="text-[9px]" style={{ color: selB?.id === b.id ? "rgba(255,255,255,0.7)" : "#94a3b8" }}>{b.floors}F</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
