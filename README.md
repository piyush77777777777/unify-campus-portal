# UNIFY — Smart Campus Portal

## How to Run

### Step 1: Open this folder in VS Code
```
File → Open Folder → Select this folder (campusos)
```

### Step 2: Open Terminal in VS Code (Ctrl + `)
```bash
npm install
```

### Step 3: Start the development server
```bash
npm run dev -- --host
```

### Step 4: Open in browser
- Local:   http://localhost:5173
- Network (phone on same WiFi): http://<your-ip>:5173

---

## Login Credentials (for demo)

| Portal           | Email                          | Verification Code     |
|------------------|--------------------------------|-----------------------|
| Student          | piyush.mohapatra@campus.edu    | 2201106145            |
| Faculty/Teacher  | prof.verma@campus.edu          | FAC-CSE-045           |
| Hostel Warden    | warden.nayak@campus.edu        | WRD-2024-001          |
| Security Guard   | security.gate@campus.edu       | SEC-GATE-01           |
| Mess Supervisor  | mess.supervisor@campus.edu     | MESS-STAFF-007        |
| Parent/Guardian  | ramesh.mohapatra@gmail.com     | 2201106145            |
| Principal        | principal@campus.edu           | ADMIN-PRINCIPAL-01    |

---

## Tech Stack
- **React 19** + **Vite 8**
- **TailwindCSS 3**
- No backend — all data simulated in context

## Project Structure
```
src/
  components/
    auth/        → Google Sign-In modal
    landing/     → Landing page
    student/     → Student dashboard, gate pass, SOS
    teacher/     → Faculty portal
    parent/      → Parent portal + bus tracker
    principal/   → Principal portal
    admin/       → Warden/Admin dashboard
    security/    → Guard terminal
    campus/      → Bus tracker, calendar
    common/      → Sidebar, TopHeader, MobileBottomNav
    notices/     → Notice board
  context/       → App state (CampusContext, NetworkContext)
  data/          → Initial mock data
```