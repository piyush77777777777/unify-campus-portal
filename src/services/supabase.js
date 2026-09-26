// ═══════════════════════════════════════════════════════════
// UNIFY — Supabase Service
// Handles: gate_passes, complaints, notices, visitor_logs,
//          audit_logs, sos_alerts, anti_ragging_reports,
//          mess_reservations, assignments, quizzes
// Falls back to demo mode if no credentials are set.
// ═══════════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const IS_LIVE = SUPABASE_URL.startsWith('https://') && SUPABASE_KEY.length > 20;

let supabase = null;
if (IS_LIVE) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    realtime: { params: { eventsPerSecond: 10 } }
  });
  console.log('[UNIFY] 🗄️  Supabase connected →', SUPABASE_URL);
} else {
  console.log('[UNIFY] 📴  Supabase not configured — running in DEMO mode');
}

// ── Generic helper ────────────────────────────────────────────
const handle = async (promise) => {
  try {
    const { data, error } = await promise;
    if (error) { console.error('[Supabase]', error.message); return null; }
    return data;
  } catch (e) {
    console.error('[Supabase network]', e.message);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// GATE PASSES
// ─────────────────────────────────────────────────────────────
export const db = {

  /* ── Gate Passes ─────────────────────────────────────────── */
  gatePasses: {
    getAll: () => IS_LIVE
      ? handle(supabase.from('gate_passes').select('*').order('created_at', { ascending: false }))
      : null,

    create: (pass) => IS_LIVE
      ? handle(supabase.from('gate_passes').insert([pass]).select().single())
      : null,

    updateStatus: (id, status, approvedBy) => IS_LIVE
      ? handle(supabase.from('gate_passes').update({ status, approved_by: approvedBy, updated_at: new Date().toISOString() }).eq('id', id))
      : null,

    subscribe: (callback) => {
      if (!IS_LIVE) return null;
      return supabase.channel('gate_passes_live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'gate_passes' },
          payload => callback(payload))
        .subscribe();
    }
  },

  /* ── Complaints ──────────────────────────────────────────── */
  complaints: {
    getAll: () => IS_LIVE
      ? handle(supabase.from('complaints').select('*').order('created_at', { ascending: false }))
      : null,

    create: (complaint) => IS_LIVE
      ? handle(supabase.from('complaints').insert([complaint]).select().single())
      : null,

    updateStatus: (id, status, note) => IS_LIVE
      ? handle(supabase.from('complaints').update({ status, resolution_note: note, updated_at: new Date().toISOString() }).eq('id', id))
      : null,

    addRating: (id, rating, feedback) => IS_LIVE
      ? handle(supabase.from('complaints').update({ student_rating: rating, student_feedback: feedback }).eq('id', id))
      : null,

    subscribe: (callback) => {
      if (!IS_LIVE) return null;
      return supabase.channel('complaints_live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' },
          payload => callback(payload))
        .subscribe();
    }
  },

  /* ── Notices ─────────────────────────────────────────────── */
  notices: {
    getAll: () => IS_LIVE
      ? handle(supabase.from('notices').select('*').order('created_at', { ascending: false }))
      : null,

    create: (notice) => IS_LIVE
      ? handle(supabase.from('notices').insert([notice]).select().single())
      : null,

    markRead: (id) => IS_LIVE
      ? handle(supabase.from('notices').update({ has_user_acknowledged: true, read_receipts_count: supabase.raw('read_receipts_count + 1') }).eq('id', id))
      : null,

    subscribe: (callback) => {
      if (!IS_LIVE) return null;
      return supabase.channel('notices_live')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notices' },
          payload => callback(payload))
        .subscribe();
    }
  },

  /* ── Visitor Logs ────────────────────────────────────────── */
  visitorLogs: {
    getAll: () => IS_LIVE
      ? handle(supabase.from('visitor_logs').select('*').order('created_at', { ascending: false }))
      : null,

    create: (visitor) => IS_LIVE
      ? handle(supabase.from('visitor_logs').insert([visitor]).select().single())
      : null,

    logExit: (id, outTime) => IS_LIVE
      ? handle(supabase.from('visitor_logs').update({ out_time: outTime, status: 'CHECKED_OUT' }).eq('id', id))
      : null,
  },

  /* ── SOS Alerts ──────────────────────────────────────────── */
  sosAlerts: {
    send: (alert) => IS_LIVE
      ? handle(supabase.from('sos_alerts').insert([alert]).select().single())
      : null,

    getRecent: () => IS_LIVE
      ? handle(supabase.from('sos_alerts').select('*').order('created_at', { ascending: false }).limit(20))
      : null,

    acknowledge: (id) => IS_LIVE
      ? handle(supabase.from('sos_alerts').update({ status: 'ACKNOWLEDGED' }).eq('id', id))
      : null,

    subscribe: (callback) => {
      if (!IS_LIVE) return null;
      return supabase.channel('sos_live')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' },
          payload => callback(payload))
        .subscribe();
    }
  },

  /* ── Audit Logs ──────────────────────────────────────────── */
  auditLogs: {
    log: (actor, action, details, badgeColor = 'blue') => IS_LIVE
      ? handle(supabase.from('audit_logs').insert([{ actor, action, details, badge_color: badgeColor }]))
      : null,

    getAll: () => IS_LIVE
      ? handle(supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100))
      : null,
  },

  /* ── Anti-Ragging Reports ────────────────────────────────── */
  antiRagging: {
    submit: (report) => IS_LIVE
      ? handle(supabase.from('anti_ragging_reports').insert([report]).select().single())
      : null,

    getAll: () => IS_LIVE
      ? handle(supabase.from('anti_ragging_reports').select('*').order('created_at', { ascending: false }))
      : null,
  },

  /* ── Mess Reservations ───────────────────────────────────── */
  messReservations: {
    reserve: (regNo, date, mealType) => IS_LIVE
      ? handle(supabase.from('mess_reservations').upsert([{ reg_no: regNo, date, meal_type: mealType, reserved: true }]))
      : null,

    cancel: (regNo, date, mealType) => IS_LIVE
      ? handle(supabase.from('mess_reservations').update({ reserved: false }).match({ reg_no: regNo, date, meal_type: mealType }))
      : null,

    getForDate: (date) => IS_LIVE
      ? handle(supabase.from('mess_reservations').select('*').eq('date', date))
      : null,
  },

  /* ── Assignments ─────────────────────────────────────────── */
  assignments: {
    getAll: (regNo) => IS_LIVE
      ? handle(supabase.from('assignments').select('*').or(`target_reg.eq.${regNo},target_reg.is.null`))
      : null,

    create: (assignment) => IS_LIVE
      ? handle(supabase.from('assignments').insert([assignment]).select().single())
      : null,

    updateProgress: (id, progress, status) => IS_LIVE
      ? handle(supabase.from('assignments').update({ progress, status }).eq('id', id))
      : null,
  },

  /* ── Quizzes / Polls ─────────────────────────────────────── */
  quizzes: {
    create: (quiz) => IS_LIVE
      ? handle(supabase.from('quizzes').insert([quiz]).select().single())
      : null,

    setActive: (id, isActive) => IS_LIVE
      ? handle(supabase.from('quizzes').update({ is_active: isActive }).eq('id', id))
      : null,

    submitResponse: (id, optionIndex) => IS_LIVE
      ? handle(supabase.rpc('increment_quiz_response', { quiz_id: id, option_idx: optionIndex }))
      : null,

    getActive: () => IS_LIVE
      ? handle(supabase.from('quizzes').select('*').eq('is_active', true))
      : null,

    subscribe: (callback) => {
      if (!IS_LIVE) return null;
      return supabase.channel('quizzes_live')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quizzes' },
          payload => callback(payload))
        .subscribe();
    }
  },
};

export const isSupabaseLive = IS_LIVE;
export default supabase;