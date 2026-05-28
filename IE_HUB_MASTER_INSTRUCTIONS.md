# IE HUB — INCLUSIVE EDUCATION HUB FOR AFRICA
## Master Development Instructions & System Architecture
### Version 1.0 | ADRES Group | Derek Muriuki

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Client & Stakeholders](#2-client--stakeholders)
3. [What The System Is](#3-what-the-system-is)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Database Models](#6-database-models)
7. [Backend — Django Apps to Build](#7-backend--django-apps-to-build)
8. [API Endpoints](#8-api-endpoints)
9. [Frontend — React Pages & Components](#9-frontend--react-pages--components)
10. [Dashboards](#10-dashboards)
11. [Accessibility Requirements](#11-accessibility-requirements)
12. [Multilingual Requirements](#12-multilingual-requirements)
13. [Forum System](#13-forum-system)
14. [LMS System](#14-lms-system)
15. [Membership & Auth System](#15-membership--auth-system)
16. [Moderation System](#16-moderation-system)
17. [Governance & Ownership System](#17-governance--ownership-system)
18. [Analytics & KPIs](#18-analytics--kpis)
19. [Notifications System](#19-notifications-system)
20. [Search & Filtering](#20-search--filtering)
21. [File & Media Management](#21-file--media-management)
22. [Security Requirements](#22-security-requirements)
23. [Performance Requirements](#23-performance-requirements)
24. [Deployment Architecture](#24-deployment-architecture)
25. [Environment Setup](#25-environment-setup)
26. [Project File Structure](#26-project-file-structure)
27. [What To Build First — Priority Order](#27-what-to-build-first--priority-order)
28. [June 16th 2026 Soft Launch Scope](#28-june-16th-2026-soft-launch-scope)
29. [Definition of Done](#29-definition-of-done)

---

## 1. PROJECT OVERVIEW

| Field | Value |
|---|---|
| Project Name | Inclusive Education Hub for Africa (IE Hub) |
| Client | LM International (Läkarmissionen) |
| Contractor | ADRES Group |
| Developer | Derek Muriuki |
| Type | Continental African eLearning + Community Platform |
| Target Launch | June 16, 2026 (Day of the African Child) |
| Full Delivery | 26 weeks from contract start |
| Location | Hosted from Nairobi, Kenya |
| Scope | Continental Africa — 11 LM country offices |

---

## 2. CLIENT & STAKEHOLDERS

### Steering Committee (13 Organizations)
These organizations govern the platform. They have elevated roles in the system.

1. Ministry of Education
2. FIDA
3. Help a Child (HaC)
4. ADRA
5. Humanity & Inclusion
6. Lutheran World Federation (LWF)
7. Kenya Society for Deaf Children (KSDC)
8. Sense International
9. United Disabled Persons of Kenya (UDPK)
10. Free Pentecostal Fellowship of Kenya (FPFK)
11. IAS Denmark
12. DORCAS
13. National Council for Persons with Disabilities (NCPWD)

### LM International Country Offices (11)
These offices are regional admins in the system.

1. Kenya
2. Uganda
3. Tanzania
4. Sudan
5. South Sudan
6. Chad
7. Ethiopia
8. Somalia
9. Rwanda including Burundi
10. DRC
11. Niger including Mali

### Target User Groups
- Children with disabilities and learners
- Teachers and educational staff
- Government officials and policymakers (Formal Duty Bearers / FDBs)
- OPDs, CSOs and FBOs (Moral Duty Bearers / MDBs)
- Academic institutions and researchers
- International partners and donors
- LM International country office staff

---

## 3. WHAT THE SYSTEM IS

The IE Hub is a continental digital platform with TWO interconnected components:

### Component 1 — Public Website
Open access. No login required. Serves the general public, policymakers, donors and anyone interested in inclusive education in Africa.

**Pages:**
- Home — hero, mission statement, featured resources, latest news, partners, newsletter signup
- About — about IE Hub, about LM International, stakeholders, partners
- Resource Library — filterable downloadable library of reports, publications, toolkits, policy briefs
- Research and Policy — policy frameworks, research findings, evidence-based advocacy resources
- Training — upcoming training sessions, webinars, past recordings with captions, registration
- News and Events — blog posts, upcoming events, past events archive
- Donate — donation form and payment gateway
- Contact — contact form, social media links, office details
- Accessibility Statement — WCAG 2.2 AA conformance, known issues, remediation plan

### Component 2 — Members Forum (Community of Practice)
Approved members only. This is the core of the platform — a Community of Practice (CoP) where practitioners across Africa learn, collaborate and advocate together.

**Features:**
- Member registration with email verification and approval workflow
- Country-based and thematic discussion groups
- Topics, threads and posts
- Private messaging
- File uploads within threads
- Events calendar
- Moderation dashboard
- Accessible notifications
- User preference settings
- Member directory
- Course enrollment and progress (via LMS)

### Component 3 — Admin Dashboards
Three levels of dashboard:
1. Super Admin — full platform control (ADRES / LM International tech lead)
2. Steering Committee Admin — governance, content approval, member management
3. Regional Admin — country-level moderation and management
4. Member Dashboard — personal profile, courses, forum activity, notifications

---

## 4. TECHNOLOGY STACK

### Backend
```
Python 3.12+
Django 5.x
Django REST Framework (DRF)
Django Channels (WebSockets for real-time)
Celery (background tasks)
Redis (cache + Celery broker)
PostgreSQL 16 (primary database)
```

### Frontend
```
React 18 + TypeScript
Vite (build tool)
React Router v6
TanStack Query (data fetching)
Zustand (state management)
Tailwind CSS (styling)
Recharts (analytics charts)
i18next (frontend multilingual)
```

### Infrastructure
```
Docker + Docker Compose
Nginx (reverse proxy)
Gunicorn (WSGI server)
Daphne (ASGI server for WebSockets)
MinIO (media/file storage — S3 compatible)
Cloudflare (CDN + DDoS protection)
Elasticsearch or Meilisearch (search)
```

### Third Party Services
```
GTranslate API (machine translation)
UserWay (accessibility widget — JavaScript snippet)
Stripe or Flutterwave (donations)
SendGrid or Mailgun (transactional email)
Google Analytics 4 (platform analytics)
Axe DevTools (automated accessibility testing)
```

### Development Tools
```
Git + GitHub
GitHub Actions (CI/CD)
pytest + pytest-django (testing)
Black + isort (Python formatting)
ESLint + Prettier (JS formatting)
Docker Compose (local dev)
```

---

## 5. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE CDN                        │
│              (DDoS protection, edge caching)                 │
└─────────────────────┬───────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────┐
│                       NGINX (Reverse Proxy)                   │
│         /api/* → Gunicorn    /ws/* → Daphne                  │
│         /* → React static build                              │
└──────┬──────────────┬──────────────────────────────────────┘
       │              │
┌──────▼──────┐  ┌────▼──────┐
│  Gunicorn   │  │  Daphne   │
│  (HTTP API) │  │ (WebSocket│
│  Django DRF │  │  Channels)│
└──────┬──────┘  └────┬──────┘
       │              │
┌──────▼──────────────▼──────────────────────────────────────┐
│                    DJANGO APPLICATION                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Public  │ │  Forum   │ │   LMS    │ │    Admin     │  │
│  │  Website │ │   App    │ │   App    │ │  Dashboard   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Members │ │  Media   │ │  Search  │ │  Analytics   │  │
│  │   App    │ │   App    │ │   App    │ │     App      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└──────┬──────────────┬──────────────┬──────────────────────┘
       │              │              │
┌──────▼──────┐  ┌────▼──────┐  ┌───▼──────────┐
│ PostgreSQL  │  │   Redis   │  │    MinIO     │
│  (Primary   │  │  (Cache + │  │   (Media +   │
│  Database)  │  │  Celery)  │  │    Files)    │
└─────────────┘  └───────────┘  └──────────────┘
```

---

## 6. DATABASE MODELS

### 6.1 Users App

```python
# CustomUser
- id (UUID)
- email (unique)
- username
- first_name
- last_name
- role (choices: SUPER_ADMIN, STEERING_COMMITTEE, REGIONAL_ADMIN, MEMBER, PUBLIC)
- country (FK → Country)
- organization
- organization_type (choices: OPD, CSO, FBO, GOVERNMENT, ACADEMIC, PRIVATE, INDIVIDUAL)
- bio
- avatar
- is_verified (email verified)
- is_approved (manually approved by admin)
- is_active
- preferred_language (choices: en, fr, ar, pt, sw)
- accessibility_preferences (JSONField)
- date_joined
- last_login

# MemberProfile
- user (OneToOne → CustomUser)
- professional_title
- expertise_areas (ManyToMany → ExpertiseTag)
- countries_of_work (ManyToMany → Country)
- linkedin_url
- twitter_url
- website_url
- is_visible_in_directory

# Country
- code (ISO 3166-1 alpha-2)
- name
- name_fr
- name_ar
- name_pt
- name_sw
- region (choices: EAST_AFRICA, WEST_AFRICA, CENTRAL_AFRICA, NORTH_AFRICA, SOUTHERN_AFRICA)
- lm_office (boolean — has LM country office)
- flag_emoji

# SteeringCommitteeOrganization
- name
- abbreviation
- country (FK → Country)
- contact_person (FK → CustomUser)
- joined_date
- is_active

# PlatformOwnership
- organization (FK → SteeringCommitteeOrganization)
- start_date
- end_date
- handover_document (FileField)
- handover_completed (boolean)
- notes
```

### 6.2 Public Website App

```python
# Page
- title (translated)
- slug
- content (translated, RichTextField)
- meta_description (translated)
- is_published
- published_at
- author (FK → CustomUser)
- approved_by (FK → CustomUser)
- approval_status (choices: DRAFT, PENDING, APPROVED, REJECTED)

# Resource
- title (translated)
- description (translated)
- resource_type (choices: REPORT, PUBLICATION, TOOLKIT, POLICY_BRIEF, RESEARCH, VIDEO, AUDIO, OTHER)
- file (FileField → MinIO)
- external_url
- thumbnail
- language (choices: en, fr, ar, pt, sw, MULTILINGUAL)
- countries (ManyToMany → Country)
- topics (ManyToMany → Topic)
- disability_types (ManyToMany → DisabilityType)
- audience (ManyToMany → AudienceType)
- published_at
- download_count
- is_featured
- approval_status

# NewsPost
- title (translated)
- slug
- content (translated, RichTextField)
- excerpt (translated)
- featured_image
- category (choices: NEWS, BLOG, PRESS_RELEASE, STORY)
- author (FK → CustomUser)
- published_at
- is_featured
- tags (ManyToMany → Tag)
- approval_status

# Event
- title (translated)
- description (translated)
- event_type (choices: WEBINAR, WORKSHOP, CONFERENCE, TRAINING, OTHER)
- start_datetime
- end_datetime
- timezone
- location_type (choices: ONLINE, IN_PERSON, HYBRID)
- location_address
- online_link
- registration_link
- max_participants
- is_members_only
- countries (ManyToMany → Country)
- approval_status

# Topic
- name (translated)
- slug
- description (translated)
- icon

# DisabilityType
- name (translated)
- slug

# AudienceType
- name (translated)
- slug

# NewsletterSubscription
- email
- language_preference
- country (FK → Country)
- subscribed_at
- is_active
- unsubscribe_token
```

### 6.3 Forum App

```python
# ForumCategory
- name (translated)
- slug
- description (translated)
- category_type (choices: COUNTRY, THEMATIC, GENERAL, ANNOUNCEMENT)
- country (FK → Country, nullable — for country groups)
- topic (FK → Topic, nullable — for thematic groups)
- icon
- order
- is_private (members only vs open to all)
- moderators (ManyToMany → CustomUser)
- created_at

# ForumThread
- category (FK → ForumCategory)
- title
- slug
- author (FK → CustomUser)
- is_pinned
- is_locked
- is_announcement
- view_count
- last_activity
- created_at
- updated_at
- approval_status

# ForumPost
- thread (FK → ForumThread)
- author (FK → CustomUser)
- content (RichTextField)
- parent (FK → self, nullable — for nested replies)
- attachments (ManyToMany → MediaFile)
- is_approved
- is_edited
- edited_at
- edited_by (FK → CustomUser)
- created_at
- reaction_counts (JSONField)

# ForumReaction
- post (FK → ForumPost)
- user (FK → CustomUser)
- reaction_type (choices: LIKE, INSIGHTFUL, HELPFUL, CELEBRATE)
- created_at

# PrivateMessage
- sender (FK → CustomUser)
- recipient (FK → CustomUser)
- subject
- content
- is_read
- read_at
- created_at
- thread_id (groups messages in a conversation)

# ModerationReport
- reported_by (FK → CustomUser)
- content_type (choices: POST, THREAD, MESSAGE, PROFILE)
- content_id (ID of reported item)
- reason (choices: SPAM, HARASSMENT, HATE_SPEECH, MISINFORMATION, INAPPROPRIATE, OTHER)
- description
- status (choices: PENDING, UNDER_REVIEW, RESOLVED, DISMISSED)
- reviewed_by (FK → CustomUser, nullable)
- reviewed_at
- resolution_notes
- created_at

# ModerationAction
- report (FK → ModerationReport)
- action_type (choices: WARNING, POST_REMOVED, USER_SUSPENDED, USER_BANNED, NO_ACTION)
- performed_by (FK → CustomUser)
- reason
- duration_days (nullable — for suspensions)
- created_at
```

### 6.4 LMS App

```python
# Course
- title (translated)
- slug
- description (translated)
- thumbnail
- instructor (FK → CustomUser)
- category (FK → Topic)
- level (choices: BEGINNER, INTERMEDIATE, ADVANCED)
- language (choices: en, fr, ar, pt, sw)
- duration_hours
- is_free
- is_members_only
- is_published
- certificate_template (FileField)
- created_at

# Module
- course (FK → Course)
- title (translated)
- description (translated)
- order
- is_required

# Lesson
- module (FK → Module)
- title (translated)
- content_type (choices: VIDEO, DOCUMENT, TEXT, QUIZ, SCORM)
- content (RichTextField)
- video_url
- document (FileField)
- duration_minutes
- order
- is_required
- transcript (TextField — for WCAG captions requirement)

# Quiz
- lesson (FK → Lesson, nullable)
- module (FK → Module, nullable)
- title (translated)
- passing_score (percentage)
- max_attempts
- time_limit_minutes

# QuizQuestion
- quiz (FK → Quiz)
- question_text (translated)
- question_type (choices: MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER)
- order
- points

# QuizAnswer
- question (FK → QuizQuestion)
- answer_text (translated)
- is_correct

# Enrollment
- user (FK → CustomUser)
- course (FK → Course)
- enrolled_at
- completed_at
- progress_percentage
- certificate_issued

# LessonProgress
- enrollment (FK → Enrollment)
- lesson (FK → Lesson)
- completed_at
- time_spent_minutes

# Certificate
- enrollment (FK → Enrollment)
- issued_at
- certificate_number (unique)
- pdf_file (FileField)
```

### 6.5 Analytics App

```python
# PageView
- path
- user (FK → CustomUser, nullable)
- country (FK → Country, nullable)
- session_id
- device_type
- browser
- referrer
- created_at

# ResourceDownload
- resource (FK → Resource)
- user (FK → CustomUser, nullable)
- country (FK → Country, nullable)
- created_at

# ForumMetric (daily snapshot)
- date
- total_threads
- new_threads
- total_posts
- new_posts
- active_users
- new_members

# PlatformKPI (monthly snapshot)
- month
- year
- total_members
- new_members
- active_members
- total_resources
- resource_downloads
- total_threads
- total_posts
- countries_represented
- courses_completed
- certificates_issued
```

---

## 7. BACKEND — DJANGO APPS TO BUILD

Create these Django apps inside the project:

```
ie_hub/
├── apps/
│   ├── users/          # Auth, profiles, roles, membership
│   ├── public/         # Public website content
│   ├── forum/          # Forum, threads, posts, private messages
│   ├── lms/            # Courses, lessons, quizzes, enrollment
│   ├── moderation/     # Reports, actions, moderation queue
│   ├── governance/     # Steering committee, ownership, handover
│   ├── analytics/      # KPIs, metrics, tracking
│   ├── notifications/  # In-app + email notifications
│   ├── search/         # Search and filtering
│   ├── media/          # File uploads, media management
│   └── core/           # Shared utilities, base models, middleware
```

### For each app you need to create:
- `models.py` — database models as defined above
- `serializers.py` — DRF serializers for API
- `views.py` — DRF ViewSets
- `urls.py` — URL routing
- `admin.py` — Django admin registration
- `permissions.py` — custom permissions
- `filters.py` — django-filter FilterSets
- `tasks.py` — Celery async tasks
- `signals.py` — Django signals
- `tests/` — pytest test files

---

## 8. API ENDPOINTS

### Auth Endpoints
```
POST   /api/auth/register/           — Register new member
POST   /api/auth/verify-email/       — Verify email token
POST   /api/auth/login/              — JWT login
POST   /api/auth/refresh/            — Refresh JWT token
POST   /api/auth/logout/             — Logout
POST   /api/auth/password-reset/     — Request password reset
POST   /api/auth/password-confirm/   — Confirm password reset
GET    /api/auth/me/                 — Get current user
PATCH  /api/auth/me/                 — Update current user
```

### Users Endpoints
```
GET    /api/users/                   — List members (directory)
GET    /api/users/{id}/              — Member profile
GET    /api/users/{id}/activity/     — Member activity
PATCH  /api/users/{id}/              — Update profile
GET    /api/users/steering-committee/ — List SC organizations
```

### Public Website Endpoints
```
GET    /api/resources/               — List resources (filterable)
GET    /api/resources/{id}/          — Resource detail
POST   /api/resources/{id}/download/ — Log download + get file URL
GET    /api/news/                    — List news posts
GET    /api/news/{slug}/             — News post detail
GET    /api/events/                  — List events
GET    /api/events/{id}/             — Event detail
POST   /api/newsletter/subscribe/    — Newsletter subscription
GET    /api/topics/                  — List topics
GET    /api/countries/               — List countries
```

### Forum Endpoints
```
GET    /api/forum/categories/        — List forum categories
GET    /api/forum/categories/{id}/   — Category detail with threads
GET    /api/forum/threads/           — List threads
POST   /api/forum/threads/           — Create thread
GET    /api/forum/threads/{id}/      — Thread detail with posts
PATCH  /api/forum/threads/{id}/      — Update thread
DELETE /api/forum/threads/{id}/      — Delete thread
GET    /api/forum/posts/             — List posts in thread
POST   /api/forum/posts/             — Create post
PATCH  /api/forum/posts/{id}/        — Edit post
DELETE /api/forum/posts/{id}/        — Delete post
POST   /api/forum/posts/{id}/react/  — React to post
POST   /api/forum/report/            — Report content
GET    /api/messages/                — List conversations
POST   /api/messages/                — Send message
GET    /api/messages/{thread_id}/    — Conversation detail
```

### LMS Endpoints
```
GET    /api/courses/                 — List courses
GET    /api/courses/{slug}/          — Course detail
POST   /api/courses/{id}/enroll/     — Enroll in course
GET    /api/enrollments/             — My enrollments
GET    /api/enrollments/{id}/        — Enrollment detail with progress
POST   /api/lessons/{id}/complete/   — Mark lesson complete
GET    /api/quizzes/{id}/            — Get quiz
POST   /api/quizzes/{id}/submit/     — Submit quiz answers
GET    /api/certificates/            — My certificates
GET    /api/certificates/{id}/download/ — Download certificate PDF
```

### Admin Endpoints (requires admin role)
```
GET    /api/admin/dashboard/         — Dashboard stats
GET    /api/admin/members/           — All members
PATCH  /api/admin/members/{id}/approve/ — Approve member
GET    /api/admin/content/pending/   — Content approval queue
PATCH  /api/admin/content/{id}/approve/ — Approve content
GET    /api/admin/moderation/reports/ — Moderation reports queue
PATCH  /api/admin/moderation/{id}/resolve/ — Resolve report
GET    /api/admin/analytics/         — Full analytics data
GET    /api/admin/governance/        — Governance and ownership data
POST   /api/admin/governance/handover/ — Initiate ownership handover
```

### WebSocket Endpoints (Django Channels)
```
ws://domain/ws/notifications/       — Real-time notifications
ws://domain/ws/forum/{thread_id}/   — Real-time post updates in thread
ws://domain/ws/messages/            — Real-time private messages
```

---

## 9. FRONTEND — REACT PAGES & COMPONENTS

### Public Pages (No auth required)
```
/                          — Home
/about                     — About IE Hub
/resources                 — Resource Library (filterable grid)
/resources/:id             — Resource Detail + Download
/research-policy           — Research and Policy
/training                  — Training page
/news                      — News and Events list
/news/:slug                — News post detail
/events                    — Events list
/events/:id                — Event detail
/donate                    — Donate page
/contact                   — Contact page
/accessibility             — Accessibility Statement
```

### Auth Pages
```
/register                  — Member registration form
/verify-email/:token       — Email verification
/login                     — Login
/forgot-password           — Password reset request
/reset-password/:token     — Password reset confirm
/pending-approval          — Waiting for account approval page
```

### Member Pages (Auth required)
```
/dashboard                 — Member dashboard
/profile                   — My profile
/profile/edit              — Edit profile
/profile/accessibility     — Accessibility preferences
/members                   — Member directory
/members/:id               — Member profile view
/messages                  — Private messages inbox
/messages/:threadId        — Conversation
/notifications             — All notifications
/my-courses                — My enrolled courses
/certificates              — My certificates
```

### Forum Pages (Auth required)
```
/forum                     — Forum home (all categories)
/forum/:categorySlug       — Category view (threads list)
/forum/:categorySlug/:threadId — Thread view (posts)
/forum/new-thread           — Create thread
```

### LMS Pages (Auth required)
```
/courses                   — Course catalog
/courses/:slug             — Course detail + enrollment
/courses/:slug/learn       — Course player (lessons)
/courses/:slug/quiz/:id    — Quiz page
/courses/:slug/certificate — Certificate download
```

### Admin Pages (Admin roles only)
```
/admin                     — Admin dashboard home
/admin/members             — Members management
/admin/members/:id         — Member detail + approve/suspend
/admin/content             — Content approval queue
/admin/content/:type/:id   — Content review
/admin/forum               — Forum moderation
/admin/moderation          — Reports queue
/admin/moderation/:id      — Report detail + action
/admin/analytics           — Platform analytics
/admin/governance          — Governance + ownership
/admin/governance/handover — Initiate handover
/admin/settings            — Platform settings
```

### Key React Components to Build

#### Layout Components
```
Navbar.tsx                 — Main navigation with language switcher
Footer.tsx                 — Footer with newsletter signup
Sidebar.tsx                — Forum/dashboard sidebar
A11yToolbar.tsx            — Accessibility toolbar (UserWay integration)
SkipToContent.tsx          — Skip to main content link
BreadcrumbNav.tsx          — Breadcrumb navigation
```

#### Public Components
```
HeroSection.tsx            — Homepage hero
ResourceCard.tsx           — Resource item card
ResourceGrid.tsx           — Filterable resource grid
ResourceFilter.tsx         — Filter panel (type, topic, country, language)
NewsCard.tsx               — News post card
EventCard.tsx              — Event card
EventCalendar.tsx          — Events calendar view
PartnerLogos.tsx           — Partners/stakeholders logo grid
NewsletterSignup.tsx       — Newsletter subscription form
DonateForm.tsx             — Donation form
ContactForm.tsx            — Contact form
StatsBanner.tsx            — Impact statistics banner
```

#### Forum Components
```
ForumCategoryList.tsx      — Forum home categories
ThreadList.tsx             — List of threads in category
ThreadCard.tsx             — Thread preview card
PostList.tsx               — Posts in a thread
PostCard.tsx               — Individual post with reactions
PostEditor.tsx             — Rich text post editor (accessible)
ReactionBar.tsx            — Like/helpful/insightful reactions
ReportModal.tsx            — Report content modal
NewThreadForm.tsx          — Create thread form
PrivateMessageList.tsx     — Message conversations list
PrivateMessageThread.tsx   — Conversation view
```

#### LMS Components
```
CourseCard.tsx             — Course preview card
CourseCatalog.tsx          — Course listing grid
CoursePlayer.tsx           — Lesson player (video + document + text)
LessonList.tsx             — Course sidebar with progress
QuizPlayer.tsx             — Quiz interface
ProgressBar.tsx            — Course/lesson progress
CertificateView.tsx        — Certificate display
```

#### Dashboard Components
```
MemberDashboard.tsx        — Member home dashboard
ActivityFeed.tsx           — Recent forum and course activity
NotificationBell.tsx       — Notification icon with count
NotificationList.tsx       — Notifications panel
ProfileCard.tsx            — User profile card
MemberDirectory.tsx        — Searchable member list
```

#### Admin Components
```
AdminLayout.tsx            — Admin sidebar + topbar layout
StatsCards.tsx             — KPI stat cards grid
MembersTable.tsx           — Members data table with actions
ContentQueue.tsx           — Content approval queue table
ModerationQueue.tsx        — Reports queue table
AnalyticsCharts.tsx        — Charts (Recharts) for analytics
GovernancePanel.tsx        — Ownership and handover management
HandoverWizard.tsx         — Step-by-step handover process
```

#### Shared/UI Components
```
Button.tsx                 — Accessible button
Input.tsx                  — Accessible form input
Select.tsx                 — Accessible select
Textarea.tsx               — Accessible textarea
Modal.tsx                  — Accessible modal dialog
Toast.tsx                  — Accessible toast notifications
Badge.tsx                  — Status badge
Avatar.tsx                 — User avatar with fallback
Pagination.tsx             — Accessible pagination
LoadingSpinner.tsx         — Loading state
EmptyState.tsx             — Empty content state
ErrorBoundary.tsx          — Error boundary component
FileUpload.tsx             — Accessible file upload
RichTextEditor.tsx         — Accessible rich text editor
LanguageSwitcher.tsx       — Language selector
CountrySelect.tsx          — Country dropdown
SearchBar.tsx              — Global search input
FilterPanel.tsx            — Reusable filter panel
```

---

## 10. DASHBOARDS

### 10.1 Member Dashboard
**Route:** `/dashboard`
**Shows:**
- Welcome message with name
- Enrolled courses with progress bars
- Recent forum activity (threads they posted in)
- Notifications (unread count + list)
- Recent resources (bookmarked or downloaded)
- Upcoming events in their country
- Quick links: New Thread, Browse Courses, Resource Library

### 10.2 Steering Committee / Admin Dashboard
**Route:** `/admin`
**Shows:**

**KPI Cards Row:**
- Total registered members
- New members this month
- Active members this month (posted at least once)
- Total resources
- Total forum posts this month
- Countries represented

**Charts (Recharts):**
- Line chart — member growth over time
- Bar chart — forum posts per month
- Pie chart — members by country/region
- Bar chart — resource downloads by type
- Line chart — course enrollments over time

**Tables:**
- Pending member approvals (with Approve / Reject buttons)
- Content approval queue (resources, news, events pending)
- Recent moderation reports (with status)
- Recent platform activity feed

### 10.3 Analytics Dashboard
**Route:** `/admin/analytics`
**Shows:**
- Date range selector
- Members: total, new, active, by country, by organization type
- Forum: threads created, posts created, most active categories, most active members
- Resources: downloads by resource type, most downloaded, downloads by country
- LMS: enrollments, completions, certificates issued, most popular courses
- Geographic map showing member distribution across Africa

### 10.4 Governance Dashboard
**Route:** `/admin/governance`
**Shows:**
- Current platform owner (organization + contact)
- Ownership timeline (past and future handovers)
- Handover status (upcoming / in progress / completed)
- Steering committee member list with roles
- Platform health metrics summary
- Initiate Handover button → HandoverWizard

---

## 11. ACCESSIBILITY REQUIREMENTS

**This is non-negotiable. Every component must be built accessible from the start.**

### WCAG 2.2 Level AA Requirements

```
PERCEIVABLE
- Alt text on every image (descriptive, not filename)
- Captions and transcripts on all video and audio
- Colour contrast minimum 4.5:1 for normal text
- Colour contrast minimum 3:1 for large text (18px+ or 14px+ bold)
- No information conveyed by colour alone
- Text resizable to 200% without layout breaking
- No content flashes more than 3 times per second

OPERABLE
- All functionality reachable by keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)
- Visible focus indicator on every focusable element (min 3px outline)
- Skip to main content link as first element in DOM
- No keyboard traps
- Descriptive link text — never "click here" or "read more" alone
- Touch targets minimum 44x44px
- Session timeout warnings with option to extend
- Page titles descriptive and unique per page

UNDERSTANDABLE
- lang attribute on html element, updated when language changes
- Error messages specific — "Please enter a valid email address" not "Invalid input"
- Labels on every form field — never placeholder text alone
- No unexpected context changes on select or focus
- Consistent navigation across all pages
- Instructions for complex interactions

ROBUST
- Valid semantic HTML — use nav, main, header, footer, section, article, aside
- ARIA roles, labels and descriptions where native HTML insufficient
- Never override ARIA without understanding implications
- Tested with NVDA + Chrome, VoiceOver + Safari, TalkBack + Chrome Mobile
- Works in Chrome, Firefox, Safari, Edge
```

### UserWay A11y Toolbar Integration
Add this to your HTML head — it handles the A11y toolbar:
```html
<script>
  window.UserWay = window.UserWay || {};
  window.UserWay.accountApiKey = 'YOUR_USERWAY_KEY';
</script>
<script async src='https://cdn.userway.org/widget.js'></script>
```

**Toolbar features it provides automatically:**
- Text size increase/decrease
- High contrast mode
- Dyslexia-friendly font (OpenDyslexic)
- Line spacing control
- Pause animations
- Hide images
- Saturation control
- Enlarged cursor
- Highlight links
- Tooltips
- Language toggle

### Accessibility Testing Process
```
1. Automated — Run Axe DevTools on every page (CI/CD pipeline)
2. Keyboard — Navigate every page using only keyboard
3. Screen reader — Test with NVDA + Chrome and VoiceOver + Safari
4. Manual audit — Check WCAG 2.2 AA checklist per page
5. User testing — Sessions with persons with disabilities
   covering: blind/low vision, deaf/hard of hearing, motor impairment, cognitive/neurodivergent
```

---

## 12. MULTILINGUAL REQUIREMENTS

**Five languages: English (en), French (fr), Arabic (ar), Portuguese (pt), Swahili (sw)**

### Language to Country Office Mapping
```
English + Swahili: Kenya, Uganda, Tanzania, South Sudan
French: Rwanda, Burundi, DRC, Niger, Mali, Chad
Arabic: Sudan, Somalia
Arabic + English: South Sudan
```

### Backend (Django)
```python
# Install
pip install django-modeltranslation

# settings.py
LANGUAGES = [
    ('en', 'English'),
    ('fr', 'Français'),
    ('ar', 'العربية'),
    ('pt', 'Português'),
    ('sw', 'Kiswahili'),
]
LANGUAGE_CODE = 'en'

# For RTL Arabic
# Add middleware to detect language and set dir attribute
```

### Arabic RTL Support
```
CRITICAL: Arabic is right-to-left. Every layout must support RTL.

In CSS:
- Use logical properties: margin-inline-start not margin-left
- Use start/end not left/right
- Add [dir="rtl"] selectors for exceptions

In HTML:
<html lang="ar" dir="rtl"> when Arabic is active

In React:
- Detect language from i18next
- Set document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
- Set document.documentElement.lang = lang
```

### Frontend (React)
```
# Install
npm install i18next react-i18next i18next-http-backend

# Translation files structure
src/locales/
├── en/
│   ├── common.json
│   ├── forum.json
│   ├── lms.json
│   └── auth.json
├── fr/
├── ar/
├── pt/
└── sw/
```

### Machine Translation
- Use GTranslate API for dynamic content translation
- Human review required for: policy documents, advocacy content, legal text
- Machine translation acceptable for: forum posts, news, events, general content

---

## 13. FORUM SYSTEM

### Member Onboarding Flow
```
1. User visits /register
2. Fills registration form:
   - Full name
   - Email
   - Password
   - Country
   - Organization name
   - Organization type (OPD, CSO, FBO, Government, Academic, Individual)
   - Role/title
   - Brief bio
   - How did you hear about IE Hub
3. System sends verification email
4. User clicks verification link → email confirmed
5. Admin receives notification of new pending member
6. Admin reviews profile in /admin/members
7. Admin approves or rejects (with reason)
8. User receives approval/rejection email
9. On approval: user can now access forum and LMS
```

### Regional and Thematic Structure
```
Forum Categories:

COUNTRY GROUPS (one per LM country office)
- Kenya Community
- Uganda Community
- Tanzania Community
- Sudan Community
- South Sudan Community
- Chad Community
- Ethiopia Community
- Somalia Community
- Rwanda & Burundi Community
- DRC Community
- Niger & Mali Community

THEMATIC GROUPS
- Policy and Advocacy
- Teacher Training and Capacity Building
- Assistive Technology
- Research and Evidence
- Gender and Inclusive Education
- Education in Emergencies
- Early Childhood Inclusive Education
- OPD Collaboration
- Resource Sharing

GENERAL
- Introductions (for new members)
- Announcements (admins only post, members read)
- Help and Support

Each category has:
- Assigned moderators (regional admins for country groups, thematic leads for thematic groups)
- Language setting (default language for that group)
- Privacy setting (members only or public view)
```

### Moderation Workflow
```
LEVEL 1 — Automated
- Spam detection (keyword filter)
- Link checking (malicious URL detection)
- File type validation on uploads
- Rate limiting on posts

LEVEL 2 — Community Reporting
- Any member can report a post/thread/message
- Report goes to moderation queue
- Reported content flagged but not removed immediately

LEVEL 3 — Moderator Review
- Category moderator receives notification
- Reviews flagged content within 24 hours
- Can: approve (keep), edit, remove, escalate

LEVEL 4 — Admin Escalation
- Serious violations escalate to regional admin
- Regional admin can: suspend user (temporary), escalate further

LEVEL 5 — Super Admin
- Ban user permanently
- Remove all content
- Notify steering committee if necessary

SANCTIONS:
- Warning (private message to user)
- Post removed (with notification)
- Thread locked
- Temporary suspension (1, 7, 30 days)
- Permanent ban
```

---

## 14. LMS SYSTEM

### Course Structure
```
Course
└── Module 1
    ├── Lesson 1 (Video with transcript)
    ├── Lesson 2 (Document)
    ├── Lesson 3 (Text content)
    └── Quiz 1
└── Module 2
    ├── Lesson 4
    └── Lesson 5
└── Final Quiz
└── Certificate (auto-generated on passing)
```

### Certificate Generation
```python
# Use ReportLab to generate PDF certificates
# (Derek has prior ReportLab experience from school diary project)

# Certificate contains:
- IE Hub logo and LM International logo
- Member full name
- Course title
- Completion date
- Unique certificate number
- QR code linking to verification page
- Digital signature
```

### WCAG Requirements for LMS
```
- All videos must have captions (VTT format)
- All audio must have transcripts
- Documents must be accessible PDFs
- Video player must be keyboard controllable
- Quiz must be completable by keyboard only
- Progress saved automatically (no timeout issues)
```

---

## 15. MEMBERSHIP & AUTH SYSTEM

### User Roles and Permissions

```python
SUPER_ADMIN
- Full access to everything
- Can create/delete any content
- Can manage all users
- Can initiate governance handover
- Can access all dashboards

STEERING_COMMITTEE
- Can approve/reject member applications
- Can approve/reject content (resources, news, events)
- Can view full analytics dashboard
- Can participate in governance decisions
- Can moderate all forum categories
- Can post announcements

REGIONAL_ADMIN (LM Country Office staff)
- Can moderate their country's forum group
- Can approve members from their country
- Can post in all categories
- Can view regional analytics

MEMBER (Approved)
- Can access all forum categories
- Can post, reply, react
- Can send private messages
- Can enroll in courses
- Can upload resources (pending approval)
- Can submit events (pending approval)
- Can view member directory

PUBLIC (Not logged in)
- Can view public website
- Can download resources
- Can view news and events
- Cannot access forum
- Cannot access LMS
```

### JWT Authentication
```python
# settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

---

## 16. MODERATION SYSTEM

### Content Approval Workflow (Public Website)
```
RESOURCES:
Member uploads resource → Status: PENDING
↓
Admin/SC member receives notification
↓
Reviewer opens resource in admin → checks:
  - Is it relevant to inclusive education?
  - Is it appropriate for the audience?
  - Is metadata complete (title, description, topics, countries)?
  - Is the file accessible (PDF is tagged, video has captions)?
↓
APPROVE → Resource published, uploader notified
REJECT → Uploader notified with reason, can revise and resubmit
REQUEST CHANGES → Uploader notified with specific changes needed

Same flow for NEWS POSTS and EVENTS.
```

---

## 17. GOVERNANCE & OWNERSHIP SYSTEM

### Platform Ownership Model
The IE Hub platform ownership rotates among Steering Committee member organizations. This means:

- One organization is the "Platform Owner" at any given time
- They have primary responsibility for editorial direction, moderation oversight and stakeholder coordination
- Ownership rotates on a defined schedule (e.g. annually or bi-annually)
- Handover must be documented and formally completed

### PlatformOwnership Model (Django)
Already defined in Section 6.1

### Handover Process (HandoverWizard in React)
```
Step 1 — Outgoing Owner Prepares
- Documents current platform state
- Lists all active admin users and their roles
- Exports current KPI report
- Prepares handover notes

Step 2 — Incoming Owner Designated
- Steering committee votes or agrees on next owner
- Incoming organization contact person identified
- New admin accounts created for incoming team

Step 3 — Transition Period (2 weeks)
- Outgoing and incoming teams both have admin access
- Knowledge transfer sessions
- Incoming team reviews all documentation

Step 4 — Formal Handover
- Handover document signed digitally
- Outgoing team access revoked
- Incoming team confirmed as Platform Owner
- All steering committee notified
- Record created in PlatformOwnership model

Step 5 — Post-Handover Review (30 days)
- Incoming team confirms all access working
- Any issues escalated to ADRES support
- Handover marked COMPLETED
```

---

## 18. ANALYTICS & KPIs

### Development Phase KPIs
```
- Number of pages built vs planned
- Accessibility score (Axe DevTools) — target: zero critical violations
- Page load time — target: under 3 seconds on 3G
- Test coverage — target: 80%+
- Sprint velocity (story points completed per sprint)
```

### Deployment Phase KPIs (Year 1 Targets)

**Membership:**
- Month 1: 50 registered members
- Month 3: 150 members
- Month 6: 300 members
- Month 12: 500+ members
- Countries represented by month 6: minimum 8 of 11 LM office countries

**Forum Engagement:**
- Month 1: 20 threads created
- Month 3: 100 threads, 300 posts
- Month 6: 50 active members per month (posted at least once)
- Month 12: 30% of registered members post at least once per month

**Resources:**
- Month 3: 50 resources in library
- Month 6: 150 resources
- Month 6: 500 downloads
- Month 12: 2000+ downloads

**LMS:**
- Month 3: 3 courses available
- Month 6: 50 course enrollments
- Month 12: 30 certificates issued

**Regional Adoption:**
- All 11 LM country office regions active in forum by month 6
- At least 5 country groups with 10+ members each by month 6

---

## 19. NOTIFICATIONS SYSTEM

### Notification Types
```python
NOTIFICATION_TYPES = [
    'new_reply',           # Someone replied to your post
    'thread_new_post',     # New post in thread you follow
    'mention',             # Someone @mentioned you
    'new_message',         # New private message
    'member_approved',     # Your membership was approved
    'member_rejected',     # Your membership was rejected
    'content_approved',    # Your resource/news/event was approved
    'content_rejected',    # Your content was rejected
    'moderation_action',   # Action taken on your account
    'course_reminder',     # Course activity reminder
    'certificate_issued',  # Course certificate ready
    'new_event',           # New event in your country
    'announcement',        # Steering committee announcement
    'handover_initiated',  # Platform ownership handover started
]
```

### Notification Delivery
```
IN-APP: Real-time via Django Channels WebSocket
EMAIL: Via Celery task → SendGrid/Mailgun
  - Immediate: membership decisions, moderation actions, messages
  - Digest (daily): forum activity, new resources
  - Never: (user can configure preferences)
```

---

## 20. SEARCH & FILTERING

### Global Search
```
Searches across: resources, news posts, events, forum threads, members, courses

Powered by: Meilisearch (recommended — fast, typo-tolerant, easy to set up)
or Elasticsearch (more powerful but heavier)

Results grouped by type with relevance ranking
Supports all 5 languages
```

### Resource Library Filters
```
Filter by:
- Resource type (Report, Publication, Toolkit, Policy Brief, Research, Video, Audio)
- Topic (from Topic model)
- Country (from Country model)
- Language (en, fr, ar, pt, sw, Multilingual)
- Disability type (from DisabilityType model)
- Target audience (Teacher, Policymaker, OPD, Parent, Learner)
- Date range (published between X and Y)

Sort by:
- Most recent
- Most downloaded
- Alphabetical
```

### Forum Filters
```
Filter by:
- Category (country group or thematic group)
- Date range
- Author
- Has attachments

Sort by:
- Most recent activity
- Most posts
- Most views
- Pinned first
```

---

## 21. FILE & MEDIA MANAGEMENT

### MinIO Setup
```
MinIO is an S3-compatible self-hosted object storage.
Use django-storages with S3 backend pointing to MinIO.

Buckets:
- ie-hub-resources    (public read — downloadable resources)
- ie-hub-media        (public read — images, thumbnails)
- ie-hub-private      (private — certificates, admin documents)
- ie-hub-forum        (members only — forum attachments)

File size limits:
- Resources: 50MB max
- Forum attachments: 10MB max
- Profile avatars: 2MB max
- Course videos: 500MB max (or use external video hosting like Vimeo)
```

### Allowed File Types
```
Documents: PDF, DOCX, PPTX, XLSX
Images: JPG, PNG, WebP, GIF (no EXIF data — strip on upload)
Video: MP4, WebM (with captions VTT file required)
Audio: MP3, WAV (with transcript required)
```

---

## 22. SECURITY REQUIREMENTS

```python
# Django Security Settings
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True

# Rate limiting (django-ratelimit or nginx)
# Login: 5 attempts per 15 minutes
# Registration: 3 per hour per IP
# API: 100 requests per minute per user
# File upload: 10 per hour per user

# Content Security Policy headers via django-csp
# Input sanitization on all user content
# SQL injection protection via Django ORM (always use ORM not raw SQL)
# XSS protection via Django template auto-escaping + DOMPurify on frontend
# File upload validation: check MIME type, not just extension
# Virus scanning on uploaded files (ClamAV)
```

---

## 23. PERFORMANCE REQUIREMENTS

```
Target: Page load under 3 seconds on 3G mobile

Strategies:
- Cloudflare CDN for static assets and media
- Redis caching for API responses (cache timeout: 5 minutes for public content)
- Database query optimization: select_related, prefetch_related on all list views
- Pagination: maximum 20 items per page on all list endpoints
- Image optimization: WebP format, lazy loading, responsive srcset
- Code splitting in React: route-based splitting with React.lazy
- Gzip/Brotli compression via Nginx
- Database connection pooling via pgBouncer
- Celery for all background tasks (email sending, PDF generation, analytics)

Performance monitoring:
- Django Debug Toolbar in development
- Sentry for error tracking in production
- New Relic or Datadog for APM (optional)
```

---

## 24. DEPLOYMENT ARCHITECTURE

### Docker Compose (Production)
```yaml
services:
  web:          # Gunicorn serving Django
  ws:           # Daphne serving Django Channels
  nginx:        # Reverse proxy
  db:           # PostgreSQL
  redis:        # Cache and Celery broker
  celery:       # Background task worker
  celery-beat:  # Scheduled tasks
  minio:        # File storage
  search:       # Meilisearch
```

### Server Recommendation
```
Hosting: Truehost Africa (Nairobi) or AWS Cape Town (af-south-1)
Minimum specs:
  - 4 vCPU
  - 8GB RAM
  - 100GB SSD
  - Ubuntu 24.04 LTS

CDN: Cloudflare (free tier minimum, Pro recommended)
SSL: Cloudflare or Let's Encrypt via Certbot
Backups: Daily automated PostgreSQL dumps + MinIO replication
```

### GitHub Actions CI/CD Pipeline
```yaml
# On push to main:
1. Run pytest (must pass)
2. Run Axe CLI accessibility tests (must pass)
3. Run ESLint + Black (must pass)
4. Build React (must succeed)
5. Build Docker image
6. Deploy to staging
7. Run smoke tests on staging
8. Manual approval gate
9. Deploy to production
```

---

## 25. ENVIRONMENT SETUP

### Backend Setup
```bash
# Clone repo
git clone https://github.com/dee-mee/ie-hub.git
cd ie-hub

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment variables (.env file)
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:pass@localhost:5432/iehub
REDIS_URL=redis://localhost:6379/0
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
EMAIL_HOST=smtp.sendgrid.net
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-key
GTRANSLATE_API_KEY=your-gtranslate-key
USERWAY_API_KEY=your-userway-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Run migrations
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser

# Load initial data (countries, topics, disability types)
python3 manage.py loaddata initial_data.json

# Run development server
python3 manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local

# .env.local
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_USERWAY_KEY=your-userway-key

# Run development server
npm run dev

# Build for production
npm run build
```

### Docker Setup (Recommended)
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

---

## 26. PROJECT FILE STRUCTURE

```
ie-hub/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── ie_hub/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── apps/
│       ├── users/
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   ├── urls.py
│       │   ├── admin.py
│       │   ├── permissions.py
│       │   ├── signals.py
│       │   └── tests/
│       ├── public/
│       ├── forum/
│       ├── lms/
│       ├── moderation/
│       ├── governance/
│       ├── analytics/
│       ├── notifications/
│       ├── search/
│       ├── media/
│       └── core/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── public/
│   │   └── locales/    ← i18n translation files
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── router.tsx
│       ├── api/        ← API call functions
│       ├── components/ ← Reusable components
│       ├── pages/      ← Route-level pages
│       ├── hooks/      ← Custom React hooks
│       ├── store/      ← Zustand state stores
│       ├── types/      ← TypeScript interfaces
│       ├── utils/      ← Helper functions
│       ├── locales/    ← Translation JSON files
│       └── styles/     ← Global CSS
├── docker-compose.yml
├── docker-compose.dev.yml
├── nginx/
│   └── nginx.conf
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── GOVERNANCE.md
```

---

## 27. WHAT TO BUILD FIRST — PRIORITY ORDER

### Sprint 1 (Week 1-2) — Foundation
```
Backend:
- Django project setup with settings
- CustomUser model + JWT auth
- Country model + initial data
- Basic API structure
- Docker setup

Frontend:
- Vite + React + TypeScript setup
- Tailwind CSS configuration
- Router setup
- Auth context (login/register/logout)
- i18next setup with 5 languages
- A11y toolbar (UserWay) integration
- SkipToContent component
- Navbar and Footer
```

### Sprint 2 (Week 3-4) — Public Website
```
Backend:
- Resource model + API
- News model + API
- Event model + API
- Topic, Country, DisabilityType models

Frontend:
- Home page
- Resource Library page with filters
- Resource detail + download
- News list + detail
- Events list + detail
- About page
- Contact page
- Accessibility Statement page
```

### Sprint 3 (Week 5-6) — Auth + Membership
```
Backend:
- Registration with email verification
- Member approval workflow
- Member profile API
- Role-based permissions

Frontend:
- Register page (full form)
- Email verification page
- Login page
- Pending approval page
- Member profile page
- Member directory page
- Accessibility preferences page
```

### Sprint 4 (Week 7-9) — Forum Core
```
Backend:
- ForumCategory model + API
- ForumThread model + API
- ForumPost model + API
- Initial categories seeded (country + thematic groups)
- Django Channels WebSocket for real-time posts

Frontend:
- Forum home (categories)
- Thread list in category
- Thread view with posts
- Post editor (rich text, accessible)
- Create thread form
- Reactions
- Real-time updates via WebSocket
```

### Sprint 5 (Week 10-11) — Moderation + Messages
```
Backend:
- ModerationReport model + API
- ModerationAction model + API
- PrivateMessage model + API
- WebSocket for messages

Frontend:
- Report content modal
- Private messages inbox
- Conversation view
- Admin moderation queue
- Member approval queue
```

### Sprint 6 (Week 12-14) — LMS
```
Backend:
- Course, Module, Lesson models + API
- Quiz, QuizQuestion, QuizAnswer models + API
- Enrollment, LessonProgress models + API
- Certificate generation (ReportLab)
- Celery task for certificate PDF

Frontend:
- Course catalog
- Course detail + enrollment
- Course player (video + document + text)
- Quiz interface
- Progress tracking
- Certificate download
```

### Sprint 7 (Week 15-16) — Dashboards + Analytics
```
Backend:
- Analytics models + tracking middleware
- KPI calculation tasks (Celery Beat daily)
- Admin dashboard API endpoints

Frontend:
- Admin dashboard with KPI cards
- Analytics charts (Recharts)
- Governance dashboard
- Member dashboard (personal)
```

### Sprint 8 (Week 17-18) — Governance + Notifications
```
Backend:
- PlatformOwnership model + API
- Notification model + API
- WebSocket for real-time notifications
- Email notification Celery tasks

Frontend:
- Notification bell + panel
- Notifications page
- Governance panel
- Handover wizard
```

### Sprint 9 (Week 19-21) — Multilingual + RTL
```
- Complete all translation files (en, fr, ar, pt, sw)
- RTL layout testing and fixes for Arabic
- GTranslate API integration for dynamic content
- Language switcher fully working
- Test all pages in all 5 languages
```

### Sprint 10 (Week 22-23) — Accessibility Audit
```
- Run Axe DevTools on every page
- Fix all critical and serious violations
- Keyboard navigation audit of entire platform
- Screen reader testing (NVDA + VoiceOver)
- User testing sessions with persons with disabilities
- WCAG 2.2 AA Conformance Report
- Accessibility Statement page finalized
```

### Sprint 11 (Week 24-25) — Performance + Security
```
- Performance testing (Lighthouse, WebPageTest)
- Fix pages loading over 3 seconds on 3G
- Security audit (OWASP top 10 checklist)
- Penetration testing (basic)
- Load testing
- Final bug fixes
```

### Sprint 12 (Week 26) — Launch
```
- Production deployment
- DNS configuration
- SSL certificate
- Cloudflare setup
- Monitoring setup (Sentry)
- Staff training (up to 10 LM staff)
- Handover documentation
- Admin manual
- Moderation guide
- Source code handover
```

---

## 28. JUNE 16TH 2026 SOFT LAUNCH SCOPE

June 16th is Day of the African Child. It is a meaningful launch date.
Full platform in 5 weeks is not viable. A soft launch IS viable with this scope:

### June 16th Soft Launch — Must Have
```
✅ Public website live (Home, About, Resources, News, Events, Contact, Accessibility)
✅ Resource Library with at least 20 resources loaded
✅ Member registration open (with approval workflow)
✅ Basic forum with country and thematic categories
✅ English language fully functional
✅ WCAG 2.2 AA on all public pages
✅ Mobile responsive
✅ UserWay A11y toolbar active
✅ Cloudflare CDN active
✅ SSL certificate active
✅ Basic analytics (Google Analytics 4)
```

### Post-June 16th — Full Platform (by week 26)
```
⏳ Full LMS with courses and certificates
⏳ Private messaging
⏳ All 5 languages + Arabic RTL
⏳ Advanced analytics dashboard
⏳ Governance and handover system
⏳ Donation system
⏳ Full moderation dashboard
⏳ Notification system (email + real-time)
⏳ WCAG 2.2 AA Conformance Report (full)
⏳ Staff training sessions
⏳ Complete handover package
```

---

## 29. DEFINITION OF DONE

A feature is DONE when:

```
✅ Backend API endpoint written and tested (pytest)
✅ API returns correct data with correct HTTP status codes
✅ API has correct permission checks (unauthenticated cannot access member-only endpoints)
✅ Frontend page/component renders correctly
✅ Page is responsive (mobile, tablet, desktop)
✅ Page passes Axe DevTools with zero critical violations
✅ Page is navigable by keyboard only
✅ All form fields have visible labels
✅ All images have alt text
✅ All interactive elements have visible focus indicators
✅ Page title is set correctly (for screen readers)
✅ Skip to content link works on page
✅ Error states are handled and communicated accessibly
✅ Loading states are handled
✅ Empty states are handled
✅ Page works in English (other languages can follow)
✅ No console errors
✅ Code reviewed and merged to main branch
```

---

## QUICK REFERENCE — KEY NUMBERS

```
Users roles: 5 (SUPER_ADMIN, STEERING_COMMITTEE, REGIONAL_ADMIN, MEMBER, PUBLIC)
Languages: 5 (en, fr, ar, pt, sw)
Steering Committee organizations: 13
LM Country offices: 11
Public pages: 9
Forum country groups: 11
Forum thematic groups: 9
Forum general groups: 3
Sprint length: 2 weeks
Total sprints: 12
Total weeks: 26
Soft launch: Week 3-4 (June 16th)
Full launch: Week 26
Minimum colour contrast: 4.5:1 (normal text), 3:1 (large text)
Minimum touch target: 44x44px
Max page load time: 3 seconds on 3G
Max resource upload: 50MB
Max forum attachment: 10MB
Year 1 member target: 500+
Year 1 download target: 2000+
```

---

*Document prepared by ADRES Group for IE Hub development.*
*Last updated: May 2026*
*Developer: Derek Muriuki | github.com/dee-mee*
