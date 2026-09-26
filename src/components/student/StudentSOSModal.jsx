import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { useCampus } from '../../context/CampusContext';
import { useGoogleMaps, CAMPUS_CENTER } from '../../hooks/useGoogleMaps';
import { firestoreDB } from '../../services/firebase';
import { db as supaDB } from '../../services/supabase';
import { AlertTriangle, MapPin, Phone, CheckCircle2, Loader, Navigation } from 'lucide-react';

const RECIPIENTS = [
  { role:'Teacher On Duty', name:'Dr. Avinash Patra', phone:'9437012345', emoji:'👩‍🏫' },
  { role:'Security Guard',  name:'Ramesh Behera',     phone:'9437056789', emoji:'🛡️' },
  { role:'Dean of Students',name:'Prof. S. K. Nayak', phone:'9437098765', emoji:'🎓' },
];

export default function StudentSOSModal({ isOpen, onClose }) {
  const { currentPersona, addAuditLog } = useCampus();
  const { isLoaded } = useGoogleMaps();
  const [phase, setPhase] = useState('idle'); // idle | locating | sending | done
  const [gpsPos, setGpsPos] = useState(null);
  const [gpsError, setGpsError] = useState('');
  const [dispatched, setDispatched] = useState([]);
  const [address, setAddress] = useState('Locating...');

  // Get GPS on open
  useEffect(() => {
    if (!isOpen) { setPhase('idle'); setDispatched([]); setGpsPos(null); setGpsError(''); return; }
    setPhase('locating');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGpsPos(loc);
        setPhase('ready');
        // Reverse geocode (works without key — uses Nominatim as fallback)
        if (window.google?.maps?.Geocoder) {
          new window.google.maps.Geocoder().geocode({ location: loc }, (res, status) => {
            if (status === 'OK' && res[0]) setAddress(res[0].formatted_address);
            else setAddress(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`);
          });
        } else {
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json`)
            .then(r => r.json()).then(d => setAddress(d.display_name || `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`))
            .catch(() => setAddress(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`));
        }
      },
      err => { setGpsError('GPS unavailable — using campus location'); setGpsPos(CAMPUS_CENTER); setPhase('ready'); },
      { timeout:8000, enableHighAccuracy:true }
    );
  }, [isOpen]);

  const handleSendSOS = async () => {
    setPhase('sending');
    const alertPayload = {
      studentName: currentPersona?.name || 'Unknown',
      regNo: currentPersona?.regNo || 'N/A',
      room: currentPersona?.room || 'N/A',
      latitude: gpsPos?.lat,
      longitude: gpsPos?.lng,
      address,
      recipients: RECIPIENTS,
      status: 'SENT',
    };
    // Push to Firebase (real-time) + Supabase (persistent)
    await Promise.allSettled([
      firestoreDB.sos.send(alertPayload),
      supaDB.sosAlerts.send(alertPayload),
    ]);
    if (addAuditLog) addAuditLog(currentPersona?.name, 'SOS_ALERT_SENT', `SOS from Room ${currentPersona?.room} — GPS: ${address}`, 'red');
    // Stagger dispatch notifications
    for (let i = 0; i < RECIPIENTS.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setDispatched(d => [...d, RECIPIENTS[i].role]);
    }
    setPhase('done');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-3 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget && phase !== 'sending') onClose(); }}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Top bar */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 p-5 text-white text-center">
          <div className="text-3xl mb-1">🚨</div>
          <h2 className="font-black text-lg">EMERGENCY SOS</h2>
          <p className="text-xs text-rose-100 mt-0.5">Alerts Teacher • Security • Dean instantly</p>
        </div>

        <div className="p-5 space-y-4">

          {/* GPS Map */}
          <div className="rounded-2xl overflow-hidden border-2 border-rose-200" style={{height:'180px'}}>
            {phase === 'locating' ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
                <Loader className="w-6 h-6 text-rose-500 animate-spin"/>
                <p className="text-xs font-bold text-slate-600">Getting your GPS location...</p>
              </div>
            ) : isLoaded && gpsPos ? (
              <GoogleMap mapContainerStyle={{width:'100%',height:'100%'}}
                center={gpsPos} zoom={16}
                options={{disableDefaultUI:true,gestureHandling:'none',styles:[
                  {elementType:'geometry',stylers:[{color:'#f5f5f5'}]},
                  {featureType:'water',elementType:'geometry',stylers:[{color:'#c9d8e8'}]},
                  {featureType:'road',elementType:'geometry',stylers:[{color:'#ffffff'}]},
                ]}}>
                <Marker position={gpsPos} icon={{
                  url:`data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="#dc2626" stroke="white" stroke-width="3"/><text x="20" y="26" text-anchor="middle" font-size="18">🚨</text></svg>')}`,
                  scaledSize: new window.google.maps.Size(40,40),
                  anchor: new window.google.maps.Point(20,20),
                }}/>
                <Circle center={gpsPos} radius={50} options={{fillColor:'#dc2626',fillOpacity:0.15,strokeColor:'#dc2626',strokeWeight:1.5}}/>
              </GoogleMap>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
                <MapPin className="w-8 h-8 text-rose-400"/>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">📍 Location Acquired</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Add VITE_GOOGLE_MAPS_API_KEY for live map</p>
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Navigation className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5"/>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Your Location</div>
              <div className="text-xs font-bold text-slate-800 leading-snug">{address}</div>
              {gpsError && <div className="text-[10px] text-amber-600 mt-0.5">⚠️ {gpsError}</div>}
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            {RECIPIENTS.map((r, i) => {
              const sent = dispatched.includes(r.role);
              const sending = phase === 'sending' && !sent && dispatched.length === i;
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${sent?'bg-emerald-50 border-emerald-300':sending?'bg-amber-50 border-amber-300 animate-pulse':'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xl flex-shrink-0">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-xs">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.role}</div>
                  </div>
                  {sent && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0"/>}
                  {sending && <Loader className="w-4 h-4 text-amber-500 animate-spin flex-shrink-0"/>}
                  {!sent && !sending && phase === 'done' && <CheckCircle2 className="w-5 h-5 text-emerald-500"/>}
                </div>
              );
            })}
          </div>

          {/* Helpline */}
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <div className="text-xs font-bold text-rose-800">National Emergency Helpline</div>
            <a href="tel:112" className="text-xl font-black text-rose-700 block mt-0.5">📞 112</a>
          </div>

          {/* Action */}
          {phase === 'done' ? (
            <div className="text-center space-y-3">
              <div className="text-emerald-600 font-black">✅ All 3 contacts alerted!</div>
              <div className="flex gap-2">
                {RECIPIENTS.map(r=>(
                  <a key={r.role} href={`tel:${r.phone}`}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold text-center">
                    📞 {r.name.split(' ')[1] || r.role.split(' ')[0]}
                  </a>
                ))}
              </div>
              <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold">Close</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={onClose} disabled={phase==='sending'}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold disabled:opacity-40 transition-all">
                Cancel
              </button>
              <button onClick={handleSendSOS}
                disabled={phase==='locating'||phase==='sending'}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-black transition-all shadow-lg shadow-rose-500/30 active:scale-95">
                {phase==='sending' ? '📡 Sending...' : phase==='locating' ? '📍 Getting GPS...' : '🚨 SEND SOS NOW'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}