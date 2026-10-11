import React, { useState } from "react";
import { Search, Navigation, MapPin, Clock, Building2, ChevronRight, X, Layers, ArrowRight } from "lucide-react";

const BUILDINGS = [
  { id:"academic", name:"Academic Block A", short:"Block A", color:"#3b82f6", darkColor:"#1d4ed8", x:280, y:180, w:120, h:80, floors:4,
    rooms:{ 1:["A-101 (Principal Office)","A-102 (HOD CSE)","A-103 (Seminar Hall)"], 2:["A-201","A-202","A-203","A-204"], 3:["A-301","A-302","A-303","A-304"], 4:["A-401 (Conference)","A-402","A-403"] } },
  { id:"cse", name:"CSE & IT Block B", short:"Block B", color:"#8b5cf6", darkColor:"#6d28d9", x:460, y:160, w:110, h:90, floors:4,
    rooms:{ 1:["B-101 (CS Lab 1)","B-102 (CS Lab 2)","B-103"], 2:["B-201","B-202","B-203 (Network Lab)"], 3:["B-301","B-302","B-303 (ML Lab)"], 4:["B-401","B-402 (Research Lab)"] } },
  { id:"library", name:"Central Library", short:"Library", color:"#7c3aed", darkColor:"#5b21b6", x:180, y:300, w:100, h:70, floors:2,
    rooms:{ 1:["Reading Hall","Issue Counter","Digital Section"], 2:["Research Zone","Rare Books","Journal Section"] } },
  { id:"admin", name:"Admin & Finance Block", short:"Admin", color:"#f59e0b", darkColor:"#d97706", x:420, y:300, w:90, h:65, floors:2,
    rooms:{ 1:["Accounts Office","Admission Cell","Exam Branch"], 2:["HR Department","Finance Office","Audit Room"] } },
  { id:"hostel", name:"Aryabhatta Hall of Residence", short:"Hostel", color:"#10b981", darkColor:"#059669", x:600, y:250, w:130, h:100, floors:5,
    rooms:{ 1:["Warden Office","Common Room","B-101 to B-110"], 2:["B-201 to B-220"], 3:["B-301 to B-320"], 4:["B-401 to B-420"], 5:["B-501 to B-510"] } },
  { id:"mess", name:"Annapurna Mess Hall", short:"Mess", color:"#f97316", darkColor:"#ea580c", x:600, y:380, w:110, h:70, floors:1,
    rooms:{ 1:["Dining Hall (440 seats)","Kitchen","Store Room","Supervisor Office"] } },
  { id:"sports", name:"Sports Complex", short:"Sports", color:"#06b6d4", darkColor:"#0891b2", x:150, y:420, w:140, h:80, floors:1,
    rooms:{ 1:["Basketball Court","Badminton Hall","Gym","Indoor Games"] } },
];

const DESTINATIONS = [
  { label:"CSE Department (B-301)", building:"cse", floor:3, room:"B-301", distance:"320m", time:"4 min" },
  { label:"CS Lab 1 (B-101)", building:"cse", floor:1, room:"B-101", distance:"280m", time:"3 min" },
  { label:"ML Lab (B-303)", building:"cse", floor:3, room:"B-303", distance:"340m", time:"5 min" },
  { label:"Principal Office (A-101)", building:"academic", floor:1, room:"A-101", distance:"180m", time:"2 min" },
  { label:"Seminar Hall (A-103)", building:"academic", floor:1, room:"A-103", distance:"200m", time:"3 min" },
  { label:"Central Library", building:"library", floor:1, room:"Reading Hall", distance:"220m", time:"3 min" },
  { label:"Mess Hall (Dinner/Lunch)", building:"mess", floor:1, room:"Dining Hall", distance:"580m", time:"7 min" },
  { label:"Aryabhatta Hostel", building:"hostel", floor:1, room:"Main Entrance", distance:"500m", time:"6 min" },
  { label:"Accounts Office", building:"admin", floor:1, room:"Accounts Office", distance:"350m", time:"4 min" },
  { label:"Sports Complex / Gym", building:"sports", floor:1, room:"Gym", distance:"400m", time:"5 min" },
];

const PATHS = {
  cse:     ["M 60 490","L 60 350","L 300 350","L 300 280","L 460 240"],
  academic:["M 60 490","L 60 350","L 280 300","L 280 260"],
  library: ["M 60 490","L 60 380","L 180 360"],
  admin:   ["M 60 490","L 60 380","L 280 380","L 420 360"],
  hostel:  ["M 60 490","L 60 350","L 400 350","L 600 310"],
  mess:    ["M 60 490","L 60 400","L 400 400","L 600 420"],
  sports:  ["M 60 490","L 60 440","L 150 450"],
};

const DIRECTIONS = {
  cse:     ["Exit Main Gate","Walk straight along Main Road (150m)","Turn RIGHT at the fountain","Block B will be on your LEFT (50m)","Enter through main entrance","Take stairs to your floor"],
  academic:["Exit Main Gate","Walk straight (100m)","Academic Block A is directly ahead","Enter through the main lobby"],
  library: ["Exit Main Gate","Turn LEFT immediately","Walk along the garden path (120m)","Library entrance on your right"],
  hostel:  ["Exit Main Gate","Walk straight on main road (200m)","Turn RIGHT at the CSE Block","Continue 200m","Aryabhatta Hall on your right"],
  mess:    ["Exit Main Gate","Walk straight (200m)","Turn RIGHT at CSE Block","Continue past hostel (150m)","Mess Hall on your left"],
  admin:   ["Exit Main Gate","Walk straight (150m)","Turn right at fountain","Admin Block on your left"],
  sports:  ["Exit Main Gate","Turn LEFT","Walk along boundary wall (250m)","Sports Complex on your right"],
};

export default function CampusNav3D() {
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState(null);
  const [navigating, setNavigating] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [dirStep, setDirStep] = useState(0);

  const filtered = search.length > 1 ? DESTINATIONS.filter(d => d.label.toLowerCase().includes(search.toLowerCase())) : [];

  const handleSelect = (dest) => { setDestination(dest); setSearch(dest.label); setNavigating(false); setDirStep(0); };
  const startNav = () => { setNavigating(true); setDirStep(0); };
  const pathD = destination ? PATHS[destination.building]?.join(" ") : null;
  const directions = destination ? (DIRECTIONS[destination.building] || []) : [];
  const destBuilding = destination ? BUILDINGS.find(b => b.id === destination.building) : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30 mb-3">
            <Navigation className="w-3.5 h-3.5" /> IGIT Sarang — Smart Campus Navigation
          </div>
          <h2 className="text-2xl font-black">3D Campus Navigator</h2>
          <p className="text-xs text-blue-100/80 mt-1">Find any classroom, lab or building — step-by-step directions included</p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e=>{setSearch(e.target.value);setDestination(null);setNavigating(false);}}
              placeholder="Where do you want to go? e.g. CS Lab, Library, Mess..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400" />
            {search && <button onClick={()=>{setSearch("");setDestination(null);setNavigating(false);}} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-white/60" /></button>}
            {filtered.length > 0 && !destination && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {filtered.map((d,i) => (
                  <button key={i} onClick={()=>handleSelect(d)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-left border-b border-slate-800 last:border-0">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div><div className="text-sm font-bold text-white">{d.label}</div><div className="text-xs text-slate-400">{d.distance} • {d.time} walk</div></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-600" /><span className="font-bold text-slate-900 text-sm">IGIT Sarang Campus Map</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" /><span className="text-xs text-blue-600 font-bold">LIVE</span></div>
          </div>
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50" style={{height:"420px"}}>
            <svg width="100%" height="100%" viewBox="0 0 780 520" className="absolute inset-0">
              <rect x="0" y="460" width="780" height="60" fill="#94a3b8" opacity="0.3"/>
              <line x1="0" y1="490" x2="780" y2="490" stroke="#64748b" strokeWidth="2" strokeDasharray="20,10"/>
              <rect x="40" y="0" width="50" height="490" fill="#94a3b8" opacity="0.2"/>
              <text x="15" y="480" fill="#475569" fontSize="9" fontWeight="bold">MAIN ROAD</text>
              <ellipse cx="340" cy="390" rx="60" ry="40" fill="#86efac" opacity="0.5"/>
              <text x="315" y="393" fill="#166534" fontSize="9" fontWeight="bold">Garden</text>
              {pathD && (<>
                <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={navigating?"0":"12,6"} strokeLinecap="round" opacity="0.9"/>
                <path d={pathD} fill="none" stroke="#93c5fd" strokeWidth="10" strokeLinecap="round" opacity="0.3"/>
              </>)}
              {BUILDINGS.map(b => {
                const isSel = destination?.building === b.id;
                return (
                  <g key={b.id} onClick={()=>{setSelectedBuilding(b);setSelectedFloor(1);}} style={{cursor:"pointer"}}>
                    <rect x={b.x+6} y={b.y+6} width={b.w} height={b.h} rx="6" fill="#00000022"/>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={isSel?b.color:"#fff"} stroke={isSel?b.darkColor:"#cbd5e1"} strokeWidth={isSel?3:2} style={{filter:isSel?`drop-shadow(0 0 12px ${b.color}88)`:"none"}}/>
                    <rect x={b.x} y={b.y} width={b.w} height="12" rx="8" fill={b.color}/>
                    <rect x={b.x} y={b.y+4} width={b.w} height="8" fill={b.color}/>
                    {[0,1,2].map(wi=>b.x+16+wi*24<b.x+b.w-16?(<rect key={wi} x={b.x+16+wi*24} y={b.y+22} width="14" height="10" rx="2" fill={isSel?"#ffffff44":b.color+"33"} stroke={b.color+"66"} strokeWidth="1"/>):null)}
                    {[0,1,2].map(wi=>b.x+16+wi*24<b.x+b.w-16?(<rect key={wi} x={b.x+16+wi*24} y={b.y+40} width="14" height="10" rx="2" fill={isSel?"#ffffff44":b.color+"33"} stroke={b.color+"66"} strokeWidth="1"/>):null)}
                    <text x={b.x+b.w/2} y={b.y+b.h+16} textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold">{b.short}</text>
                    <text x={b.x+b.w/2} y={b.y+b.h+28} textAnchor="middle" fill="#64748b" fontSize="8">{b.floors}F</text>
                    {isSel&&(<g>
                      <circle cx={b.x+b.w/2} cy={b.y-12} r="10" fill={b.color}/>
                      <text x={b.x+b.w/2} y={b.y-8} textAnchor="middle" fill="white" fontSize="11">📍</text>
                    </g>)}
                  </g>
                );
              })}
              <g>
                <circle cx="60" cy="490" r="10" fill="#3b82f6"/>
                <circle cx="60" cy="490" r="4" fill="white"/>
                <rect x="75" y="480" width="90" height="20" rx="4" fill="#1e40af"/>
                <text x="120" y="494" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">📍 YOU ARE HERE</text>
              </g>
              <g transform="translate(720,30)">
                <circle cx="0" cy="0" r="22" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
                <text x="0" y="-10" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="black">N</text>
                <text x="0" y="16" textAnchor="middle" fill="#64748b" fontSize="8">S</text>
                <text x="-14" y="4" textAnchor="middle" fill="#64748b" fontSize="8">W</text>
                <text x="14" y="4" textAnchor="middle" fill="#64748b" fontSize="8">E</text>
                <polygon points="0,-8 4,4 0,2 -4,4" fill="#dc2626"/>
                <polygon points="0,8 4,-4 0,-2 -4,-4" fill="#94a3b8"/>
              </g>
            </svg>
          </div>
          <div className="p-3 border-t border-slate-100">
            <div className="flex flex-wrap gap-3">
              {[{c:"#3b82f6",l:"Academic"},{c:"#8b5cf6",l:"CSE/IT"},{c:"#7c3aed",l:"Library"},{c:"#f59e0b",l:"Admin"},{c:"#10b981",l:"Hostel"},{c:"#f97316",l:"Mess"},{c:"#06b6d4",l:"Sports"}].map(i=>(
                <div key={i.l} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{background:i.c}}/><span className="text-xs text-slate-600">{i.l}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {destination ? (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600"/><h3 className="font-bold text-slate-900 text-sm">Destination</h3></div>
              <div className="p-3 rounded-2xl border" style={{background:destBuilding?.color+"11",borderColor:destBuilding?.color+"44"}}>
                <div className="font-bold text-slate-900 text-sm">{destination.label}</div>
                <div className="text-xs text-slate-600 mt-1">Floor {destination.floor} • Room {destination.room}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-slate-50 rounded-2xl"><div className="text-lg font-black text-slate-900">{destination.distance}</div><div className="text-xs text-slate-500">Distance</div></div>
                <div className="text-center p-3 bg-slate-50 rounded-2xl"><div className="text-lg font-black text-slate-900">{destination.time}</div><div className="text-xs text-slate-500">Walk time</div></div>
              </div>
              {!navigating ? (
                <button onClick={startNav} className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25">
                  <Navigation className="w-4 h-4"/> Start Navigation
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-emerald-700">🗺 Step {dirStep+1} of {directions.length}</div>
                  <div className="text-sm font-bold text-emerald-900">{directions[dirStep]}</div>
                  <div className="flex gap-2">
                    {dirStep>0&&<button onClick={()=>setDirStep(d=>d-1)} className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold">← Back</button>}
                    {dirStep<directions.length-1&&<button onClick={()=>setDirStep(d=>d+1)} className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Next →</button>}
                    {dirStep===directions.length-1&&<div className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center">🎯 Arrived!</div>}
                  </div>
                  <div className="flex gap-1">
                    {directions.map((_,i)=><div key={i} className={`flex-1 h-1 rounded-full ${i<=dirStep?"bg-emerald-500":"bg-slate-200"}`}/>)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
              <div className="text-center py-4 mb-4"><Navigation className="w-10 h-10 text-slate-300 mx-auto mb-2"/><p className="text-sm font-bold text-slate-500">Search a destination above</p></div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Access</p>
                {DESTINATIONS.slice(0,5).map((d,i)=>(
                  <button key={i} onClick={()=>handleSelect(d)} className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 text-left transition-all">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"/>
                    <div className="flex-1 min-w-0"><div className="text-xs font-bold text-slate-800 truncate">{d.label}</div><div className="text-[10px] text-slate-400">{d.time} walk</div></div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300"/>
                  </button>
                ))}
              </div>
            </div>
          )}
          {selectedBuilding && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-600"/><h3 className="font-bold text-slate-900 text-xs truncate">{selectedBuilding.name}</h3></div>
                <button onClick={()=>setSelectedBuilding(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {Array.from({length:selectedBuilding.floors},(_,i)=>i+1).map(f=>(
                  <button key={f} onClick={()=>setSelectedFloor(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedFloor===f?"text-white shadow":"bg-slate-100 text-slate-600"}`} style={selectedFloor===f?{background:selectedBuilding.color}:{}}>F{f}</button>
                ))}
              </div>
              <div className="space-y-1.5">
                {(selectedBuilding.rooms[selectedFloor]||[]).map((room,i)=>(
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:selectedBuilding.color}}/>
                    <span className="text-xs text-slate-700 font-medium">{room}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}