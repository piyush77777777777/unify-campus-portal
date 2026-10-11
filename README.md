# UNIFY — Smart Campus Management Portal

> **UNIFY** is a comprehensive, role-based smart campus management system built for modern educational institutions.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://piyush77777777777.github.io/unify-campus-portal/)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Version](https://img.shields.io/badge/Version-3.1-success?style=for-the-badge)](https://github.com/piyush77777777777/unify-campus-portal)

---

## 🚀 Live Demo

**[https://piyush77777777777.github.io/unify-campus-portal/](https://piyush77777777777.github.io/unify-campus-portal/)**

---

## ✨ Features

### 🗺 3D Campus Navigation (NEW)
- Interactive campus map with 7 buildings — Academic, CSE/IT, Library, Admin, Hostel, Mess, Sports
- Real building photos + floor-by-floor photo explorer
- Turn-by-turn navigation from Main Gate to any classroom/lab
- Live animated route path, compass rose, scale bar
- Floor plan with room details per floor

### 📅 Smart Timetable System (NEW)
- Full weekly class schedule with room number, block, floor & teacher
- Live "ONGOING" / "UPCOMING" class indicators
- Next class alert with location details
- One-tap navigation to classroom

### 🚫 Disciplinary Actions & Fines (NEW — Warden Portal)
- Issue fines for misconduct (drinking, smoking, gate pass violations, ragging)
- Auto-notifies parents via SMS & Email on fine issuance
- Case severity levels: CRITICAL / HIGH / MEDIUM / LOW
- Full disciplinary record with timestamps

### 📋 Per-Class Attendance (NEW — Teacher Portal)
- Mark attendance per class session (no QR code needed)
- Present / Absent / Late buttons per student
- Live attendance percentage with below-cutoff alerts
- Session-wise roll call with search

### ⭐ Teacher Feedback System (NEW)
- Only students with 75%+ attendance can submit feedback
- 5-star rating across 5 criteria (Teaching, Punctuality, Knowledge, Support, Material)
- Anonymous submission option
- Locked with clear message for below-75% students

### 🎫 Gate Pass System
- Students request outgoing/incoming passes
- Warden approves/rejects with one click
- Security guard verifies at gate with QR scan simulation
- Parent notified on every gate pass activity
- Overdue detection with alerts

### 📢 Notice Board
- Role-based notice publishing (Warden, Principal, Teacher)
- Priority levels and acknowledgement tracking
- Real-time unread badge count

### 🍽 Mess Management
- Today's menu (Breakfast / Lunch / Dinner)
- Weekly reservation headcounts
- Mess manager dashboard with inventory

### 🚌 Bus Tracker
- Live route visualization for 3 bus lines
- Real-time ETA countdown
- Occupancy percentage display
- All-routes quick view

### 🔒 Multi-Role Authentication
- 7 distinct portals — Student, Teacher, Warden, Guard, Mess Manager, Parent, Principal
- Email-to-role locking (one email = one role)
- Persistent login with localStorage session management

### 🤖 AI Analytics Dashboard
- Campus-wide insights and trends
- Complaint heatmaps, attendance trends
- Principal command view with department-wise stats

---

## 🔐 Demo Login Credentials

| Portal | Email | Code |
|--------|-------|------|
| Student | `piyush@igit.ac.in` | `2201106145` |
| Teacher | `avinash@igit.ac.in` | `FAC-001` |
| Warden | `warden@igit.ac.in` | `WAR-01` |
| Security Guard | `guard@igit.ac.in` | `SEC-01` |
| Mess Manager | `mess@igit.ac.in` | `MESS-01` |
| Parent | `parent@gmail.com` | `2201106145` |
| Principal | `principal@igit.ac.in` | `PRIN-01` |

### How to Login
1. Open the live URL
2. Click any **portal card** on the landing page
3. Enter the email and code from the table above
4. Explore the dashboard!

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite 8 |
| Styling | TailwindCSS |
| Icons | Lucide React |
| Maps | Custom SVG (no API key needed) |
| State Management | React Context API |
| Storage | localStorage (demo mode) |
| Deployment | GitHub Pages + GitHub Actions |
| Backend Ready | Supabase + Firebase (configurable) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── campus/          # CampusNav3D, BusTracker, CalendarView
│   ├── student/         # Dashboard, GatePass, MessView, SmartTimetable, TeacherFeedback
│   ├── teacher/         # TeacherDashboard, ClassAttendance
│   ├── warden/          # DisciplinaryActions
│   ├── admin/           # AdminDashboard
│   ├── parent/          # ParentPortal
│   ├── principal/       # PrincipalPortal
│   ├── security/        # GuardTerminal
│   ├── notices/         # NoticeBoard
│   ├── auth/            # GoogleAuthModal, EmailReceiptModal
│   └── common/          # Sidebar, Navbar, TopHeader, Toast
├── context/             # CampusContext, LanguageContext, NetworkContext
├── data/                # initialData.js (all demo data)
└── services/            # firebase.js, supabase.js (configurable)
```

---

## 🚀 Run Locally

```bash
git clone https://github.com/piyush77777777777/unify-campus-portal.git
cd unify-campus-portal
npm install
npm run dev
# Opens at http://localhost:5173/unify-campus-portal/
```

---

## 👨‍💻 Developer

**Piyush Kumar Dey**
Registration No: `260310533838`
Team: **BUG FINDERS**

---

## 📄 License

MIT License — Free to use and modify.