# IE HUB DEVELOPMENT ROADMAP
## Inclusive Education Hub for Africa
### ADRES Group | Derek Muriuki | May 2026

---

## 🎯 PROJECT GOALS

**Primary Goal:** Launch a fully functional, accessible, multilingual Community of Practice platform for inclusive education across Africa.

**Soft Launch:** June 16, 2026 (Day of the African Child) - 3 weeks from now  
**Full Launch:** Week 26 (November 2026)

---

## 📅 DEVELOPMENT PHASES

### PHASE 1: FOUNDATION (Week 1-2) — WEBSITE FIRST ⭐
**Sprint 1: May 26 - June 8, 2026**

#### Backend Tasks
- [x] Review master instructions document
- [x] Initialize Django project structure
- [x] Configure Docker Compose (Django, PostgreSQL, Redis, MinIO)
- [x] Create CustomUser model with role-based permissions
- [x] Implement JWT authentication (djangorestframework-simplejwt)
- [x] Create Country model + seed 54 African countries
- [x] Set up basic API structure (DRF ViewSets)
- [x] Configure CORS for React frontend
- [ ] Set up Celery + Redis for async tasks
- [x] Write initial pytest suite

#### Frontend Tasks
- [x] Initialize Vite + React + TypeScript project
- [x] Configure Tailwind CSS with custom theme
- [x] Set up React Router v6 with route structure
- [x] Create authentication context (AuthProvider)
- [x] Set up i18next with 5 languages (en, fr, ar, pt, sw) — English complete; others pending
- [x] Integrate UserWay accessibility toolbar
- [x] Build core components:
  - [x] Navbar (responsive, accessible)
  - [x] Footer
  - [x] SkipToContent component
  - [x] LoadingSpinner
  - [x] ErrorBoundary
- [x] Create authentication pages:
  - [x] Login
  - [x] Register
  - [x] Forgot Password
- [ ] Set up TanStack Query for API calls — when backend ready
- [ ] Configure Zustand for state management — when platform phase starts

#### DevOps Tasks
- [x] Create docker-compose.yml
- [x] Create Dockerfile for Django
- [x] Create Dockerfile for React (production build)
- [x] Set up .env.example files
- [x] Create README.md with setup instructions
- [ ] Initialize Git repository
- [ ] Set up GitHub repository

**Sprint 1 Deliverables:**
- ✅ Functional authentication system
- ✅ Docker environment running locally
- ✅ Basic frontend shell with routing
- ✅ Database migrations working
- ✅ API accessible from React

---

### PHASE 2: PUBLIC WEBSITE (Week 3-4)
**Sprint 2: June 9-15, 2026 (SOFT LAUNCH SPRINT)**

#### Backend Tasks
- [x] Create Resource model + API (PDF, images, videos)
- [x] Create NewsArticle model + API
- [x] Create Event model + API
- [x] Create ContactMessage model + API
- [ ] Create Topic, DisabilityType reference models
- [ ] Implement file upload to MinIO
- [ ] Create admin interface for content management
- [ ] Seed initial content (20 resources minimum)

#### Frontend Tasks
- [x] Build public pages:
  - [x] Home page (hero, featured resources, latest news)
  - [x] About page (IE Hub, LM International, stakeholders)
  - [x] Resource Library (filterable, searchable, downloadable)
  - [x] Resource Detail page
  - [x] News & Events page
  - [x] News Detail page
  - [x] Contact page
  - [x] Accessibility Statement page
- [x] Implement search and filter functionality
- [x] Add pagination for lists
- [x] Create newsletter signup form
- [x] Mobile responsive testing (layout; formal QA pending)

#### Accessibility Tasks
- [ ] Run Axe DevTools on all public pages
- [ ] Fix all critical/serious violations
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA)
- [ ] Add proper ARIA labels
- [ ] Ensure 4.5:1 contrast ratio minimum

**Sprint 2 Deliverables (SOFT LAUNCH):**
- ✅ Public website live with 9 pages
- ✅ 20+ resources in library
- ✅ WCAG 2.2 AA compliant (public pages)
- ✅ Mobile responsive
- ✅ SSL + Cloudflare CDN active

---

### PHASE 3: MEMBERSHIP SYSTEM (Week 5-6)
**Sprint 3: June 16-29, 2026**

#### Backend Tasks
- [ ] Implement email verification workflow
- [ ] Create MemberProfile model + API
- [ ] Build admin approval workflow
- [ ] Create ExpertiseTag model
- [ ] Implement role-based permissions (5 roles)
- [ ] Create member directory API with filters
- [ ] Build preference settings API
- [ ] Set up SendGrid/Mailgun email service

#### Frontend Tasks
- [ ] Registration form (multi-step)
- [ ] Email verification page
- [ ] Pending approval page
- [ ] Member profile page (view/edit)
- [ ] Member directory page with search
- [ ] Accessibility preferences page
- [ ] Profile avatar upload

**Sprint 3 Deliverables:**
- ✅ Member registration working
- ✅ Email verification functional
- ✅ Admin approval workflow
- ✅ Member profiles viewable

---

### PHASE 4: FORUM CORE (Week 7-9)
**Sprint 4: June 30 - July 13, 2026**

#### Backend Tasks
- [ ] Create ForumCategory model + API
- [ ] Create ForumThread model + API
- [ ] Create ForumPost model + API
- [ ] Create PostReaction model
- [ ] Seed 23 forum categories:
  - [ ] 11 country groups
  - [ ] 9 thematic groups
  - [ ] 3 general groups
- [ ] Implement Django Channels for WebSocket
- [ ] Create WebSocket consumer for real-time posts
- [ ] Implement pagination for threads/posts
- [ ] Add file attachment support (max 10MB)

#### Frontend Tasks
- [ ] Forum home page (category list)
- [ ] Thread list view (with filters)
- [ ] Thread detail view (with posts)
- [ ] Create thread form
- [ ] Post editor (rich text, accessible)
- [ ] Reaction system UI
- [ ] WebSocket connection for real-time updates
- [ ] File upload in posts

**Sprint 4 Deliverables:**
- ✅ Forum fully functional
- ✅ Real-time posting working
- ✅ 23 categories seeded
- ✅ File attachments working

---

### PHASE 5: MODERATION & MESSAGING (Week 10-11)
**Sprint 5: July 14-27, 2026**

#### Backend Tasks
- [ ] Create ModerationReport model + API
- [ ] Create ModerationAction model + API
- [ ] Create PrivateMessage model + API
- [ ] Create Conversation model
- [ ] WebSocket consumer for private messages
- [ ] Notification triggers for moderation
- [ ] Build moderation queue API
- [ ] Implement content flagging system

#### Frontend Tasks
- [ ] Report content modal
- [ ] Private messages inbox
- [ ] Conversation view (threaded)
- [ ] Compose new message
- [ ] Admin moderation dashboard
- [ ] Member approval queue (admin)
- [ ] Content review interface

**Sprint 5 Deliverables:**
- ✅ Private messaging functional
- ✅ Moderation system working
- ✅ Admin can review reports

---

### PHASE 6: LEARNING MANAGEMENT SYSTEM (Week 12-14)
**Sprint 6: July 28 - August 17, 2026**

#### Backend Tasks
- [ ] Create Course model + API
- [ ] Create Module model + API
- [ ] Create Lesson model + API (video, document, text)
- [ ] Create Quiz model + API
- [ ] Create QuizQuestion, QuizAnswer models
- [ ] Create Enrollment model
- [ ] Create LessonProgress model
- [ ] Create Certificate model
- [ ] Implement certificate generation (ReportLab)
- [ ] Create Celery task for certificate PDF
- [ ] Video streaming configuration
- [ ] Course completion tracking

#### Frontend Tasks
- [ ] Course catalog page
- [ ] Course detail page
- [ ] Enrollment flow
- [ ] Course player interface:
  - [ ] Video player
  - [ ] Document viewer
  - [ ] Progress tracker
- [ ] Quiz interface
- [ ] Results page
- [ ] Certificate download
- [ ] My Courses dashboard

**Sprint 6 Deliverables:**
- ✅ Full LMS functional
- ✅ Courses playable
- ✅ Quizzes working
- ✅ Certificates generating

---

### PHASE 7: DASHBOARDS & ANALYTICS (Week 15-16)
**Sprint 7: August 18-31, 2026**

#### Backend Tasks
- [ ] Create PlatformAnalytics model
- [ ] Create PageView tracking middleware
- [ ] Implement KPI calculation tasks
- [ ] Create Celery Beat scheduled jobs
- [ ] Build admin dashboard API endpoints
- [ ] Create analytics aggregation queries
- [ ] Set up Google Analytics 4

#### Frontend Tasks
- [ ] Super Admin dashboard:
  - [ ] KPI cards (members, resources, downloads)
  - [ ] Analytics charts (Recharts)
  - [ ] Member growth chart
  - [ ] Forum activity chart
  - [ ] Course enrollment chart
- [ ] Steering Committee dashboard
- [ ] Regional Admin dashboard
- [ ] Member personal dashboard

**Sprint 7 Deliverables:**
- ✅ All 4 dashboard types functional
- ✅ Real-time KPI tracking
- ✅ Analytics charts working

---

### PHASE 8: GOVERNANCE & NOTIFICATIONS (Week 17-18)
**Sprint 8: September 1-14, 2026**

#### Backend Tasks
- [ ] Create PlatformOwnership model + API
- [ ] Create Notification model + API
- [ ] WebSocket consumer for notifications
- [ ] Email notification Celery tasks
- [ ] Create notification triggers:
  - [ ] New thread mention
  - [ ] Post reply
  - [ ] Private message
  - [ ] Content approval
  - [ ] Moderation action
- [ ] Implement handover workflow

#### Frontend Tasks
- [ ] Notification bell component
- [ ] Notification dropdown panel
- [ ] Notifications page (full list)
- [ ] Notification preferences
- [ ] Governance panel (ownership history)
- [ ] Handover wizard
- [ ] Real-time notification updates

**Sprint 8 Deliverables:**
- ✅ Notification system working
- ✅ Email notifications sending
- ✅ Governance tracking functional

---

### PHASE 9: MULTILINGUAL & RTL (Week 19-21)
**Sprint 9: September 15 - October 5, 2026**

#### Backend Tasks
- [ ] Integrate GTranslate API
- [ ] Create translation cache system
- [ ] Build language detection middleware
- [ ] Create translated content models
- [ ] API endpoints for language switching

#### Frontend Tasks
- [ ] Complete all i18next translation files:
  - [ ] English (en) - 100%
  - [ ] French (fr)
  - [ ] Arabic (ar)
  - [ ] Portuguese (pt)
  - [ ] Swahili (sw)
- [ ] Implement RTL layout for Arabic
- [ ] Test all pages in all 5 languages
- [ ] Language switcher component
- [ ] RTL-specific CSS fixes
- [ ] Date/number formatting per locale

**Sprint 9 Deliverables:**
- ✅ All 5 languages working
- ✅ Arabic RTL functional
- ✅ Language switcher on every page

---

### PHASE 10: ACCESSIBILITY AUDIT (Week 22-23)
**Sprint 10: October 6-19, 2026**

#### Tasks
- [ ] Run Axe DevTools on entire platform
- [ ] Fix all critical violations
- [ ] Fix all serious violations
- [ ] Fix moderate violations where possible
- [ ] Keyboard navigation audit (every page)
- [ ] Screen reader testing:
  - [ ] NVDA (Windows)
  - [ ] VoiceOver (macOS/iOS)
  - [ ] TalkBack (Android)
- [ ] User testing with persons with disabilities
- [ ] Color contrast verification
- [ ] Touch target size verification (44x44px)
- [ ] Focus indicator visibility check
- [ ] Form label/error association
- [ ] Alt text review (all images)
- [ ] Video captions check
- [ ] Create WCAG 2.2 AA Conformance Report
- [ ] Update Accessibility Statement

**Sprint 10 Deliverables:**
- ✅ Zero critical accessibility violations
- ✅ WCAG 2.2 AA Conformance Report
- ✅ Accessibility Statement finalized

---

### PHASE 11: PERFORMANCE & SECURITY (Week 24-25)
**Sprint 11: October 20 - November 2, 2026**

#### Performance Tasks
- [ ] Run Lighthouse on all pages
- [ ] Achieve 90+ performance score
- [ ] Optimize images (WebP conversion)
- [ ] Implement lazy loading
- [ ] Code splitting (React.lazy)
- [ ] Database query optimization
- [ ] Redis caching implementation
- [ ] CDN configuration
- [ ] Gzip/Brotli compression
- [ ] Test on 3G network (must load <3s)
- [ ] Run WebPageTest
- [ ] Load testing (Apache Bench/Locust)

#### Security Tasks
- [ ] OWASP Top 10 checklist review
- [ ] SQL injection testing
- [ ] XSS vulnerability testing
- [ ] CSRF protection verification
- [ ] Rate limiting implementation
- [ ] Input validation review
- [ ] File upload security check
- [ ] Password strength enforcement
- [ ] Session management review
- [ ] HTTPS enforcement
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Dependency vulnerability scan
- [ ] Penetration testing (basic)

**Sprint 11 Deliverables:**
- ✅ All pages load <3s on 3G
- ✅ Lighthouse score 90+
- ✅ Security vulnerabilities patched

---

### PHASE 12: DEPLOYMENT & HANDOVER (Week 26)
**Sprint 12: November 3-16, 2026**

#### Deployment Tasks
- [ ] Production server setup
- [ ] Domain configuration (DNS)
- [ ] SSL certificate (Let's Encrypt)
- [ ] Cloudflare CDN setup
- [ ] Database backup automation
- [ ] Monitoring setup:
  - [ ] Sentry (error tracking)
  - [ ] Uptime monitoring
  - [ ] Performance monitoring
- [ ] Log aggregation setup
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Production environment variables
- [ ] Database migration to production
- [ ] Initial content seeding

#### Documentation Tasks
- [ ] Admin User Manual
- [ ] Moderation Guide
- [ ] Content Manager Guide
- [ ] API Documentation
- [ ] Deployment Documentation
- [ ] Troubleshooting Guide
- [ ] Database Schema Documentation

#### Training Tasks
- [ ] Staff training sessions (up to 10 LM staff):
  - [ ] Session 1: Platform Overview
  - [ ] Session 2: Content Management
  - [ ] Session 3: Member Management
  - [ ] Session 4: Moderation
  - [ ] Session 5: Analytics & Reporting
- [ ] Create training videos
- [ ] Q&A sessions

#### Handover Tasks
- [ ] Source code handover (GitHub)
- [ ] Database access credentials
- [ ] Server access credentials
- [ ] Third-party service credentials
- [ ] Domain/DNS management transfer
- [ ] SSL certificate management
- [ ] Monitoring dashboard access
- [ ] Email service credentials
- [ ] Payment gateway credentials (if applicable)

**Sprint 12 Deliverables:**
- ✅ Production platform live
- ✅ All documentation complete
- ✅ Staff trained
- ✅ Full handover completed

---

## 🚀 IMMEDIATE NEXT STEPS (TODAY)

### Step 1: Project Structure Setup
```bash
ie-hub/
├── backend/              # Django project
├── frontend/             # React project
├── docker-compose.yml    # Local development
├── .env.example          # Environment template
└── README.md             # Setup instructions
```

### Step 2: Backend Foundation
- Initialize Django project
- Configure PostgreSQL connection
- Set up CustomUser model
- Implement JWT authentication
- Create Country model

### Step 3: Frontend Foundation
- Initialize React + TypeScript
- Configure Tailwind CSS
- Set up routing
- Create authentication flow
- Add accessibility toolbar

### Step 4: Docker Configuration
- Django container
- PostgreSQL container
- Redis container
- MinIO container
- React dev server

---

## 📊 SUCCESS METRICS

### Soft Launch (June 16, 2026)
- ✅ Public website accessible
- ✅ 20+ resources in library
- ✅ Member registration open
- ✅ Basic forum live
- ✅ WCAG 2.2 AA (public pages)
- ✅ Mobile responsive
- ✅ SSL active

### Full Launch (Week 26)
- ✅ 500+ registered members
- ✅ 100+ forum threads
- ✅ 10+ courses live
- ✅ 2000+ resource downloads
- ✅ 5 languages working
- ✅ Zero critical accessibility issues
- ✅ 90+ Lighthouse score
- ✅ <3s page load on 3G

---

## ⚠️ RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tight deadline (3 weeks to soft launch) | HIGH | Focus on MVP scope only, defer LMS to post-launch |
| Accessibility compliance complexity | MEDIUM | Start accessibility testing from Sprint 1, not end |
| Arabic RTL layout issues | MEDIUM | Test RTL early, use Tailwind RTL utilities |
| Resource loading for 20 items | LOW | Use seed data, client provides content by June 10 |
| Production hosting setup | MEDIUM | Start deployment prep in Sprint 2, not Sprint 12 |

---

## 🎯 CURRENT FOCUS (Week 1)

**Primary Goal:** Get a working Django + React + Docker environment running with authentication.

**Today's Tasks:**
1. ✅ Review master instructions
2. ✅ Create project structure (frontend)
3. ⏳ Initialize Django backend — next after website API wiring
4. ✅ Initialize React frontend (public website)
5. ⏳ Set up Docker Compose
6. ⏳ Implement CustomUser + JWT auth — platform phase
7. ⏳ Build login/register pages — platform phase
8. ⏳ Test end-to-end authentication flow — platform phase

**By End of Week 1:**
- Docker environment running
- Login/register working
- Database migrations applied
- Basic API responding
- React app serving

---

*Roadmap created: May 26, 2026*  
*Next review: June 16, 2026 (Soft Launch)*  
*Developer: Derek Muriuki | ADRES Group*
