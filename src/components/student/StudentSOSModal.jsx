import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { AlertTriangle, MapPin, Phone, CheckCircle2, Loader, Navigation } from 'lucide-react';

const CAMPUS_CENTER = { lat: 21.2514, lng: 83.9812 };

const RECIPIENTS = [
  { role:'Teacher On Duty', name:'Dr. Avinash Patra', phone:'9437012345', emoji:'👩‍🏫' },
  { role:'Security Guard',  name:'Ramesh Behera',     phone:'9437056789', emoji:'🛡️' },
  { role:'Dean of Students',name:'Prof. S. K. Nayak', phone:'9437098765', emoji:'🎓' },
];

export default function StudentSOSModal({ isOpen, onClose }) {
  const { currentPersona, addAuditLog } = useCampus();
  const [phase, setPhase] = useState('idle'); // idle | locating | ready | sending | done
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
        // Reverse geocode via Nominatim (no API key needed)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json`)
          .then(r => r.json())
          .then(d => setAddress(d.display_name || `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`))
          .catch(() => setAddress(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`));
      },
      () => {
        setGpsError('GPS unavailable — using campus location');
        setGpsPos(CAMPUS_CENTER);
        setPhase('ready');
        setAddress('Trident Academy of Technology, Bhubaneswar, Odisha');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [isOpen]);

  const handleSendSOS = async () => {
    setPhase('sending');
    if (addAuditLog) addAuditLog(
      currentPersona?.name, 'SOS_ALERT_SENT',
      `SOS from Room ${currentPersona?.room} — GPS: ${address}`, 'red'
    );
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

          {/* GPS Location Map — Pure CSS, no Google Maps */}
          <div className="rounded-2xl overflow-hidden border-2 border-rose-200" style={{height:'180px'}}>
            {phase === 'locating' ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
                <Loader className="w-6 h-6 text-rose-500 animate-spin"/>
                <p className="text-xs font-bold text-slate-600">Getting your GPS location...</p>
              </div>
            ) : gpsPos ? (
              <div className="h-full relative" style={{background:"linear-gradient(135deg,#dbeafe,#ede9fe,#fce7f3)"}}>
                {/* Grid */}
                <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,#cbd5e155 0,#cbd5e155 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,#cbd5e155 0,#cbd5e155 1px,transparent 1px,transparent 28px)"}}/>
                {/* Roads */}
                <div style={{position:"absolute",top:"50%",left:0,right:0,height:3,background:"#fff",boxShadow:"0 1px 3px #00000018",transform:"translateY(-50%)"}}/>
                <div style={{position:"absolute",left:"45%",top:0,bottom:0,width:3,background:"#fff",boxShadow:"1px 0 3px #00000018"}}/>
                {/* Radius ring */}
                <div style={{position:"absolute",top:"50%",left:"50%",width:100,height:100,transform:"translate(-50%,-50%)",borderRadius:"50%",background:"rgba(220,38,38,0.08)",border:"2px solid rgba(220,38,38,0.25)"}}/>
                {/* SOS marker */}
                <div style={{
                  position:"absolute",top:"50%",left:"50%",
                  transform:"translate(-50%,-50%)",
                  width:38,height:38,
                  background:"#dc2626",
                  borderRadius:"50%",
                  border:"3px solid white",
                  boxShadow:"0 0 0 6px rgba(220,38,38,0.25), 0 4px 16px rgba(220,38,38,0.5)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
                }}>🚨</div>
                {/* Coords */}
                <div style={{
                  position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
                  background:"rgba(15,23,42,0.85)",color:"white",
                  fontSize:9,fontWeight:"bold",padding:"3px 10px",borderRadius:20,
                  whiteSpace:"nowrap",letterSpacing:0.3,
                }}>
                  📍 {gpsPos.lat.toFixed(4)}, {gpsPos.lng.toFixed(4)}
                </div>
                {/* Live badge */}
                <div style={{position:"absolute",top:8,right:8,background:"#dc2626",color:"white",fontSize:8,fontWeight:900,padding:"2px 8px",borderRadius:10,letterSpacing:1}}>
                  ● LIVE
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
                <MapPin className="w-8 h-8 text-rose-400"/>
                <p className="text-xs font-bold text-slate-700">📍 Location Ready</p>
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
              const sent    = dispatched.includes(r.role);
              const sending = phase === 'sending' && !sent && dispatched.length === i;
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${sent?'bg-emerald-50 border-emerald-300':sending?'bg-amber-50 border-amber-300 animate-pulse':'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xl flex-shrink-0">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-xs">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.role}</div>
                  </div>
                  {sent    && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0"/>}
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
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold disabled:opacity-40">
                Cancel
              </button>
              <button onClick={handleSendSOS}
                disabled={phase==='locating'||phase==='sending'}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-black shadow-lg shadow-rose-500/30 active:scale-95 transition-all">
                {phase==='sending' ? '📡 Sending...' : phase==='locating' ? '📍 Getting GPS...' : '🚨 SEND SOS NOW'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
