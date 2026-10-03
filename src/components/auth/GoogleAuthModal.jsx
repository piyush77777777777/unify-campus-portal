import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { X, ShieldCheck, Mail, ArrowRight, AlertTriangle, Hash } from 'lucide-react';

function safeStorage(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const ROLE_META = {
  student:     { label: 'Student',           color: 'bg-blue-600',    emoji: '🎓', verifyLabel: 'Registration Number',  placeholder: '2201106145',     hint: 'Enter your university registration number' },
  teacher:     { label: 'Faculty / Teacher', color: 'bg-purple-600',  emoji: '📚', verifyLabel: 'Employee ID',          placeholder: 'FAC-001',        hint: 'Enter your faculty employee ID' },
  warden:      { label: 'Hostel Warden',     color: 'bg-indigo-600',  emoji: '🏠', verifyLabel: 'Warden ID',            placeholder: 'WAR-01',         hint: 'Enter your official warden ID' },
  guard:       { label: 'Security Guard',    color: 'bg-amber-600',   emoji: '🛡', verifyLabel: 'Badge / Guard ID',     placeholder: 'SEC-01',         hint: 'Enter your security badge number' },
  messManager: { label: 'Mess Supervisor',   color: 'bg-emerald-600', emoji: '🍽', verifyLabel: 'Mess Staff ID',        placeholder: 'MESS-01',        hint: 'Enter your mess staff ID' },
  parent:      { label: 'Parent / Guardian', color: 'bg-teal-600',    emoji: '👨', verifyLabel: "Ward's Reg. Number",  placeholder: '2201106145',     hint: "Enter your ward's registration number" },
  principal:   { label: 'Principal',         color: 'bg-rose-700',    emoji: '🎯', verifyLabel: 'Principal Office ID',  placeholder: 'PRIN-01',        hint: 'Enter your principal office ID' }
};

const DEMO_ACCOUNTS = {
  student:     { name: 'Piyush Kumar Dey',   email: 'piyush@igit.ac.in',     code: '2201106145' },
  teacher:     { name: 'Prof. Ananya Verma', email: 'avinash@igit.ac.in',    code: 'FAC-001'    },
  warden:      { name: 'Dr. S. K. Nayak',    email: 'warden@igit.ac.in',     code: 'WAR-01'     },
  guard:       { name: 'Subedar Ram Singh',  email: 'guard@igit.ac.in',      code: 'SEC-01'     },
  messManager: { name: 'Bikram Das',          email: 'mess@igit.ac.in',       code: 'MESS-01'    },
  parent:      { name: 'Mr. Ramesh Dey',     email: 'parent@gmail.com',      code: '2201106145' },
  principal:   { name: 'Prof. D. K. Mishra', email: 'principal@igit.ac.in',  code: 'PRIN-01'    }
};

export default function GoogleAuthModal({ isOpen: propIsOpen, onClose: propOnClose, onLogin: propOnLogin, initialRole = null }) {
  const ctx = useCampus();
  const loginWithGoogle = ctx?.loginWithGoogle;
  const authModalOpen   = ctx?.authModalOpen;
  const setAuthModalOpen = ctx?.setAuthModalOpen;

  // Support both prop-based and context-based open state
  const isOpen = propIsOpen !== undefined ? propIsOpen : (authModalOpen || false);
  const handleClose = () => {
    if (propOnClose) propOnClose();
    else if (setAuthModalOpen) setAuthModalOpen(false);
    resetState();
  };
  const handleLogin = (role, acc) => {
    if (propOnLogin) propOnLogin(role, acc);
    else if (loginWithGoogle) loginWithGoogle(role, acc);
    handleClose();
  };

  const [step, setStep]   = useState('role');
  const [role, setRole]   = useState(null);
  const [account, setAccount] = useState(null);
  const [code, setCode]   = useState('');
  const [error, setError] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName]   = useState('');
  const [useCustom, setUseCustom]     = useState(false);
  const [done, setDone]   = useState(false);

  const resetState = () => {
    setStep(initialRole ? 'account' : 'role');
    setRole(initialRole || null);
    setAccount(null); setCode(''); setError('');
    setCustomEmail(''); setCustomName(''); setUseCustom(false); setDone(false);
  };

  useEffect(() => {
    if (isOpen) {
      setStep(initialRole ? 'account' : 'role');
      setRole(initialRole || null);
      setAccount(null); setCode(''); setError('');
      setCustomEmail(''); setCustomName(''); setUseCustom(false); setDone(false);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const meta = role ? ROLE_META[role] : null;
  const demo = role ? DEMO_ACCOUNTS[role] : null;
  const accentColor = meta?.color || 'bg-slate-700';

  // ── STEP 1: choose role ──
  const pickRole = (r) => { setRole(r); setError(''); setStep('account'); };

  // ── STEP 2: choose account ──
  const pickAccount = (acc) => {
    setAccount(acc); setError(''); setStep('verify');
  };
  const submitCustom = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const map = safeStorage('unify_email_role_map');
    const existing = map[customEmail.toLowerCase()];
    if (existing && existing !== role) {
      setError('This email is already used for the ' + (ROLE_META[existing]?.label || existing) + ' portal.');
      return;
    }
    setAccount({ name: customName || customEmail.split('@')[0], email: customEmail, code: null });
    setError(''); setStep('verify');
  };

  // ── STEP 3: verify ──
  const verify = (e) => {
    e.preventDefault();
    if (!code.trim()) { setError('Please enter your ' + (meta?.verifyLabel || 'ID') + '.'); return; }
    if (demo && account?.email === demo.email && code.trim().toLowerCase() !== demo.code.toLowerCase()) {
      setError('Wrong code. Hint: try "' + demo.code + '"');
      return;
    }
    const map = safeStorage('unify_email_role_map');
    map[(account?.email || '').toLowerCase()] = role;
    saveStorage('unify_email_role_map', map);
    setDone(true);
    setTimeout(() => handleLogin(role, { role, name: account?.name || '', email: account?.email || '' }), 1000);
  };

  const steps = ['role','account','verify'];
  const stepIdx = steps.indexOf(step);

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',backgroundColor:'rgba(0,0,0,0.65)',backdropFilter:'blur(4px)'}}>
      <div style={{background:'white',borderRadius:'24px',boxShadow:'0 25px 60px rgba(0,0,0,0.3)',width:'100%',maxWidth:'380px',overflow:'hidden'}}>

        {/* Header */}
        <div className={`${accentColor} text-white px-6 py-5 relative`}>
          <button onClick={handleClose} style={{position:'absolute',right:'16px',top:'16px',width:'28px',height:'28px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',border:'none',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <X size={14}/>
          </button>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>
              {meta ? meta.emoji : '🔐'}
            </div>
            <div>
              <div style={{fontWeight:900,fontSize:'16px'}}>{meta ? meta.label + ' Portal' : 'UNIFY Login'}</div>
              <div style={{fontSize:'11px',opacity:0.8,marginTop:'2px'}}>
                {step==='role' ? 'Select your portal' : step==='account' ? 'Choose your account' : step==='verify' ? 'Verify your identity' : 'Logging in...'}
              </div>
            </div>
          </div>
          {/* Progress dots */}
          <div style={{display:'flex',gap:'6px',marginTop:'16px'}}>
            {(initialRole ? ['account','verify'] : steps).map((s,i) => (
              <div key={s} style={{height:'3px',flex:1,borderRadius:'2px',background: step===s ? 'white' : stepIdx > (initialRole ? i+1 : i) ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}}/>
            ))}
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div style={{margin:'12px 20px 0',padding:'10px 12px',borderRadius:'12px',background:'#fff1f2',border:'1px solid #fecdd3',display:'flex',gap:'8px',alignItems:'flex-start'}}>
            <AlertTriangle size={14} color="#e11d48" style={{flexShrink:0,marginTop:'2px'}}/>
            <span style={{fontSize:'11px',color:'#be123c',fontWeight:500}}>{error}</span>
          </div>
        ) : null}

        <div style={{padding:'20px 24px 24px'}}>

          {/* STEP: role */}
          {step==='role' && (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              <p style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'4px'}}>Who are you? Select your portal:</p>
              {Object.entries(ROLE_META).map(([r, rm]) => (
                <button key={r} onClick={() => pickRole(r)}
                  style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',textAlign:'left',width:'100%'}}
                  onMouseOver={e=>{e.currentTarget.style.borderColor='#60a5fa';e.currentTarget.style.background='#eff6ff';}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.background='white';}}>
                  <div className={`${rm.color}`} style={{width:'36px',height:'36px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',color:'white',flexShrink:0}}>
                    {rm.emoji}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#1e293b'}}>{rm.label}</div>
                  </div>
                  <ArrowRight size={14} color="#94a3b8"/>
                </button>
              ))}
            </div>
          )}

          {/* STEP: account */}
          {step==='account' && meta && (
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {!initialRole && (
                <button onClick={() => {setStep('role');setError('');}} style={{alignSelf:'flex-start',fontSize:'11px',color:'#2563eb',fontWeight:700,background:'none',border:'none',cursor:'pointer',padding:0}}>← Back</button>
              )}
              {!useCustom ? (
                <>
                  <p style={{fontSize:'11px',color:'#94a3b8',margin:0}}>Demo account for {meta.label}:</p>
                  {demo && (
                    <button onClick={() => pickAccount({name: demo.name, email: demo.email, expectedCode: demo.code})}
                      style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#f8fafc',cursor:'pointer',textAlign:'left',width:'100%'}}
                      onMouseOver={e=>{e.currentTarget.style.borderColor='#60a5fa';}}
                      onMouseOut={e=>{e.currentTarget.style.borderColor='#e2e8f0';}}>
                      <div className={`${meta.color}`} style={{width:'36px',height:'36px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',color:'white',flexShrink:0}}>
                        {meta.emoji}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#1e293b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{demo.name}</div>
                        <div style={{fontSize:'11px',color:'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{demo.email}</div>
                      </div>
                      <ArrowRight size={14} color="#94a3b8"/>
                    </button>
                  )}
                  <button onClick={() => setUseCustom(true)} style={{fontSize:'11px',color:'#2563eb',fontWeight:700,background:'none',border:'none',cursor:'pointer',textAlign:'center',padding:'4px 0'}}>
                    + Use a different email
                  </button>
                </>
              ) : (
                <form onSubmit={submitCustom} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  <p style={{fontSize:'11px',color:'#64748b',margin:0}}>Enter your email for {meta.label} portal:</p>
                  <div style={{position:'relative'}}>
                    <Mail size={14} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}}/>
                    <input type="email" required value={customEmail} onChange={e=>{setCustomEmail(e.target.value);setError('');}}
                      placeholder="your@email.com"
                      style={{width:'100%',paddingLeft:'32px',paddingRight:'10px',paddingTop:'8px',paddingBottom:'8px',fontSize:'12px',border:'1px solid #cbd5e1',borderRadius:'10px',outline:'none',boxSizing:'border-box'}}/>
                  </div>
                  <input type="text" value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Your full name"
                    style={{width:'100%',padding:'8px 10px',fontSize:'12px',border:'1px solid #cbd5e1',borderRadius:'10px',outline:'none',boxSizing:'border-box'}}/>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button type="button" onClick={() => setUseCustom(false)}
                      style={{flex:1,padding:'8px',borderRadius:'10px',border:'1px solid #e2e8f0',fontSize:'12px',fontWeight:600,cursor:'pointer',background:'white'}}>Back</button>
                    <button type="submit"
                      style={{flex:1,padding:'8px',borderRadius:'10px',border:'none',fontSize:'12px',fontWeight:700,cursor:'pointer',background:'#2563eb',color:'white'}}>Continue →</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP: verify */}
          {step==='verify' && meta && account && !done && (
            <form onSubmit={verify} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <button type="button" onClick={() => {setStep('account');setError('');setCode('');}}
                style={{alignSelf:'flex-start',fontSize:'11px',color:'#2563eb',fontWeight:700,background:'none',border:'none',cursor:'pointer',padding:0}}>← Back</button>
              <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'16px',padding:'16px',textAlign:'center'}}>
                <div style={{fontSize:'28px',marginBottom:'6px'}}>{meta.emoji}</div>
                <div style={{fontWeight:900,fontSize:'14px',color:'#1e293b'}}>{meta.label} Verification</div>
                <div style={{fontSize:'11px',color:'#64748b',marginTop:'4px'}}>{account.email}</div>
              </div>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#374151',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{meta.verifyLabel} *</label>
                <div style={{position:'relative'}}>
                  <Hash size={14} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}}/>
                  <input type="text" required value={code} onChange={e=>{setCode(e.target.value);setError('');}}
                    placeholder={meta.placeholder}
                    style={{width:'100%',paddingLeft:'32px',paddingRight:'10px',paddingTop:'10px',paddingBottom:'10px',fontSize:'12px',border:'1px solid #cbd5e1',borderRadius:'10px',outline:'none',fontFamily:'monospace',boxSizing:'border-box'}}/>
                </div>
                <p style={{fontSize:'10px',color:'#94a3b8',marginTop:'4px'}}>{meta.hint}</p>
              </div>
              <button type="submit"
                className={`${meta.color}`}
                style={{width:'100%',padding:'12px',borderRadius:'12px',border:'none',color:'white',fontSize:'12px',fontWeight:900,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                <ShieldCheck size={16}/> Verify &amp; Enter {meta.label} Portal
              </button>
            </form>
          )}

          {/* SUCCESS */}
          {done && (
            <div style={{textAlign:'center',padding:'24px 0'}}>
              <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#d1fae5',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                <ShieldCheck size={28} color="#059669"/>
              </div>
              <div style={{fontWeight:900,color:'#1e293b',fontSize:'16px'}}>Verified!</div>
              <div style={{fontSize:'12px',color:'#64748b',marginTop:'4px'}}>Opening {meta?.label} Portal...</div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{padding:'12px 24px',borderTop:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',fontSize:'10px',color:'#94a3b8'}}>
          <span style={{display:'flex',alignItems:'center',gap:'4px'}}><ShieldCheck size={10} color="#10b981"/> Secured Login</span>
          <span>1 Email = 1 Portal Only</span>
        </div>
      </div>
    </div>
  );
}