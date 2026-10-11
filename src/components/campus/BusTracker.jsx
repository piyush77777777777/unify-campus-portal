import React, { useState, useEffect } from "react";
import { useCampus } from "../../context/CampusContext";
import { Bus, MapPin, Clock, Users, Navigation, Activity } from "lucide-react";

const BUS_ROUTES = [
  { id:"B1", name:"Campus Circular", color:"#3b82f6",
    stops:["Main Gate","Academic Block","Library","Hostel A","Hostel B","Mess Hall","Main Gate"],
    currentStop:2, nextArrival:"3", capacity:42, occupancy:28, driver:"Santosh Kumar", status:"ON TIME" },
  { id:"B2", name:"City Express", color:"#10b981",
    stops:["Main Gate","Rourkela Station","City Market","District Hospital","Main Gate"],
    currentStop:1, nextArrival:"12", capacity:54, occupancy:41, driver:"Ravi Das", status:"ON TIME" },
  { id:"B3", name:"Lab Shuttle", color:"#f59e0b",
    stops:["Hostel A","Hostel B","Research Lab","Canteen","Hostel A"],
    currentStop:0, nextArrival:"7", capacity:30, occupancy:12, driver:"Birju Singh", status:"DELAYED" },
];

export default function BusTracker() {
  const { busRoutes } = useCampus();
  const [sel, setSel] = useState("B1");
  const [tick, setTick] = useState(0);

  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 2000); return () => clearInterval(t); }, []);

  const routes = (busRoutes && busRoutes.length) ? busRoutes : BUS_ROUTES;
  const active = routes.find(r => r.id === sel) || routes[0];
  const eta = Math.max(1, parseInt(active.nextArrival) - Math.floor(tick / 15));
  const occPct = Math.round((active.occupancy / active.capacity) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-500/30 mb-3">
            <Bus className="w-3.5 h-3.5"/> Live Campus Bus Tracker
          </div>
          <h2 className="text-2xl font-black">Campus Transport System</h2>
          <p className="text-xs text-emerald-100/90 mt-1">Real-time bus locations and arrival alerts</p>
          <div className="flex flex-wrap gap-3 mt-5">
            {routes.map(r => (
              <button key={r.id} onClick={() => setSel(r.id)}
                className={"flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all " +
                  (sel === r.id ? "bg-white text-slate-900 border-white shadow-md" : "bg-white/10 text-white border-white/30 hover:bg-white/20")}>
                <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: r.color}}/>
                {r.id}: {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Visual */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">{active.id}: {active.name} — Live Route</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{color: active.color}}>
                <Activity className="w-3.5 h-3.5 animate-pulse"/> LIVE
              </div>
              <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (active.status === "ON TIME" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                {active.status}
              </span>
            </div>
          </div>

          {/* Animated route stops */}
          <div className="relative py-6 px-2">
            <div className="absolute top-1/2 left-4 right-4 h-2 bg-slate-100 rounded-full -translate-y-1/2"/>
            <div className="absolute top-1/2 left-4 h-2 rounded-full -translate-y-1/2 transition-all duration-700"
              style={{backgroundColor: active.color, width: `calc(${(active.currentStop / (active.stops.length - 1)) * 100}% - 16px)`}}/>
            <div className="relative flex items-center justify-between">
              {active.stops.map((stop, i) => {
                const isPassed = i < active.currentStop;
                const isCurrent = i === active.currentStop;
                return (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2" style={{flex: i === active.stops.length - 1 ? "0 0 auto" : 1}}>
                    <div className={"w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all " +
                      (isCurrent ? "scale-150 border-white shadow-lg" : isPassed ? "border-white" : "bg-white border-slate-300")}
                      style={isCurrent || isPassed ? {backgroundColor: active.color, borderColor: active.color} : {}}>
                      {isCurrent && <div className="w-2 h-2 rounded-full bg-white"/>}
                    </div>
                    <div className={"text-[9px] font-bold text-center w-14 leading-tight " +
                      (isCurrent ? "text-slate-900" : isPassed ? "text-slate-400" : "text-slate-500")}>
                      {stop}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ETA card */}
          <div className="mt-4 p-4 rounded-2xl border flex items-center gap-3" style={{background: active.color + "10", borderColor: active.color + "33"}}>
            <Clock className="w-5 h-5 flex-shrink-0" style={{color: active.color}}/>
            <div>
              <div className="font-bold text-slate-900">
                Bus {active.id} arriving at Main Gate in <span style={{color: active.color}} className="font-black">{eta} min</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Currently at: <strong>{active.stops[active.currentStop]}</strong> • Driver: {active.driver}
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900">Bus Status</h4>
            {[
              ["Bus Number", active.id],
              ["Route", active.name],
              ["Driver", active.driver],
              ["Next Arrival", eta + " min"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{k}</span>
                <span className={"font-bold text-slate-900 text-xs " + (k === "Next Arrival" ? "" : "")} style={k === "Next Arrival" ? {color: active.color} : {}}>{v}</span>
              </div>
            ))}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1"><Users className="w-3 h-3"/> Occupancy</span>
                <span className={"font-bold " + (occPct > 85 ? "text-rose-700" : occPct > 60 ? "text-amber-700" : "text-emerald-700")}>
                  {active.occupancy}/{active.capacity} seats
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className={"h-2 rounded-full transition-all " + (occPct > 85 ? "bg-rose-500" : occPct > 60 ? "bg-amber-500" : "bg-emerald-500")}
                  style={{width: occPct + "%"}}/>
              </div>
              <div className="text-[10px] text-slate-400 text-right">{occPct}% full • {active.capacity - active.occupancy} seats free</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900">All Routes</h4>
            {routes.map(r => (
              <button key={r.id} onClick={() => setSel(r.id)}
                className={"w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all " +
                  (sel === r.id ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:bg-slate-50")}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{backgroundColor: r.color + "20", border: "1px solid " + r.color + "40"}}>
                  <Bus className="w-4 h-4" style={{color: r.color}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">{r.id}: {r.name}</div>
                  <div className="text-[10px] text-slate-500">{r.stops.length - 1} stops • ETA {r.nextArrival} min</div>
                </div>
                <Navigation className="w-3.5 h-3.5 text-slate-400"/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}