# 🗄️ UNIFY — Database Setup Guide

## Architecture

```
UNIFY App
   ├── Supabase (PostgreSQL)     → Structured data (persistent)
   │     ├── gate_passes
   │     ├── complaints
   │     ├── notices
   │     ├── visitor_logs
   │     ├── audit_logs
   │     ├── sos_alerts
   │     ├── anti_ragging_reports
   │     ├── mess_reservations
   │     ├── assignments
   │     └── quizzes
   │
   └── Firebase                  → Real-time + Push notifications
         ├── Firestore (real-time SOS, quiz results, complaint updates)
         ├── FCM (push notifications to mobile/browser)
         └── Google Auth (sign-in)
```

> **Demo Mode:** App works fully offline with mock data even without credentials.

---

## ─── STEP 1: Supabase Setup ───────────────────────────────

### 1. Create Project
1. Go to → https://supabase.com
2. Click **New Project**
3. Project name: `unify-campus`
4. Choose a region closest to Odisha (Mumbai / Singapore)
5. Set a database password → **Save it**

### 2. Run Schema SQL
1. Go to → **SQL Editor** → **New Query**
2. Open `supabase_schema.sql` from your project folder
3. Paste the entire contents → Click **Run**
4. You should see: `UNIFY Database Schema created successfully!`

### 3. Get API Keys
1. Go to → **Project Settings** → **API**
2. Copy:
   - `Project URL` → paste as `VITE_SUPABASE_URL`
   - `anon/public` key → paste as `VITE_SUPABASE_ANON_KEY`

---

## ─── STEP 2: Firebase Setup ────────────────────────────────

### 1. Create Project
1. Go to → https://console.firebase.google.com
2. Click **Add Project** → Name: `unify-campus`
3. Enable Google Analytics (optional)

### 2. Add Web App
1. In Firebase Console → Click the **</>** (Web) icon
2. App nickname: `UNIFY Web`
3. Enable **Firebase Hosting** (optional)
4. Copy the config values

### 3. Enable Services
- **Authentication** → Sign-in Method → Enable **Google**
- **Firestore Database** → Create database → **Start in test mode**
- **Cloud Messaging** → Generate **Web Push Certificate** → Copy VAPID key

---

## ─── STEP 3: Add .env File ─────────────────────────────────

Create `.env` file in project root (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123...
VITE_FIREBASE_VAPID_KEY=BK9hXxx...
VITE_APP_MODE=live
```

---

## ─── STEP 4: Run the Project ───────────────────────────────

```bash
npm install
npm run dev -- --host
```

Open: http://localhost:5173

### ✅ How to verify it's working

When Supabase is connected you'll see in browser console:
```
[UNIFY] 🗄️  Supabase connected → https://xxx.supabase.co
[UNIFY] Supabase data loaded
[UNIFY] 🔥 Firebase connected → Project: unify-campus
[UNIFY] FCM ready
```

When in demo mode:
```
[UNIFY] 📴  Supabase not configured — running in DEMO mode
[UNIFY] 📴  Firebase not configured — running in DEMO mode
```

---

## ─── What Data Goes Where ──────────────────────────────────

| Action | Where stored |
|--------|-------------|
| Student files gate pass | Supabase `gate_passes` |
| Student submits complaint | Supabase `complaints` |
| Warden publishes notice | Supabase `notices` |
| Guard logs visitor | Supabase `visitor_logs` |
| Student presses SOS | Supabase `sos_alerts` + Firebase Firestore (real-time) |
| Anti-ragging report | Supabase `anti_ragging_reports` |
| Mess reservation | Supabase `mess_reservations` |
| Assignment submission | Supabase `assignments` |
| Teacher launches quiz | Supabase `quizzes` + Firebase Firestore (real-time results) |
| Push notification sent | Firebase FCM |
| Login with Google | Firebase Auth |
| Every action | Supabase `audit_logs` |

---

## ─── Netlify Deployment ─────────────────────────────────────

Add all env variables in:
**Netlify → Site Settings → Environment Variables**

Then trigger a new deploy — your live site will connect to real DB. 🚀