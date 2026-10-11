import React, { useState, useEffect } from "react";
import { Search, Navigation, MapPin, Clock, Building2, ChevronRight, X, Layers, Camera, Compass } from "lucide-react";

const BUILDINGS = [
  { id:"academic", name:"Academic Block A", short:"Block A", tag:"Main Academic", type:"academic", color:"#3b82f6", gradient:"from-blue-600 to-blue-800", x:265, y:175, w:130, h:85, floors:4,
    image:"https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
    description:"The main academic block housing CSE, IT and ECE departments with modern classrooms.",
    amenities:["Wi-Fi","AC Classrooms","Projectors","Faculty Rooms"],
    floorImages:{ 1:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80", 2:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&auto=format&fit=crop&q=80", 3:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80", 4:"https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=400&auto=format&fit=crop&q=80" },
    rooms:{ 1:["A-101 — Principal Office","A-102 — HOD CSE","A-103 — Seminar Hall (200 seats)","A-104 — Reception"], 2:["A-201 — Classroom (60 seats)","A-202 — Classroom","A-203 — Faculty Room","A-204 — Classroom"], 3:["A-301 — Classroom","A-302 — Classroom","A-303 — Classroom","A-304 — HOD IT"], 4:["A-401 — Conference Hall","A-402 — Classroom","A-403 — Staff Room"] }
  },
  { id:"cse", name:"CSE & IT Block B", short:"Block B", tag:"Technology Hub", type:"academic", color:"#8b5cf6", gradient:"from-violet-600 to-purple-800", x:450, y:155, w:120, h:95, floors:4,
    image:"https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&auto=format&fit=crop&q=80",
    description:"State-of-the-art technology block with computer labs, ML lab, and research facilities.",
    amenities:["High-Speed LAN","GPU Servers","24/7 Lab Access","Research Center"],
    floorImages:{ 1:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80", 2:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80", 3:"https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&auto=format&fit=crop&q=80", 4:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80" },
    rooms:{ 1:["B-101 — CS Lab 1 (40 PCs)","B-102 — CS Lab 2 (40 PCs)","B-103 — IT Lab"], 2:["B-201 — Classroom","B-202 — Classroom","B-203 — Network Lab"], 3:["B-301 — Classroom (CSE-A)","B-302 — Classroom (CSE-B)","B-303 — ML & AI Lab"], 4:["B-401 — Classroom","B-402 — Research Lab","B-403 — Project Room"] }
  },
  { id:"library", name:"Central Library", short:"Library", tag:"Knowledge Hub", type:"library", color:"#7c3aed", gradient:"from-purple-600 to-indigo-800", x:165, y:295, w:110, h:75, floors:3,
    image:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80",
    description:"Central library with over 50,000 books, digital resources and quiet study zones.",
    amenities:["50k+ Books","Digital Library","Quiet Zones","24hr Study Room"],
    floorImages:{ 1:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&auto=format&fit=crop&q=80", 2:"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&auto=format&fit=crop&q=80", 3:"https://images.unsplash.com/photo-1568667256549-094345857637?w=400&auto=format&fit=crop&q=80" },
    rooms:{ 1:["Issue & Return Counter","Digital Resource Section","Newspaper & Periodicals"], 2:["Reference Section","Silent Reading Hall (150 seats)","Journals & Papers"], 3:["Rare Books Section","Faculty Lounge","Research Study Cabins"] }
  },
  { id:"admin", name:"Admin & Finance Block", short:"Admin Block", tag:"Administrative", type:"admin", color:"#f59e0b", gradient:"from-amber-500 to-orange-700", x:408, y:295, w:100, h:70, floors:2,
    image:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    description:"Administrative headquarters with accounts, admissions, exam branch and HR offices.",
    amenities:["Accounts Office","Admission Cell","Exam Branch","HR Department"],
    floorImages:{ 1:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&auto=format&fit=crop&q=80", 2:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&auto=format&fit=crop&q=80" },
    rooms:{ 1:["Accounts Office","Fee Payment Counter","Admission Cell","Exam Branch"], 2:["HR Department","Finance Office","Audit Room","Director PA Office"] }
  },
  { id:"hostel", name:"Aryabhatta Hall of Residence", short:"Hostel", tag:"Student Housing", type:"hostel", color:"#10b981", gradient:"from-emerald-600 to-teal-800", x:590, y:240, w:140, h:105, floors:5,
    image:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80",
    description:"Premium hostel with fully furnished rooms, Wi-Fi, gym and common rooms.",
    amenities:["AC Rooms","Wi-Fi","Gym","Laundry","Common Room"],
    floorImages:{ 1:"https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&auto=format&fit=crop&q=80", 2:"https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&auto=format&fit=crop&q=80", 3:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=80", 4:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&auto=format&fit=crop&q=80", 5:"https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&auto=format&fit=crop&q=80" },
    rooms:{ 1:["Warden Office","Reception","Common Room (TV + Carom)","B-101 to B-115"], 2:["B-201 to B-230","Balcony Lounge","Study Room"], 3:["B-301 to B-330","Balcony Lounge"], 4:["B-401 to B-430"], 5:["B-501 to B-515","Terrace Garden"] }
  },
  { id:"mess", name:"Annapurna Mess Hall", short:"Mess Hall", tag:"Dining", type:"mess", color:"#f97316", gradient:"from-orange-500 to-red-700", x:590, y:370, w:120, h:75, floors:1,
    image:"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&auto=format&fit=crop&q=80",
    description:"Hygienic, fully equipped mess serving 3 meals daily to 440+ students.",
    amenities:["440 Seats","Hygienic Kitchen","CCTV Monitored","Nutritious Menu"],
    floorImages:{ 1:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80" },
    rooms:{ 1:["Main Dining Hall (440 seats)","Kitchen & Food Prep Zone","Store Room","Supervisor Office"] }
  },
  { id:"sports", name:"Sports Complex & Gym", short:"Sports", tag:"Recreation", type:"sports", color:"#06b6d4", gradient:"from-cyan-500 to-blue-700", x:135, y:415, w:150, h:85, floors:2,
    image:"https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    description:"Modern sports complex with indoor and outdoor facilities including a fully equipped gym.",
    amenities:["Gym","Basketball","Badminton","Indoor Games","Yoga Room"],
    floorImages:{ 1:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80", 2:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80" },
    rooms:{ 1:["Gymnasium (Full Equipment)","Yoga & Meditation Room","Badminton Court x2","Boxing Ring"], 2:["Basketball Court","Indoor Games (TT, Chess, Carom)","Sports Storage","Changing Rooms"] }
  },
];

const DESTINATIONS=[
  {label:"CSE Dept — Room B-301",building:"cse",floor:3,room:"B-301",distance:"320m",time:"4 min",tag:"Class"},
  {label:"CS Lab 1 — 40 PCs (B-101)",building:"cse",floor:1,room:"B-101",distance:"280m",time:"3 min",tag:"Lab"},
  {label:"ML & AI Lab (B-303)",building:"cse",floor:3,room:"B-303",distance:"340m",time:"5 min",tag:"Lab"},
  {label:"Principal Office (A-101)",building:"academic",floor:1,room:"A-101",distance:"180m",time:"2 min",tag:"Admin"},
  {label:"Seminar Hall A-103 (200 seats)",building:"academic",floor:1,room:"A-103",distance:"200m",time:"3 min",tag:"Hall"},
  {label:"Central Library Ground Floor",building:"library",floor:1,room:"Reading Hall",distance:"220m",time:"3 min",tag:"Library"},
  {label:"Annapurna Mess Hall",building:"mess",floor:1,room:"Dining Hall",distance:"580m",time:"7 min",tag:"Food"},
  {label:"Aryabhatta Hostel",building:"hostel",floor:1,room:"Reception",distance:"500m",time:"6 min",tag:"Hostel"},
  {label:"Accounts — Fee Counter",building:"admin",floor:1,room:"Accounts",distance:"350m",time:"4 min",tag:"Admin"},
  {label:"Gym & Sports Complex",building:"sports",floor:1,room:"Gymnasium",distance:"400m",time:"5 min",tag:"Sports"},
  {label:"Network Lab (B-203)",building:"cse",floor:2,room:"B-203",distance:"300m",time:"4 min",tag:"Lab"},
  {label:"Research Lab (B-402)",building:"cse",floor:4,room:"B-402",distance:"360m",time:"5 min",tag:"Lab"},
];
const PATHS={
  cse:["M 55 490","L 55 340","L 300 340","L 300 260","L 450 215"],
  academic:["M 55 490","L 55 340","L 265 300","L 265 260"],
  library:["M 55 490","L 55 360","L 165 355"],
  admin:["M 55 490","L 55 370","L 280 370","L 408 355"],
  hostel:["M 55 490","L 55 340","L 400 340","L 590 300"],
  mess:["M 55 490","L 55 395","L 400 395","L 590 405"],
  sports:["M 55 490","L 55 445","L 135 450"],
};
const DIRECTIONS={
  cse:["Exit Main Gate and walk straight","Continue on Main Road for 150m","Turn RIGHT at the water fountain","Block B on your LEFT (50m)","Enter through the main lobby","Take stairs to your floor"],
  academic:["Exit Main Gate and walk straight","Academic Block A is 100m ahead","Enter through the main lobby glass doors","Destination reached!"],
  library:["Exit Main Gate","Turn LEFT along the garden path","Walk 120m along the garden","Library entrance on your right"],
  hostel:["Exit Main Gate","Walk straight on main road (200m)","Turn RIGHT after the CSE Block","Continue 200m","Aryabhatta Hall on your right"],
  mess:["Exit Main Gate","Walk straight (200m)","Turn RIGHT after CSE Block","Continue past hostel (150m)","Mess Hall on your left"],
  admin:["Exit Main Gate","Walk straight 150m","Turn RIGHT at the fountain","Admin Block on your left"],
  sports:["Exit Main Gate","Turn LEFT","Walk along boundary wall (250m)","Sports Complex on your right"],
};
const TAGS={"Class":"bg-blue-100 text-blue-700","Lab":"bg-purple-100 text-purple-700","Admin":"bg-amber-100 text-amber-700","Library":"bg-indigo-100 text-indigo-700","Hall":"bg-cyan-100 text-cyan-700","Food":"bg-orange-100 text-orange-700","Hostel":"bg-emerald-100 text-emerald-700","Sports":"bg-teal-100 text-teal-700"};

export default function CampusNav3D(){
  const [search,setSearch]=useState("");
  const [destination,setDestination]=useState(null);
  const [navigating,setNavigating]=useState(false);
  const [selBuilding,setSelBuilding]=useState(null);
  const [selFloor,setSelFloor]=useState(1);
  const [dirStep,setDirStep]=useState(0);
  const [view,setView]=useState("map");
  const [pulse,setPulse]=useState(0);

  useEffect(()=>{const t=setInterval(()=>setPulse(p=>(p+1)%3),700);return()=>clearInterval(t);},[]);

  const filtered=search.length>1?DESTINATIONS.filter(d=>d.label.toLowerCase().includes(search.toLowerCase())).slice(0,6):[];
  const sel=(dest)=>{setDestination(dest);setSearch(dest.label);setNavigating(false);setDirStep(0);setView("map");};
  const pathD=destination?PATHS[destination.building]?.join(" "):null;
  const dirs=destination?DIRECTIONS[destination.building]||[]:[];
  const destB=destination?BUILDINGS.find(b=>b.id===destination.building):null;
  const openB=(b)=>{setSelBuilding(b);setSelFloor(1);setView("building");};

  if(view==="building"&&selBuilding){
    const b=selBuilding;
    return(
      <div className="space-y-4 animate-fade-in">
        <button onClick={()=>setView("map")} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">
          &larr; Back to Campus Map
        </button>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{height:"240px"}}>
          <img src={b.image} alt={b.name} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white" style={{background:b.color}}>{b.tag}</div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h2 className="text-2xl font-black">{b.name}</h2>
            <p className="text-sm text-white/80 mt-1">{b.description}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3 text-sm">Facilities & Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {b.amenities.map((a,i)=>(
              <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">&#10003; {a}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Floor Plan Explorer</h3>
            <div className="flex gap-1 flex-wrap">
              {Array.from({length:b.floors},(_,i)=>i+1).map(f=>(
                <button key={f} onClick={()=>setSelFloor(f)}
                  className="w-9 h-9 rounded-xl text-xs font-black transition-all"
                  style={selFloor===f?{background:b.color,color:"white",boxShadow:`0 4px 12px ${b.color}55`}:{background:"#f1f5f9",color:"#475569"}}>F{f}</button>
              ))}
            </div>
          </div>
          {b.floorImages[selFloor]&&(
            <div className="relative rounded-2xl overflow-hidden" style={{height:"180px"}}>
              <img src={b.floorImages[selFloor]} alt={"Floor "+selFloor} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
              <div className="absolute bottom-3 left-3 text-white">
                <div className="text-xs font-bold opacity-70">Floor {selFloor} — {b.name}</div>
                <div className="text-sm font-black">{(b.rooms[selFloor]||[]).length} rooms on this floor</div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Floor {selFloor} Rooms</p>
            {(b.rooms[selFloor]||[]).map((room,i)=>(
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:b.color}}/>
                <span className="text-xs text-slate-800 font-medium">{room}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>{const d=DESTINATIONS.find(d=>d.building===b.id);if(d){sel(d);setNavigating(true);}}}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          style={{background:b.color}}>
          Navigate to {b.short}
        </button>
      </div>
    );
  }

  return(
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-3xl p-5 shadow-2xl relative overflow-hidden" style={{background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)"}}>
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 20% 50%,#3b82f6 0%,transparent 50%),radial-gradient(circle at 80% 20%,#8b5cf6 0%,transparent 50%)"}}/>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center" style={{boxShadow:"0 4px 20px #3b82f655"}}>
              <Navigation className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Trident Academy of Technology Campus Navigator</h2>
              <p className="text-xs text-blue-300">Interactive Map + Building Photos + Turn-by-Turn Directions</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2"><Search className="w-4 h-4 text-blue-400"/></div>
            <input value={search} onChange={e=>{setSearch(e.target.value);setDestination(null);setNavigating(false);}}
              placeholder="Search classroom, lab, hostel, mess..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm border text-white placeholder-white/40 focus:outline-none transition-all"
              style={{background:"rgba(255,255,255,0.1)",borderColor:"rgba(255,255,255,0.2)"}}/>
            {search&&<button onClick={()=>{setSearch("");setDestination(null);}} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.2)"}}><X className="w-3.5 h-3.5 text-white"/></button>}
            {filtered.length>0&&!destination&&(
              <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl shadow-2xl z-50 overflow-hidden" style={{background:"#0f172a",border:"1px solid #1e293b"}}>
                {filtered.map((d,i)=>(
                  <button key={i} onClick={()=>sel(d)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors" style={{borderBottom:"1px solid #1e293b"}} onMouseOver={e=>e.currentTarget.style.background="#1e293b"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <div className="w-8 h-8 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4 text-blue-400"/></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{d.label}</div>
                      <div className="text-xs text-slate-400">{d.distance} &bull; {d.time} walk</div>
                    </div>
                    <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 "+(TAGS[d.tag]||"bg-slate-700 text-slate-300")}>{d.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="font-bold text-slate-900 text-sm">Trident Academy of Technology Campus — Interactive Map</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">LIVE</span>
          </div>
          <div className="relative" style={{background:"linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 50%,#f0f9ff 100%)",height:"440px"}}>
            <svg width="100%" height="100%" viewBox="0 0 780 530" className="absolute inset-0">
              <rect x="20" y="20" width="740" height="490" rx="12" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8,4" opacity="0.5"/>
              <rect x="0" y="460" width="780" height="70" fill="#cbd5e1" opacity="0.6"/>
              <line x1="0" y1="490" x2="780" y2="490" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="25,12"/>
              <text x="390" y="508" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">STATE HIGHWAY NH-55</text>
              <rect x="30" y="20" width="55" height="460" fill="#cbd5e1" opacity="0.5"/>
              <line x1="57" y1="20" x2="57" y2="460" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="20,10"/>
              <line x1="57" y1="350" x2="600" y2="350" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round"/>
              <line x1="300" y1="350" x2="300" y2="180" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round"/>
              <line x1="57" y1="400" x2="590" y2="400" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round"/>
              <ellipse cx="340" cy="400" rx="55" ry="35" fill="#86efac" opacity="0.7"/>
              <circle cx="325" cy="392" r="7" fill="#16a34a" opacity="0.7"/>
              <circle cx="355" cy="408" r="5" fill="#16a34a" opacity="0.6"/>
              <circle cx="340" cy="383" r="4" fill="#22c55e" opacity="0.8"/>
              <text x="340" y="428" textAnchor="middle" fill="#166534" fontSize="8" fontWeight="bold">Central Garden</text>
              <rect x="95" y="462" width="80" height="22" rx="4" fill="#e2e8f0"/>
              <text x="135" y="477" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">P  Parking</text>
              {pathD&&(
                <>
                  <path d={pathD} fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d={pathD} fill="none" stroke={destB?destB.color:"#3b82f6"} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={navigating?"0":"15,8"} opacity="0.9"/>
                  <path d={pathD} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3,14" opacity="0.8"/>
                </>
              )}
              {BUILDINGS.map(b=>{
                const isSel=destination?.building===b.id;
                return(
                  <g key={b.id} onClick={()=>openB(b)} style={{cursor:"pointer"}}>
                    <rect x={b.x+8} y={b.y+8} width={b.w} height={b.h} rx="8" fill="#00000015"/>
                    <rect x={b.x+4} y={b.y+4} width={b.w} height={b.h} rx="8" fill="#0000000a"/>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10"
                      fill={isSel?b.color:"#ffffff"} stroke={isSel?b.color:"#e2e8f0"} strokeWidth={isSel?3:1.5}
                      style={{filter:isSel?`drop-shadow(0 0 20px ${b.color}99)`:"none"}}/>
                    <rect x={b.x} y={b.y} width={b.w} height={16} rx="10" fill={b.color}/>
                    <rect x={b.x} y={b.y+8} width={b.w} height={8} fill={b.color}/>
                    {Array.from({length:Math.min(4,Math.floor(b.w/28))},(_,wi)=>(
                      <rect key={"w1"+wi} x={b.x+12+wi*28} y={b.y+24} width={18} height={12} rx="2" fill={isSel?"#ffffff44":b.color+"22"} stroke={b.color+"55"} strokeWidth="1"/>
                    ))}
                    {b.h>60&&Array.from({length:Math.min(4,Math.floor(b.w/28))},(_,wi)=>(
                      <rect key={"w2"+wi} x={b.x+12+wi*28} y={b.y+44} width={18} height={12} rx="2" fill={isSel?"#ffffff44":b.color+"22"} stroke={b.color+"66"} strokeWidth="1"/>
                    ))}
                    <rect x={b.x+b.w-30} y={b.y+22} width={24} height={16} rx="4" fill={isSel?"#ffffff33":"#f8fafc"} stroke={b.color+"55"} strokeWidth="1"/>
                    <text x={b.x+b.w-18} y={b.y+34} textAnchor="middle" fill={isSel?"white":b.color} fontSize="8" fontWeight="black">{b.floors}F</text>
                    <text x={b.x+b.w/2} y={b.y+b.h+14} textAnchor="middle" fill={isSel?b.color:"#1e293b"} fontSize="9" fontWeight="bold">{b.short}</text>
                    <text x={b.x+b.w/2} y={b.y+b.h+24} textAnchor="middle" fill="#94a3b8" fontSize="7">{b.tag}</text>
                    {isSel&&(
                      <g>
                        <circle cx={b.x+b.w/2} cy={b.y-14} r={7+pulse} fill={b.color} opacity={0.25}/>
                        <circle cx={b.x+b.w/2} cy={b.y-14} r="9" fill={b.color}/>
                        <text x={b.x+b.w/2} y={b.y-9} textAnchor="middle" fill="white" fontSize="9">P</text>
                      </g>
                    )}
                  </g>
                );
              })}
              <g>
                <circle cx="57" cy="490" r={9+pulse} fill="#3b82f6" opacity={0.25}/>
                <circle cx="57" cy="490" r="13" fill="#3b82f6"/>
                <circle cx="57" cy="490" r="5" fill="white"/>
                <rect x="72" y="481" width="106" height="18" rx="5" fill="#1d4ed8" opacity="0.95"/>
                <text x="125" y="494" textAnchor="middle" fill="white" fontSize="8" fontWeight="black">YOU ARE HERE</text>
              </g>
              <g transform="translate(735,48)">
                <circle cx="0" cy="0" r="24" fill="white" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.97"/>
                <polygon points="0,-15 5,5 0,2 -5,5" fill="#dc2626"/>
                <polygon points="0,15 5,-5 0,-2 -5,-5" fill="#94a3b8"/>
                <text x="0" y="-17" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="black">N</text>
                <text x="0" y="23" textAnchor="middle" fill="#64748b" fontSize="7">S</text>
              </g>
              <g transform="translate(25,438)">
                <rect x="0" y="0" width="80" height="6" rx="3" fill="#cbd5e1"/>
                <rect x="0" y="0" width="40" height="6" rx="3" fill="#64748b"/>
                <text x="0" y="-3" fill="#64748b" fontSize="7">0</text>
                <text x="35" y="-3" fill="#64748b" fontSize="7">100m</text>
                <text x="72" y="-3" fill="#64748b" fontSize="7">200m</text>
              </g>
            </svg>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
              {BUILDINGS.map(b=>(
                <button key={b.id} onClick={()=>openB(b)} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                  <div className="w-3 h-3 rounded-sm" style={{background:b.color}}/>
                  <span className="text-xs text-slate-600">{b.short}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">Tap any building to see photos, floor plan and rooms</p>
          </div>
        </div>

        <div className="space-y-4">
          {destination&&destB?(
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="relative h-36">
                <img src={destB.image} alt={destB.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"/>
                <button onClick={()=>{setDestination(null);setSearch("");setNavigating(false);}} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm" style={{background:"rgba(0,0,0,0.4)"}}><X className="w-4 h-4 text-white"/></button>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs opacity-70 font-bold">Destination</div>
                  <div className="font-black text-sm leading-tight">{destination.label}</div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2.5 bg-slate-50 rounded-xl"><div className="text-sm font-black text-slate-900">{destination.distance}</div><div className="text-[10px] text-slate-500">Distance</div></div>
                  <div className="text-center p-2.5 bg-slate-50 rounded-xl"><div className="text-sm font-black text-slate-900">{destination.time}</div><div className="text-[10px] text-slate-500">Walk</div></div>
                  <div className="text-center p-2.5 rounded-xl" style={{background:destB.color+"12",borderColor:destB.color+"33"}}><div className="text-sm font-black" style={{color:destB.color}}>F{destination.floor}</div><div className="text-[10px] text-slate-500">Floor</div></div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 font-bold mb-0.5">Room / Area</div>
                  <div className="text-xs font-bold text-slate-900">{destination.room}</div>
                </div>
                {!navigating?(
                  <button onClick={()=>{setNavigating(true);setDirStep(0);}} className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg" style={{background:destB.color}}>
                    Start Navigation
                  </button>
                ):(
                  <div className="p-3.5 rounded-2xl border-2 space-y-3" style={{background:destB.color+"08",borderColor:destB.color+"33"}}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold" style={{color:destB.color}}>Step {dirStep+1} of {dirs.length}</span>
                      <div className="flex gap-1">{dirs.map((_,i)=><div key={i} className="h-1 rounded-full transition-all" style={{width:"16px",background:i<=dirStep?destB.color:"#e2e8f0"}}/>)}</div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{dirs[dirStep]}</div>
                    <div className="flex gap-2">
                      {dirStep>0&&<button onClick={()=>setDirStep(d=>d-1)} className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">Back</button>}
                      {dirStep<dirs.length-1?(
                        <button onClick={()=>setDirStep(d=>d+1)} className="flex-1 py-2 rounded-xl text-white text-xs font-bold" style={{background:destB.color}}>Next</button>
                      ):(
                        <div className="flex-1 py-2 rounded-xl text-white text-xs font-bold text-center bg-emerald-500">Arrived!</div>
                      )}
                    </div>
                  </div>
                )}
                <button onClick={()=>openB(destB)} className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-50">
                  <Camera className="w-3.5 h-3.5"/> View Photos &amp; Floor Plans
                </button>
              </div>
            </div>
          ):(
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
              <div className="text-center py-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3"><Navigation className="w-7 h-7 text-blue-500"/></div>
                <p className="text-sm font-bold text-slate-700">Search a destination</p>
                <p className="text-xs text-slate-400 mt-1">Type classroom, lab, hostel...</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Access</p>
                {DESTINATIONS.slice(0,5).map((d,i)=>(
                  <button key={i} onClick={()=>sel(d)} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 text-left transition-all">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><MapPin className="w-3 h-3 text-blue-600"/></div>
                    <div className="flex-1 min-w-0"><div className="text-xs font-bold text-slate-800 truncate">{d.label}</div><div className="text-[10px] text-slate-400">{d.time} &bull; {d.distance}</div></div>
                    <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 "+(TAGS[d.tag]||"")}>{d.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Campus Buildings</p>
            <div className="space-y-2">
              {BUILDINGS.slice(0,5).map(b=>(
                <button key={b.id} onClick={()=>openB(b)} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all group">
                  <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{b.name}</div>
                    <div className="text-[10px] text-slate-500">{b.floors} floors &bull; {b.tag}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0"/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
