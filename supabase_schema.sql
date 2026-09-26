-- ═══════════════════════════════════════════════════════════════
-- UNIFY Campus Management System — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. GATE PASSES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gate_passes (
  id             TEXT PRIMARY KEY DEFAULT 'GP-' || to_char(now(),'YYYY') || '-' || floor(random()*9000+1000)::text,
  student_name   TEXT NOT NULL,
  reg_no         TEXT NOT NULL,
  room           TEXT NOT NULL,
  destination    TEXT NOT NULL,
  purpose        TEXT NOT NULL,
  out_time       TEXT,
  expected_in_time TEXT,
  status         TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','CHECKED_OUT','RETURNED','OVERDUE')),
  approved_by    TEXT,
  approval_chain TEXT[] DEFAULT '{}',
  qr_token       TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  emergency_phone TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. COMPLAINTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
  id               TEXT PRIMARY KEY DEFAULT 'COMP-' || floor(random()*9000+1000)::text,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  category         TEXT NOT NULL,
  urgency          TEXT DEFAULT 'NORMAL' CHECK (urgency IN ('LOW','NORMAL','MEDIUM','HIGH','CRITICAL')),
  status           TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_PROGRESS','ESCALATED','RESOLVED','CLOSED')),
  location         TEXT,
  block            TEXT,
  room_no          TEXT,
  reported_by      TEXT,
  assigned_to      TEXT,
  reported_days_ago INT DEFAULT 0,
  resolution_note  TEXT,
  student_rating   INT CHECK (student_rating BETWEEN 1 AND 5),
  student_feedback TEXT,
  images           TEXT[] DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. NOTICES / ANNOUNCEMENTS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS notices (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               TEXT NOT NULL,
  content             TEXT NOT NULL,
  priority            TEXT DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL','MEDIUM','HIGH')),
  target              TEXT DEFAULT 'All Students',
  sender              TEXT NOT NULL,
  sender_role         TEXT,
  channels            TEXT[] DEFAULT '{FCM Push}',
  action_required     BOOLEAN DEFAULT FALSE,
  has_user_acknowledged BOOLEAN DEFAULT FALSE,
  read_receipts_count INT DEFAULT 0,
  total_target_users  INT DEFAULT 440,
  quiet_hours_exempt  BOOLEAN DEFAULT FALSE,
  scheduled_at        TIMESTAMPTZ,
  published_at        TIMESTAMPTZ DEFAULT NOW(),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. VISITOR LOGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitor_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_name  TEXT NOT NULL,
  phone         TEXT NOT NULL,
  relation      TEXT,
  visiting      TEXT NOT NULL,
  purpose       TEXT,
  vehicle_no    TEXT DEFAULT 'N/A',
  pass_badge    TEXT UNIQUE DEFAULT 'VIS-' || floor(random()*9000+1000)::text,
  in_time       TEXT,
  out_time      TEXT,
  status        TEXT DEFAULT 'ON_CAMPUS' CHECK (status IN ('ON_CAMPUS','CHECKED_OUT','PRE_REGISTERED')),
  guard_name    TEXT,
  photo_url     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. AUDIT LOGS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor       TEXT NOT NULL,
  action      TEXT NOT NULL,
  details     TEXT,
  badge_color TEXT DEFAULT 'blue',
  related_id  TEXT,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. SOS ALERTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sos_alerts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  reg_no       TEXT NOT NULL,
  room         TEXT,
  latitude     FLOAT,
  longitude    FLOAT,
  address      TEXT,
  status       TEXT DEFAULT 'SENT' CHECK (status IN ('SENT','ACKNOWLEDGED','RESOLVED')),
  recipients   JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. ANTI-RAGGING REPORTS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS anti_ragging_reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type          TEXT NOT NULL,
  location      TEXT NOT NULL,
  description   TEXT,
  anonymous     BOOLEAN DEFAULT TRUE,
  reporter_reg  TEXT,
  status        TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED','INVESTIGATING','RESOLVED')),
  action_taken  TEXT,
  assigned_to   TEXT DEFAULT 'Dean of Student Welfare',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. MESS RESERVATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mess_reservations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reg_no      TEXT NOT NULL,
  date        DATE NOT NULL,
  meal_type   TEXT NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner')),
  reserved    BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reg_no, date, meal_type)
);

-- ── 9. ASSIGNMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  faculty     TEXT,
  deadline    TEXT,
  weight      TEXT,
  status      TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','IN_REVIEW','SUBMITTED','GRADED')),
  progress    INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  target_reg  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. QUIZ / POLLS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quizzes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject        TEXT NOT NULL,
  question       TEXT NOT NULL,
  options        TEXT[] NOT NULL,
  correct_index  INT,
  results        INT[] DEFAULT '{0,0,0,0}',
  total_responses INT DEFAULT 0,
  is_active      BOOLEAN DEFAULT FALSE,
  faculty_id     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RLS) ────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE gate_passes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices              ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE anti_ragging_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_reservations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes              ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write for demo (tighten per role for production)
CREATE POLICY "Allow all for anon" ON gate_passes          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON complaints           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON notices              FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON visitor_logs         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON audit_logs           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON sos_alerts           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON anti_ragging_reports FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON mess_reservations    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON assignments          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON quizzes              FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── REAL-TIME SUBSCRIPTIONS ─────────────────────────────────────
-- Enable real-time for live tables
ALTER PUBLICATION supabase_realtime ADD TABLE gate_passes;
ALTER PUBLICATION supabase_realtime ADD TABLE complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE notices;
ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE visitor_logs;

-- ── SEED DATA — Sample Notices ──────────────────────────────────
INSERT INTO notices (title, content, priority, target, sender, channels, action_required, read_receipts_count, total_target_users) VALUES
('Semester Exam Timetable Released', 'End semester exams start from October 15th. Check the academic portal for your full exam schedule.', 'HIGH', 'All Students', 'Academic Section', '{FCM Push,SMS,Email}', true, 312, 440),
('Hostel Room Inspection — Block B', 'Routine inspection on Sep 28 at 10 AM. Ensure rooms are clean and assets are in proper condition.', 'MEDIUM', 'Hostel Residents', 'Chief Warden', '{FCM Push,SMS}', false, 89, 180),
('Mess Menu Updated for October', 'New monthly mess menu has been uploaded. Check the Mess section for daily schedules and nutritional info.', 'NORMAL', 'All Students', 'Mess Supervisor', '{FCM Push}', false, 201, 440);

-- Done! Your UNIFY database is ready.
SELECT 'UNIFY Database Schema created successfully!' AS status;