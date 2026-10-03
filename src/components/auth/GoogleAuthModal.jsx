import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { X, ShieldCheck, Mail, ArrowRight, AlertTriangle, Hash } from 'lucide-react';

function getEmailRoleMap() {
  try { return JSON.parse(localStorage.getItem('unify_email_role_map') || '{}'); }
  catch { return {}; }
}
function saveEmailRoleMap(map) {
  localStorage.setItem('unify_email_role_map', JSON.stringify(map));
}

const ROLE_META = {
  student:     { label: 'Student',           color: 'bg-blue-600',    emoji: '🎓', verifyLabel: 'Registration Number',   verifyPlaceholder: '2201106145',        hint: 'Enter your university registration number' },
  teacher:     { label: 'Faculty / Teacher', color: 'bg-purple-600',  emoji: '📚', verifyLabel: 'Employee ID',           verifyPlaceholder: 'FAC-001',           hint: 'Enter your faculty employee ID' },
  warden:      { label: 'Hostel Warden',     color: 'bg-indigo-600',  emoji: '🏠', verifyLabel: 'Warden ID',             verifyPlaceholder: 'WAR-01',            hint: 'Enter your official warden ID' },
  guard:       { label: 'Security Guard',    color: 'bg-amber-600',   emoji: '🛡️', verifyLabel: 'Badge / Guard ID',      verifyPlaceholder: 'SEC-01',            hint: 'Enter your security badge number' },
  messManager: { label: 'Mess Supervisor',   color: 'bg-emerald-600', emoji: '🍽️', verifyLabel: 'Mess Staff ID',         verifyPlaceholder: 'MESS-01',           hint: 'Enter your mess staff ID' },
  parent:      { label: 'Parent / Guardian', color: 'bg-teal-600',    emoji: '👨‍👩‍👧', verifyLabel: "Ward's Reg. Number",  verifyPlaceholder: '2201106145',        hint: "Enter your ward's registration number" },
  principal:   { label: 'Principal',         color: 'bg-rose-700',    emoji: '🎯', verifyLabel: 'Principal Office ID',   verifyPlaceholder: 'PRIN-01',           hint: 'Enter your principal office ID' }
};

// DEMO ACCOUNTS — these show as clickable cards in step 2
const PORTAL_ACCOUNTS = [
  { role: 'student',     name: 'Piyush Kumar Dey',    email: 'piyush@igit.ac.in',       verifyCode: '2201106145' },
  { role: 'teacher',     name: 'Prof. Ananya Verma',  email: 'avinash@igit.ac.in',      verifyCode: 'FAC-001' },
  { role: 'warden',      name: 'Dr. S. K. Nayak',     email: 'warden@igit.ac.in',       verifyCode: 'WAR-01' },
  { role: 'guard',       name: 'Subedar Ram Singh',   email: 'guard@igit.ac.in',        verifyCode: 'SEC-01' },
  { role: 'messManager', name: 'Bikram Das',           email: 'mess@igit.ac.in',         verifyCode: 'MESS-01' },
  { role: 'parent',      name: 'Mr. Ramesh Dey',      email: 'parent@gmail.com',        verifyCode: '2201106145' },
  { role: 'principal',   name: 'Prof. D. K. Mishra',  email: 'principal@igit.ac.in',    verifyCode: 'PRIN-01' }
];

export default function GoogleAuthModal({ isOpen, onClose, onLogin, initialRole = null }) {
  const { loginWithGoogle, initialPersonas } = useCampus();

  const [step, setStep]                   = useState('role');
  const [selectedRole, setSelectedRole]   = useState(null);
  const [meta, setMeta]                   = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [verifyCode, setVerifyCode]       = useState('');
  const [error, setError]                 = useState('');
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [customEmail, setCustomEmail]     = useState('');
  const [customName, setCustomName]       = useState('');
  const [success, setSuccess]             = useState(false);

  // When initialRole prop changes (user clicked a specific portal card), skip step 1
  useEffect(() => {
    if (initialRole && ROLE_META[initialRole]) {
      setSelectedRole(initialRole);
      setMeta(ROLE_META[initialRole]);
      setStep('google');
    } else {
      setStep('role');
      setSelectedRole(null);
      setMeta(null);
    }
    setError('');
    setVerifyCode('');
    setSuccess(false);
    setSelectedAccount(null);
    setUseCustomEmail(false);
    setCustomEmail('');
    setCustomName('');
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  // Accounts filtered for this role
  const portalAccounts = PORTAL_ACCOUNTS.filter(a => a.role === selectedRole);

  const handleClose = () => {
    setStep('role'); setSelectedRole(null); setMeta(null);
    setSelectedAccount(null); setVerifyCode(''); setError('');
    setUseCustomEmail(false); setCustomEmail(''); setCustomName('');
    setSuccess(false);
    if (onClose) onClose();
  };

  // Step 1 → Step 2
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setMeta(ROLE_META[role]);
    setError('');
    setStep('google');
  };

  // Step 2 → Step 3 (preset account clicked)
  const handleAccountSelect = (acc) => {
    const map = getEmailRoleMap();
    const existingRole = map[acc.email.toLowerCase()];
    if (existingRole && existingRole !== acc.role) {
      setError(`This email is already registered to the ${ROLE_META[existingRole]?.label || existingRole} portal.`);
      return;
    }
    setSelectedAccount(acc);
    setError('');
    setStep('verify');
  };

  // Step 2 → Step 3 (custom email)
  const handleCustomNext = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const map = getEmailRoleMap();
    const existingRole = map[customEmail.toLowerCase()];
    if (existingRole && existingRole !== selectedRole) {
      setError(`This email is already registered to the ${ROLE_META[existingRole]?.label || existingRole} portal.`);
      return;
    }
    setSelectedAccount({ role: selectedRole, name: customName || customEmail.split('@')[0], email: customEmail });
    setError('');
    setStep('verify');
  };

  // Step 3 — verify identity code
  const handleVerify = (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) {
      setError(`Please enter your ${meta?.verifyLabel}.`);
      return;
    }
    const acc = selectedAccount;
    const preset = PORTAL_ACCOUNTS.find(a => a.email.toLowerCase() === acc.email.toLowerCase());
    // If it's a preset account, check the code. If custom email, any code works (demo).
    if (preset && verifyCode.trim().toLowerCase() !== preset.verifyCode.toLowerCase()) {
      setError(`Incorrect ${meta?.verifyLabel}. Hint: try "${preset.verifyCode}"`);
      return;
    }
    // All good — save email→role map and login
    const map = getEmailRoleMap();
    map[acc.email.toLowerCase()] = acc.role;
    saveEmailRoleMap(map);
    setSuccess(true);
    setTimeout(() => {
      if (onLogin) onLogin(acc.role, acc);
      else if (loginWithGoogle) loginWithGoogle(acc.role, acc);
      handleClose();
    }, 1200);
  };

  const m = meta;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in">

        {/* Header */}
        <div className={`${m?.color || 'bg-slate-800'} text-white px-6 py-5 relative`}>
          <button onClick={handleClose}
            className="absolute right-4 top-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">{m?.emoji || '🔐'}</div>
            <div>
              <div className="font-black text-base">{m ? `${m.label} Portal` : 'UNIFY Login'}</div>
              <div className="text-xs text-white/75 mt-0.5">
                {step === 'role' ? 'Select your portal to continue' :
                 step === 'google' ? 'Choose your account' :
                 step === 'verify' ? 'Verify your identity' : 'Welcome!'}
              </div>
            </div>
          </div>
          {/* Step dots */}
          <div className="flex gap-1.5 mt-4">
            {['role','google','verify'].map((s,i) => (
              <div key={s} className={`h-1 rounded-full flex-1 transition-all ${
                step === s ? 'bg-white' : ['role','google','verify'].indexOf(step) > i ? 'bg-white/60' : 'bg-white/20'
              }`}/>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <div className="px-6 py-5 space-y-3">

          {/* ── STEP 1: Pick role ── */}
          {step === 'role' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-semibold">Who are you? Select your portal:</p>
              {Object.entries(ROLE_META).map(([role, rm]) => (
                <button key={role} onClick={() => handleRoleSelect(role)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                  <div className={`w-9 h-9 rounded-xl ${rm.color} text-white flex items-center justify-center text-base flex-shrink-0`}>
                    {rm.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{rm.label}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 2: Pick account ── */}
          {step === 'google' && m && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {!initialRole && (
                  <button onClick={() => { setStep('role'); setError(''); }}
                    className="text-[11px] text-blue-600 font-bold hover:underline">← Back</button>
                )}
                <span className="text-xs text-slate-500">Signing in as: <strong className="text-slate-800">{m.emoji} {m.label}</strong></span>
              </div>

              {!useCustomEmail ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">Select a demo account:</p>
                  {portalAccounts.map((acc, i) => (
                    <button key={i} onClick={() => handleAccountSelect(acc)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-all text-left group">
                      <div className={`w-9 h-9 rounded-xl ${m.color} text-white flex items-center justify-center text-base flex-shrink-0`}>
                        {m.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{acc.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                  ))}
                  <button onClick={() => setUseCustomEmail(true)}
                    className="w-full text-center text-[11px] text-blue-600 font-bold py-1.5 hover:underline">
                    + Use a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomNext} className="space-y-3">
                  <p className="text-[11px] text-slate-500">Enter your email for the {m.label} portal:</p>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input type="email" required value={customEmail}
                      onChange={e => { setCustomEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <input type="text" value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setUseCustomEmail(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold">Back</button>
                    <button type="submit"
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                      Continue →
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── STEP 3: Verify identity ── */}
          {step === 'verify' && m && selectedAccount && !success && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setStep('google'); setError(''); setVerifyCode(''); }}
                  className="text-[11px] text-blue-600 font-bold hover:underline">← Back</button>
                <span className="text-xs text-slate-500">Verifying: <strong>{selectedAccount.name}</strong></span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-sm font-black text-slate-900">{m.label} Verification</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{selectedAccount.email}</div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {m.verifyLabel} *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" required value={verifyCode}
                    onChange={e => { setVerifyCode(e.target.value); setError(''); }}
                    placeholder={m.verifyPlaceholder}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{m.hint}</p>
              </div>

              <button type="submit"
                className={`w-full py-3 rounded-xl ${m.color} hover:opacity-90 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md`}>
                <ShieldCheck className="w-4 h-4" />
                Verify & Enter {m.label} Portal
              </button>
            </form>
          )}

          {/* ── SUCCESS ── */}
          {success && (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="font-black text-slate-900">Identity Verified!</div>
              <div className="text-xs text-slate-500">Entering {m?.label} Portal...</div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Secured Login</span>
          <span>1 Email → 1 Portal Only</span>
        </div>
      </div>
    </div>
  );
}