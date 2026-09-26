import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def build_pptx(output_path, img_dir):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Classy Executive Dark Colors (Obsidian / Midnight Navy + Gold & Sapphire Accents)
    COLOR_BG = RGBColor(10, 15, 29)              # #0a0f1d Deep Obsidian Navy
    COLOR_CARD = RGBColor(21, 31, 50)            # #151f32 Refined Slate Glass Card
    COLOR_BLUE = RGBColor(37, 99, 235)           # #2563eb Vivid Sapphire
    COLOR_LIGHT_BLUE = RGBColor(147, 197, 253)   # #93c5fd Soft Ice Blue
    COLOR_GOLD = RGBColor(245, 158, 11)          # #f59e0b Executive Gold
    COLOR_EMERALD = RGBColor(16, 185, 129)       # #10b981
    COLOR_CYAN = RGBColor(6, 182, 212)           # #06b6d4
    COLOR_ROSE = RGBColor(244, 63, 94)           # #f43f5e
    COLOR_PURPLE = RGBColor(168, 85, 247)        # #a855f7
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_MUTED = RGBColor(203, 213, 225)        # #cbd5e1

    def apply_classy_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()

        top_accent1 = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(4.5), Inches(0.06))
        top_accent1.fill.solid()
        top_accent1.fill.fore_color.rgb = COLOR_GOLD
        top_accent1.line.fill.background()

        top_accent2 = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(4.5), 0, Inches(8.833), Inches(0.06))
        top_accent2.fill.solid()
        top_accent2.fill.fore_color.rgb = COLOR_BLUE
        top_accent2.line.fill.background()

        ft_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3))
        p = ft_box.text_frame.paragraphs[0]
        p.text = "CampusOS • BPUT Hackathon 2026 • Problem Statement 07 (Fretbox) • Team: BUG FINDERS"
        p.font.size = Pt(8.5)
        p.font.color.rgb = RGBColor(100, 116, 139)

    def add_header(slide, page_num, total_pages, title, category="CAMPUSOS • BPUT HACKATHON 2026"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.25), Inches(11.7), Inches(0.35))
        p = cat_box.text_frame.paragraphs[0]
        p.text = f"{category}  |  TEAM: BUG FINDERS  |  SLIDE {page_num}/{total_pages}"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD

        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.7), Inches(0.7))
        p2 = t_box.text_frame.paragraphs[0]
        p2.text = title
        p2.font.size = Pt(22)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_WHITE

    TOTAL_SLIDES = 10

    img_hero = os.path.join(img_dir, 'campusos_hero.jpg')
    img_mindmap = os.path.join(img_dir, 'campusos_mindmap.jpg')
    img_gps_qr = os.path.join(img_dir, 'campusos_gps_qr.jpg')
    img_sos_bot = os.path.join(img_dir, 'campusos_sos_bot.jpg')
    img_qr_gatepass = os.path.join(img_dir, 'qr_gatepass.png')
    img_qr_bonafide = os.path.join(img_dir, 'qr_bonafide.png')
    img_impact = os.path.join(img_dir, 'campusos_impact_chart.png')

    # =============================================================
    # SLIDE 1: Title, Team & Problem Statement (Classy Hero + Pointers)
    # =============================================================
    s1 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s1)

    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(4.5), Inches(0.35))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_BLUE
    pill.line.fill.background()
    p = pill.text_frame.paragraphs[0]
    p.text = "BPUT HACKATHON 2026 • FRETBOX PS-07"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.alignment = PP_ALIGN.CENTER

    t1 = s1.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
    p1 = t1.text_frame.paragraphs[0]
    p1.text = "CampusOS : Campus Life, Debugged"
    p1.font.size = Pt(30)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE

    p1_sub = t1.text_frame.add_paragraph()
    p1_sub.text = "Smart Campus Operating System with AI Robot, Emergency SOS, GPS Geofence & IoT Sensors"
    p1_sub.font.size = Pt(13)
    p1_sub.font.color.rgb = COLOR_LIGHT_BLUE

    team_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.7), Inches(0.45))
    team_box.fill.solid()
    team_box.fill.fore_color.rgb = COLOR_GOLD
    team_box.line.fill.background()
    p_team = team_box.text_frame.paragraphs[0]
    p_team.text = "🌟 PRESENTED BY TEAM: BUG FINDERS 🌟"
    p_team.font.size = Pt(14)
    p_team.font.bold = True
    p_team.font.color.rgb = COLOR_BG
    p_team.alignment = PP_ALIGN.CENTER

    ps_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.25), Inches(6.4), Inches(4.7))
    ps_card.fill.solid()
    ps_card.fill.fore_color.rgb = COLOR_CARD
    ps_card.line.color.rgb = COLOR_BLUE
    ps_card.line.width = Pt(1.5)

    tf_ps = ps_card.text_frame
    tf_ps.word_wrap = True
    p = tf_ps.paragraphs[0]
    p.text = "The Problem Statement in Clear Pointers (For Non-Tech Evaluators):"
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    p_quote = tf_ps.add_paragraph()
    p_quote.text = "“Four apps, six notice boards, two WhatsApp groups and one register. Replace all of it.”"
    p_quote.font.size = Pt(11)
    p_quote.font.italic = True
    p_quote.font.color.rgb = COLOR_WHITE

    ps_pointers = [
        "• The Everyday Reality: Students waste full afternoons hopping between 3 offices.",
        "• 3-Day Bonafide Queue: Standing in Accounts, Library & Dean lines for one simple paper.",
        "• 9-Day Tap Leak: Hostel washroom tap leaks for 9 days because it was lost in a paper diary.",
        "• Paper Gate Register: Outing clearances rely on physical warden signatures & paper slips.",
        "• WhatsApp Spam: Critical exam notifications get buried under 400 late-night messages.",
        "• Zero Humans Genuinely Needed: None of these routine friction points needed manual effort.",
        "• Team BUG FINDERS Solution: CampusOS unifies all 5 workflows into an offline-ready hub."
    ]
    for pt in ps_pointers:
        p = tf_ps.add_paragraph()
        p.text = pt
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_MUTED

    if os.path.exists(img_hero):
        hero_frame = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.4), Inches(2.25), Inches(5.1), Inches(4.7))
        hero_frame.fill.solid()
        hero_frame.fill.fore_color.rgb = COLOR_CARD
        hero_frame.line.color.rgb = COLOR_GOLD
        hero_frame.line.width = Pt(1.5)

        s1.shapes.add_picture(img_hero, Inches(7.55), Inches(2.4), width=Inches(4.8), height=Inches(3.3))

        cap_box = s1.shapes.add_textbox(Inches(7.55), Inches(5.8), Inches(4.8), Inches(1.0))
        tf_c = cap_box.text_frame
        tf_c.word_wrap = True
        p_c1 = tf_c.paragraphs[0]
        p_c1.text = "Unified Smart Campus Architecture"
        p_c1.font.size = Pt(11.5)
        p_c1.font.bold = True
        p_c1.font.color.rgb = COLOR_GOLD

        p_c2 = tf_c.add_paragraph()
        p_c2.text = "• Seamlessly connects QR Gate Turnstiles, 24/7 AI Robot, Emergency SOS, and IoT Sensors."
        p_c2.font.size = Pt(9.5)
        p_c2.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 2: Visual System Mind Map
    # =============================================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s2)
    add_header(s2, 2, TOTAL_SLIDES, "Visual Ecosystem Mind Map : 6 Unified Campus Branches (Pointers)")

    if os.path.exists(img_mindmap):
        mm_frame = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.8), Inches(5.55))
        mm_frame.fill.solid()
        mm_frame.fill.fore_color.rgb = COLOR_CARD
        mm_frame.line.color.rgb = COLOR_CYAN
        mm_frame.line.width = Pt(1.5)

        s2.shapes.add_picture(img_mindmap, Inches(0.95), Inches(1.55), width=Inches(5.5), height=Inches(3.9))

        cap_mm = s2.shapes.add_textbox(Inches(0.95), Inches(5.55), Inches(5.5), Inches(1.2))
        tf_mm = cap_mm.text_frame
        tf_mm.word_wrap = True
        p_mm1 = tf_mm.paragraphs[0]
        p_mm1.text = "Central Operating System Core"
        p_mm1.font.size = Pt(11.5)
        p_mm1.font.bold = True
        p_mm1.font.color.rgb = COLOR_CYAN

        p_mm2 = tf_mm.add_paragraph()
        p_mm2.text = "• Replaces 4 disjointed apps and 6 notice boards with a synchronized realtime ecosystem."
        p_mm2.font.size = Pt(9.5)
        p_mm2.font.color.rgb = COLOR_MUTED

    mm_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.55))
    mm_card.fill.solid()
    mm_card.fill.fore_color.rgb = COLOR_CARD
    mm_card.line.color.rgb = COLOR_GOLD
    mm_card.line.width = Pt(1.5)

    tf_mm_card = mm_card.text_frame
    tf_mm_card.word_wrap = True
    p = tf_mm_card.paragraphs[0]
    p.text = "The 6 Interconnected Branches (In Clear Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    branches = [
        ("1. Student App Hub", "• Safe Bunk margin (6 left) • 1-tap Gate Pass • Bonafide PDF • Offline PWA."),
        ("2. Security Gate & GPS", "• Dynamic QR scanner • GPS virtual perimeter • Curfew delay siren."),
        ("3. AI Robot & Emergency SOS", "• 24/7 CampusBot assistant • Live GPS panic broadcast • Siren alert."),
        ("4. External Hardware & IoT", "• Ultrasonic water tank sensors • RFID ID tap • Optical scanner guns."),
        ("5. Smart Mess Dining", "• 4 PM Eating Tonight? poll • Saves 750 kg food waste & ₹90,000 monthly."),
        ("6. Executive Analytics", "• 9-day tap leak SLA watchdog • Campus recurring issue heatmap.")
    ]
    for b_title, b_desc in branches:
        p_t = tf_mm_card.add_paragraph()
        p_t.text = f"• {b_title}:"
        p_t.font.size = Pt(10.5)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_LIGHT_BLUE

        p_d = tf_mm_card.add_paragraph()
        p_d.text = f"   {b_desc}"
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 3: GPS Geo-Fencing & Dynamic QR Scanner
    # =============================================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s3)
    add_header(s3, 3, TOTAL_SLIDES, "GPS Geo-Fencing & Dynamic QR Scanner : Zero Gate Queue (Pointers)")

    if os.path.exists(img_gps_qr):
        gps_frame = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.8), Inches(5.55))
        gps_frame.fill.solid()
        gps_frame.fill.fore_color.rgb = COLOR_CARD
        gps_frame.line.color.rgb = COLOR_CYAN
        gps_frame.line.width = Pt(1.5)

        s3.shapes.add_picture(img_gps_qr, Inches(0.95), Inches(1.55), width=Inches(5.5), height=Inches(3.8))

        if os.path.exists(img_qr_gatepass):
            s3.shapes.add_picture(img_qr_gatepass, Inches(1.0), Inches(5.45), width=Inches(1.3), height=Inches(1.3))

        cap_gps = s3.shapes.add_textbox(Inches(2.4), Inches(5.45), Inches(4.0), Inches(1.3))
        tf_cgps = cap_gps.text_frame
        tf_cgps.word_wrap = True
        p_cg1 = tf_cgps.paragraphs[0]
        p_cg1.text = "Scannable Dynamic Gate Pass QR"
        p_cg1.font.size = Pt(11)
        p_cg1.font.bold = True
        p_cg1.font.color.rgb = COLOR_CYAN

        p_cg2 = tf_cgps.add_paragraph()
        p_cg2.text = "• Scan with phone camera to test live verification token. 30s rolling key prevents forgery."
        p_cg2.font.size = Pt(9)
        p_cg2.font.color.rgb = COLOR_MUTED

    gps_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.55))
    gps_card.fill.solid()
    gps_card.fill.fore_color.rgb = COLOR_CARD
    gps_card.line.color.rgb = COLOR_BLUE
    gps_card.line.width = Pt(1.5)

    tf_gps = gps_card.text_frame
    tf_gps.word_wrap = True
    p = tf_gps.paragraphs[0]
    p.text = "How GPS & QR Systems Protect Campus Life (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    gps_pointers = [
        "• GPS Campus Perimeter Geofence: Maps exact virtual boundary around BPUT campus.",
        "• Auto Check-Out & Check-In: Proximity triggers automated clearance without paper lines.",
        "• Live GPS Emergency Sharing: Transmits live location coordinates during night outings.",
        "• Geo-Tagged Grievances: Photos automatically record broken lamp or water tank coordinates.",
        "• Dynamic 30-Second Rolling QR: Regenerating cryptographic token stops screenshot passes.",
        "• 0.3s Optical Laser Scan: Security guards scan with mobile camera or barcode laser guns.",
        "• Peak Rush Speed: Clears 500+ students during 8:00 PM curfew rush in under 15 minutes.",
        "• Automated Parent SMS: Sends instant arrival/departure SMS to parent mobile numbers."
    ]
    for pt in gps_pointers:
        p = tf_gps.add_paragraph()
        p.text = pt
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 4: Hostel Maintenance & Leaking Tap SLA Watchdog
    # =============================================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s4)
    add_header(s4, 4, TOTAL_SLIDES, "Hostel Maintenance & Leaking Tap SLA Watchdog (Pointers)")

    card_leak = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.7), Inches(5.55))
    card_leak.fill.solid()
    card_leak.fill.fore_color.rgb = COLOR_CARD
    card_leak.line.color.rgb = COLOR_ROSE
    card_leak.line.width = Pt(1.5)

    tf_l = card_leak.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "The Problem Brief: Tap Leaking for 9 Days (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_ROSE

    leak_pointers = [
        "• Written in Paper Register: Student reported a broken washroom tap in a paper diary.",
        "• Zero Accountability: The hostel warden forgot to check the physical diary for over a week.",
        "• Plumber Uninformed: Technicians were never notified or assigned to the plumbing defect.",
        "• Slipping Hazard: Continuous puddle formed an acute slipping hazard for hostel residents.",
        "• Massive Water Loss: Thousands of liters of purified water drained continuously.",
        "• Student Frustration: Students lose trust in administration after waiting 9 days."
    ]
    for pt in leak_pointers:
        p = tf_l.add_paragraph()
        p.text = pt
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_MUTED

    card_fix = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.55))
    card_fix.fill.solid()
    card_fix.fill.fore_color.rgb = COLOR_CARD
    card_fix.line.color.rgb = COLOR_EMERALD
    card_fix.line.width = Pt(1.5)

    tf_f = card_fix.text_frame
    tf_f.word_wrap = True
    p = tf_f.paragraphs[0]
    p.text = "How CampusOS Debugs Maintenance (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD

    fix_pointers = [
        "• 1-Tap Photo Grievance: Student snaps photo of leaking tap in 10 seconds.",
        "• AI Auto-Tagging: NLP assigns issue directly to Plumbing Dept with a strict 12h SLA.",
        "• IoT Flow Sensors: Smart water flow meters detect anomalous drop in 45 minutes.",
        "• Visual SLA Clock: Live countdown timer visible to both student and technicians.",
        "• Automated Escalation: Unresolved tickets turn bright RED and ping Chief Warden Nayak.",
        "• Verified Resolution: Student rates repair (5 stars) with mandatory photo proof.",
        "• Campus Heatmap: Detects 14 recurring pipe failures on Block B 3rd Floor for permanent overhaul."
    ]
    for pt in fix_pointers:
        p = tf_f.add_paragraph()
        p.text = pt
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 5: Instant Verifiable Bonafide & NOC Clearance
    # =============================================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s5)
    add_header(s5, 5, TOTAL_SLIDES, "Instant Verifiable Bonafide & NOC Clearance : 3 Days to 2s (Pointers)")

    card_doc = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(6.8), Inches(5.55))
    card_doc.fill.solid()
    card_doc.fill.fore_color.rgb = COLOR_CARD
    card_doc.line.color.rgb = COLOR_BLUE
    card_doc.line.width = Pt(1.5)

    tf_doc = card_doc.text_frame
    tf_doc.word_wrap = True
    p = tf_doc.paragraphs[0]
    p.text = "Automated Document Issuance Workflow (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    doc_pointers = [
        "• The Old 3-Day Nightmare: Waiting outside Accounts, Library & Dean offices for clearance signatures.",
        "• Instant Rule Engine: CampusOS queries ERP database in 2 seconds upon request.",
        "• Attendance Verification: Automatically confirms student attendance is above 75% threshold (84% active).",
        "• Fee Due Verification: Automatically confirms student has ₹0 pending tuition/hostel balances.",
        "• Official Printable PDF: Generates BPUT institutional letterhead with official university seal.",
        "• Cryptographic Verification QR: Employers and passport consulates scan QR to verify authenticity.",
        "• Zero Queues, Zero Paper: Eliminates 100% of clerical queues during peak scholarship deadlines."
    ]
    for pt in doc_pointers:
        p = tf_doc.add_paragraph()
        p.text = pt
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_MUTED

    card_doc_r = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.8), Inches(1.4), Inches(4.7), Inches(5.55))
    card_doc_r.fill.solid()
    card_doc_r.fill.fore_color.rgb = COLOR_CARD
    card_doc_r.line.color.rgb = COLOR_EMERALD
    card_doc_r.line.width = Pt(1.5)

    if os.path.exists(img_qr_bonafide):
        s5.shapes.add_picture(img_qr_bonafide, Inches(8.9), Inches(1.7), width=Inches(2.5), height=Inches(2.5))

    cap_doc = s5.shapes.add_textbox(Inches(8.0), Inches(4.3), Inches(4.3), Inches(2.5))
    tf_cdoc = cap_doc.text_frame
    tf_cdoc.word_wrap = True
    p = tf_cdoc.paragraphs[0]
    p.text = "Live Digital Authenticity QR Code"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD

    doc_qr_pts = [
        "• Scan to verify official university records.",
        "• SHA-256 digital signature stamp.",
        "• Valid for Odisha Scholarship Portal & Passport Verification.",
        "• Generated in under 2 seconds."
    ]
    for pt in doc_qr_pts:
        p = tf_cdoc.add_paragraph()
        p.text = pt
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 6: Smart Mess Operations & Food Waste Reduction
    # =============================================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s6)
    add_header(s6, 6, TOTAL_SLIDES, "Smart Mess Dining & Measurable Food Waste Reduction (Pointers)")

    card_mess = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.8), Inches(5.55))
    card_mess.fill.solid()
    card_mess.fill.fore_color.rgb = COLOR_CARD
    card_mess.line.color.rgb = COLOR_EMERALD
    card_mess.line.width = Pt(1.5)

    tf_m = card_mess.text_frame
    tf_m.word_wrap = True
    p = tf_m.paragraphs[0]
    p.text = "How CampusOS Stops Mess Waste (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    mess_pointers = [
        "• 4:00 PM Eating Tonight? Poll: Students tap YES or NO before cooking starts.",
        "• Predictive Kitchen Headcount: Head Chef Suresh cooks for verified diners, not arbitrary guesses.",
        "• 30% Food Waste Reduction: Prevents cooking surplus food that gets thrown in dumpsters.",
        "• ₹90,000 Saved Monthly: Direct raw ration savings redirected into higher food quality.",
        "• 7-Day Verified Menu: Transparent 4-meal daily nutritional calendar eliminates dinner confusion.",
        "• Daily Taste Ratings: Students rate meals daily to hold catering contractors accountable.",
        "• Feature Phone Fallback: Non-smartphone students vote via SMS (MESS DINNER YES to 56767)."
    ]
    for pt in mess_pointers:
        p = tf_m.add_paragraph()
        p.text = pt
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_MUTED

    if os.path.exists(img_impact):
        chart_frame = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.55))
        chart_frame.fill.solid()
        chart_frame.fill.fore_color.rgb = COLOR_CARD
        chart_frame.line.color.rgb = COLOR_CYAN
        chart_frame.line.width = Pt(1.5)

        s6.shapes.add_picture(img_impact, Inches(6.95), Inches(1.55), width=Inches(5.4), height=Inches(3.2))

        cap_chart = s6.shapes.add_textbox(Inches(7.0), Inches(4.85), Inches(5.3), Inches(1.9))
        tf_cch = cap_chart.text_frame
        tf_cch.word_wrap = True
        p = tf_cch.paragraphs[0]
        p.text = "Quantified Operational Improvements (BUG FINDERS Metrics):"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_CYAN

        chart_pts = [
            "• Bonafide Wait: Cut from 72 Hours down to 2 Seconds (99.9% faster).",
            "• Tap Leaks: Cut from 9 Days down to 12 Hours (SLA enforced).",
            "• Gate Scanning: Cut from 45s paper writing to 0.3s optical scan.",
            "• Mess Food Waste: Reduced by ~750 kg per month (~30% reduction)."
        ]
        for pt in chart_pts:
            p = tf_cch.add_paragraph()
            p.text = pt
            p.font.size = Pt(9.5)
            p.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 7: 24/7 AI Robot & Emergency SOS Alerts
    # =============================================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s7)
    add_header(s7, 7, TOTAL_SLIDES, "24/7 AI Robot & Emergency SOS Distress Alerts (Pointers)")

    if os.path.exists(img_sos_bot):
        sos_frame = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.8), Inches(5.55))
        sos_frame.fill.solid()
        sos_frame.fill.fore_color.rgb = COLOR_CARD
        sos_frame.line.color.rgb = COLOR_ROSE
        sos_frame.line.width = Pt(1.5)

        s7.shapes.add_picture(img_sos_bot, Inches(0.95), Inches(1.55), width=Inches(5.5), height=Inches(3.8))

        cap_sos = s7.shapes.add_textbox(Inches(0.95), Inches(5.45), Inches(5.5), Inches(1.4))
        tf_csos = cap_sos.text_frame
        tf_csos.word_wrap = True
        p = tf_csos.paragraphs[0]
        p.text = "Integrated Campus Safety & AI Automation"
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_ROSE

        p_sub = tf_csos.add_paragraph()
        p_sub.text = "• Instant GPS location broadcast on distress trigger paired with 24/7 conversational AI robot."
        p_sub.font.size = Pt(9.5)
        p_sub.font.color.rgb = COLOR_MUTED

    card_ai = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.55))
    card_ai.fill.solid()
    card_ai.fill.fore_color.rgb = COLOR_CARD
    card_ai.line.color.rgb = COLOR_PURPLE
    card_ai.line.width = Pt(1.5)

    tf_ai = card_ai.text_frame
    tf_ai.word_wrap = True
    p = tf_ai.paragraphs[0]
    p.text = "AI Robot & Emergency Alert Architecture (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    ai_pointers = [
        "• 1-Tap Emergency SOS Siren: Dual-tone audio alarm alerts nearby guard posts instantly.",
        "• Live GPS Coordinate Locking: Pings student exact coordinates to Campus Police & Warden.",
        "• Automated Parent Dispatch: Sends urgent SMS with Google Maps navigation link to guardian.",
        "• CampusBot 24/7 AI Robot: Resolves the top 20 repetitive office inquiries without human queues.",
        "• Multilingual NLP: Understands questions asked in English, Odia (ଓଡ଼ିଆ), and Hinglish.",
        "• Guided Action Buttons: Directly opens Gate Pass, Bonafide, or Grievance forms from chat cards.",
        "• Physical Reception Robot Ready: UI connects seamlessly to touch-screen campus kiosk robots."
    ]
    for pt in ai_pointers:
        p = tf_ai.add_paragraph()
        p.text = pt
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 8: External Devices & IoT Hardware Integration
    # =============================================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s8)
    add_header(s8, 8, TOTAL_SLIDES, "External Devices & IoT Hardware Integration (In Pointers)")

    devices = [
        ("📡 IoT Ultrasonic Water Tank Sensors", [
            "Measures hostel overhead water tank levels in real time.",
            "Detects sudden pressure loss & pipe leaks in 45 minutes.",
            "Automatically generates emergency plumbing ticket before dry taps occur."
        ], Inches(0.8), Inches(1.4), Inches(5.7), Inches(2.65), COLOR_CYAN),

        ("💳 Contactless RFID / NFC College ID Card Tap", [
            "Integrates with existing Mifare/NFC physical college identity cards.",
            "Students tap physical ID card at turnstiles to raise automatic gate barriers.",
            "Works flawlessly even when student smartphone battery is drained."
        ], Inches(6.8), Inches(1.4), Inches(5.7), Inches(2.65), COLOR_BLUE),

        ("🔫 Handheld Optical Barcode / 2D Scanner Guns", [
            "Security guard booth equipped with USB/Bluetooth rapid 2D laser scanner guns.",
            "0.3-second rapid optical read speed allows blazing fast gate clearance.",
            "Clears a peak curfew crowd of 500+ students in under 15 minutes."
        ], Inches(0.8), Inches(4.3), Inches(5.7), Inches(2.65), COLOR_GOLD),

        ("⚖️ Smart Mess Kitchen Food Waste Digital Scales", [
            "IoT platform scales measure daily plate waste at mess tray return counter.",
            "Data feeds directly into CampusOS dining analytics engine.",
            "Daily waste metrics dynamically optimize the next day cooking rations."
        ], Inches(6.8), Inches(4.3), Inches(5.7), Inches(2.65), COLOR_EMERALD)
    ]

    for title, pointers, left, top, width, height, accent in devices:
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = accent
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = accent

        for pt in pointers:
            p = tf.add_paragraph()
            p.text = f"• {pt}"
            p.font.size = Pt(10)
            p.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 9: Accessibility, Reality Checks & Multilingual
    # =============================================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s9)
    add_header(s9, 9, TOTAL_SLIDES, "Accessibility & Reality Checks : Built for Real Campuses (Pointers)")

    access_cards = [
        ("📶 Offline-First PWA (Pointers)", [
            "• Hostel Wi-Fi Deadzone Resilient: Works without active internet inside thick hostel corridors.",
            "• Local IndexedDB Queue: Gate passes & complaints are stored securely locally.",
            "• Background Re-Sync: Automatically synchronizes data the moment Wi-Fi reconnects.",
            "• Zero Data Loss Guarantee: Never drops drafts or emergency reports during connectivity drops."
        ]),
        ("🌐 Multilingual Localization (Pointers)", [
            "• Native Odisha Language: Full UI support in Odia (ଓଡ଼ିଆ) for BPUT campus community.",
            "• 1-Click Instant Switch: Toggle between English, Odia (ଓଡ଼ିଆ), and Hindi (हिन्दी).",
            "• Non-Teaching Staff Friendly: Security guards & mess staff operate easily in native script.",
            "• Inclusive Accessibility: Removes English comprehension barriers for all support personnel."
        ]),
        ("📱 Basic Feature Phone Fallback (Pointers)", [
            "• Inclusive of Non-Smartphone Students: Fully accessible on basic ₹800 keypad phones.",
            "• Interactive Nokia USSD (*789#): Menu for emergency passes, mess dining & attendance.",
            "• Plain Text SMS Gateway (56767): Send PASS OUT to receive instant approval verification code.",
            "• 100% Student Body Coverage: Ensures zero students are excluded due to device affordability."
        ])
    ]

    for idx, (a_title, a_pointers) in enumerate(access_cards):
        col_left = Inches(0.8 + idx * 3.95)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_left, Inches(1.4), Inches(3.8), Inches(5.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BLUE
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = a_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD

        for pt in a_pointers:
            p = tf.add_paragraph()
            p.text = pt
            p.font.size = Pt(10)
            p.font.color.rgb = COLOR_MUTED

    # =============================================================
    # SLIDE 10: 30-Day Rollout Blueprint & Quantified Impact
    # =============================================================
    s10 = prs.slides.add_slide(blank_layout)
    apply_classy_background(s10)
    add_header(s10, 10, TOTAL_SLIDES, "30-Day Rollout Blueprint & Measurable ROI Impact (Pointers)")

    road_box = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(6.8), Inches(5.55))
    road_box.fill.solid()
    road_box.fill.fore_color.rgb = COLOR_CARD
    road_box.line.color.rgb = COLOR_BLUE
    road_box.line.width = Pt(1.5)

    tf_r = road_box.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "How BPUT Colleges Roll This Out in 3 Waves (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    waves_pointers = [
        "• Weeks 1 - 2 (Wave 1: Digital Gate, Emergency SOS & Notices):",
        "  - Deploy optical QR scanners & NFC ID readers at North & South gates.",
        "  - Set up 1-Tap Emergency SOS buttons and live GPS geofence perimeter.",
        "  - Replace unofficial WhatsApp groups with targeted broadcasts & read receipts.",
        "• Weeks 3 - 4 (Wave 2: Maintenance SLA Watchdog & Smart Mess):",
        "  - Launch 4 PM Eating Tonight? dinner poll cutting 30% kitchen waste.",
        "  - Deploy AI grievance auto-tagging with strict 12h SLA timers.",
        "  - Install IoT ultrasonic water tank sensors to stop 9-day leaks.",
        "• Month 2 (Wave 3: Automated Bonafide & Executive Heatmap):",
        "  - Enable 2-second verifiable Bonafide & NOC PDF clearance generator.",
        "  - Activate recurring issue heatmap for administrative maintenance budgeting.",
        "  - Roll out CampusBot 24/7 AI Robot to handle 80% of routine student inquiries."
    ]
    for pt in waves_pointers:
        p = tf_r.add_paragraph()
        p.text = pt
        p.font.size = Pt(9.5)
        p.font.color.rgb = COLOR_MUTED

    sum_box = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.8), Inches(1.4), Inches(4.7), Inches(5.55))
    sum_box.fill.solid()
    sum_box.fill.fore_color.rgb = COLOR_CARD
    sum_box.line.color.rgb = COLOR_GOLD
    sum_box.line.width = Pt(1.5)

    tf_s = sum_box.text_frame
    tf_s.word_wrap = True
    p = tf_s.paragraphs[0]
    p.text = "Summary of Measurable ROI (In Pointers):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    sum_pointers = [
        "• 90% Less Queue Time: Routine administrative tasks take <60 seconds.",
        "• ₹90,000 Saved Monthly: Direct raw ration savings from mess headcount optimization.",
        "• 9-Day Leaks Eliminated: Breached tickets turn RED and alert Chief Warden in real time.",
        "• 100% Student Safety: Emergency SOS broadcast with live GPS tracking.",
        "• Zero Paper Registers: Digital audit trail prevents lost records and forged passes.",
        "• Built for Every Student: Feature phone USSD (*789#) + Odia multilingual localization.",
        "• 100% Built & Ready: Live working demo presented by Team BUG FINDERS."
    ]
    for pt in sum_pointers:
        p = tf_s.add_paragraph()
        p.text = pt
        p.font.size = Pt(9.5)
        p.font.color.rgb = COLOR_MUTED

    p_end = tf_s.add_paragraph()
    p_end.text = "🌟 TEAM BUG FINDERS • BPUT HACKATHON 2026 🌟"
    p_end.font.size = Pt(11)
    p_end.font.bold = True
    p_end.font.color.rgb = COLOR_GOLD
    p_end.alignment = PP_ALIGN.CENTER

    prs.save(output_path)
    print(f"Classy PPTX successfully created at {output_path}")


def build_pdf(output_path, img_dir):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=landscape(letter),
        leftMargin=30,
        rightMargin=30,
        topMargin=26,
        bottomMargin=26
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        textColor=colors.HexColor('#0f172a'),
        leading=20,
        spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        textColor=colors.HexColor('#b45309'),
        leading=12,
        spaceAfter=5
    )
    callout_style = ParagraphStyle(
        'CalloutCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        textColor=colors.HexColor('#1e40af'),
        leading=11
    )
    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        textColor=colors.HexColor('#334155'),
        leading=11,
        spaceAfter=2
    )

    img_hero = os.path.join(img_dir, 'campusos_hero.jpg')
    img_mindmap = os.path.join(img_dir, 'campusos_mindmap.jpg')
    img_gps_qr = os.path.join(img_dir, 'campusos_gps_qr.jpg')
    img_sos_bot = os.path.join(img_dir, 'campusos_sos_bot.jpg')
    img_qr_gatepass = os.path.join(img_dir, 'qr_gatepass.png')
    img_qr_bonafide = os.path.join(img_dir, 'qr_bonafide.png')
    img_impact = os.path.join(img_dir, 'campusos_impact_chart.png')

    story = []

    # PAGE 1: Problem Statement in Pointers (Hero Image + Team BUG FINDERS)
    story.append(Paragraph("CampusOS : Campus Life, Debugged", title_style))
    story.append(Paragraph("BPUT HACKATHON 2026 • PROBLEM STATEMENT 07 (FRETBOX) &nbsp;|&nbsp; <b>TEAM: BUG FINDERS</b>", subtitle_style))

    p1_left = """
    <b>Problem Statement 07 Overview (In Clear Pointers for Non-Tech Evaluators):</b><br/>
    • <b>The Core Challenge:</b> 'Four apps, six notice boards, two WhatsApp groups and one paper register. Replace all of it.'<br/>
    • <b>The Tuesday Mess:</b> Students spend an entire afternoon hopping between 3 offices for a bonafide letter, reporting a 9-day leaking tap, checking cancelled classes, and finding dinner menus.<br/>
    • <b>Zero Humans Needed:</b> Total number of these repetitive tasks that genuinely required manual human effort: roughly zero.<br/>
    • <b>The Team BUG FINDERS Solution:</b> CampusOS replaces all 5 physical queues with an offline-first system equipped with <b>AI Robot Assistance, Emergency SOS Alerts, IoT Sensors, GPS Geo-Fencing, and Dynamic QR Scanners</b>.
    """

    hero_img_flowable = RLImage(img_hero, width=310, height=170) if os.path.exists(img_hero) else Paragraph("Hero Image", body_style)

    page1_top_table = Table([
        [Paragraph(p1_left, body_style), hero_img_flowable]
    ], colWidths=[400, 320])
    page1_top_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('RIGHTPADDING', (0,0), (0,0), 10),
    ]))
    story.append(page1_top_table)
    story.append(Spacer(1, 4))

    t1_data = [
        [Paragraph("<b>Problem Area</b>", callout_style), Paragraph("<b>Before CampusOS (Old Friction)</b>", callout_style), Paragraph("<b>With CampusOS (Team BUG FINDERS Solution)</b>", callout_style)],
        [Paragraph("• Gate Outing Clearance", body_style), Paragraph("• 45-minute search for warden<br/>• Manual paper register & easily forged slips", body_style), Paragraph("• 10-second phone pass with dynamic QR<br/>• Virtual GPS campus perimeter geofence<br/>• Automated parent SMS dispatch upon exit", body_style)],
        [Paragraph("• Hostel Maintenance", body_style), Paragraph("• Notebook diary; tap leaks 9 days forgotten<br/>• Plumbers never alerted automatically", body_style), Paragraph("• AI auto-routes ticket to plumber with 12h SLA<br/>• IoT ultrasonic tank sensors detect leaks in 45m<br/>• Breached tickets turn RED and alert Chief Warden", body_style)],
        [Paragraph("• Bonafide Certificates", body_style), Paragraph("• 3-day queue across Accounts, Library & Dean<br/>• Wastes study time before exams", body_style), Paragraph("• Instant automated check (>75% attd, ₹0 dues)<br/>• 2-second verifiable PDF with official seal & QR", body_style)],
        [Paragraph("• Emergency & Office FAQs", body_style), Paragraph("• No emergency panic alarm for night travel<br/>• Office queue to ask basic timing questions", body_style), Paragraph("• 1-Tap Emergency SOS sends live GPS to security<br/>• 24/7 CampusBot AI answers top 20 questions", body_style)]
    ]
    t1 = Table(t1_data, colWidths=[120, 260, 340])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0effe')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t1)
    story.append(PageBreak())

    # PAGE 2: System Mind Map & Ecosystem Branches
    story.append(Paragraph("Page 2: CampusOS Ecosystem Mind Map (In Pointers)", title_style))
    story.append(Paragraph("TEAM: BUG FINDERS &nbsp;|&nbsp; BPUT HACKATHON 2026", subtitle_style))

    mm_img_flowable = RLImage(img_mindmap, width=320, height=180) if os.path.exists(img_mindmap) else Paragraph("Mind Map Image", body_style)

    p2_desc = """
    <b>The 6 Interconnected Branches of CampusOS (In Clear Pointers):</b><br/>
    • <b>1. Student App Hub:</b> Safe Bunk margin (6 left) • 1-tap Gate Pass • Bonafide PDF • Offline PWA.<br/>
    • <b>2. Gate Security & GPS:</b> Dynamic QR scanner • GPS virtual perimeter • Curfew delay siren.<br/>
    • <b>3. AI Robot & Emergency SOS:</b> CampusBot 24/7 assistant • Live GPS panic broadcast • Siren alert.<br/>
    • <b>4. External Hardware & IoT:</b> Ultrasonic water tank sensors • RFID ID tap • Optical scanner guns.<br/>
    • <b>5. Smart Mess Dining:</b> 4 PM Eating Tonight? poll • Saves 750 kg food waste & ₹90,000 monthly.<br/>
    • <b>6. Executive Analytics:</b> 9-day tap leak SLA watchdog • Campus recurring issue heatmap.<br/>
    • <b>Offline Architecture:</b> IndexedDB local state engine ensures seamless operation during Wi-Fi deadzones.
    """

    page2_top_table = Table([
        [Paragraph(p2_desc, body_style), mm_img_flowable]
    ], colWidths=[390, 330])
    page2_top_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('RIGHTPADDING', (0,0), (0,0), 10),
    ]))
    story.append(page2_top_table)
    story.append(Spacer(1, 6))

    t2_data = [
        [Paragraph("<b>Branch</b>", callout_style), Paragraph("<b>Key Operations (In Pointers)</b>", callout_style), Paragraph("<b>System Intelligence (In Pointers)</b>", callout_style)],
        [
            Paragraph("<b>Student App Hub</b>", body_style),
            Paragraph("• Attendance Safe Bunk margin (6 left)<br/>• 1-tap Gate Pass with dynamic QR<br/>• Maintenance photo upload & SLA clock<br/>• Instant Bonafide & NOC PDF generator", body_style),
            Paragraph("• Offline-First IndexedDB state engine<br/>• Caches all actions during Wi-Fi deadzones<br/>• Zero data loss guarantee", body_style)
        ],
        [
            Paragraph("<b>Gate Security & GPS</b>", body_style),
            Paragraph("• Dynamic QR optical scanner on mobile/tablet<br/>• Handheld 2D barcode scanner gun support<br/>• GPS campus boundary geofence<br/>• Automated curfew delay & overdue alert", body_style),
            Paragraph("• Dynamic 30s token stops screenshot sharing<br/>• Automated SMS dispatch confirms arrival to parent<br/>• Eliminates gate disputes", body_style)
        ],
        [
            Paragraph("<b>AI Robot & Emergency SOS</b>", body_style),
            Paragraph("• CampusBot answers top 20 repetitive office FAQs<br/>• 1-Tap Emergency SOS button<br/>• Live GPS coordinate dispatch to security<br/>• Campus-wide siren alert broadcast", body_style),
            Paragraph("• Natural language processing in Odia/English<br/>• Auto-routes tickets by keyword detection<br/>• Real-time panic dispatch", body_style)
        ]
    ]
    t2 = Table(t2_data, colWidths=[130, 290, 300])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fef3c7')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t2)
    story.append(PageBreak())

    # PAGE 3: GPS Geo-Fencing & Dynamic QR Scanner
    story.append(Paragraph("Page 3: GPS Geo-Fencing & Dynamic QR Scanner Integration (In Pointers)", title_style))
    story.append(Paragraph("TEAM: BUG FINDERS &nbsp;|&nbsp; BPUT HACKATHON 2026", subtitle_style))

    gps_img_flowable = RLImage(img_gps_qr, width=310, height=170) if os.path.exists(img_gps_qr) else Paragraph("GPS Image", body_style)
    qr_img_flowable = RLImage(img_qr_gatepass, width=100, height=100) if os.path.exists(img_qr_gatepass) else Paragraph("QR Gatepass", body_style)

    p3_left = """
    <b>GPS & Dynamic QR Scanner Highlights (In Clear Pointers):</b><br/>
    • <b>Virtual GPS Perimeter:</b> Coordinates map entire BPUT campus boundary.<br/>
    • <b>Automated Gate Trigger:</b> Proximity triggers instant departure / arrival logging.<br/>
    • <b>Night Outing SOS:</b> Transmits live GPS coordinates to gate security and parents.<br/>
    • <b>Dynamic Rolling QR:</b> Regenerates cryptographic token every 30s to prevent screenshots.<br/>
    • <b>Rapid Optical Scan:</b> 0.3s handheld barcode scanner gun clears 500+ students in 15 minutes.<br/>
    • <b>Automated Parent SMS:</b> Dispatches arrival confirmation to parents automatically.
    """

    page3_top = Table([
        [Paragraph(p3_left, body_style), qr_img_flowable, gps_img_flowable]
    ], colWidths=[290, 110, 320])
    page3_top.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'CENTER'),
    ]))
    story.append(page3_top)
    story.append(Spacer(1, 6))

    t3_data = [
        [Paragraph("<b>Feature Area</b>", callout_style), Paragraph("<b>How It Works (In Clear Pointers)</b>", callout_style), Paragraph("<b>Core Campus Advantage (In Pointers)</b>", callout_style)],
        [
            Paragraph("<b>GPS Campus Perimeter Geo-Fencing</b>", body_style),
            Paragraph("• Maps exact virtual GPS boundary around BPUT campus perimeter.<br/>• Proximity triggers automated check-out/check-in verification.<br/>• <b>Emergency Night Outing SOS:</b> Transmits live GPS coordinates to security & parents.<br/>• Geo-stamped grievance reporting tags exact broken streetlight/hostel block coordinates.", body_style),
            Paragraph("• Complete student safety protection outside campus walls.<br/>• Eliminates disputed curfew arrival timestamps.<br/>• Coordinates dispatch for emergency assistance.", body_style)
        ],
        [
            Paragraph("<b>Dynamic Security QR Code Scanner</b>", body_style),
            Paragraph("• Generated QR incorporates rolling 30-second cryptographic token.<br/>• Animated optical laser line displayed on student screen.<br/>• Security guard scans QR via mobile camera viewfinder in 0.5s.<br/>• Supports external handheld 2D barcode scanner guns (0.3s rapid scan).", body_style),
            Paragraph("• 100% prevents screenshot pass sharing & forgery.<br/>• Handles peak curfew rush (500+ students) in 15 minutes.<br/>• Zero handwriting in paper registers.", body_style)
        ]
    ]
    t3 = Table(t3_data, colWidths=[150, 300, 270])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#dcfce7')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t3)
    story.append(PageBreak())

    # PAGE 4: Emergency SOS Alerts & 24/7 AI Robot
    story.append(Paragraph("Page 4: Emergency SOS Alerts & 24/7 AI Robot Assistant (In Pointers)", title_style))
    story.append(Paragraph("TEAM: BUG FINDERS &nbsp;|&nbsp; BPUT HACKATHON 2026", subtitle_style))

    sos_bot_flowable = RLImage(img_sos_bot, width=320, height=180) if os.path.exists(img_sos_bot) else Paragraph("SOS Bot Image", body_style)

    p4_left = """
    <b>Integrated Campus Safety & AI Automation (In Clear Pointers):</b><br/>
    • <b>1-Tap Emergency SOS Button:</b> Available on every screen for female students and late travel.<br/>
    • <b>Dual-Tone Audio Alarm:</b> Triggers campus siren sound alert at security guard post.<br/>
    • <b>Live GPS Location Broadcast:</b> Pings student location with 5-meter radius accuracy.<br/>
    • <b>Automated Parent Alert:</b> Sends instant high-priority SMS with Google Maps link.<br/>
    • <b>CampusBot 24/7 AI Robot:</b> Resolves top 20 repetitive office FAQs in seconds.<br/>
    • <b>Multilingual NLP:</b> Supports questions asked in English, Odia (ଓଡ଼ିଆ), and Hinglish.<br/>
    • <b>Direct Action Shortcuts:</b> Triggers gate pass, bonafide, and complaint forms directly.
    """

    page4_top = Table([
        [Paragraph(p4_left, body_style), sos_bot_flowable]
    ], colWidths=[400, 320])
    page4_top.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('RIGHTPADDING', (0,0), (0,0), 10),
    ]))
    story.append(page4_top)
    story.append(Spacer(1, 6))

    t4_data = [
        [Paragraph("<b>Safety & Alert Layer</b>", callout_style), Paragraph("<b>Key Operations (In Pointers)</b>", callout_style), Paragraph("<b>Campus Impact (In Pointers)</b>", callout_style)],
        [
            Paragraph("<b>1-Tap Emergency SOS Button</b>", body_style),
            Paragraph("• Available on every screen for female students and late travel.<br/>• Instantly broadcasts student live GPS coordinates to gate security.<br/>• Dispatches automated emergency SMS to parent/guardian.<br/>• Triggers flashing red alert banner on Chief Warden dashboard.", body_style),
            Paragraph("• Immediate emergency response during night travel.<br/>• Complete security accountability.<br/>• Operates offline via plain text SMS.", body_style)
        ],
        [
            Paragraph("<b>Targeted Push Notification Hub</b>", body_style),
            Paragraph("• Precision audience filters: branch, academic year, hostel block.<br/>• Verified Delivery Tracking: shows % of students who read it (e.g. 94% Read).<br/>• Compliance Action Button: tracks mandatory Acknowledge clicks.<br/>• High-priority SMS gateway sends text to phones for critical alerts.", body_style),
            Paragraph("• 100% replaces chaotic 2 AM WhatsApp groups.<br/>• Zero unread exam or water shutoff warnings.<br/>• Complete institutional communication record.", body_style)
        ]
    ]
    t4 = Table(t4_data, colWidths=[150, 310, 260])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fee2e2')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t4)
    story.append(PageBreak())

    # PAGE 5: Instant Bonafide & Hostel Maintenance Watchdog
    story.append(Paragraph("Page 5: Instant Bonafide Certificate & Hostel Maintenance Watchdog (In Pointers)", title_style))
    story.append(Paragraph("TEAM: BUG FINDERS &nbsp;|&nbsp; BPUT HACKATHON 2026", subtitle_style))

    qr_bonafide_flowable = RLImage(img_qr_bonafide, width=120, height=120) if os.path.exists(img_qr_bonafide) else Paragraph("QR Bonafide", body_style)

    p5_bonafide_text = """
    <b>Instant Verifiable Bonafide & NOC Clearance (In Clear Pointers):</b><br/>
    • <b>Cuts 3-Day Queue to 2 Seconds:</b> Automated check verifies &gt;75% attendance and ₹0 fee dues.<br/>
    • <b>Official PDF Letterhead:</b> Includes university header, reference number, registrar seal.<br/>
    • <b>Scannable Authenticity QR:</b> Cryptographic SHA-256 hash valid for scholarships & visas.<br/>
    • <b>Zero Paper Waste:</b> Completely eliminates paper stationery and physical queues.
    """

    page5_top = Table([
        [Paragraph(p5_bonafide_text, body_style), qr_bonafide_flowable]
    ], colWidths=[580, 140])
    page5_top.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'CENTER'),
    ]))
    story.append(page5_top)
    story.append(Spacer(1, 6))

    t5_data = [
        [Paragraph("<b>Maintenance & SLA Component</b>", callout_style), Paragraph("<b>How It Works (In Clear Pointers)</b>", callout_style), Paragraph("<b>Campus Benefit (In Pointers)</b>", callout_style)],
        [
            Paragraph("<b>The Leaking Tap Solution</b>", body_style),
            Paragraph("• Problem: Washroom tap leaks for 9 days because it was noted in a lost notebook.<br/>• CampusOS Fix: Student snaps photo; AI tags Plumbing Dept with 12h SLA.<br/>• Breached tickets turn bright RED and auto-escalate to Chief Warden Dr. Nayak.<br/>• Technician logs resolution with before/after photos and student 5-star rating.", body_style),
            Paragraph("• Eliminates 9-day neglected leaks.<br/>• Enforces SLA accountability.<br/>• Prevents slipping hazards and thousands of liters of wasted water.", body_style)
        ],
        [
            Paragraph("<b>Campus Recurring Issue Heatmap</b>", body_style),
            Paragraph("• Aggregates maintenance tickets by building wing, floor, and equipment type.<br/>• Automatically flags hotspots (e.g. 14 pipe leaks on Aryabhatta Block B 3rd Floor).<br/>• Alerts estate board to replace decaying pipeline instead of temporary patch repairs.", body_style),
            Paragraph("• Data-driven capital infrastructure budgeting.<br/>• Prevents catastrophic pipeline bursts.<br/>• Maximizes maintenance ROI.", body_style)
        ]
    ]
    t5 = Table(t5_data, colWidths=[160, 310, 250])
    t5.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f3e8ff')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t5)
    story.append(PageBreak())

    # PAGE 6: Quantified Impact & 30-Day Rollout Blueprint
    story.append(Paragraph("Page 6: Quantified ROI Impact & 30-Day Rollout Blueprint (In Pointers)", title_style))
    story.append(Paragraph("TEAM: BUG FINDERS &nbsp;|&nbsp; BPUT HACKATHON 2026", subtitle_style))

    chart_flowable = RLImage(img_impact, width=320, height=170) if os.path.exists(img_impact) else Paragraph("Impact Chart", body_style)

    p6_roi = """
    <b>Quantified Measurable Advantages (In Clear Pointers):</b><br/>
    • <b>90% Queue Time Saved:</b> Routine tasks cut from hours to under 60 seconds.<br/>
    • <b>₹90,000 Saved Monthly:</b> 30% mess kitchen food waste cut (~750 kg food saved).<br/>
    • <b>9-Day Leaks Eliminated:</b> Maintenance tickets resolved in &lt;12 hours under SLA.<br/>
    • <b>100% Student Body Inclusivity:</b> Feature phone USSD (*789#) + Odia language support.<br/>
    • <b>1-Tap Safety:</b> Emergency SOS broadcast with live GPS geofence tracking.<br/>
    • <b>Zero Data Loss:</b> Offline-First PWA functions seamlessly during Wi-Fi deadzones.
    """

    page6_top = Table([
        [Paragraph(p6_roi, body_style), chart_flowable]
    ], colWidths=[400, 320])
    page6_top.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('RIGHTPADDING', (0,0), (0,0), 10),
    ]))
    story.append(page6_top)
    story.append(Spacer(1, 6))

    t6_data = [
        [Paragraph("<b>Rollout Wave</b>", callout_style), Paragraph("<b>Key Deployment Steps (In Pointers)</b>", callout_style), Paragraph("<b>Institutional Transformation (In Pointers)</b>", callout_style)],
        [
            Paragraph("<b>Weeks 1 - 2 (Wave 1)</b>", body_style),
            Paragraph("• Deploy optical QR scanners & NFC ID readers at gate booths.<br/>• Launch 1-Tap Emergency SOS buttons & campus GPS perimeter geofence.<br/>• Migrate official notices from WhatsApp to targeted push broadcast with read receipts.", body_style),
            Paragraph("• Zero gate bottlenecks.<br/>• Immediate student security enhancement.<br/>• 100% verified notice delivery.", body_style)
        ],
        [
            Paragraph("<b>Weeks 3 - 4 (Wave 2)</b>", body_style),
            Paragraph("• Launch 4 PM Eating Tonight? dinner poll cutting 30% kitchen waste.<br/>• Deploy AI grievance auto-routing with strict 12h SLA timers.<br/>• Install IoT ultrasonic water tank sensors to prevent dry hostel taps.", body_style),
            Paragraph("• Immediate ₹90,000 monthly food savings.<br/>• End to 9-day leaking tap negligence.<br/>• Proactive water management.", body_style)
        ],
        [
            Paragraph("<b>Month 2 (Wave 3)</b>", body_style),
            Paragraph("• Activate 2-second verifiable Bonafide & NOC PDF generator.<br/>• Enable recurring issue heatmap for administrative budgeting.<br/>• Roll out 24/7 CampusBot AI to resolve 80% of routine student questions.", body_style),
            Paragraph("• 100% paperless administration.<br/>• End to clerical queues.<br/>• Data-driven infrastructure upgrades.", body_style)
        ]
    ]
    t6 = Table(t6_data, colWidths=[130, 310, 280])
    t6.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ccfbf1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t6)

    footer_text = """
    <br/>
    <b>Built with ❤️ by Team BUG FINDERS for BPUT Hackathon 2026 • Problem Statement 07 (Fretbox)</b>
    """
    story.append(Paragraph(footer_text, body_style))

    doc.build(story)
    print(f"Classy PDF successfully created at {output_path}")

if __name__ == "__main__":
    public_dir = os.path.join(os.path.dirname(__file__), "public")
    img_dir = os.path.join(public_dir, "images")
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(img_dir, exist_ok=True)

    pptx_path = os.path.join(public_dir, "campusos_bugfinders.pptx")
    pdf_path = os.path.join(public_dir, "campusos_bugfinders.pdf")

    build_pptx(pptx_path, img_dir)
    build_pdf(pdf_path, img_dir)
