import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { X, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

// ── Portal definitions ────────────────────────────────────────────────────────
const PORTALS = [
  {
    id: 'admin',
    emoji: '🏛',
    label: 'Admin',
    sublabel: 'Dean\'s Office',
    desc: 'Generate timetable · Conflict resolution · Approve changes · Export',
    color: 'from-slate-700 to-slate-900',
    accent: '#475569',
    name: 'Dean R. K. Sharma',
  },
  {
    id: 'faculty',
    emoji: '📚',
    label: 'Faculty',
    sublabel: 'Teaching Staff',
    desc: 'My timetable · Leave request · Extra class · AI scheduling copilot',
    color: 'from-teal-500 to-emerald-600',
    accent: '#0d9488',
    name: 'Dr. A. Panda',
  },
  {
    id: 'coordinator',
    emoji: '🗂',
    label: 'Dept. Coordinator',
    sublabel: 'CSE Department',
    desc: 'Approve requests · Department timetable · Lab resource management',
    color: 'from-orange-500 to-amber-600',
    accent: '#f97316',
    name: 'Prof. S. Rath',
  },
  {
    id: 'club',
    emoji: '🎉',
    label: 'Club Representative',
    sublabel: 'Student Clubs',
    desc: 'Spectra venue booking · Hall requests · Event management',
    color: 'from-violet-500 to-purple-600',
    accent: '#8b5cf6',
    name: 'Arjun Mehta (IEEE)',
  },
  {
    id: 'student',
    emoji: '🎓',
    label: 'Student',
    sublabel: 'CIT Campus',
    desc: 'My timetable · Exam schedule · Campus map · Notice board',
    color: 'from-blue-500 to-indigo-600',
    accent: '#3b82f6',
    name: 'Piyush Kumar Dey',
  },
];

export default function GoogleAuthModal({ isOpen: propIsOpen, onClose: propOnClose, onLogin: propOnLogin }) {
  const ctx = useCampus();
  const loginWithGoogle = ctx?.loginWithGoogle;
  const authModalOpen = ctx?.authModalOpen;
  const setAuthModalOpen = ctx?.setAuthModalOpen;

  const isOpen = propIsOpen !== undefined ? propIsOpen : (authModalOpen || false);

  const handleClose = () => {
    if (propOnClose) propOnClose();
    else if (setAuthModalOpen) setAuthModalOpen(false);
    setEntering(null);
  };

  const handleLogin = (role, acc) => {
    if (propOnLogin) propOnLogin(role, acc);
    else if (loginWithGoogle) loginWithGoogle(acc.email, role, acc.name);
    handleClose();
  };

  const [entering, setEntering] = useState(null); // portal being entered

  const enter = (portal) => {
    setEntering(portal.id);
    setTimeout(() => {
      handleLogin(portal.id, { role: portal.id, name: portal.name, email: `${portal.id}@cit.ac.in` });
    }, 900);
  };

  if (!isOpen) return null;

  const activePortal = PORTALS.find(p => p.id === entering);

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'16px', backgroundColor:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)'
    }}>
      <div style={{
        background:'white', borderRadius:'28px',
        boxShadow:'0 32px 80px rgba(0,0,0,0.35)',
        width:'100%', maxWidth:'440px', overflow:'hidden',
        maxHeight:'90vh', display:'flex', flexDirection:'column'
      }}>

        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg,#1e293b,#334155)',
          color:'white', padding:'24px', position:'relative', flexShrink:0
        }}>
          <button onClick={handleClose} style={{
            position:'absolute', right:'16px', top:'16px',
            width:'28px', height:'28px', borderRadius:'50%',
            background:'rgba(255,255,255,0.15)', border:'none',
            color:'white', cursor:'pointer', display:'flex',
            alignItems:'center', justifyContent:'center'
          }}>
            <X size={14}/>
          </button>

          {/* Logo row */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'4px' }}>
            <div style={{
              width:'44px', height:'44px', borderRadius:'14px',
              background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'22px'
            }}>🏫</div>
            <div>
              <div style={{ fontWeight:900, fontSize:'20px', letterSpacing:'-0.5px' }}>UNIFY</div>
              <div style={{ fontSize:'11px', opacity:0.7, fontWeight:600 }}>
                Chilika Institute of Technology · Campus Scheduling
              </div>
            </div>
          </div>
          <p style={{ fontSize:'12px', opacity:0.6, marginTop:'10px', lineHeight:1.5 }}>
            Select your role and enter instantly — no password required.
          </p>
        </div>

        {/* Portal list */}
        <div style={{ padding:'16px', overflowY:'auto', flex:1 }}>

          {entering ? (
            /* Entering animation */
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{
                width:'64px', height:'64px', borderRadius:'50%',
                background:'#d1fae5', display:'flex', alignItems:'center',
                justifyContent:'center', margin:'0 auto 16px', fontSize:'28px'
              }}>
                {activePortal?.emoji}
              </div>
              <div style={{ fontWeight:900, fontSize:'18px', color:'#1e293b' }}>
                Welcome, {activePortal?.name}!
              </div>
              <div style={{ fontSize:'12px', color:'#64748b', marginTop:'6px' }}>
                Opening <strong>{activePortal?.label}</strong> portal…
              </div>
              <div style={{
                width:'40px', height:'4px', borderRadius:'2px',
                background:'#e2e8f0', margin:'20px auto 0', overflow:'hidden'
              }}>
                <div style={{
                  height:'100%', background: activePortal?.accent || '#3b82f6',
                  borderRadius:'2px', animation:'slideIn 0.9s ease forwards',
                  width:'100%'
                }}/>
              </div>
              <style>{`@keyframes slideIn { from { transform:translateX(-100%) } to { transform:translateX(0) } }`}</style>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {PORTALS.map(portal => (
                <button
                  key={portal.id}
                  onClick={() => enter(portal)}
                  style={{
                    display:'flex', alignItems:'center', gap:'14px',
                    padding:'14px 16px', borderRadius:'18px',
                    border:'1.5px solid #e2e8f0', background:'white',
                    cursor:'pointer', textAlign:'left', width:'100%',
                    transition:'all 0.15s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = portal.accent;
                    e.currentTarget.style.background = `${portal.accent}0d`;
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width:'46px', height:'46px', borderRadius:'14px', flexShrink:0,
                    background:`linear-gradient(135deg,${portal.accent}22,${portal.accent}44)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'22px'
                  }}>
                    {portal.emoji}
                  </div>

                  {/* Text */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <span style={{ fontWeight:900, fontSize:'13px', color:'#1e293b' }}>
                        {portal.label}
                      </span>
                      <span style={{
                        fontSize:'10px', fontWeight:700, color: portal.accent,
                        background:`${portal.accent}15`, padding:'1px 7px',
                        borderRadius:'20px'
                      }}>
                        {portal.sublabel}
                      </span>
                    </div>
                    <div style={{
                      fontSize:'11px', color:'#64748b', marginTop:'2px',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
                    }}>
                      {portal.desc}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={16} color={portal.accent} style={{ flexShrink:0, opacity:0.6 }}/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!entering && (
          <div style={{
            padding:'12px 20px', borderTop:'1px solid #f1f5f9',
            display:'flex', justifyContent:'space-between',
            fontSize:'10px', color:'#94a3b8', flexShrink:0
          }}>
            <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <Zap size={10} color="#10b981"/> One-click access · No password needed
            </span>
            <span>CIT v3.0</span>
          </div>
        )}
      </div>
    </div>
  );
}
