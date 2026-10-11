import React, { useState, useEffect } from "react";
import { Search, Navigation, MapPin, X, ChevronRight, Layers, RotateCcw, Building2, Users, Coffee, BookOpen } from "lucide-react";

const CELL = 52;
const FH   = 30;

const BUILDINGS = [
  { id:"library",  name:"Central Library",     short:"Library",  col:1,  row:4,  w:2, d:2, floors:3,
    base:"#7c3aed", light:"#a78bfa", dark:"#2e1065", slab:"#c4b5fd",
    image:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80",
    amenities:["50k+ Books","Digital Library","Quiet Zones","24hr Study"],
    rooms:{ 1:["Issue Counter","Digital Section","Newspapers"], 2:["Reference Hall 150 seats","Journals"], 3:["Rare Books","Study Cabins"] }
  },
  { id:"academic", name:"Academic Block A",     short:"Block A",  col:3,  row:1,  w:4, d:2, floors:4,
    base:"#3b82f6", light:"#93c5fd", dark:"#172554", slab:"#bfdbfe",
    image:"https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
    amenities:["Wi-Fi","AC Classrooms","Projectors","Faculty Rooms"],
    rooms:{ 1:["A-101 Principal","A-102 HOD","A-103 Seminar Hall"], 2:["A-201","A-202","A-203 Faculty"], 3:["A-301","A-302","A-303 HOD IT"], 4:["A-401 Conference","A-402"] }
  },
  { id:"sports",   name:"Sports Complex",       short:"Sports",   col:0,  row:7,  w:3, d:2, floors:2,
    base:"#06b6d4", light:"#67e8f9", dark:"#083344", slab:"#a5f3fc",
    image:"https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    amenities:["Gym","Basketball","Badminton","Yoga"],
    rooms:{ 1:["Gymnasium","Yoga Room","Badminton x2"], 2:["Basketball Court","Indoor Games"] }
  },
  { id:"cse",      name:"CSE & IT Block B",     short:"Block B",  col:8,  row:1,  w:3, d:2, floors:4,
    base:"#8b5cf6", light:"#c4b5fd", dark:"#2e1065", slab:"#ddd6fe",
    image:"https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&auto=format&fit=crop&q=80",
    amenities:["GPU Servers","24/7 Lab","Research","High-Speed LAN"],
    rooms:{ 1:["CS Lab 1 40PCs","CS Lab 2","IT Lab"], 2:["Classroom","Network Lab"], 3:["CSE-A","CSE-B","ML Lab"], 4:["Classroom","Research Lab"] }
  },
  { id:"admin",    name:"Admin & Finance",      short:"Admin",    col:8,  row:4,  w:2, d:2, floors:2,
    base:"#f59e0b", light:"#fcd34d", dark:"#451a03", slab:"#fde68a",
    image:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    amenities:["Accounts","Admissions","Exam Branch","HR"],
    rooms:{ 1:["Accounts","Fee Counter","Admission","Exam Branch"], 2:["HR Dept","Finance","Audit"] }
  },
  { id:"hostel",   name:"Aryabhatta Hostel",    short:"Hostel",   col:12, row:1,  w:3, d:3, floors:5,
    base:"#10b981", light:"#6ee7b7", dark:"#022c22", slab:"#a7f3d0",
    image:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80",
    amenities:["AC Rooms","Wi-Fi","Gym","Laundry"],
    rooms:{ 1:["Warden Office","Reception","B101-B115"], 2:["B201-B230","Study Room"], 3:["B301-B330"], 4:["B401-B430"], 5:["B501-B515","Terrace"] }
  },
  { id:"mess",     name:"Annapurna Mess",       short:"Mess",     col:12, row:5,  w:2, d:2, floors:1,
    base:"#f97316", light:"#fdba74", dark:"#431407", slab:"#fed7aa",
    image:"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&auto=format&fit=crop&q=80",
    amenities:["440 Seats","Hygienic Kitchen","3 Meals/Day"],
    rooms:{ 1:["Dining Hall 440 seats","Kitchen","Store Room"] }
  },
];

const DESTS = [
  { label:"CSE Dept B-301",        building:"cse",      floor:2, room:"B-301",        distance:"320m", time:"4 min", tag:"Class"   },
  { label:"CS Lab 1 40PCs B-101",  building:"cse",      floor:0, room:"B-101",        distance:"280m", time:"3 min", tag:"Lab"     },
  { label:"ML & AI Lab B-303",     building:"cse",      floor:2, room:"B-303",        distance:"340m", time:"5 min", tag:"Lab"     },
  { label:"Principal Office A-101",building:"academic", floor:0, room:"A-101",        distance:"180m", time:"2 min", tag:"Admin"   },
  { label:"Seminar Hall A-103",    building:"academic", floor:0, room:"A-103",        distance:"200m", time:"3 min", tag:"Hall"    },
  { label:"Central Library",       building:"library",  floor:0, room:"Reading Hall", distance:"220m", time:"3 min", tag:"Library" },
  { label:"Annapurna Mess Hall",   building:"mess",     floor:0, room:"Dining Hall",  distance:"580m", time:"7 min", tag:"Food"    },
  { label:"Aryabhatta Hostel",     building:"hostel",   floor:0, room:"Reception",    distance:"500m", time:"6 min", tag:"Hostel"  },
  { label:"Accounts Fee Counter",  building:"admin",    floor:0, room:"Accounts",     distance:"350m", time:"4 min", tag:"Admin"   },
  { label:"Sports Gym",            building:"sports",   floor:0, room:"Gymnasium",    distance:"400m", time:"5 min", tag:"Sports"  },
];

const DIRS = {
  cse:["Exit Main Gate — walk straight","Continue 150m on Main Road","Turn RIGHT at the fountain","Block B on your LEFT","Enter lobby, take stairs"],
  academic:["Exit Main Gate — walk straight","Academic Block A is 100m ahead","Enter through glass doors","Destination reached!"],
  library:["Exit Main Gate","Turn LEFT along garden path","Walk 120m","Library entrance on right"],
  hostel:["Exit Main Gate","Walk straight 200m","Turn RIGHT after CSE Block","200m ahead — Aryabhatta Hall"],
  mess:["Exit Main Gate","Walk 200m straight","Turn RIGHT after CSE","Pass hostel — Mess Hall on left"],
  admin:["Exit Main Gate","Walk 150m straight","Turn RIGHT at fountain","Admin Block on left"],
  sports:["Exit Main Gate","Turn LEFT","Walk 250m along boundary wall","Sports Complex on right"],
};

const TAGS = {
  Class:"bg-blue-100 text-blue-700", Lab:"bg-purple-100 text-purple-700",
  Admin:"bg-amber-100 text-amber-700", Library:"bg-indigo-100 text-indigo-700",
  Hall:"bg-cyan-100 text-cyan-700", Food:"bg-orange-100 text-orange-700",
  Hostel:"bg-emerald-100 text-emerald-700", Sports:"bg-teal-100 text-teal-700",
};

// ─── CSS 3D Building ───────────────────────────────────────────────────────
function Building3D({ b, isSelected, selFloor, onClick, tick, revealed }) {
  const { col, row, w, d, floors, base, light, dark } = b;
  const totalH = floors * FH;
  const W = w * CELL, D = d * CELL;
  const L = col * CELL, T = row * CELL;

  const scanLine = `repeating-linear-gradient(0deg,transparent,transparent 5px,${base}22 5px,${base}22 6px)`;

  return (
    <div onClick={onClick} style={{
      position:"absolute", left:L, top:T, width:W, height:D,
      transformStyle:"preserve-3d", cursor:"pointer",
      /* Entrance animation: rise from underground when revealed */
      opacity: revealed ? 1 : 0,
      transform: revealed ? "translateZ(0px)" : "translateZ(-420px)",
      transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {/* Ground footprint */}
      <div style={{
        position:"absolute", inset:0,
        background: dark,
        border:`1px solid ${base}55`,
      }}/>

      {/* Floor slabs — the X-ray layers */}
      {Array.from({length:floors},(_,f)=>{
        const active  = isSelected && selFloor===f;
        const dimmed  = isSelected && !active;
        const pct = (f+1)/floors;
        return (
          <div key={f} style={{
            position:"absolute", inset:0,
            transform:`translateZ(${(f+1)*FH}px)`,
            background: active
              ? `${b.slab}ee`
              : dimmed
              ? `${base}08`
              : `${base}${Math.round(20+pct*18).toString(16).padStart(2,"0")}`,
            border:`${active?2:1}px solid ${active?"#ffffff":base+(dimmed?"22":"88")}`,
            boxShadow: active ? `0 0 24px ${base}cc, 0 0 48px ${base}55, inset 0 0 12px ${base}44` : "none",
            backgroundImage: active
              ? `repeating-linear-gradient(90deg,${base}55 0,transparent 1px,transparent ${W/Math.max(w,1)}px),repeating-linear-gradient(0deg,${base}55 0,transparent 1px,transparent ${D/Math.max(d,1)}px)`
              : dimmed ? "none" : scanLine,
            transition:"all 0.25s ease",
          }}>
            {active && (
              <div style={{
                position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
                color: base, fontSize:10, fontWeight:900, opacity:0.7, letterSpacing:1,
              }}>F{f+1}</div>
            )}
          </div>
        );
      })}

      {/* FRONT WALL — south face, X-ray glass */}
      <div style={{
        position:"absolute", bottom:0, left:0, width:W, height:totalH,
        transformOrigin:"center bottom",
        transform:"rotateX(-90deg)",
        background:`${base}16`,
        backgroundImage:scanLine,
        border:`1px solid ${light}55`,
        backdropFilter:"blur(1px)",
      }}>
        {/* Window columns */}
        {Array.from({length:w},(_,i)=>(
          <div key={i} style={{
            position:"absolute",
            left:`${(i/w*100)+5}%`, width:`${90/w}%`,
            top:"15%", height:"70%",
            background:`${light}14`,
            border:`0.5px solid ${light}44`,
          }}/>
        ))}
      </div>

      {/* RIGHT WALL — east face, X-ray glass */}
      <div style={{
        position:"absolute", left:W, top:0, width:totalH, height:D,
        transformOrigin:"left center",
        transform:"rotateY(90deg)",
        background:`${dark}20`,
        backgroundImage:scanLine,
        border:`1px solid ${base}44`,
      }}>
        {Array.from({length:d},(_,i)=>(
          <div key={i} style={{
            position:"absolute",
            top:`${(i/d*100)+5}%`, height:`${90/d}%`,
            left:"15%", width:"70%",
            background:`${base}10`,
            border:`0.5px solid ${base}33`,
          }}/>
        ))}
      </div>

      {/* BACK WALL — north face, faint */}
      <div style={{
        position:"absolute", top:0, left:0, width:W, height:totalH,
        transformOrigin:"center top",
        transform:"rotateX(90deg)",
        background:`${dark}0c`,
        border:`1px solid ${dark}30`,
      }}/>

      {/* LEFT WALL — west face, faint */}
      <div style={{
        position:"absolute", left:0, top:0, width:totalH, height:D,
        transformOrigin:"left center",
        transform:"rotateY(90deg)",
        background:`${base}0c`,
        border:`1px solid ${base}28`,
      }}/>

      {/* ROOF — with building name printed on top */}
      <div style={{
        position:"absolute", inset:0,
        transform:`translateZ(${totalH}px)`,
        background: isSelected ? light : `${base}cc`,
        border:`${isSelected?2:1}px solid ${isSelected?"#ffffff":light}`,
        boxShadow: isSelected?`0 0 20px ${base}99`:"none",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", gap:1,
        overflow:"hidden",
      }}>
        {/* Short name on roof */}
        <div style={{
          fontSize: Math.max(7, Math.min(11, W/b.short.length*0.7)),
          fontWeight:900, color: isSelected?"#1e1b4b":"#ffffff",
          textAlign:"center", letterSpacing:0.5, lineHeight:1.2,
          textShadow: isSelected?"none":"0 1px 3px rgba(0,0,0,0.5)",
          padding:"0 4px", userSelect:"none",
        }}>{b.short}</div>
        <div style={{
          fontSize:6, fontWeight:700,
          color: isSelected?"#3730a3":"rgba(255,255,255,0.7)",
          letterSpacing:0.5, userSelect:"none",
        }}>{floors} FLOORS</div>
      </div>

      {/* Name on FRONT WALL (south face) — readable from front view */}
      <div style={{
        position:"absolute", bottom:0, left:0, width:W, height:totalH,
        transformOrigin:"center bottom",
        transform:"rotateX(-90deg)",
        pointerEvents:"none",
        display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:2,
      }}>
        <div style={{
          fontSize: Math.max(8, Math.min(13, W/8)),
          fontWeight:900, color:"#ffffff",
          textShadow:`0 0 12px ${base}, 0 2px 4px rgba(0,0,0,0.8)`,
          letterSpacing:0.5, textAlign:"center", padding:"0 6px",
          userSelect:"none",
        }}>{b.name}</div>
        <div style={{
          display:"flex", gap:3, alignItems:"center",
        }}>
          {Array.from({length:floors},(_,i)=>(
            <div key={i} style={{
              width:6, height:10,
              background: base,
              opacity: 0.4+i*0.15,
              border:`0.5px solid ${light}66`,
              borderRadius:1,
            }}/>
          ))}
          <span style={{fontSize:7,color:light,fontWeight:"bold",marginLeft:2}}>{floors}F</span>
        </div>
      </div>

      {/* Floating badge ABOVE roof — always visible */}
      <div style={{
        position:"absolute",
        left:W/2, top:D/2,
        transform:`translateZ(${totalH+18}px) rotateZ(-45deg) rotateX(-52deg)`,
        transformOrigin:"center center",
        pointerEvents:"none",
      }}>
        <div style={{
          background: isSelected ? base : "rgba(2,12,27,0.92)",
          border:`1.5px solid ${isSelected?"#ffffff":base}`,
          borderRadius:8, padding:"3px 10px",
          color:"#ffffff", fontSize:10, fontWeight:900, whiteSpace:"nowrap",
          backdropFilter:"blur(6px)",
          textShadow: isSelected?`0 0 10px #fff`:`0 0 8px ${base}`,
          boxShadow: isSelected?`0 0 20px ${base}, 0 4px 12px rgba(0,0,0,0.5)`:`0 4px 12px rgba(0,0,0,0.5)`,
          textAlign:"center",
          transform:"translate(-50%,-50%)",
          letterSpacing:0.3,
        }}>
          {b.short}
          <span style={{fontSize:8,color:light,marginLeft:4,fontWeight:700}}>•{floors}F</span>
        </div>
        {/* Connector line down to roof */}
        <div style={{
          width:1, height:14,
          background:`linear-gradient(${base},transparent)`,
          margin:"0 auto",
        }}/>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function CampusNav3D() {
  const [search, setSearch] = useState("");
  const [dest,   setDest]   = useState(null);
  const [nav,    setNav]    = useState(false);
  const [selB,   setSelB]   = useState(null);
  const [selF,   setSelF]   = useState(0);
  const [step,   setStep]   = useState(0);
  const [view,   setView]   = useState("map");
  const [tick,   setTick]   = useState(0);

  // ── FIXED angle — no rotation, no drag ────────────────────────────────
  const ELEV = 52;   // constant elevation
  const AZIM = 45;   // constant azimuth

  // ── Staggered building reveal ──────────────────────────────────────────
  const [visibleCount, setVisibleCount] = useState(0);

  // Tick for beacon animation
  useEffect(()=>{
    const t = setInterval(()=>setTick(n=>n+1),700);
    return ()=>clearInterval(t);
  },[]);

  // Reveal buildings one by one on mount
  useEffect(()=>{
    setVisibleCount(0);
    let idx = 0;
    const scheduleNext = () => {
      if(idx < BUILDINGS.length) { idx++; setVisibleCount(idx); setTimeout(scheduleNext, 200); }
    };
    setTimeout(scheduleNext, 300);
  },[]);

  const filtered = search.length>1
    ? DESTS.filter(d=>d.label.toLowerCase().includes(search.toLowerCase())).slice(0,6)
    : [];

  const selectDest = d => {
    setDest(d); setSearch(d.label); setNav(false); setStep(0);
    const b = BUILDINGS.find(b=>b.id===d.building);
    setSelB(b); setSelF(d.floor); setView("map");
  };
  const openB = b => { setSelB(b); setSelF(0); setView("building"); };
  const dirs  = dest ? DIRS[dest.building]||[] : [];
  const destB = dest ? BUILDINGS.find(b=>b.id===dest.building) : null;


  // Building detail view
  if(view==="building" && selB){
    const b=selB;
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={()=>setView("map")}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">
          &#8592; Back to 3D X-Ray Map
        </button>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{height:220}}>
          <img src={b.image} alt={b.name} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white" style={{background:b.base}}>{b.id.toUpperCase()}</div>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl font-black">{b.name}</h2>
            <p className="text-xs opacity-75">{b.floors} Floors — Trident Academy of Technology</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 mb-2">Facilities</p>
          <div className="flex flex-wrap gap-2">{b.amenities.map((a,i)=>(
            <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">&#10003; {a}</span>
          ))}</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Floor Explorer</h3>
            <div className="flex gap-1">{Array.from({length:b.floors},(_,i)=>(
              <button key={i} onClick={()=>setSelF(i)}
                className="w-9 h-9 rounded-xl text-xs font-black transition-all"
                style={selF===i?{background:b.base,color:"white",boxShadow:`0 4px 12px ${b.base}66`}:{background:"#f1f5f9",color:"#475569"}}>
                F{i+1}
              </button>
            ))}</div>
          </div>

          {/* Mini 3D floor preview using CSS 3D */}
          <div className="rounded-2xl overflow-hidden" style={{height:140,background:"#020c1b",perspective:"600px"}}>
            <div style={{
              position:"relative",width:200,height:140,margin:"0 auto",
              transform:"rotateX(50deg) rotateZ(45deg) translateY(10px)",
              transformStyle:"preserve-3d",
            }}>
              <div style={{position:"absolute",width:160,height:120,left:20,top:10,background:b.dark,border:`1px solid ${b.base}55`}}/>
              <div style={{
                position:"absolute",width:160,height:120,left:20,top:10,
                transform:`translateZ(32px)`,
                background:`${b.slab}cc`,border:`2px solid white`,
                backgroundImage:`repeating-linear-gradient(90deg,${b.base}44 0,transparent 1px,transparent 40px),repeating-linear-gradient(0deg,${b.base}44 0,transparent 1px,transparent 40px)`,
              }}/>
              {/* front wall */}
              <div style={{position:"absolute",left:20,top:130,width:160,height:32,transformOrigin:"top",transform:"rotateX(-90deg)",background:`${b.base}20`,border:`1px solid ${b.light}55`}}/>
              {/* right wall */}
              <div style={{position:"absolute",left:180,top:10,width:32,height:120,transformOrigin:"left",transform:"rotateY(90deg)",background:`${b.dark}20`,border:`1px solid ${b.base}44`}}/>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Floor {selF+1} Rooms</p>
            {(b.rooms[selF+1]||[]).map((room,i)=>(
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:b.base}}/>
                <span className="text-xs text-slate-800 font-medium">{room}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>{const d=DESTS.find(d=>d.building===b.id);if(d){selectDest(d);setNav(true);}}}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          style={{background:b.base}}>
          <Navigation className="w-5 h-5"/> Navigate to {b.short}
        </button>
      </div>
    );
  }

  // Map view
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search */}
      <div className="rounded-3xl p-5 shadow-2xl relative overflow-hidden"
        style={{background:"linear-gradient(135deg,#0f172a,#1e1b4b 60%,#0f172a)"}}>
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(circle at 25% 50%,#3b82f622,transparent 50%),radial-gradient(circle at 75% 20%,#8b5cf622,transparent 50%)"}}/>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Layers className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h2 className="text-lg font-black text-white">TAT Campus — Real 3D X-Ray Map</h2>
              <p className="text-xs text-blue-300">CSS 3D &bull; Transparent X-Ray Floors &bull; Drag to Orbit &bull; Live Navigation</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setDest(null);setNav(false);}}
              placeholder="Search classroom, lab, hostel, mess..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none"
              style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)"}}/>
            {search && (
              <button onClick={()=>{setSearch("");setDest(null);setSelB(null);setNav(false);}}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{background:"rgba(255,255,255,0.18)"}}>
                <X className="w-3.5 h-3.5 text-white"/>
              </button>
            )}
            {filtered.length>0 && !dest && (
              <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{background:"#0f172a",border:"1px solid #1e293b"}}>
                {filtered.map((d,i)=>(
                  <button key={i} onClick={()=>selectDest(d)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-800 transition-colors"
                    style={{borderBottom:"1px solid #1e293b"}}>
                    <div className="w-8 h-8 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-400"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{d.label}</div>
                      <div className="text-xs text-slate-400">{d.distance} &bull; {d.time} walk</div>
                    </div>
                    <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full "+(TAGS[d.tag]||"")}>{d.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULL-WIDTH 3D MAP + Side panel below */}
      <div className="space-y-4">
        {/* 3D X-RAY MAP CANVAS — full width */}
        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl w-full"
          style={{background:"#020c1b"}}>
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-white font-bold text-sm">Trident Academy of Technology — CSS 3D X-Ray Map</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-900/30 border border-cyan-700/40 px-2 py-0.5 rounded-full">REAL 3D</span>
              <button onClick={()=>{ setSelB(null); setVisibleCount(0); setTimeout(()=>{let i=0;const go=()=>{if(i<BUILDINGS.length){i++;setVisibleCount(i);setTimeout(go,200);}};go();},300); }}
                className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors" title="Reset view">
                <RotateCcw className="w-3.5 h-3.5 text-slate-400"/>
              </button>
              {selB && (
                <div className="flex gap-1">
                  {Array.from({length:selB.floors},(_,i)=>(
                    <button key={i} onClick={()=>setSelF(i)}
                      className="w-7 h-7 rounded-lg text-[10px] font-black transition-all"
                      style={selF===i?{background:selB.base,color:"white"}:{background:"#1e293b",color:"#64748b"}}>
                      {i+1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* THE 3D MAP — FIXED, NO ROTATION */}
          <div style={{height:580, perspective:"1600px", overflow:"hidden", position:"relative"}}>

            {/* Dark background */}
            <div style={{
              position:"absolute",inset:0,
              backgroundImage:"radial-gradient(ellipse at 30% 40%,#0c1a3a 0%,transparent 60%),radial-gradient(ellipse at 70% 60%,#1a0c3a 0%,transparent 60%)",
            }}/>

            {/* Click-to-select hint */}
            <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
              fontSize:10, color:"rgba(100,130,200,0.6)", fontWeight:"bold", pointerEvents:"none",
              letterSpacing:1, zIndex:10}}>
              🏛️ CLICK A BUILDING TO VIEW INFO
            </div>

            {/* Scene — FIXED angle, never rotates */}
            <div style={{
              position:"absolute", top:"22%", left:"48%",
              transformStyle:"preserve-3d",
              transform:`rotateZ(${AZIM}deg) rotateX(${ELEV}deg)`,
              width:0, height:0,
            }}>
              {/* Ground plane */}
              <div style={{
                position:"absolute",
                left:-120, top:-100,
                width: 17*CELL, height:13*CELL,
                transformStyle:"preserve-3d",
                background:"#0a1628",
                border:"1px solid #1a2744",
                backgroundImage:`
                  repeating-linear-gradient(90deg,#1a2744 0,#1a2744 1px,transparent 1px,transparent ${CELL}px),
                  repeating-linear-gradient(0deg,#1a2744 0,#1a2744 1px,transparent 1px,transparent ${CELL}px)
                `,
              }}>
                {/* Road */}
                <div style={{position:"absolute",left:0,top:9*CELL,width:"100%",height:2*CELL,background:"#111d2e",borderTop:"1px solid #243450",borderBottom:"1px solid #243450"}}/>
                {/* Garden */}
                <div style={{position:"absolute",left:4*CELL,top:5*CELL,width:5*CELL,height:3*CELL,background:"#052e16",border:"1px solid #14532d",borderRadius:4}}/>
                {/* Road dashes */}
                <div style={{position:"absolute",left:0,top:9*CELL+CELL-1,height:2,width:"100%",backgroundImage:"repeating-linear-gradient(90deg,#2d4a6b 0,#2d4a6b 30px,transparent 30px,transparent 60px)"}}/>
                {/* Road label */}
                <div style={{position:"absolute",left:"35%",top:9*CELL+22,fontSize:9,color:"#334155",fontWeight:"bold",letterSpacing:2}}>MAIN CAMPUS ROAD</div>
                {/* Garden label */}
                <div style={{position:"absolute",left:5.5*CELL,top:6*CELL+15,fontSize:8,color:"#14532d",fontWeight:"bold"}}>Campus Garden</div>
              </div>

              {/* Buildings — all visible immediately, click to select */}
              {BUILDINGS.map((b, idx)=>(
                <Building3D key={b.id} b={b}
                  isSelected={selB?.id===b.id}
                  selFloor={selF} tick={tick}
                  revealed={true}
                  onClick={()=>{ setSelB(s => s?.id===b.id ? null : b); setSelF(0); }}/>
              ))}

              {/* Main Gate */}
              <div style={{
                position:"absolute", left:2*CELL-20, top:9*CELL-10,
                width:40, height:20,
                background:"#1d4ed8",
                border:"2px solid #3b82f6",
                borderRadius:4,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"white", fontSize:8, fontWeight:900, letterSpacing:1,
                transformStyle:"preserve-3d",
                boxShadow:`0 0 20px #3b82f688`,
              }}>
                GATE
              </div>
              {/* Gate glow beacon */}
              <div style={{
                position:"absolute", left:2*CELL-8, top:9*CELL-8,
                width:16, height:16,
                transform:`translateZ(${4+(tick%4)*2}px)`,
                background:"#3b82f6",
                borderRadius:"50%",
                boxShadow:`0 0 ${12+tick%8}px #3b82f6`,
                opacity:0.9,
              }}/>

              {/* Destination beacon */}
              {destB && (
                <div style={{
                  position:"absolute",
                  left: destB.col*CELL + destB.w*CELL/2 - 10,
                  top:  destB.row*CELL + destB.d*CELL/2 - 10,
                  width:20, height:20,
                  transform:`translateZ(${destB.floors*FH + 8 + (tick%4)*3}px)`,
                  background:destB.base,
                  borderRadius:"50%",
                  boxShadow:`0 0 ${16+(tick%4)*4}px ${destB.base}, 0 0 40px ${destB.base}66`,
                  border:"2px solid white",
                }}/>
              )}
            </div>
          </div>

          {/* Legend bar */}
          <div className="px-4 py-2.5 border-t border-slate-800">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {BUILDINGS.map(b=>(
                <button key={b.id} onClick={()=>{ setSelB(s=>s?.id===b.id?null:b); setSelF(0); }}
                  className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-lg ${selB?.id===b.id?'bg-slate-700':'hover:bg-slate-800'}`}>
                  <div className="w-3 h-3 rounded-sm" style={{background:b.base}}/>
                  <span className="text-xs text-slate-300 font-medium">{b.short}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-1">Click a building on the map or legend to view details</p>
          </div>
        </div>

        {/* Bottom panels — 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left — Search / Navigation */}
          <div>
          {dest && destB ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="relative h-36">
                <img src={destB.image} alt={destB.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"/>
                <button onClick={()=>{setDest(null);setSearch("");setNav(false);setSelB(null);}}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm"
                  style={{background:"rgba(0,0,0,0.4)"}}>
                  <X className="w-4 h-4 text-white"/>
                </button>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs opacity-70">Destination</div>
                  <div className="font-black text-sm">{dest.label}</div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2.5 bg-slate-50 rounded-xl"><div className="text-sm font-black">{dest.distance}</div><div className="text-[10px] text-slate-500">Distance</div></div>
                  <div className="text-center p-2.5 bg-slate-50 rounded-xl"><div className="text-sm font-black">{dest.time}</div><div className="text-[10px] text-slate-500">Walk</div></div>
                  <div className="text-center p-2.5 rounded-xl" style={{background:destB.base+"12"}}>
                    <div className="text-sm font-black" style={{color:destB.base}}>F{dest.floor+1}</div>
                    <div className="text-[10px] text-slate-500">Floor</div>
                  </div>
                </div>
                {!nav ? (
                  <button onClick={()=>{setNav(true);setStep(0);}}
                    className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                    style={{background:destB.base}}>
                    <Navigation className="w-4 h-4"/> Start Navigation
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl border-2 space-y-3"
                    style={{background:destB.base+"08",borderColor:destB.base+"33"}}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{color:destB.base}}>Step {step+1}/{dirs.length}</span>
                      <div className="flex gap-1">{dirs.map((_,i)=><div key={i} style={{width:14,height:4,borderRadius:2,background:i<=step?destB.base:"#e2e8f0"}}/>)}</div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{dirs[step]}</div>
                    <div className="flex gap-2">
                      {step>0 && <button onClick={()=>setStep(s=>s-1)} className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">← Back</button>}
                      {step<dirs.length-1
                        ? <button onClick={()=>setStep(s=>s+1)} className="flex-1 py-2 rounded-xl text-white text-xs font-bold" style={{background:destB.base}}>Next →</button>
                        : <div className="flex-1 py-2 rounded-xl text-white text-xs font-bold text-center bg-emerald-500">🏁 Arrived!</div>
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-blue-500"/>
                <p className="text-sm font-bold text-slate-700">Find a Room / Location</p>
              </div>
              <div className="space-y-1.5">
                {DESTS.slice(0,6).map((d,i)=>(
                  <button key={i} onClick={()=>selectDest(d)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 text-left transition-all">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-blue-600"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{d.label}</div>
                      <div className="text-[10px] text-slate-400">{d.time} • {d.distance}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TAGS[d.tag]||""}`}>{d.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>

          {/* Right — Building info when clicked, else all buildings grid */}
          {selB ? (
            <div className="bg-white rounded-3xl shadow-sm border-2 overflow-hidden animate-fade-in"
              style={{borderColor: selB.base+"55"}}>
              {/* Photo banner */}
              <div className="relative h-40">
                <img src={selB.image} alt={selB.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                <button onClick={()=>setSelB(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                  <X className="w-4 h-4 text-white"/>
                </button>
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black text-white" style={{background:selB.base}}>
                  {selB.id.toUpperCase()}
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-black text-lg leading-tight">{selB.name}</h3>
                  <p className="text-xs opacity-80">{selB.floors} Floors · Trident Academy of Technology</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Amenities */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Facilities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selB.amenities.map((a,i)=>(
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{background:selB.base}}>✓ {a}</span>
                    ))}
                  </div>
                </div>

                {/* Floor selector */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Floor Explorer</p>
                  <div className="flex gap-1.5 mb-2">
                    {Array.from({length:selB.floors},(_,i)=>(
                      <button key={i} onClick={()=>setSelF(i)}
                        className="flex-1 py-2 rounded-xl text-xs font-black transition-all"
                        style={selF===i?{background:selB.base,color:"white",boxShadow:`0 4px 12px ${selB.base}55`}:{background:"#f1f5f9",color:"#475569"}}>
                        F{i+1}
                      </button>
                    ))}
                  </div>
                  {/* Rooms on selected floor */}
                  <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5">
                    <p className="text-[10px] text-slate-400 font-bold">Floor {selF+1} Rooms</p>
                    {(selB.rooms[selF]||[]).map((room,i)=>(
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:selB.base}}/>
                        {room}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigate to */}
                <button onClick={()=>openB(selB)}
                  className="w-full py-2.5 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-2"
                  style={{background:selB.base}}>
                  <ChevronRight className="w-4 h-4"/> Full Floor Plans & Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">All Campus Buildings</p>
              <div className="grid grid-cols-2 gap-2">
                {BUILDINGS.map(b=>(
                  <button key={b.id} onClick={()=>{setSelB(b);setSelF(0);}}
                    className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all">
                    <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={b.image} alt={b.name} className="w-full h-full object-cover"/>
                      <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{background:b.base}}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{b.name}</div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({length:b.floors},(_,i)=>(
                          <div key={i} style={{width:10,height:5,borderRadius:1,background:b.base,opacity:0.3+i*0.15}}/>
                        ))}
                        <span className="text-[9px] text-slate-400 ml-1">{b.floors}F</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>{/* end 2-col grid */}
      </div>{/* end space-y-4 */}
    </div>
  );
}
