// initialData.js - Smart Campus OS unified data layer

export const initialPersonas = {
  student: {
    id: "STU-2022-CSE-045",
    name: "Piyush Mohapatra",
    role: "student",
    regNo: "2201106145",
    branch: "Computer Science & Engineering",
    year: "3rd Year (6th Sem)",
    hostel: "Aryabhatta Hall of Residence",
    room: "B-304",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98765 43210",
    guardianPhone: "+91 94370 12345",
    citizenScore: 340,
    citizenLevel: "Silver",
    attendance: {
      overall: 84.5,
      required: 75,
      safeBunksRemaining: 6,
      subjects: [
        { code: "CST301", name: "Operating Systems", attended: 36, total: 40, percentage: 90 },
        { code: "CST302", name: "Database Management Systems", attended: 32, total: 38, percentage: 84.2 },
        { code: "CST303", name: "Design & Analysis of Algorithms", attended: 28, total: 35, percentage: 80.0 },
        { code: "CST304", name: "Computer Networks", attended: 29, total: 36, percentage: 80.5 }
      ]
    },
    dues: {
      collegeFee: 0,
      hostelRent: 0,
      messDues: 3200,
      libraryFine: 0,
      isCleared: false
    }
  },
  warden: {
    id: "FAC-WARDEN-01",
    name: "Dr. S. K. Nayak",
    role: "warden",
    title: "Chief Warden & Professor (Dept. of CSE)",
    department: "Hostel Administration & Student Welfare",
    hostelManaged: "Aryabhatta Hall of Residence",
    phone: "+91 94371 99887",
    email: "warden.aryabhatta@campus.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  guard: {
    id: "SEC-GATE-04",
    name: "Subedar Ram Singh",
    role: "guard",
    title: "Chief Security Officer",
    post: "North Main Gate & Gatehouse 1",
    shift: "08:00 - 20:00",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  messManager: {
    id: "MESS-SUP-02",
    name: "Bikram Das",
    role: "messManager",
    title: "Annapurna Mess Incharge & Food Quality Supervisor",
    canteen: "Aryabhatta Central Mess",
    phone: "+91 98610 55432",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  teacher: {
    id: "FAC-CSE-09",
    name: "Prof. Ananya Verma",
    role: "teacher",
    title: "Associate Professor (Dept. of CSE)",
    department: "Computer Science & Engineering",
    email: "prof.verma@campus.edu",
    phone: "+91 94371 11223",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    classes: [
      { code: "CST301", name: "Operating Systems", section: "CSE-A", totalStudents: 60, avgAttendance: 82 },
      { code: "CST303", name: "Design & Analysis of Algorithms", section: "CSE-B", totalStudents: 58, avgAttendance: 76 },
      { code: "CST401", name: "Machine Learning", section: "CSE-A", totalStudents: 55, avgAttendance: 88 }
    ],
    workload: {
      weeklyHours: 18,
      labHours: 6,
      leaveBalance: { casual: 8, sick: 10, duty: 5 },
      substitutionsThisSem: 2
    }
  },
  parent: {
    id: "PAR-2022-CSE-045",
    name: "Mr. Ramesh Mohapatra",
    role: "parent",
    title: "Parent / Guardian",
    wardName: "Piyush Mohapatra",
    wardRegNo: "2201106145",
    wardRoom: "B-304",
    wardBranch: "Computer Science & Engineering",
    phone: "+91 94370 12345",
    email: "ramesh.mohapatra@gmail.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  },
  principal: {
    id: "ADMIN-PRINCIPAL-01",
    name: "Prof. D. K. Mishra",
    role: "principal",
    title: "Principal & Director",
    department: "Office of the Principal",
    email: "principal@campus.edu",
    phone: "+91 94371 00001",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  }
};

export const initialGatePasses = [
  {
    id: "GP-2026-8891",
    studentId: "STU-2022-CSE-045",
    studentName: "Piyush Mohapatra",
    regNo: "2201106145",
    room: "B-304",
    passType: "Day Outing",
    destination: "Rourkela Main Market (Books & Project Kit)",
    outTime: "Today, 17:00",
    expectedInTime: "Today, 20:30",
    actualOutTime: null,
    actualInTime: null,
    status: "APPROVED",
    approvedBy: "Dr. S. K. Nayak",
    approvedAt: "Today, 14:15",
    approvalChain: ["Warden: Approved", "First-Aid: N/A", "Dean: Auto-Cleared"],
    qrToken: "UNIFY-GP-2026-8891-SECURE-98X",
    guardianAlertSent: true,
    emergencyPhone: "+91 94370 12345",
    remarks: "Permitted for academic supplies purchase."
  },
  {
    id: "GP-2026-8890",
    studentId: "STU-2022-EE-089",
    studentName: "Ananya Mishra",
    regNo: "2201106230",
    room: "KC-201",
    passType: "Weekend Home Visit",
    destination: "Bhubaneswar Home",
    outTime: "Yesterday, 16:00",
    expectedInTime: "Sunday, 21:00",
    actualOutTime: "Yesterday, 16:22",
    actualInTime: null,
    status: "CHECKED_OUT",
    approvedBy: "Dr. S. K. Nayak",
    approvedAt: "Yesterday, 11:30",
    approvalChain: ["Warden: Approved", "Dean: Approved"],
    qrToken: "UNIFY-GP-2026-8890-SECURE-42Y",
    guardianAlertSent: true,
    emergencyPhone: "+91 98612 34567",
    remarks: "Weekend leave granted."
  },
  {
    id: "GP-2026-8884",
    studentId: "STU-2022-ME-012",
    studentName: "Rohan Samal",
    regNo: "2201106098",
    room: "A-112",
    passType: "Day Outing",
    destination: "Railway Station pickup",
    outTime: "Yesterday, 18:00",
    expectedInTime: "Yesterday, 20:30",
    actualOutTime: "Yesterday, 18:05",
    actualInTime: "Yesterday, 22:15",
    status: "OVERDUE",
    approvedBy: "Dr. S. K. Nayak",
    approvedAt: "Yesterday, 15:00",
    approvalChain: ["Warden: Approved"],
    qrToken: "UNIFY-GP-2026-8884-SECURE-11Z",
    guardianAlertSent: true,
    emergencyPhone: "+91 94375 66778",
    remarks: "Returned 1 hr 45 min past curfew without prior notice."
  },
  {
    id: "GP-2026-8895",
    studentId: "STU-2022-CSE-045",
    studentName: "Piyush Mohapatra",
    regNo: "2201106145",
    room: "B-304",
    passType: "Health & Infirmary Leave",
    destination: "Campus Health Center / Ispat General Hospital",
    outTime: "Today, 10:30",
    expectedInTime: "Today, 14:00",
    actualOutTime: null,
    actualInTime: null,
    status: "APPROVED",
    approvedBy: "Dr. S. K. Nayak & Dr. P. Mohanty (Campus Physician)",
    approvedAt: "Today, 10:15",
    approvalChain: ["First-Aid: Cleared", "Warden: Approved"],
    qrToken: "UNIFY-HL-2026-8895-MED-SAFE",
    guardianAlertSent: true,
    emergencyPhone: "+91 94370 12345",
    remarks: "Medical checkup pass issued with infirmary logging."
  }
];

export const initialComplaints = [
  {
    id: "CMP-2026-0042",
    title: "Hostel tap leaking continuously for 9 days",
    description: "The main washroom tap in 3rd Floor Wing B has been leaking for 9 days. Constant water wastage and slipping hazard. Needs immediate plumber washer replacement.",
    category: "Plumbing",
    location: "Aryabhatta Hall - Block B, 3rd Floor Washroom",
    urgency: "HIGH",
    reportedBy: "Piyush Mohapatra (B-304)",
    studentId: "STU-2022-CSE-045",
    reportedDaysAgo: 9,
    reportedDate: "2026-09-16",
    status: "ESCALATED",
    assignedTo: "Manoj Rout (Head Plumber)",
    slaBreached: true,
    slaTargetHours: 24,
    escalationLevel: "Level 2: Chief Warden Attention",
    photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
    studentRating: null,
    studentFeedback: null,
    timeline: [
      { timestamp: "9 days ago (Sep 16)", note: "Ticket filed by student via app", author: "Student" },
      { timestamp: "7 days ago (Sep 18)", note: "Assigned to Maintenance Plumber pool", author: "AI Auto-Router" },
      { timestamp: "6 days ago (Sep 19)", note: "SLA (24h) breached. Warning notification sent", author: "System Ageing Bot" },
      { timestamp: "2 days ago (Sep 23)", note: "Overdue by 7 days. Auto-escalated to Chief Warden Dr. S. K. Nayak", author: "SLA Watchdog" }
    ]
  },
  {
    id: "CMP-2026-0051",
    title: "Wi-Fi router in Block B corridors rebooting continuously",
    description: "Frequent disconnections during late evening hours. Cisco AP lights blinking amber. Cannot access NPTEL and campus portal.",
    category: "Wi-Fi & IT",
    location: "Aryabhatta Hall - Block B, 2nd & 3rd Floor Hub",
    urgency: "MEDIUM",
    reportedBy: "Subham Jena (B-210)",
    studentId: "STU-2022-CSE-019",
    reportedDaysAgo: 1,
    reportedDate: "2026-09-24",
    status: "IN_PROGRESS",
    assignedTo: "Pradeep Sahu (Network Admin)",
    slaBreached: false,
    slaTargetHours: 48,
    escalationLevel: "Level 1: Technician Queue",
    photoUrl: null,
    studentRating: null,
    studentFeedback: null,
    timeline: [
      { timestamp: "Yesterday", note: "Ticket logged by student", author: "Student" },
      { timestamp: "Today 09:30", note: "Technician Pradeep Sahu picked up ticket. Firmware reset scheduled.", author: "Network Admin" }
    ]
  },
  {
    id: "CMP-2026-0038",
    title: "Reading Room tube-light blinking",
    description: "40W LED tube flickering, making it difficult for night study.",
    category: "Electrical",
    location: "Aryabhatta Hall - Ground Floor Study Hall",
    urgency: "LOW",
    reportedBy: "Piyush Mohapatra (B-304)",
    studentId: "STU-2022-CSE-045",
    reportedDaysAgo: 3,
    reportedDate: "2026-09-22",
    status: "RESOLVED",
    assignedTo: "Ramesh Behera (Electrician)",
    slaBreached: false,
    slaTargetHours: 48,
    escalationLevel: "Closed",
    photoUrl: null,
    studentRating: 5,
    studentFeedback: "Repaired within 4 hours. Great work by electrician Ramesh!",
    timeline: [
      { timestamp: "3 days ago", note: "Ticket filed by student", author: "Student" },
      { timestamp: "2 days ago", note: "Tube-light replaced with new Philips 40W LED", author: "Ramesh Behera" },
      { timestamp: "Yesterday", note: "Resolved. Verified by Warden office & student rated 5 stars", author: "System" }
    ]
  }
];

export const initialNotices = [
  {
    id: "NOT-2026-104",
    title: "Mandatory Semester Exam Registration & Fee Clearance Deadline",
    content: "All 3rd & 4th Year B.Tech students must clear remaining semester fees and register on BPUT portal before September 30, 2026. Non-registered students will not receive hall tickets.",
    priority: "HIGH",
    sender: "Prof. D. K. Mishra (Principal & Director)",
    target: "All B.Tech 3rd & 4th Year",
    date: "Sep 24, 2026",
    channels: ["📱 FCM Push", "✉️ Email", "💬 SMS"],
    actionRequired: true,
    hasUserAcknowledged: false,
    readReceiptsCount: 382,
    totalTargetUsers: 450,
    quietHoursExempt: true
  },
  {
    id: "NOT-2026-103",
    title: "Hostel Water Tank Cleaning & Disinfection Notice",
    content: "Overhead tank cleaning scheduled for Saturday from 9:00 AM to 1:00 PM. Water supply will be temporarily suspended during this window. Keep buckets filled.",
    priority: "MEDIUM",
    sender: "Dr. S. K. Nayak (Chief Warden)",
    target: "Aryabhatta Hall Residents",
    date: "Sep 23, 2026",
    channels: ["📱 FCM Push", "💬 SMS"],
    actionRequired: true,
    hasUserAcknowledged: true,
    readReceiptsCount: 412,
    totalTargetUsers: 420,
    quietHoursExempt: false
  },
  {
    id: "NOT-2026-102",
    title: "National Tech Hackathon 2026 – Team Registration Open",
    content: "University incubation cell invites teams of 4 to register for Smart India & State Hackathons. Funding up to ₹50,000 for top prototypes.",
    priority: "NORMAL",
    sender: "Prof. Ananya Verma (Faculty Coordinator)",
    target: "All Departments",
    date: "Sep 22, 2026",
    channels: ["📱 FCM Push"],
    actionRequired: false,
    hasUserAcknowledged: true,
    readReceiptsCount: 840,
    totalTargetUsers: 1200,
    quietHoursExempt: false
  }
];

export const initialMessData = {
  annapurnaMess: {
    todayPoll: {
      breakfastCount: 342,
      lunchCount: 418,
      dinnerCount: 365,
      foodWasteSavedKg: 18.4,
      totalRegistered: 440
    },
    todayMenu: {
      breakfast: "Idli, Medu Vada, Coconut Chutney, Sambhar, Hot Tea/Coffee",
      lunch: "Steamed Rice, Yellow Dal Tadka, Paneer Butter Masala, Mixed Veg Fry, Papad, Gulab Jamun",
      evening: "Samosa with Tamarind Chutney, Ginger Tea",
      dinner: "Tandoori Roti, Chicken Kassa / Shahi Paneer, Jeera Rice, Dal Makhani, Fresh Curd"
    },
    userMealDecision: {
      breakfast: true,
      lunch: true,
      dinner: true
    },
    recentFeedbacks: [
      { student: "Piyush M.", rating: 5, dish: "Paneer Butter Masala", comment: "Paneer was fresh and gravy was great today!", time: "Today lunch" },
      { student: "Ananya M.", rating: 4, dish: "Medu Vada", comment: "Crispy and warm. Sambhar had good flavor.", time: "Today breakfast" },
      { student: "Rohan S.", rating: 3, dish: "Evening Tea", comment: "Sugar was a bit high in the tea.", time: "Yesterday" }
    ],
    weeklyReservations: {
      Monday:    { breakfast: 310, lunch: 390, dinner: 338 },
      Tuesday:   { breakfast: 295, lunch: 380, dinner: 350 },
      Wednesday: { breakfast: 320, lunch: 400, dinner: 360 },
      Thursday:  { breakfast: 280, lunch: 370, dinner: 330 },
      Friday:    { breakfast: 300, lunch: 395, dinner: 375 },
      Saturday:  { breakfast: 260, lunch: 350, dinner: 310 },
      Sunday:    { breakfast: 340, lunch: 415, dinner: 390 }
    }
  }
};

// ── Student Timetable & Class Updates ──
export const initialTimetable = [
  { time: "09:00 - 10:00", subject: "Operating Systems (CST301)", room: "Room 401", faculty: "Prof. Ananya Verma", status: "Ongoing", isSubstitute: false },
  { time: "10:15 - 11:15", subject: "Database Management (CST302)", room: "Room 302", faculty: "Dr. K. C. Patra", status: "Upcoming", isSubstitute: false },
  { time: "11:30 - 12:30", subject: "Design & Analysis of Algorithms (CST303)", room: "Room 401", faculty: "Dr. Rajan Panda", status: "Upcoming", isSubstitute: true, substituteNote: "Covering for Prof. S. Sen" },
  { time: "14:00 - 16:00", subject: "Algorithms Lab (Section B)", room: "CS Lab 2", faculty: "Prof. Ananya Verma", status: "Upcoming", isSubstitute: false },
  { time: "16:15 - 17:15", subject: "Computer Networks (CST304)", room: "Room 205", faculty: "Prof. B. Dash", status: "Upcoming", isSubstitute: false }
];

// ── Student Assignments, Deadlines & Productivity ──
export const initialAssignments = [
  { id: "ASN-01", subject: "Operating Systems", title: "CPU Scheduling Algorithms Simulation in C++", deadline: "Sep 28, 2026", status: "PENDING", weight: "15 Marks", progress: 60 },
  { id: "ASN-02", subject: "Database Systems", title: "Normalization & SQL Queries Case Study", deadline: "Oct 02, 2026", status: "SUBMITTED", weight: "10 Marks", progress: 100 },
  { id: "ASN-03", subject: "Algorithms", title: "Dynamic Programming Knapsack Problem", deadline: "Oct 05, 2026", status: "IN_REVIEW", weight: "20 Marks", progress: 85 },
  { id: "ASN-04", subject: "Computer Networks", title: "Packet Sniffer Analysis using Wireshark", deadline: "Oct 12, 2026", status: "UPCOMING", weight: "10 Marks", progress: 20 }
];

// ── Hostel Room Assets & Maintenance Records ──
export const initialRoomAssets = [
  { name: "Ceiling Fan (Crompton 1200mm)", assetId: "AST-FAN-304", status: "Operational", lastServiced: "Aug 15, 2026", condition: "Good" },
  { name: "LAN Ethernet Port (Gigabit)", assetId: "AST-NET-304", status: "Operational", lastServiced: "Sep 02, 2026", condition: "100 Mbps Verified" },
  { name: "LED Tube Light (Philips 40W)", assetId: "AST-LGT-304", status: "Operational", lastServiced: "Jul 10, 2026", condition: "Good" },
  { name: "Geyser (Floor Washroom Unit 2)", assetId: "AST-GEY-FL3", status: "Maintenance Scheduled", lastServiced: "Aug 28, 2026", condition: "Thermostat check" },
  { name: "Wooden Study Desk & Chair Set", assetId: "AST-FUR-304", status: "Operational", lastServiced: "Jul 2024", condition: "Solid Teakwood" }
];

// ── Anti-Ragging Reports (Direct to Dean / Committee) ──
export const initialAntiRaggingReports = [
  {
    id: "RAG-2026-003",
    timestamp: "Sep 20, 2026, 23:15",
    type: "Verbal Harassment / Late Night Ragging",
    location: "Block A - Ground Floor Quadrangle",
    anonymous: true,
    reportedBy: "Anonymous Student (Shield Active)",
    targetFaculty: "Dean of Student Welfare & Anti-Ragging Cell",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    actionTaken: "Dean convened anti-ragging squad; night patrol doubled in Block A.",
    deanRemarks: "Strict disciplinary hearing scheduled with committee members."
  }
];

// ── Security Visitor Entry & Gate Logs ──
export const initialVisitorLogs = [
  { id: "VIS-901", visitorName: "Satish Mishra", phone: "+91 94371 88220", visiting: "Piyush Mohapatra (B-304)", relation: "Parent / Guardian", vehicleNo: "OD-14-AK-5521", inTime: "Today 11:30 AM", outTime: null, status: "ON_CAMPUS", passBadge: "VIS-PASS-04" },
  { id: "VIS-900", visitorName: "Sunil K. Barik", phone: "+91 98610 99112", visiting: "Dr. S. K. Nayak", relation: "Equipment Vendor (Lab PC Supplies)", vehicleNo: "OD-05-B-1142", inTime: "Today 09:45 AM", outTime: "Today 12:15 PM", status: "CHECKED_OUT", passBadge: "VIS-PASS-01" },
  { id: "VIS-899", visitorName: "Deepak Sahu", phone: "+91 70081 22334", visiting: "Annapurna Mess", relation: "Dairy & Milk Delivery", vehicleNo: "OD-14-M-9900", inTime: "Today 06:15 AM", outTime: "Today 07:30 AM", status: "CHECKED_OUT", passBadge: "VIS-PASS-VENDOR" }
];

// ── Faculty Workload, Quizzes & Student Reviews ──
export const initialQuizzes = [
  {
    id: "QZ-01",
    subject: "Operating Systems",
    topic: "Process Synchronization & Semaphores",
    question: "Which of the following conditions must hold for Deadlock to occur?",
    options: ["Mutual Exclusion", "Hold and Wait", "No Preemption & Circular Wait", "All of the above"],
    correctIndex: 3,
    totalResponses: 52,
    active: true,
    results: [4, 2, 6, 40]
  }
];

export const initialStudentReviews = [
  { regNo: "2201106145", studentName: "Piyush Mohapatra", subject: "Operating Systems", grade: "A+", marks: 92, feedback: "Excellent grasp of OS kernel concepts and active participation.", attendancePct: 90 },
  { regNo: "2201106201", studentName: "Priya Dash", subject: "Operating Systems", grade: "B", marks: 74, feedback: "Good in theory, needs more focus on lab shell scripting assignments.", attendancePct: 71 },
  { regNo: "2201106098", studentName: "Rohan Samal", subject: "Algorithms", grade: "C+", marks: 65, feedback: "Critical attendance shortage (68%). Advised to attend remedial sessions.", attendancePct: 68 }
];

// ── Principal Policy Compliance & Staff Workload ──
export const initialPolicyCompliance = {
  antiRaggingCompliance: 100,
  attendanceCutoffCompliance: 92.4,
  grievanceRedressalRate: 94.6,
  scholarshipDisbursalRate: 98.0,
  hostelCapacityUtilized: 91.5,
  busTransportEfficiency: 86.0
};

export const initialStaffWorkload = [
  { name: "Prof. Ananya Verma", role: "Associate Prof (CSE)", teachingHours: 18, assignedTickets: 4, resolvedTickets: 4, performanceScore: "98%" },
  { name: "Dr. S. K. Nayak", role: "Chief Warden & Prof", teachingHours: 14, assignedTickets: 12, resolvedTickets: 10, performanceScore: "92%" },
  { name: "Dr. K. C. Patra", role: "Professor (CSE)", teachingHours: 16, assignedTickets: 2, resolvedTickets: 2, performanceScore: "96%" },
  { name: "Dr. Rajan Panda", role: "Assistant Prof (CSE)", teachingHours: 20, assignedTickets: 3, resolvedTickets: 3, performanceScore: "95%" }
];

export const initialFinanceData = {
  totalFeeCollection: 14850000,
  feeCollectionRate: 94.2,
  scholarshipsDisbursed: 2850000,
  hostelRentCollected: 4920000,
  messBillingCollected: 3840000,
  pendingDuesCount: 42,
  totalStudentsEnrolled: 980
};

export const campusHotspotStats = [
  { block: "Aryabhatta Hall (Boys)", wing: "Block B (3rd Floor)", issues: 14, primaryIssue: "Plumbing & Tap leakage", risk: "CRITICAL" },
  { block: "Aryabhatta Hall (Boys)", wing: "Block A (2nd Floor)", issues: 8, primaryIssue: "Wi-Fi Router dropouts", risk: "MEDIUM" },
  { block: "Kalpana Chawla Hall (Girls)", wing: "Wing C (1st Floor)", issues: 5, primaryIssue: "Electrical Switchboard", risk: "LOW" },
  { block: "Academic Block 2", wing: "Floor 4 Lab Wing", issues: 6, primaryIssue: "Projector HDMI cable faulty", risk: "MEDIUM" },
  { block: "Annapurna Central Mess", wing: "Kitchen Water Filter", issues: 2, primaryIssue: "RO UV cartridge replacement", risk: "LOW" }
];

export const initialAuditLogs = [
  {
    id: "LOG-9921",
    timestamp: "Today, 14:15:32",
    actor: "Dr. S. K. Nayak (Chief Warden)",
    action: "APPROVED_GATE_PASS",
    details: "Approved Day Outing for Piyush Mohapatra (GP-2026-8891). SMS alert dispatched to +91 94370 12345.",
    badgeColor: "emerald"
  },
  {
    id: "LOG-9920",
    timestamp: "Today, 12:44:10",
    actor: "System SLA Watchdog",
    action: "ESCALATED_TICKET",
    details: "Ticket CMP-2026-0042 crossed 9 days without resolution. Escalated to Chief Warden.",
    badgeColor: "red"
  },
  {
    id: "LOG-9919",
    timestamp: "Today, 08:00:00",
    actor: "Office of the Chief Warden",
    action: "BROADCAST_NOTICE",
    details: "Dispatched targeted notice NOT-2026-104 to 420 residents of Aryabhatta Hall.",
    badgeColor: "blue"
  },
  {
    id: "LOG-9918",
    timestamp: "Yesterday, 16:22:45",
    actor: "Subedar Ram Singh (Gate 1)",
    action: "SECURITY_SCAN_OUT",
    details: "Scanned QR for Ananya Mishra (GP-2026-8890). Out-time verified & gate barrier opened.",
    badgeColor: "amber"
  }
];

export const busRoutes = [
  {
    id: "B1",
    name: "Campus Circular",
    color: "#3b82f6",
    stops: ["Main Gate", "Academic Block", "Library", "Hostel Block A", "Hostel Block B", "Mess", "Main Gate"],
    currentStop: 2,
    nextArrival: "3 min",
    capacity: 42,
    occupancy: 28,
    driver: "Santosh Kumar"
  },
  {
    id: "B2",
    name: "City Express",
    color: "#10b981",
    stops: ["Main Gate", "Rourkela Station", "City Market", "Hospital", "Main Gate"],
    currentStop: 1,
    nextArrival: "12 min",
    capacity: 54,
    occupancy: 41,
    driver: "Ravi Das"
  },
  {
    id: "B3",
    name: "Lab Shuttle",
    color: "#f59e0b",
    stops: ["Hostel A", "Hostel B", "Research Lab", "Canteen", "Hostel A"],
    currentStop: 0,
    nextArrival: "7 min",
    capacity: 30,
    occupancy: 12,
    driver: "Birju Singh"
  }
];

export const examCalendar = [
  { date: "2026-10-01", type: "exam", title: "OS Mid-Sem (CST301)", time: "10:00 AM", venue: "Block A Hall 1", urgent: true },
  { date: "2026-10-03", type: "exam", title: "DBMS Mid-Sem (CST302)", time: "10:00 AM", venue: "Block B Hall 2", urgent: true },
  { date: "2026-10-05", type: "event", title: "Tech Fest – Triskele 2026", time: "9:00 AM", venue: "Open Amphitheatre" },
  { date: "2026-10-08", type: "exam", title: "Algorithms Mid-Sem (CST303)", time: "10:00 AM", venue: "Block A Hall 1", urgent: true },
  { date: "2026-10-10", type: "holiday", title: "Dussehra Holiday", time: "All Day", venue: "" },
  { date: "2026-10-15", type: "event", title: "Placement Mock Test – TCS iON", time: "2:00 PM", venue: "Computer Lab 3" },
  { date: "2026-10-20", type: "exam", title: "Computer Networks (CST304)", time: "10:00 AM", venue: "Block B Hall 1", urgent: true },
  { date: "2026-10-25", type: "holiday", title: "Diwali Holiday", time: "All Day", venue: "" },
  { date: "2026-11-01", type: "event", title: "Sports Day – Annual Athletic Meet", time: "8:00 AM", venue: "Campus Ground" },
  { date: "2026-11-15", type: "exam", title: "End-Sem Exams Begin", time: "10:00 AM", venue: "All Exam Halls", urgent: true }
];
