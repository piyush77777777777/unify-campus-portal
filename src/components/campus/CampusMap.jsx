import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';
import { useGoogleMaps, CAMPUS_CENTER } from '../../hooks/useGoogleMaps';
import { useCampus } from '../../context/CampusContext';
import { MapPin, AlertTriangle, CheckCircle2, Wrench, Zap, Droplets, Wifi, Sparkles } from 'lucide-react';

const HOTSPOTS = [
  { id:1, name:'Hostel Block A',   lat:20.9550, lng:85.1008, complaints:8, risk:'CRITICAL', issue:'Plumbing', color:'#ef4444' },
  { id:2, name:'Hostel Block B',   lat:20.9545, lng:85.0995, complaints:5, risk:'MEDIUM',   issue:'Electrical', color:'#f59e0b' },
  { id:3, name:'Mess Hall',        lat:20.9525, lng:85.0990, complaints:3, risk:'LOW',       issue:'Cleanliness', color:'#22c55e' },
  { id:4, name:'Academic Block',   lat:20.9530, lng:85.1015, complaints:6, risk:'MEDIUM',   issue:'Wi-Fi & IT', color:'#f59e0b' },
  { id:5, name:'Library',          lat:20.9540, lng:85.1020, complaints:1, risk:'LOW',       issue:'Furniture', color:'#22c55e' },
  { id:6, name:'Ground & Sports',  lat:20.9510, lng:85.1000, complaints:4, risk:'LOW',       issue:'Drainage', color:'#22c55e' },
  { id:7, name:'Main Gate',        lat:20.9517, lng:85.1004, complaints:2, risk:'LOW',       issue:'Lighting', color:'#22c55e' },
  { id:8, name:'Research Lab',     lat:20.9560, lng:85.1025, complaints:7, risk:'CRITICAL',  issue:'Electrical', color:'#ef4444' },
];

const ISSUE_ICONS = { Plumbing:'💧', Electrical:'⚡', 'Wi-Fi & IT':'📶', Cleanliness:'🧹', Furniture:'🪑', Drainage:'🌊', Lighting:'💡' };

export default function CampusMap() {
  const { isLoaded, mapsEnabled } = useGoogleMaps();
  const { complaints } = useCampus();
  const [selectedPin, setSelectedPin] = useState(null);
  const [mapFilter, setMapFilter] = useState('ALL');

  const filtered = mapFilter === 'ALL' ? HOTSPOTS : HOTSPOTS.filter(h => h.risk === mapFilter);

  const heatData = isLoaded && window.google
    ? HOTSPOTS.map(h => ({ location: new window.google.maps.LatLng(h.lat, h.lng), weight: h.complaints }))
    : [];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-green-950 to-teal-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-200 text-xs font-bold border border-green-500/30 mb-2">
            <Sparkles className="w-3 h-3"/>AI Campus Map — Google Maps
          </div>
          <h2 className="text-xl font-black">📍 Campus Hotspot Intelligence</h2>
          <p className="text-xs text-green-100/80 mt-0.5">AI-identified complaint hotspots overlaid on real campus map</p>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { risk:'ALL',      label:'All Zones',      color:'bg-blue-500' },
              { risk:'CRITICAL', label:'🔴 Critical',    color:'bg-rose-500' },
              { risk:'MEDIUM',   label:'🟡 Medium',      color:'bg-amber-500' },
              { risk:'LOW',      label:'🟢 Low Risk',    color:'bg-emerald-500' },
            ].map(f=>(
              <button key={f.risk} onClick={()=>setMapFilter(f.risk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${mapFilter===f.risk?'bg-white text-slate-900 border-white':'bg-white/10 text-white border-white/30 hover:bg-white/20'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">🗺️ Live Campus Map — {filtered.length} zones shown</h3>
            {!mapsEnabled && <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-full border border-amber-200">Add API Key for real map</span>}
          </div>

          {isLoaded && mapsEnabled ? (
            <GoogleMap mapContainerStyle={{width:'100%',height:'380px'}}
              center={CAMPUS_CENTER} zoom={16}
              options={{
                styles:[
                  {elementType:'geometry',stylers:[{color:'#f5f5f5'}]},
                  {featureType:'water',elementType:'geometry',stylers:[{color:'#c9d8e8'}]},
                  {featureType:'road',elementType:'geometry',stylers:[{color:'#ffffff'}]},
                  {featureType:'road.arterial',elementType:'geometry',stylers:[{color:'#e8e8e8'}]},
                  {featureType:'poi.park',elementType:'geometry',stylers:[{color:'#d5e8d4'}]},
                ],
                mapTypeControl:false, streetViewControl:false,
              }}>
              {filtered.map(h => (
                <Marker key={h.id}
                  position={{lat:h.lat, lng:h.lng}}
                  onClick={() => setSelectedPin(h)}
                  icon={{
                    url:`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
                        <ellipse cx="22" cy="48" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
                        <path d="M22 2C13.16 2 6 9.16 6 18c0 13.5 16 30 16 30S38 31.5 38 18C38 9.16 30.84 2 22 2z" fill="${h.color}" stroke="white" stroke-width="2.5"/>
                        <circle cx="22" cy="18" r="9" fill="white" fill-opacity="0.95"/>
                        <text x="22" y="23" text-anchor="middle" font-size="12">${ISSUE_ICONS[h.issue]||'⚠️'}</text>
                        <circle cx="34" cy="8" r="7" fill="${h.risk==='CRITICAL'?'#ef4444':h.risk==='MEDIUM'?'#f59e0b':'#22c55e'}" stroke="white" stroke-width="1.5"/>
                        <text x="34" y="12" text-anchor="middle" font-size="9" fill="white" font-weight="bold">${h.complaints}</text>
                      </svg>`)}`,
                    scaledSize: new window.google.maps.Size(44,52),
                    anchor: new window.google.maps.Point(22,50),
                  }}
                />
              ))}
              {selectedPin && (
                <InfoWindow position={{lat:selectedPin.lat,lng:selectedPin.lng}} onCloseClick={()=>setSelectedPin(null)}>
                  <div className="p-1 min-w-[160px]">
                    <div className="font-black text-sm text-slate-900">{selectedPin.name}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${selectedPin.risk==='CRITICAL'?'bg-rose-100 text-rose-700':selectedPin.risk==='MEDIUM'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{selectedPin.risk}</span>
                      <span className="text-xs text-slate-600">{selectedPin.complaints} complaints</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Issue: {ISSUE_ICONS[selectedPin.issue]} {selectedPin.issue}</div>
                    <button className="mt-2 w-full py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold">Report Issue Here</button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            /* Fallback visual map */
            <div className="relative bg-gradient-to-br from-green-50 to-slate-100 border-b border-slate-200" style={{height:'380px'}}>
              <div className="absolute inset-0 p-4">
                {/* Fake roads */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/60 rounded opacity-60"/>
                <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-white/60 rounded opacity-60"/>
                <div className="absolute top-1/3 left-1/4 right-0 h-2 bg-white/50 rounded opacity-40"/>
                {/* Campus area */}
                <div className="absolute inset-8 border-2 border-dashed border-green-400 rounded-2xl bg-green-100/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-700 bg-white/70 px-2 py-1 rounded-full">🏫 Campus Area</span>
                </div>
                {/* Hotspot pins */}
                {filtered.map((h, i)=>(
                  <button key={h.id}
                    onClick={()=>setSelectedPin(selectedPin?.id===h.id?null:h)}
                    className="absolute flex flex-col items-center gap-0.5 transition-all hover:scale-110 active:scale-95"
                    style={{
                      left:`${15+(i%4)*20}%`,
                      top:`${20+Math.floor(i/4)*35}%`
                    }}>
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm"
                        style={{backgroundColor:h.color}}>
                        {ISSUE_ICONS[h.issue]||'⚠️'}
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white border flex items-center justify-center text-[8px] font-black"
                        style={{color:h.color}}>{h.complaints}</div>
                    </div>
                    <span className="text-[8px] font-bold text-slate-700 bg-white/80 px-1 rounded whitespace-nowrap">{h.name.split(' ').slice(-1)[0]}</span>
                    {selectedPin?.id===h.id && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 w-40 z-10">
                        <div className="font-bold text-xs text-slate-900">{h.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{h.complaints} complaints • {h.issue}</div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${h.risk==='CRITICAL'?'bg-rose-100 text-rose-700':h.risk==='MEDIUM'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{h.risk}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className="bg-white/90 rounded-xl px-3 py-1.5 text-[10px] text-slate-500 font-bold border border-slate-200">
                  💡 Add VITE_GOOGLE_MAPS_API_KEY for interactive Google Map
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hotspot List */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3">📊 Hotspot Summary</h4>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label:'Critical', count:HOTSPOTS.filter(h=>h.risk==='CRITICAL').length, color:'text-rose-700', bg:'bg-rose-50 border-rose-200' },
                { label:'Medium',   count:HOTSPOTS.filter(h=>h.risk==='MEDIUM').length,   color:'text-amber-700', bg:'bg-amber-50 border-amber-200' },
                { label:'Low',      count:HOTSPOTS.filter(h=>h.risk==='LOW').length,       color:'text-emerald-700', bg:'bg-emerald-50 border-emerald-200' },
              ].map((s,i)=>(
                <div key={i} className={`text-center p-2 rounded-xl border ${s.bg}`}>
                  <div className={`text-lg font-black ${s.color}`}>{s.count}</div>
                  <div className="text-[9px] font-bold text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {filtered.map(h=>(
                <button key={h.id} onClick={()=>setSelectedPin(selectedPin?.id===h.id?null:h)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${selectedPin?.id===h.id?'border-blue-300 bg-blue-50':'border-slate-200 hover:bg-slate-50'}`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                    style={{backgroundColor:h.color+'20',border:`1px solid ${h.color}40`}}>
                    {ISSUE_ICONS[h.issue]||'⚠️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{h.name}</div>
                    <div className="text-[10px] text-slate-500">{h.complaints} issues • {h.issue}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${h.risk==='CRITICAL'?'bg-rose-100 text-rose-700':h.risk==='MEDIUM'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>
                    {h.risk}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"/>
            <div><strong>AI Insight:</strong> Block A Plumbing has been reported 8 times this month. Escalate to Senior Maintenance immediately.</div>
          </div>
        </div>
      </div>
    </div>
  );
}