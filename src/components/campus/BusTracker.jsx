import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { useCampus } from '../../context/CampusContext';
import { useGoogleMaps, CAMPUS_CENTER, MAPS_ENABLED } from '../../hooks/useGoogleMaps';
import { Bus, MapPin, Clock, Users, Navigation, Activity, AlertCircle } from 'lucide-react';

const MAP_STYLE = [
  { featureType:'poi', stylers:[{visibility:'off'}] },
  { featureType:'transit', stylers:[{visibility:'off'}] },
  { elementType:'geometry', stylers:[{color:'#f5f5f5'}] },
  { featureType:'water', elementType:'geometry', stylers:[{color:'#c9d8e8'}] },
  { featureType:'road', elementType:'geometry', stylers:[{color:'#ffffff'}] },
  { featureType:'road.arterial', elementType:'geometry', stylers:[{color:'#e8e8e8'}] },
];

const BUS_ROUTES_DATA = [
  {
    id:'B1', name:'Campus Circular', color:'#3b82f6',
    stops:[
      { name:'Main Gate',      lat:20.9517, lng:85.1004 },
      { name:'Academic Block', lat:20.9530, lng:85.1015 },
      { name:'Library',        lat:20.9540, lng:85.1020 },
      { name:'Hostel A',       lat:20.9550, lng:85.1008 },
      { name:'Hostel B',       lat:20.9545, lng:85.0995 },
      { name:'Mess',           lat:20.9525, lng:85.0990 },
    ],
    currentStopIdx:2, capacity:42, occupancy:28, driver:'Santosh Kumar', nextArrival:'3',
  },
  {
    id:'B2', name:'City Express', color:'#10b981',
    stops:[
      { name:'Main Gate',         lat:20.9517, lng:85.1004 },
      { name:'Rourkela Station',  lat:20.9600, lng:85.0950 },
      { name:'City Market',       lat:20.9650, lng:85.0900 },
      { name:'District Hospital', lat:20.9700, lng:85.0880 },
    ],
    currentStopIdx:1, capacity:54, occupancy:41, driver:'Ravi Das', nextArrival:'12',
  },
  {
    id:'B3', name:'Lab Shuttle', color:'#f59e0b',
    stops:[
      { name:'Hostel A',     lat:20.9550, lng:85.1008 },
      { name:'Hostel B',     lat:20.9545, lng:85.0995 },
      { name:'Research Lab', lat:20.9560, lng:85.1025 },
      { name:'Canteen',      lat:20.9520, lng:85.1010 },
    ],
    currentStopIdx:0, capacity:30, occupancy:12, driver:'Birju Singh', nextArrival:'7',
  },
];

const MapPlaceholder = ({ route }) => (
  <div className="w-full h-72 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
    {/* Fake road lines */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-1/3 left-0 right-0 h-3 bg-white rounded"/>
      <div className="absolute top-2/3 left-0 right-0 h-2 bg-white rounded"/>
      <div className="absolute left-1/3 top-0 bottom-0 w-3 bg-white rounded"/>
      <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-white rounded"/>
    </div>
    {/* Bus stops */}
    {route.stops.map((s, i) => (
      <div key={i} className="absolute flex flex-col items-center"
        style={{
          left: `${15 + (i / (route.stops.length - 1)) * 70}%`,
          top: `${20 + Math.sin(i * 1.2) * 30 + 20}%`
        }}>
        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${i === route.currentStopIdx ? 'scale-150' : ''}`}
          style={{ backgroundColor: route.color }}/>
        <span className="text-[8px] font-bold text-slate-600 mt-0.5 whitespace-nowrap bg-white/80 px-1 rounded">{s.name}</span>
      </div>
    ))}
    {/* Moving bus dot */}
    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white animate-bounce"
      style={{
        backgroundColor: route.color,
        left: `${15 + (route.currentStopIdx / (route.stops.length - 1)) * 70}%`,
        top: `${20 + Math.sin(route.currentStopIdx * 1.2) * 30 + 12}%`
      }}>
      <Bus className="w-4 h-4 text-white"/>
    </div>
    <div className="mt-auto mb-4 text-center z-10">
      <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1"/>
      <p className="text-xs font-bold text-slate-600">Add VITE_GOOGLE_MAPS_API_KEY to .env</p>
      <p className="text-[10px] text-slate-400">for live interactive map</p>
    </div>
  </div>
);

export default function BusTracker() {
  const { busRoutes } = useCampus();
  const { isLoaded, mapsEnabled } = useGoogleMaps();
  const [selectedBus, setSelectedBus] = useState('B1');
  const [tick, setTick] = useState(0);
  const [selectedStop, setSelectedStop] = useState(null);
  const mapRef = useRef(null);

  const routes = busRoutes?.length ? busRoutes : BUS_ROUTES_DATA;
  const active = routes.find(r => r.id === selectedBus) || routes[0];
  const occupancyPct = Math.round((active.occupancy / active.capacity) * 100);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const getArrival = (base, t) => Math.max(1, parseInt(base) - Math.floor(t / 15));

  const onMapLoad = useCallback(map => { mapRef.current = map; }, []);

  // Interpolated bus position between current and next stop
  const currentStop = active.stops[active.currentStopIdx];
  const nextStop = active.stops[(active.currentStopIdx + 1) % active.stops.length];
  const progress = (tick % 30) / 30;
  const busPos = isLoaded && currentStop ? {
    lat: currentStop.lat + (nextStop.lat - currentStop.lat) * progress,
    lng: currentStop.lng + (nextStop.lng - currentStop.lng) * progress,
  } : null;

  const routePath = active.stops.map(s => ({ lat: s.lat, lng: s.lng }));

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-500/30 mb-2">
            <Bus className="w-3 h-3"/>
            {isLoaded ? '🟢 LIVE GPS — Google Maps' : '📍 Campus Transport'}
          </div>
          <h2 className="text-xl font-black">Live Bus Tracker 🚌</h2>
          <p className="text-xs text-emerald-100/80 mt-0.5">Real-time GPS positions • Arrival alerts • Route maps</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {routes.map(r => (
              <button key={r.id} onClick={() => setSelectedBus(r.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedBus === r.id ? 'bg-white text-slate-900 border-white shadow-md' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}/>
                {r.id}: {r.name}
                {selectedBus === r.id && <Activity className="w-3 h-3 text-emerald-500 animate-pulse"/>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── MAP ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">{active.id}: {active.name}</h3>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Activity className="w-3.5 h-3.5 animate-pulse"/>LIVE
            </div>
          </div>

          {isLoaded && mapsEnabled ? (
            <GoogleMap
              mapContainerStyle={{ width:'100%', height:'320px' }}
              center={currentStop || CAMPUS_CENTER}
              zoom={15}
              onLoad={onMapLoad}
              options={{
                styles: MAP_STYLE,
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}>

              {/* Route path */}
              <Polyline
                path={routePath}
                options={{ strokeColor: active.color, strokeWeight: 4, strokeOpacity: 0.7, geodesic: true }}
              />

              {/* Stop markers */}
              {active.stops.map((stop, i) => (
                <Marker key={i}
                  position={{ lat: stop.lat, lng: stop.lng }}
                  onClick={() => setSelectedStop(stop)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: i === active.currentStopIdx ? 10 : 7,
                    fillColor: i < active.currentStopIdx ? active.color : i === active.currentStopIdx ? '#ffffff' : '#e2e8f0',
                    fillOpacity: 1,
                    strokeColor: active.color,
                    strokeWeight: 2.5,
                  }}
                />
              ))}

              {/* Live bus marker */}
              {busPos && (
                <Marker position={busPos}
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="17" fill="${active.color}" stroke="white" stroke-width="3"/>
                        <text x="18" y="23" text-anchor="middle" font-size="16">🚌</text>
                      </svg>`)}`,
                    scaledSize: new window.google.maps.Size(36, 36),
                    anchor: new window.google.maps.Point(18, 18),
                  }}
                />
              )}

              {/* Info window for selected stop */}
              {selectedStop && (
                <InfoWindow position={{ lat: selectedStop.lat, lng: selectedStop.lng }}
                  onCloseClick={() => setSelectedStop(null)}>
                  <div className="p-1 text-xs font-bold text-slate-800 min-w-[100px]">
                    <div className="font-black text-sm mb-0.5">📍 {selectedStop.name}</div>
                    <div className="text-slate-500">Route: {active.name}</div>
                    <div style={{ color: active.color }} className="font-bold mt-0.5">
                      {selectedStop.name === active.stops[active.currentStopIdx]?.name ? '🟢 Bus is HERE' : 'Stop'}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <MapPlaceholder route={active}/>
          )}

          {/* ETA bar */}
          <div className="p-4 flex items-center gap-3 bg-emerald-50 border-t border-emerald-200">
            <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0"/>
            <div>
              <div className="text-sm font-bold text-emerald-900">
                Bus {active.id} arrives at Main Gate in{' '}
                <span className="text-emerald-600">{getArrival(active.nextArrival, tick)} min</span>
              </div>
              <div className="text-xs text-emerald-700 mt-0.5">
                Currently at: <strong>{active.stops[active.currentStopIdx]?.name}</strong> • Driver: {active.driver}
              </div>
            </div>
          </div>
        </div>

        {/* ── BUS INFO ── */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">🚌 Bus Status</h4>
            {[
              { label:'Bus', value:active.id },
              { label:'Route', value:active.name },
              { label:'Driver', value:active.driver },
              { label:'ETA Main Gate', value:`${getArrival(active.nextArrival, tick)} min` },
            ].map((row,i)=>(
              <div key={i} className="flex justify-between text-xs border-b border-slate-100 pb-1.5 last:border-0">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-bold text-slate-900">{row.value}</span>
              </div>
            ))}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1"><Users className="w-3 h-3"/>Occupancy</span>
                <span className={`font-bold ${occupancyPct>85?'text-rose-700':occupancyPct>60?'text-amber-700':'text-emerald-700'}`}>
                  {active.occupancy}/{active.capacity}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className={`h-2 rounded-full transition-all ${occupancyPct>85?'bg-rose-500':occupancyPct>60?'bg-amber-500':'bg-emerald-500'}`}
                  style={{ width:`${occupancyPct}%` }}/>
              </div>
              <div className="text-[10px] text-slate-400 text-right">{occupancyPct}% • {active.capacity - active.occupancy} seats free</div>
            </div>
          </div>

          {/* Stop list */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">📍 Route Stops</h4>
            {active.stops.map((stop, i) => (
              <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${i === active.currentStopIdx ? 'bg-emerald-50 border border-emerald-200' : 'border border-transparent'}`}>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${
                  i < active.currentStopIdx ? 'border-slate-300 bg-slate-300' :
                  i === active.currentStopIdx ? 'border-emerald-500 bg-emerald-500 animate-pulse' :
                  'border-slate-200 bg-white'
                }`}/>
                <span className={`text-xs font-bold ${i === active.currentStopIdx ? 'text-emerald-800' : i < active.currentStopIdx ? 'text-slate-400' : 'text-slate-700'}`}>
                  {stop.name}
                </span>
                {i === active.currentStopIdx && (
                  <span className="ml-auto text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">HERE</span>
                )}
              </div>
            ))}
          </div>

          {/* All routes */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">🗺️ All Routes</h4>
            {routes.map(r=>(
              <button key={r.id} onClick={()=>setSelectedBus(r.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${selectedBus===r.id?'border-blue-300 bg-blue-50':'border-slate-200 hover:bg-slate-50'}`}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{backgroundColor:r.color+'20',border:`1px solid ${r.color}40`}}>
                  <Bus className="w-3.5 h-3.5" style={{color:r.color}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">{r.id}: {r.name}</div>
                  <div className="text-[10px] text-slate-500">{r.stops.length} stops • ETA {r.nextArrival} min</div>
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