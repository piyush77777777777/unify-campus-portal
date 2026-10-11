import React, { useState } from "react";
import { Search, MapPin, X, ChevronRight, Navigation, Layers } from "lucide-react";

// ── Campus buildings data ────────────────────────────────────────────────────
const BUILDINGS = [
  {
    id:"blockA", name:"Academic Block A", short:"Block A",
    color:"#2563eb", bg:"#dbeafe", border:"#93c5fd",
    // SVG coords (% of viewBox 0 0 100 100)
    x:10, y:8, w:28, h:18, floors:4,
    amenities:["Lecture Halls","Seminar Rooms","Faculty Cabins","Smart Boards"],
    rooms:{ 0:["101 - CSE Lab","102 - Lecture Hall","103 - HOD Office"],
            1:["201 - AI Lab","202 - Networks Lab","203 - Class"],
            2:["301 - DS Lab","302 - Class","303 - Staff Room"],
            3:["401 - Project Lab","402 - Seminar Hall"] },
    desc:"Main academic building with 4 floors, 40+ classrooms and labs."
  },
  {
    id:"blockB", name:"Academic Block B", short:"Block B",
    color:"#7c3aed", bg:"#ede9fe", border:"#c4b5fd",
    x:44, y:8, w:24, h:18, floors:3,
    amenities:["Electronics Lab","Electrical Lab","Workshops","Drawing Hall"],
    rooms:{ 0:["101 - Drawing Hall","102 - Basic Elec Lab","103 - Workshop"],
            1:["201 - Electronics Lab","202 - Class","203 - Staff Room"],
            2:["301 - Project Room","302 - Class"] },
    desc:"Engineering labs block with workshops and electrical labs."
  },
  {
    id:"library", name:"Central Library", short:"Library",
    color:"#0891b2", bg:"#cffafe", border:"#67e8f9",
    x:74, y:8, w:22, h:16, floors:3,
    amenities:["50k+ Books","Digital Section","Study Cabins","Journals"],
    rooms:{ 0:["Issue Counter","Digital Library","Newspaper Hall"],
            1:["Reference Hall","Journals Section","Group Study"],
            2:["Rare Books","Research Cabins","Silent Zone"] },
    desc:"Central library with 50,000+ books, digital resources and study zones."
  },
  {
    id:"hostel", name:"Aryabhatta Hostel", short:"Hostel",
    color:"#059669", bg:"#d1fae5", border:"#6ee7b7",
    x:74, y:34, w:22, h:26, floors:4,
    amenities:["300 Rooms","Common Room","Laundry","24hr Water"],
    rooms:{ 0:["Warden Office","Visitor Room","Store Room"],
            1:["101-130 Single Rooms","Common Room"],
            2:["201-230 Double Rooms","Study Room"],
            3:["301-330 Rooms","Gym Room"] },
    desc:"Main boys hostel with 300+ rooms, common room and all facilities."
  },
  {
    id:"mess", name:"Mess & Dining Hall", short:"Mess",
    color:"#d97706", bg:"#fef3c7", border:"#fcd34d",
    x:44, y:36, w:24, h:14, floors:1,
    amenities:["800 Capacity","Veg & Non-Veg","Canteen","Tuck Shop"],
    rooms:{ 0:["Main Dining Hall","Veg Counter","Non-Veg Counter","Canteen","Manager Office"] },
    desc:"Central mess hall serving 1000+ students daily with multiple counters."
  },
  {
    id:"admin", name:"Admin & Principal Block", short:"Admin",
    color:"#dc2626", bg:"#fee2e2", border:"#fca5a5",
    x:10, y:36, w:28, h:14, floors:2,
    amenities:["Principal Office","Exam Cell","Accounts","Registrar"],
    rooms:{ 0:["Reception","Accounts Section","Registrar Office","Exam Cell"],
            1:["Principal Office","Vice Principal","Board Room","HR Office"] },
    desc:"Administrative hub with principal office, exam cell, and student services."
  },
  {
    id:"sports", name:"Sports Complex", short:"Sports",
    color:"#0d9488", bg:"#ccfbf1", border:"#5eead4",
    x:10, y:60, w:36, h:20, floors:1,
    amenities:["Cricket Ground","Football Field","Basketball","Indoor Gym"],
    rooms:{ 0:["Main Ground","Basketball Court","Indoor Stadium","Gym","Changing Rooms"] },
    desc:"Full sports complex with outdoor and indoor facilities for all sports."
  },
  {
    id:"research", name:"Research & Innovation Lab", short:"R&I Lab",
    color:"#9333ea", bg:"#f3e8ff", border:"#d8b4fe",
    x:52, y:60, w:20, h:20, floors:2,
    amenities:["IoT Lab","AI Studio","3D Printing","Incubation"],
    rooms:{ 0:["IoT Lab","Robotics Lab","3D Print Room","Workshop"],
            1:["AI & ML Studio","Incubation Cell","Meeting Room","Server Room"] },
    desc:"State-of-the-art research lab with IoT, AI studio and incubation centre."
  },
];

const PATHS = [
  // Main horizontal road
  { x:0, y:30, w:100, h:4, color:"#1e293b", dash:false },
  // Main vertical road
  { x:40, y:0, w:4, h:100, color:"#1e293b", dash:false },
  // Secondary horizontal
  { x:0, y:56, w:100, h:3, color:"#0f172a", dash:true },
  // Secondary vertical
  { x:70, y:0, w:3, h:100, color:"#0f172a", dash:true },
];

const TAGS = {
  Class:"bg-blue-100 text-blue-700", Lab:"bg-purple-100 text-purple-700",
  Admin:"bg-amber-100 text-amber-700", Library:"bg-indigo-100 text-indigo-700",
  Hall:"bg-cyan-100 text-cyan-700", Food:"bg-orange-100 text-orange-700",
};

const DESTS = [
  { label:"CSE Lab 201",      building:"blockA",  floor:1, time:"3 min",  distance:"180m", tag:"Lab" },
  { label:"HOD Office CSE",   building:"blockA",  floor:0, time:"2 min",  distance:"120m", tag:"Admin" },
  { label:"AI & ML Studio",   building:"research",floor:1, time:"5 min",  distance:"320m", tag:"Lab" },
  { label:"Central Library",  building:"library", floor:0, time:"4 min",  distance:"260m", tag:"Library" },
  { label:"Mess Hall",        building:"mess",    floor:0, time:"2 min",  distance:"150m", tag:"Food" },
  { label:"Principal Office", building:"admin",   floor:1, time:"3 min",  distance:"200m", tag:"Admin" },
  { label:"Seminar Hall 302", building:"blockA",  floor:2, time:"4 min",  distance:"230m", tag:"Hall" },
  { label:"Electronics Lab",  building:"blockB",  floor:1, time:"4 min",  distance:"250m", tag:"Lab" },
];

export default function CampusNav3D() {
  const [search,  setSearch]  = useState("");
  const [selB,    setSelB]    = useState(null);
  const [selF,    setSelF]    = useState(0);
  const [dest,    setDest]    = useState(null);
  const [nav,     setNav]     = useState(false);
  const [step,    setStep]    = useState(0);
  const [hovB,    setHovB]    = useState(null);

  const filtered = search.length > 1
    ? DESTS.filter(d => d.label.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const selectDest = d => {
    setDest(d); setSearch(d.label);
    const b = BUILDINGS.find(b => b.id === d.building);
    setSelB(b); setSelF(d.floor);
  };

  const dirs = dest
    ? [`Exit Main Gate`, `Head towards ${dest.label.split(" ")[0]} building`,
       `Enter through main entrance`, `Go to Floor ${dest.floor + 1}`, `${dest.label} on your right`]
    : [];

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="rounded-2xl p-4 text-white flex items-center justify-between"
        style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f,#0f172a)"}}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-xs font-bold text-emerald-300">LIVE CAMPUS MAP</span>
          </div>
          <h2 className="text-lg font-black">Trident Academy of Technology</h2>
          <p className="text-xs text-slate-400 mt-0.5">Click any building to view details • Top-down floor plan</p>
        </div>
        <div className="text-right text-xs text-slate-400 hidden sm:block">
          <div className="font-bold text-white">{BUILDINGS.length} Buildings</div>
          <div>Bhubaneswar, Odisha</div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search room, lab, office…"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        {search && <button onClick={()=>{setSearch("");setDest(null);}} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="w-4 h-4 text-slate-400"/>
        </button>}
        {filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-1 shadow-xl z-20 overflow-hidden">
            {filtered.map((d,i)=>(
              <button key={i} onClick={()=>selectDest(d)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-left border-b border-slate-100 last:border-0">
                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900">{d.label}</div>
                  <div className="text-xs text-slate-400">{d.time} walk · {d.distance}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TAGS[d.tag]||""}`}>{d.tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── 2D TOP-DOWN CAMPUS MAP ─────────────────────────────── */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl bg-white">

          {/* Map header */}
          <div className="px-4 py-2 bg-slate-800 flex items-center justify-between">
            <span className="text-white text-xs font-bold">📍 TAT Campus — Floor Plan (Top View)</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-emerald-300 text-[10px] font-bold">LIVE</span>
            </div>
          </div>

          {/* SVG MAP */}
          <svg viewBox="0 0 100 100" width="100%" style={{display:"block", aspectRatio:"4/3",
            background:"linear-gradient(135deg,#f0f9ff,#f8fafc,#f0fdf4)"}}>

            {/* Campus boundary */}
            <rect x="1" y="1" width="98" height="98" fill="none" stroke="#cbd5e1" strokeWidth="0.5" rx="1"/>
            <rect x="2" y="2" width="96" height="96" fill="#f8fafc" rx="0.5"/>

            {/* Green campus lawn background */}
            <rect x="2" y="2" width="96" height="96" fill="#f0fdf4" rx="0.5"/>

            {/* Roads */}
            {/* Main horizontal road */}
            <rect x="0" y="29" width="100" height="5" fill="#334155"/>
            <line x1="0" y1="31.5" x2="100" y2="31.5" stroke="#64748b" strokeWidth="0.3" strokeDasharray="2,2"/>
            <text x="50" y="33.2" textAnchor="middle" fontSize="1.4" fill="#94a3b8" fontWeight="bold">MAIN CAMPUS ROAD</text>

            {/* Main vertical road */}
            <rect x="39" y="0" width="5" height="100" fill="#334155"/>
            <line x1="41.5" y1="0" x2="41.5" y2="100" stroke="#64748b" strokeWidth="0.3" strokeDasharray="2,2"/>

            {/* Secondary road horizontal */}
            <rect x="0" y="55" width="100" height="3" fill="#475569"/>
            {/* Secondary road vertical */}
            <rect x="69" y="0" width="3" height="100" fill="#475569"/>

            {/* Footpaths */}
            <line x1="2" y1="35" x2="38" y2="35" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="1,1"/>
            <line x1="45" y1="35" x2="68" y2="35" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="1,1"/>
            <line x1="73" y1="35" x2="98" y2="35" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="1,1"/>

            {/* Gardens / green areas */}
            <rect x="3" y="60" width="8" height="8" fill="#bbf7d0" stroke="#86efac" strokeWidth="0.3" rx="1"/>
            <text x="7" y="65.5" textAnchor="middle" fontSize="1.5" fill="#15803d">🌳</text>
            <rect x="45" y="3" width="7" height="6" fill="#bbf7d0" stroke="#86efac" strokeWidth="0.3" rx="1"/>
            <text x="48.5" y="7" textAnchor="middle" fontSize="1.5" fill="#15803d">🌳</text>

            {/* Parking */}
            <rect x="3" y="80" width="8" height="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.3" rx="0.5"/>
            <text x="7" y="86" textAnchor="middle" fontSize="1.6" fill="#475569" fontWeight="bold">P</text>
            <text x="7" y="88.5" textAnchor="middle" fontSize="1" fill="#64748b">Parking</text>

            {/* Main Gate */}
            <rect x="19" y="97" width="6" height="3" fill="#1d4ed8" rx="0.3"/>
            <text x="22" y="99.5" textAnchor="middle" fontSize="1.4" fill="white" fontWeight="bold">GATE</text>

            {/* Buildings */}
            {BUILDINGS.map(b => {
              const isSelected = selB?.id === b.id;
              const isHov = hovB === b.id;
              const isDest = dest?.building === b.id;
              return (
                <g key={b.id} style={{cursor:"pointer"}}
                  onClick={()=>{ setSelB(s=>s?.id===b.id?null:b); setSelF(0); }}
                  onMouseEnter={()=>setHovB(b.id)}
                  onMouseLeave={()=>setHovB(null)}>
                  {/* Selection glow */}
                  {(isSelected||isHov) && (
                    <rect x={b.x-0.8} y={b.y-0.8} width={b.w+1.6} height={b.h+1.6}
                      fill="none" stroke={b.color} strokeWidth={isSelected?"1":"0.5"}
                      strokeOpacity={isSelected?1:0.5} rx="1.5"
                      style={{filter:`drop-shadow(0 0 3px ${b.color})`}}/>
                  )}
                  {/* Destination highlight */}
                  {isDest && (
                    <rect x={b.x-1} y={b.y-1} width={b.w+2} height={b.h+2}
                      fill="none" stroke="#fbbf24" strokeWidth="0.8" rx="1.5"
                      strokeDasharray="2,1"/>
                  )}
                  {/* Building body */}
                  <rect x={b.x} y={b.y} width={b.w} height={b.h}
                    fill={isSelected ? b.color : b.bg}
                    stroke={b.border} strokeWidth="0.4" rx="1"
                    opacity={isSelected?0.95:0.9}/>
                  {/* Building pattern (floors) */}
                  {Array.from({length:b.floors-1},(_,i)=>(
                    <line key={i}
                      x1={b.x+1} y1={b.y + (b.h/(b.floors))*(i+1)}
                      x2={b.x+b.w-1} y2={b.y + (b.h/(b.floors))*(i+1)}
                      stroke={isSelected?"rgba(255,255,255,0.3)":b.border}
                      strokeWidth="0.25" strokeDasharray="1,0.5"/>
                  ))}
                  {/* Building name */}
                  <text x={b.x+b.w/2} y={b.y+b.h/2-1.2} textAnchor="middle"
                    fontSize="2" fontWeight="bold"
                    fill={isSelected?"white":b.color}>
                    {b.short}
                  </text>
                  <text x={b.x+b.w/2} y={b.y+b.h/2+1.8} textAnchor="middle"
                    fontSize="1.3" fill={isSelected?"rgba(255,255,255,0.8)":"#64748b"}>
                    {b.floors}F
                  </text>
                  {/* Selected marker */}
                  {isSelected && (
                    <circle cx={b.x+b.w/2} cy={b.y+2} r="1.5" fill="white" opacity="0.9"/>
                  )}
                </g>
              );
            })}

            {/* Compass */}
            <g transform="translate(95,5)">
              <circle cx="0" cy="0" r="3.5" fill="white" stroke="#cbd5e1" strokeWidth="0.3"/>
              <text x="0" y="-1.5" textAnchor="middle" fontSize="2" fontWeight="bold" fill="#ef4444">N</text>
              <polygon points="0,-3 0.6,-1 0,0 -0.6,-1" fill="#ef4444"/>
              <polygon points="0,3 0.6,1 0,0 -0.6,1" fill="#94a3b8"/>
            </g>

            {/* Scale bar */}
            <g transform="translate(3,95)">
              <line x1="0" y1="0" x2="10" y2="0" stroke="#475569" strokeWidth="0.5"/>
              <line x1="0" y1="-0.8" x2="0" y2="0.8" stroke="#475569" strokeWidth="0.5"/>
              <line x1="10" y1="-0.8" x2="10" y2="0.8" stroke="#475569" strokeWidth="0.5"/>
              <text x="5" y="-1.2" textAnchor="middle" fontSize="1.2" fill="#64748b">100m</text>
            </g>
          </svg>

          {/* Legend */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2">
            {BUILDINGS.map(b=>(
              <button key={b.id}
                onClick={()=>{ setSelB(s=>s?.id===b.id?null:b); setSelF(0); }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold border transition-all ${selB?.id===b.id?'text-white':'text-slate-600 hover:bg-slate-50'}`}
                style={selB?.id===b.id?{background:b.color,borderColor:b.color}:{borderColor:b.border, background:b.bg}}>
                <div className="w-2 h-2 rounded-sm" style={{background:b.color}}/>
                {b.short}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────── */}
        <div className="space-y-3">

          {/* Building info when selected */}
          {selB ? (
            <div className="bg-white rounded-2xl border-2 shadow-lg overflow-hidden"
              style={{borderColor: selB.color+"55"}}>
              {/* Header */}
              <div className="p-4 text-white relative" style={{background:`linear-gradient(135deg,${selB.color},${selB.color}cc)`}}>
                <button onClick={()=>setSelB(null)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-white"/>
                </button>
                <div className="text-xs opacity-75 mb-0.5">{selB.id.toUpperCase()}</div>
                <h3 className="font-black text-base leading-tight">{selB.name}</h3>
                <p className="text-xs opacity-80 mt-1">{selB.floors} Floors · TAT Campus</p>
                <p className="text-[10px] opacity-70 mt-1">{selB.desc}</p>
              </div>

              <div className="p-3 space-y-3">
                {/* Facilities */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Facilities</p>
                  <div className="flex flex-wrap gap-1">
                    {selB.amenities.map((a,i)=>(
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{background:selB.color}}>✓ {a}</span>
                    ))}
                  </div>
                </div>

                {/* Floor selector */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Select Floor</p>
                  <div className="flex gap-1 mb-2">
                    {Array.from({length:selB.floors},(_,i)=>(
                      <button key={i} onClick={()=>setSelF(i)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-black transition-all"
                        style={selF===i?{background:selB.color,color:"white",boxShadow:`0 2px 8px ${selB.color}55`}:{background:"#f1f5f9",color:"#475569"}}>
                        F{i+1}
                      </button>
                    ))}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold">Floor {selF+1} Rooms</p>
                    {(selB.rooms[selF]||[]).map((room,i)=>(
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:selB.color}}/>
                        {room}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigate */}
                {!nav ? (
                  <button onClick={()=>{setDest(DESTS.find(d=>d.building===selB.id)||{building:selB.id,label:selB.name,floor:selF,time:"3 min",distance:"200m"});setNav(true);setStep(0);}}
                    className="w-full py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2"
                    style={{background:selB.color}}>
                    <Navigation className="w-3.5 h-3.5"/> Navigate Here
                  </button>
                ) : (
                  <div className="p-3 rounded-xl border-2 space-y-2"
                    style={{background:selB.color+"08",borderColor:selB.color+"33"}}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold" style={{color:selB.color}}>Step {step+1}/{dirs.length}</span>
                      <button onClick={()=>{setNav(false);setStep(0);}} className="text-[10px] text-slate-400">✕ End</button>
                    </div>
                    <div className="text-xs font-bold text-slate-900">→ {dirs[step]}</div>
                    <div className="flex gap-2">
                      {step>0 && <button onClick={()=>setStep(s=>s-1)} className="flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">← Back</button>}
                      {step<dirs.length-1
                        ? <button onClick={()=>setStep(s=>s+1)} className="flex-1 py-1.5 rounded-lg text-white text-[11px] font-bold" style={{background:selB.color}}>Next →</button>
                        : <div className="flex-1 py-1.5 rounded-lg text-white text-[11px] font-bold text-center bg-emerald-500">🏁 Arrived!</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Default — quick access */
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-500"/>
                <p className="text-sm font-bold text-slate-700">Quick Access</p>
              </div>
              <div className="space-y-1.5">
                {DESTS.slice(0,6).map((d,i)=>(
                  <button key={i} onClick={()=>selectDest(d)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 text-left transition-all">
                    <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{d.label}</div>
                      <div className="text-[10px] text-slate-400">{d.time} · {d.distance}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TAGS[d.tag]||""}`}>{d.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All buildings mini list */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">All Buildings</p>
            <div className="space-y-1">
              {BUILDINGS.map(b=>(
                <button key={b.id} onClick={()=>{setSelB(s=>s?.id===b.id?null:b);setSelF(0);}}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition-all ${selB?.id===b.id?'text-white':'hover:bg-slate-50'}`}
                  style={selB?.id===b.id?{background:b.color}:{}}>
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background:b.color}}/>
                  <span className="text-xs font-bold flex-1 truncate"
                    style={selB?.id===b.id?{color:"white"}:{color:"#334155"}}>{b.name}</span>
                  <span className="text-[9px]" style={selB?.id===b.id?{color:"rgba(255,255,255,0.7)"}:{color:"#94a3b8"}}>{b.floors}F</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
