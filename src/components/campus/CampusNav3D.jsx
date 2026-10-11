
import React, { useState, useEffect } from "react";
import { Search, Navigation, MapPin, X, ChevronRight, Camera, Layers, Building2, Compass } from "lucide-react";

// ─── Isometric Engine ────────────────────────────────────────────────────────
const TW = 54, TH = 27, FH = 42;
const OX = 370, OY = 130;

const iso = (c, r, f = 0) => ({
  x: OX + (c - r) * (TW / 2),
  y: OY + (c + r) * (TH / 2) - f * FH,
});
const pt = (c, r, f = 0) => { const p = iso(c, r, f); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; };
const pts = (...arr) => arr.join(" ");

// ─── Building Data ───────────────────────────────────────────────────────────
const BUILDINGS = [
  {
    id: "library", name: "Central Library", short: "Library", tag: "Knowledge Hub",
    col: 1, row: 4, w: 3, d: 2, floors: 3,
    base: "#7c3aed", light: "#a78bfa", dark: "#4c1d95", slab: "#c4b5fd",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80",
    amenities: ["50k+ Books", "Digital Library", "Quiet Zones", "24hr Study"],
    rooms: {
      1: ["Issue & Return Counter", "Digital Section", "Newspapers"],
      2: ["Reference Hall (150 seats)", "Journals", "Research Papers"],
      3: ["Rare Books", "Faculty Lounge", "Study Cabins"],
    },
  },
  {
    id: "academic", name: "Academic Block A", short: "Block A", tag: "Main Academic",
    col: 4, row: 1, w: 4, d: 3, floors: 4,
    base: "#3b82f6", light: "#93c5fd", dark: "#1e40af", slab: "#bfdbfe",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
    amenities: ["Wi-Fi", "AC Classrooms", "Projectors", "Faculty Rooms"],
    rooms: {
      1: ["A-101 Principal Office", "A-102 HOD CSE", "A-103 Seminar Hall"],
      2: ["A-201 Classroom", "A-202 Classroom", "A-203 Faculty Room"],
      3: ["A-301 Classroom", "A-302 Classroom", "A-303 HOD IT"],
      4: ["A-401 Conference Hall", "A-402 Classroom"],
    },
  },
  {
    id: "sports", name: "Sports Complex", short: "Sports", tag: "Recreation",
    col: 0, row: 7, w: 4, d: 2, floors: 2,
    base: "#06b6d4", light: "#67e8f9", dark: "#0e7490", slab: "#a5f3fc",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    amenities: ["Gym", "Basketball", "Badminton", "Yoga"],
    rooms: {
      1: ["Gymnasium", "Yoga Room", "Badminton x2", "Boxing"],
      2: ["Basketball Court", "Indoor Games", "Changing Rooms"],
    },
  },
  {
    id: "cse", name: "CSE & IT Block B", short: "Block B", tag: "Technology Hub",
    col: 9, row: 1, w: 3, d: 3, floors: 4,
    base: "#8b5cf6", light: "#c4b5fd", dark: "#4c1d95", slab: "#ddd6fe",
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&auto=format&fit=crop&q=80",
    amenities: ["High-Speed LAN", "GPU Servers", "24/7 Lab", "Research"],
    rooms: {
      1: ["B-101 CS Lab 1 (40 PCs)", "B-102 CS Lab 2", "B-103 IT Lab"],
      2: ["B-201 Classroom", "B-202 Classroom", "B-203 Network Lab"],
      3: ["B-301 CSE-A Class", "B-302 CSE-B Class", "B-303 ML & AI Lab"],
      4: ["B-401 Classroom", "B-402 Research Lab"],
    },
  },
  {
    id: "admin", name: "Admin & Finance", short: "Admin", tag: "Administrative",
    col: 8, row: 5, w: 3, d: 2, floors: 2,
    base: "#f59e0b", light: "#fcd34d", dark: "#92400e", slab: "#fde68a",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    amenities: ["Accounts", "Admissions", "Exam Branch", "HR"],
    rooms: {
      1: ["Accounts Office", "Fee Counter", "Admission Cell", "Exam Branch"],
      2: ["HR Department", "Finance Office", "Audit Room"],
    },
  },
  {
    id: "hostel", name: "Aryabhatta Hostel", short: "Hostel", tag: "Student Housing",
    col: 14, row: 1, w: 4, d: 3, floors: 5,
    base: "#10b981", light: "#6ee7b7", dark: "#064e3b", slab: "#a7f3d0",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80",
    amenities: ["AC Rooms", "Wi-Fi", "Gym", "Laundry", "Common Room"],
    rooms: {
      1: ["Warden Office", "Reception", "Common Room", "B-101–B-115"],
      2: ["B-201–B-230", "Study Room"],
      3: ["B-301–B-330"],
      4: ["B-401–B-430"],
      5: ["B-501–B-515", "Terrace Garden"],
    },
  },
  {
    id: "mess", name: "Annapurna Mess Hall", short: "Mess", tag: "Dining",
    col: 14, row: 6, w: 3, d: 2, floors: 1,
    base: "#f97316", light: "#fdba74", dark: "#7c2d12", slab: "#fed7aa",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&auto=format&fit=crop&q=80",
    amenities: ["440 Seats", "Hygienic Kitchen", "CCTV", "3 Meals/Day"],
    rooms: { 1: ["Dining Hall (440 seats)", "Kitchen", "Store Room", "Supervisor Office"] },
  },
];

const SORTED_BUILDINGS = [...BUILDINGS].sort((a, b) => (a.col + a.row) - (b.col + b.row));

const DESTINATIONS = [
  { label: "CSE Dept — B-301", building: "cse", floor: 2, room: "B-301", distance: "320m", time: "4 min", tag: "Class" },
  { label: "CS Lab 1 — 40 PCs (B-101)", building: "cse", floor: 0, room: "B-101", distance: "280m", time: "3 min", tag: "Lab" },
  { label: "ML & AI Lab (B-303)", building: "cse", floor: 2, room: "B-303", distance: "340m", time: "5 min", tag: "Lab" },
  { label: "Principal Office (A-101)", building: "academic", floor: 0, room: "A-101", distance: "180m", time: "2 min", tag: "Admin" },
  { label: "Seminar Hall A-103", building: "academic", floor: 0, room: "A-103", distance: "200m", time: "3 min", tag: "Hall" },
  { label: "Central Library", building: "library", floor: 0, room: "Reading Hall", distance: "220m", time: "3 min", tag: "Library" },
  { label: "Annapurna Mess Hall", building: "mess", floor: 0, room: "Dining Hall", distance: "580m", time: "7 min", tag: "Food" },
  { label: "Aryabhatta Hostel", building: "hostel", floor: 0, room: "Reception", distance: "500m", time: "6 min", tag: "Hostel" },
  { label: "Accounts — Fee Counter", building: "admin", floor: 0, room: "Accounts", distance: "350m", time: "4 min", tag: "Admin" },
  { label: "Sports Gym", building: "sports", floor: 0, room: "Gymnasium", distance: "400m", time: "5 min", tag: "Sports" },
  { label: "Network Lab (B-203)", building: "cse", floor: 1, room: "B-203", distance: "300m", time: "4 min", tag: "Lab" },
];

const DIRECTIONS = {
  cse: ["Exit Main Gate — walk straight", "Continue 150m on Main Road", "Turn RIGHT at the fountain", "Block B is on your LEFT", "Enter through main lobby", "Take stairs to your floor"],
  academic: ["Exit Main Gate — walk straight", "Academic Block A is 100m ahead", "Enter through the glass lobby doors", "You have arrived!"],
  library: ["Exit Main Gate", "Turn LEFT along the garden path", "Walk 120m along the garden", "Library entrance is on your right"],
  hostel: ["Exit Main Gate", "Walk straight on main road (200m)", "Turn RIGHT after CSE Block", "Continue for 200m", "Aryabhatta Hall on your right"],
  mess: ["Exit Main Gate", "Walk straight (200m)", "Turn RIGHT after CSE Block", "Continue past hostel (150m)", "Mess Hall on your left"],
  admin: ["Exit Main Gate", "Walk straight 150m", "Turn RIGHT at the fountain", "Admin Block on your left"],
  sports: ["Exit Main Gate", "Turn LEFT", "Walk along boundary wall (250m)", "Sports Complex on your right"],
};

const TAGS = { Class: "bg-blue-100 text-blue-700", Lab: "bg-purple-100 text-purple-700", Admin: "bg-amber-100 text-amber-700", Library: "bg-indigo-100 text-indigo-700", Hall: "bg-cyan-100 text-cyan-700", Food: "bg-orange-100 text-orange-700", Hostel: "bg-emerald-100 text-emerald-700", Sports: "bg-teal-100 text-teal-700" };


// ─── Isometric Building with X-ray floors ────────────────────────────────────
function IsoBuilding({ b, isSelected, selFloor, onClick, pulse }) {
  const { col, row, w, d, floors, base, light, dark, slab } = b;
  const els = [];

  // Ground shadow
  const gndPts = pts(pt(col,row), pt(col+w,row), pt(col+w,row+d), pt(col,row+d));
  els.push(<polygon key="gnd" points={gndPts} fill="#000" fillOpacity="0.12" />);

  // Draw each floor bottom→top
  for (let f = 0; f < floors; f++) {
    const isSel = isSelected && selFloor === f;
    const wAlpha = isSelected ? (isSel ? 0.30 : 0.07) : 0.16;
    const sAlpha = isSelected ? (isSel ? 1.0  : 0.35) : 0.65;

    // ── North back wall (low row edge) - partially visible ──
    const nPts = pts(pt(col,row,f), pt(col+w,row,f), pt(col+w,row,f+1), pt(col,row,f+1));
    els.push(<polygon key={`n${f}`} points={nPts} fill={dark} fillOpacity={wAlpha * 0.5} stroke={dark} strokeOpacity={0.3} strokeWidth={0.5} />);

    // ── West back wall (low col edge) - partially visible ──
    const wPts = pts(pt(col,row,f), pt(col,row+d,f), pt(col,row+d,f+1), pt(col,row,f+1));
    els.push(<polygon key={`w${f}`} points={wPts} fill={base} fillOpacity={wAlpha * 0.5} stroke={base} strokeOpacity={0.3} strokeWidth={0.5} />);

    // ── South wall (front-left in screen) - VISIBLE X-RAY ──
    const sPts = pts(pt(col,row+d,f), pt(col+w,row+d,f), pt(col+w,row+d,f+1), pt(col,row+d,f+1));
    els.push(
      <polygon key={`s${f}`} points={sPts}
        fill={base} fillOpacity={wAlpha}
        stroke={isSel ? "#ffffff" : light} strokeOpacity={isSel ? 0.9 : 0.5} strokeWidth={isSel ? 1.5 : 0.8} />
    );
    // Window grid lines on south wall
    const sBase = iso(col, row+d, f); const sTop = iso(col, row+d, f+1);
    const sRight = iso(col+w, row+d, f);
    const wallH = sBase.y - sTop.y;
    const wallW_x = sRight.x - sBase.x;
    const wallW_y = sRight.y - sBase.y;
    // Vertical window dividers
    for (let wi = 1; wi < w; wi++) {
      const wx = sBase.x + (wallW_x / w) * wi;
      const wy = sBase.y + (wallW_y / w) * wi;
      els.push(<line key={`sv${f}${wi}`} x1={wx} y1={wy} x2={wx - (sBase.x - sTop.x)} y2={wy - wallH}
        stroke={light} strokeOpacity={isSel ? 0.5 : 0.25} strokeWidth={0.5} />);
    }
    // Horizontal mid-window line
    const midY = (sBase.y + sTop.y) / 2;
    const midX = (sBase.x + sTop.x) / 2;
    els.push(<line key={`sh${f}`} x1={sBase.x} y1={sBase.y - wallH * 0.5} x2={sRight.x} y2={sRight.y - wallH * 0.5}
      stroke={light} strokeOpacity={isSel ? 0.5 : 0.2} strokeWidth={0.5} />);
    // Window openings (lighter rects effect)
    for (let wi = 0; wi < w; wi++) {
      const wx1 = sBase.x + (wallW_x / w) * wi + wallW_x / w * 0.15;
      const wy1 = sBase.y + (wallW_y / w) * wi + wallW_y / w * 0.15;
      const wx2 = sBase.x + (wallW_x / w) * (wi + 0.85);
      const wy2 = sBase.y + (wallW_y / w) * (wi + 0.85);
      const winPts = `${wx1},${(wy1 - wallH * 0.25).toFixed(1)} ${wx2},${(wy2 - wallH * 0.25).toFixed(1)} ${wx2},${(wy2 - wallH * 0.75).toFixed(1)} ${wx1},${(wy1 - wallH * 0.75).toFixed(1)}`;
      els.push(<polygon key={`win${f}${wi}`} points={winPts}
        fill={isSel ? "#ffffff" : light} fillOpacity={isSel ? 0.35 : 0.12}
        stroke={light} strokeOpacity={0.4} strokeWidth={0.5} />);
    }

    // ── East wall (front-right in screen) - VISIBLE X-RAY ──
    const ePts = pts(pt(col+w,row,f), pt(col+w,row+d,f), pt(col+w,row+d,f+1), pt(col+w,row,f+1));
    els.push(
      <polygon key={`e${f}`} points={ePts}
        fill={dark} fillOpacity={wAlpha}
        stroke={isSel ? "#ffffff" : base} strokeOpacity={isSel ? 0.9 : 0.5} strokeWidth={isSel ? 1.5 : 0.8} />
    );
    // East wall windows
    const eBase = iso(col+w, row, f); const eBack = iso(col+w, row+d, f);
    const eWallW_x = eBack.x - eBase.x; const eWallW_y = eBack.y - eBase.y;
    for (let di = 1; di < d; di++) {
      const ex = eBase.x + (eWallW_x / d) * di;
      const ey = eBase.y + (eWallW_y / d) * di;
      els.push(<line key={`ev${f}${di}`} x1={ex} y1={ey} x2={ex - (eBase.x - iso(col+w,row,f+1).x)} y2={ey - wallH}
        stroke={base} strokeOpacity={isSel ? 0.5 : 0.2} strokeWidth={0.5} />);
    }
    els.push(<line key={`eh${f}`} x1={eBase.x} y1={eBase.y - wallH * 0.5} x2={eBack.x} y2={eBack.y - wallH * 0.5}
      stroke={base} strokeOpacity={isSel ? 0.4 : 0.15} strokeWidth={0.5} />);

    // ── Floor slab (TOP face) - solid with room grid ──
    const tPts = pts(pt(col,row,f+1), pt(col+w,row,f+1), pt(col+w,row+d,f+1), pt(col,row+d,f+1));
    const slabColor = isSel ? "#ffffff" : slab;
    els.push(
      <polygon key={`top${f}`} points={tPts}
        fill={slabColor} fillOpacity={sAlpha}
        stroke={isSel ? "#ffffff" : base} strokeOpacity={isSel ? 1 : 0.7} strokeWidth={isSel ? 1.5 : 0.8} />
    );

    // Room divider grid on slab when selected
    if (isSel) {
      const corners = [iso(col,row,f+1), iso(col+w,row,f+1), iso(col+w,row+d,f+1), iso(col,row+d,f+1)];
      for (let ci = 1; ci < w; ci++) {
        const t = ci / w;
        const x1 = corners[0].x + (corners[1].x - corners[0].x) * t;
        const y1 = corners[0].y + (corners[1].y - corners[0].y) * t;
        const x2 = corners[3].x + (corners[2].x - corners[3].x) * t;
        const y2 = corners[3].y + (corners[2].y - corners[3].y) * t;
        els.push(<line key={`rg_c${f}${ci}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={base} strokeOpacity={0.6} strokeWidth={0.8} strokeDasharray="3,2" />);
      }
      for (let ri = 1; ri < d; ri++) {
        const t = ri / d;
        const x1 = corners[0].x + (corners[3].x - corners[0].x) * t;
        const y1 = corners[0].y + (corners[3].y - corners[0].y) * t;
        const x2 = corners[1].x + (corners[2].x - corners[1].x) * t;
        const y2 = corners[1].y + (corners[2].y - corners[1].y) * t;
        els.push(<line key={`rg_r${f}${ri}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={base} strokeOpacity={0.6} strokeWidth={0.8} strokeDasharray="3,2" />);
      }
      // Floor number label on slab
      const midSlab = iso(col + w/2, row + d/2, f+1);
      els.push(<text key={`flbl${f}`} x={midSlab.x} y={midSlab.y + 1}
        textAnchor="middle" fill={base} fontSize="7" fontWeight="black" opacity={0.9}>F{f+1}</text>);
    }

    // Glow ring on selected floor base
    if (isSel) {
      const glowPts = pts(pt(col,row+d,f), pt(col+w,row+d,f), pt(col+w,row,f));
      els.push(<polyline key={`glow${f}`} points={glowPts}
        fill="none" stroke="#ffffff" strokeWidth={3} strokeOpacity={0.6 + pulse*0.15}
        style={{filter:`drop-shadow(0 0 6px ${base})`}} />);
    }
  }

  // ── Roof cap ──
  const roofPts = pts(pt(col,row,floors), pt(col+w,row,floors), pt(col+w,row+d,floors), pt(col,row+d,floors));
  els.push(<polygon key="roof" points={roofPts}
    fill={isSelected ? light : base} fillOpacity={isSelected ? 0.95 : 0.8}
    stroke={isSelected ? "#ffffff" : light} strokeOpacity={isSelected ? 1 : 0.6} strokeWidth={isSelected ? 2 : 1} />);

  // ── Building label ──
  const labelPos = iso(col + w/2, row + d + 0.3, 0);
  const namePos  = iso(col + w/2, row - 0.2, floors);
  els.push(<text key="lbl" x={labelPos.x} y={labelPos.y + 14}
    textAnchor="middle" fill={isSelected ? base : "#1e293b"} fontSize="8.5" fontWeight="bold"
    style={isSelected ? {filter:`drop-shadow(0 0 4px ${base}88)`} : {}}>{b.short}</text>);
  els.push(<text key="tag" x={labelPos.x} y={labelPos.y + 25}
    textAnchor="middle" fill="#64748b" fontSize="7">{b.tag}</text>);

  // ── Destination pin ──
  if (isSelected) {
    const pinPos = iso(col + w/2, row + d/2, floors + 0.3 + pulse * 0.1);
    els.push(
      <g key="pin">
        <circle cx={pinPos.x} cy={pinPos.y} r={6 + pulse * 2} fill={base} opacity={0.2 - pulse * 0.05} />
        <circle cx={pinPos.x} cy={pinPos.y} r="9" fill={base} />
        <circle cx={pinPos.x} cy={pinPos.y} r="5" fill="white" />
      </g>
    );
    // Vertical pole
    const poleBot = iso(col + w/2, row + d/2, floors);
    els.push(<line key="pole" x1={pinPos.x} y1={pinPos.y} x2={poleBot.x} y2={poleBot.y}
      stroke={base} strokeWidth={1.5} strokeOpacity={0.6} />);
  }

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}
      filter={isSelected ? `drop-shadow(0 0 10px ${base}66)` : undefined}>
      {els}
    </g>
  );
}

// ─── Navigation Path ─────────────────────────────────────────────────────────
function NavPath({ destBuilding, navigating, pulse }) {
  if (!destBuilding) return null;
  const b = destBuilding;
  const gate = iso(3, 10, 0);
  const bCenter = iso(b.col + b.w/2, b.row + b.d/2, 0);
  const mid1 = iso(b.col + b.w/2, 10, 0);
  const pathD = `M ${gate.x},${gate.y} L ${mid1.x},${mid1.y} L ${bCenter.x},${bCenter.y}`;
  return (
    <g>
      <path d={pathD} fill="none" stroke="#e2e8f0" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD} fill="none" stroke={b.base} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={navigating ? "0" : "14,7"} opacity={0.9}
        style={navigating ? { animation: "dash 1s linear infinite" } : {}} />
      <path d={pathD} fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round"
        strokeDasharray="4,16" opacity={0.7} />
      {/* Animated dot along path */}
      {navigating && (
        <circle r="5" fill={b.base} opacity={0.9}>
          <animateMotion dur="2s" repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </g>
  );
}


// ─── Ground Plane ────────────────────────────────────────────────────────────
function GroundPlane() {
  const cells = [];
  for (let c = 0; c <= 19; c++) {
    for (let r = 0; r <= 11; r++) {
      const tPts = pts(pt(c,r), pt(c+1,r), pt(c+1,r+1), pt(c,r+1));
      const isRoad = (r >= 9 && r <= 10) || (c >= 2 && c <= 3 && r <= 9);
      const isGarden = (c >= 5 && c <= 9 && r >= 5 && r <= 8);
      const fill = isRoad ? "#cbd5e1" : isGarden ? "#86efac" : "#f0fdf4";
      const opacity = isRoad ? 0.7 : isGarden ? 0.6 : 0.45;
      cells.push(<polygon key={`g${c}${r}`} points={tPts} fill={fill} fillOpacity={opacity}
        stroke="#e2e8f0" strokeOpacity={0.3} strokeWidth={0.3} />);
    }
  }
  return <g>{cells}</g>;
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function CampusNav3D() {
  const [search, setSearch]     = useState("");
  const [destination, setDest]  = useState(null);
  const [navigating, setNav]    = useState(false);
  const [selBld, setSelBld]     = useState(null);
  const [selFloor, setSelFloor] = useState(0);
  const [dirStep, setDirStep]   = useState(0);
  const [view, setView]         = useState("map");
  const [pulse, setPulse]       = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 4), 650);
    return () => clearInterval(t);
  }, []);

  const filtered = search.length > 1
    ? DESTINATIONS.filter(d => d.label.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const selectDest = (dest) => {
    setDest(dest); setSearch(dest.label); setNav(false); setDirStep(0);
    const b = BUILDINGS.find(b => b.id === dest.building);
    setSelBld(b); setSelFloor(dest.floor); setView("map");
  };

  const openBuilding = (b) => { setSelBld(b); setSelFloor(0); setView("building"); };
  const dirs = destination ? DIRECTIONS[destination.building] || [] : [];
  const destB = destination ? BUILDINGS.find(b => b.id === destination.building) : null;

  // ── Building Detail View ──────────────────────────────────────────────────
  if (view === "building" && selBld) {
    const b = selBld;
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => setView("map")} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">
          &#8592; Back to 3D X-ray Map
        </button>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: 220 }}>
          <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: b.base }}>{b.tag}</div>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl font-black">{b.name}</h2>
            <p className="text-xs opacity-75">{b.floors} Floors &bull; Trident Academy of Technology</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-2">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {b.amenities.map((a, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">&#10003; {a}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Floor Plan Explorer</h3>
            <div className="flex gap-1">
              {Array.from({ length: b.floors }, (_, i) => (
                <button key={i} onClick={() => setSelFloor(i)}
                  className="w-9 h-9 rounded-xl text-xs font-black transition-all"
                  style={selFloor === i ? { background: b.base, color: "white", boxShadow: `0 4px 12px ${b.base}55` } : { background: "#f1f5f9", color: "#475569" }}>
                  F{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Isometric Mini Floor View */}
          <div className="rounded-2xl overflow-hidden border border-slate-100" style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", height: 160 }}>
            <svg width="100%" height="160" viewBox="0 0 400 160">
              {/* Mini isometric floor slab */}
              {(() => {
                const mc = 4, mr = 2, mw = b.w * 2, md = b.d * 2, mTW = 28, mTH = 14, mOX = 200, mOY = 60;
                const miso = (cc, rr) => ({ x: mOX + (cc - rr) * mTW / 2, y: mOY + (cc + rr) * mTH / 2 });
                const mpt = (cc, rr) => { const p = miso(cc, rr); return `${p.x},${p.y}`; };
                const corners = [miso(mc, mr), miso(mc+mw, mr), miso(mc+mw, mr+md), miso(mc, mr+md)];
                const topPts = corners.map(p => `${p.x},${p.y}`).join(" ");
                const leftPts = `${corners[0].x},${corners[0].y} ${corners[3].x},${corners[3].y} ${corners[3].x},${corners[3].y + 20} ${corners[0].x},${corners[0].y + 20}`;
                const rightPts = `${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[2].x},${corners[2].y + 20} ${corners[1].x},${corners[1].y + 20}`;
                const roomItems = (b.rooms[selFloor + 1] || []);
                return (
                  <g>
                    <polygon points={leftPts} fill={b.dark} fillOpacity={0.7} />
                    <polygon points={rightPts} fill={b.dark} fillOpacity={0.5} />
                    <polygon points={topPts} fill={b.slab} fillOpacity={0.9} stroke="white" strokeOpacity={0.4} strokeWidth={1} />
                    {/* Room grid */}
                    {Array.from({ length: b.w }, (_, ci) => ci + 1).slice(0, b.w - 1).map(ci => {
                      const t = ci / b.w;
                      const x1 = corners[0].x + (corners[1].x - corners[0].x) * t;
                      const y1 = corners[0].y + (corners[1].y - corners[0].y) * t;
                      const x2 = corners[3].x + (corners[2].x - corners[3].x) * t;
                      const y2 = corners[3].y + (corners[2].y - corners[3].y) * t;
                      return <line key={`rc${ci}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={b.base} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3,2" />;
                    })}
                    {Array.from({ length: b.d }, (_, ri) => ri + 1).slice(0, b.d - 1).map(ri => {
                      const t = ri / b.d;
                      const x1 = corners[0].x + (corners[3].x - corners[0].x) * t;
                      const y1 = corners[0].y + (corners[3].y - corners[0].y) * t;
                      const x2 = corners[1].x + (corners[2].x - corners[1].x) * t;
                      const y2 = corners[1].y + (corners[2].y - corners[1].y) * t;
                      return <line key={`rr${ri}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={b.base} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3,2" />;
                    })}
                    <text x="200" y="152" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" opacity="0.7">Floor {selFloor + 1} — {b.name}</text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Floor {selFloor + 1} — Rooms & Areas</p>
            {(b.rooms[selFloor + 1] || []).map((room, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: b.base }} />
                <span className="text-xs text-slate-800 font-medium">{room}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => { const d = DESTINATIONS.find(d => d.building === b.id); if (d) { selectDest(d); setNav(true); } }}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          style={{ background: b.base }}>
          <Navigation className="w-5 h-5" /> Navigate to {b.short}
        </button>
      </div>
    );
  }

  // ── Map View ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="rounded-3xl p-5 shadow-2xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 20% 50%,#3b82f6 0%,transparent 50%),radial-gradient(circle at 80% 20%,#8b5cf6 0%,transparent 50%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center" style={{ boxShadow: "0 4px 20px #3b82f655" }}>
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">TAT Campus — 3D X-Ray Navigator</h2>
              <p className="text-xs text-blue-300">Isometric Map &bull; Floor-by-Floor X-Ray &bull; Live Navigation</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2"><Search className="w-4 h-4 text-blue-400" /></div>
            <input value={search} onChange={e => { setSearch(e.target.value); setDest(null); setNav(false); }}
              placeholder="Search classroom, lab, hostel, mess..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }} />
            {search && <button onClick={() => { setSearch(""); setDest(null); setNav(false); setSelBld(null); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}><X className="w-3.5 h-3.5 text-white" /></button>}
            {filtered.length > 0 && !destination && (
              <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                {filtered.map((d, i) => (
                  <button key={i} onClick={() => selectDest(d)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-800 transition-colors"
                    style={{ borderBottom: "1px solid #1e293b" }}>
                    <div className="w-8 h-8 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{d.label}</div>
                      <div className="text-xs text-slate-400">{d.distance} &bull; {d.time} walk</div>
                    </div>
                    <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (TAGS[d.tag] || "")}>{d.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── 3D X-RAY MAP ── */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-lg border border-slate-800"
          style={{ background: "linear-gradient(135deg,#020617 0%,#0f172a 50%,#020617 100%)" }}>
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white text-sm">Trident Academy of Technology — X-Ray 3D View</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-700">LIVE 3D</span>
              {selBld && (
                <div className="flex gap-1">
                  {Array.from({ length: selBld.floors }, (_, i) => (
                    <button key={i} onClick={() => setSelFloor(i)}
                      className="w-7 h-7 rounded-lg text-[10px] font-black transition-all"
                      style={selFloor === i ? { background: selBld.base, color: "white" } : { background: "#1e293b", color: "#94a3b8" }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ height: 440 }}>
            <svg width="100%" height="440" viewBox="0 0 820 460" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="softglow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <style>{`@keyframes dash { to { stroke-dashoffset: -21; } }`}</style>
              </defs>

              {/* Ground */}
              <GroundPlane />

              {/* Road labels */}
              {(() => {
                const rPos = iso(10, 9.5, 0);
                return <text x={rPos.x} y={rPos.y} textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">MAIN CAMPUS ROAD</text>;
              })()}

              {/* Navigation path */}
              <NavPath destBuilding={destB} navigating={navigating} pulse={pulse} />

              {/* Main Gate */}
              {(() => {
                const gp = iso(3, 10, 0);
                return (
                  <g>
                    <rect x={gp.x - 28} y={gp.y - 12} width={56} height={18} rx={5} fill="#1d4ed8" opacity={0.95} />
                    <text x={gp.x} y={gp.y + 1} textAnchor="middle" fill="white" fontSize="8" fontWeight="black">MAIN GATE</text>
                    <circle cx={gp.x} cy={gp.y + 14} r={6 + pulse} fill="#3b82f6" opacity={0.3} />
                    <circle cx={gp.x} cy={gp.y + 14} r={8} fill="#3b82f6" />
                    <circle cx={gp.x} cy={gp.y + 14} r={4} fill="white" />
                  </g>
                );
              })()}

              {/* Buildings — painter's order (back to front) */}
              {SORTED_BUILDINGS.map(b => (
                <IsoBuilding key={b.id} b={b}
                  isSelected={selBld?.id === b.id}
                  selFloor={selFloor}
                  pulse={pulse}
                  onClick={() => {
                    if (selBld?.id === b.id) { openBuilding(b); }
                    else { setSelBld(b); setSelFloor(0); }
                  }} />
              ))}

              {/* Compass */}
              {(() => {
                const cx = 790, cy = 45;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={22} fill="#0f172a" stroke="#334155" strokeWidth={1.5} opacity={0.95} />
                    <polygon points={`${cx},${cy-14} ${cx+4},${cy+4} ${cx},${cy+1} ${cx-4},${cy+4}`} fill="#ef4444" />
                    <polygon points={`${cx},${cy+14} ${cx+4},${cy-4} ${cx},${cy-1} ${cx-4},${cy-4}`} fill="#475569" />
                    <text x={cx} y={cy - 16} textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="black">N</text>
                    <text x={cx} y={cy + 22} textAnchor="middle" fill="#64748b" fontSize="7">S</text>
                  </g>
                );
              })()}

              {/* X-ray legend */}
              <g transform="translate(14, 420)">
                <rect x={0} y={-14} width={200} height={18} rx={4} fill="#0f172a" opacity={0.8} />
                <circle cx={10} cy={-5} r={4} fill="#3b82f6" opacity={0.2} stroke="#3b82f6" strokeWidth={1} />
                <text x={18} y={-1} fill="#94a3b8" fontSize="7">X-Ray Wall</text>
                <rect x={65} y={-11} width={16} height={10} rx={2} fill="#3b82f6" opacity={0.8} />
                <text x={85} y={-1} fill="#94a3b8" fontSize="7">Floor Slab</text>
                <circle cx={130} cy={-5} r={4} fill="#3b82f6" />
                <text x={138} y={-1} fill="#94a3b8" fontSize="7">Selected</text>
              </g>
            </svg>
          </div>

          {/* Building quick-select */}
          <div className="px-4 py-3 border-t border-slate-800">
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1">
              {BUILDINGS.map(b => (
                <button key={b.id} onClick={() => { setSelBld(b); setSelFloor(0); }}
                  className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
                  <div className="w-3 h-3 rounded-sm" style={{ background: b.base }} />
                  <span className="text-xs text-slate-400">{b.short}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600">Tap a building to X-ray it &bull; Tap again to see floor plans &amp; photos</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="space-y-4">
          {destination && destB ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="relative h-36">
                <img src={destB.image} alt={destB.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <button onClick={() => { setDest(null); setSearch(""); setNav(false); setSelBld(null); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm"
                  style={{ background: "rgba(0,0,0,0.4)" }}><X className="w-4 h-4 text-white" /></button>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs opacity-70">Destination</div>
                  <div className="font-black text-sm">{destination.label}</div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2.5 bg-slate-50 rounded-xl"><div className="text-sm font-black">{destination.distance}</div><div className="text-[10px] text-slate-500">Distance</div></div>
                  <div className="text-center p-2.5 bg-slate-50 rounded-xl"><div className="text-sm font-black">{destination.time}</div><div className="text-[10px] text-slate-500">Walk</div></div>
                  <div className="text-center p-2.5 rounded-xl" style={{ background: destB.base + "12" }}>
                    <div className="text-sm font-black" style={{ color: destB.base }}>F{destination.floor + 1}</div>
                    <div className="text-[10px] text-slate-500">Floor</div>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">Room</div>
                  <div className="text-xs font-bold text-slate-900">{destination.room}</div>
                </div>
                {!navigating ? (
                  <button onClick={() => { setNav(true); setDirStep(0); }}
                    className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                    style={{ background: destB.base }}>
                    <Navigation className="w-4 h-4" /> Start Navigation
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl border-2 space-y-3" style={{ background: destB.base + "08", borderColor: destB.base + "33" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: destB.base }}>Step {dirStep + 1}/{dirs.length}</span>
                      <div className="flex gap-1">{dirs.map((_, i) => <div key={i} className="h-1 rounded-full" style={{ width: 14, background: i <= dirStep ? destB.base : "#e2e8f0" }} />)}</div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{dirs[dirStep]}</div>
                    <div className="flex gap-2">
                      {dirStep > 0 && <button onClick={() => setDirStep(d => d - 1)} className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">&#8592; Back</button>}
                      {dirStep < dirs.length - 1
                        ? <button onClick={() => setDirStep(d => d + 1)} className="flex-1 py-2 rounded-xl text-white text-xs font-bold" style={{ background: destB.base }}>Next &#8594;</button>
                        : <div className="flex-1 py-2 rounded-xl text-white text-xs font-bold text-center bg-emerald-500">&#127937; Arrived!</div>}
                    </div>
                  </div>
                )}
                <button onClick={() => openBuilding(destB)} className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-50">
                  <Camera className="w-3.5 h-3.5" /> Floor Plans &amp; Photos
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-7 h-7 text-blue-500" />
                </div>
                <p className="text-sm font-bold text-slate-700">3D X-Ray Campus Map</p>
                <p className="text-xs text-slate-400 mt-1">Tap any building to see X-ray floors</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Destinations</p>
                {DESTINATIONS.slice(0, 5).map((d, i) => (
                  <button key={i} onClick={() => selectDest(d)} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 text-left transition-all">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><MapPin className="w-3 h-3 text-blue-600" /></div>
                    <div className="flex-1 min-w-0"><div className="text-xs font-bold text-slate-800 truncate">{d.label}</div><div className="text-[10px] text-slate-400">{d.time} &bull; {d.distance}</div></div>
                    <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded-full " + (TAGS[d.tag] || "")}>{d.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Building gallery */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Campus Buildings</p>
            <div className="space-y-2">
              {BUILDINGS.map(b => (
                <button key={b.id} onClick={() => openBuilding(b)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all group">
                  <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: b.base }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{b.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {Array.from({ length: b.floors }, (_, i) => (
                        <div key={i} className="w-3 h-1.5 rounded-sm" style={{ background: b.base, opacity: 0.3 + i * 0.15 }} />
                      ))}
                      <span className="text-[9px] text-slate-400">{b.floors}F</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
