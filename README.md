# Inclusive Education Hub for Africa (IE Hub)

Continental platform for inclusive education — public website and Community of Practice.

**Client:** LM International · **Developer:** ADRES Group (Derek Muriuki)

## Current status

**Phase 4: Advanced Features & Launch (Complete)** — Full-featured platform with membership, forum, analytics, and multilingual support.

### Features

- **Public Website:** Home, About, News, Events, and filterable Resource Library.
- **Community of Practice:** Member registration, email verification, and administrative approval.
- **Member Dashboard:** Personalized hub with recent forum activity, news, and resources.
- **Interactive Forum:** Categorized discussion groups (Regional, Thematic, General) with rich text and reactions.
- **Member Directory:** Searchable directory of inclusive education practitioners across Africa.
- **Resource Access Control:** Distinction between public resources and professional member-only content.
- **Multilingual Support:** English, Français, Kiswahili, and Arabic (with RTL support).
- **Notification System:** Real-time in-app alerts and asynchronous email-ready tasks.
- **Donation System:** Contribution tracking with Flutterwave-ready infrastructure.
- **Admin Dashboard:** Modernized, WordPress-like management portal with platform-wide analytics.

### Platform Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/dashboard` | Member Hub | Member |
| `/resources` | Resource Library | Public / Member |
| `/forum` | Community Forum | Member |
| `/members` | Practitioner Directory | Member |
| `/notifications` | User Alerts | Member |
| `/profile` | Professional Profile | Member |
| `/donate` | Support IE Hub | Public |
| `/admin` | Management Portal | Admin |

## Quick start

### Option A: Run with Docker (recommended)

```bash
docker compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000/api](http://localhost:8000/api)
- Django admin: [http://localhost:8000/admin](http://localhost:8000/admin)
- MinIO console: [http://localhost:9001](http://localhost:9001)

### Option B: Run locally without Docker

Backend:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_public_data
python manage.py seed_forum
python manage.py runserver
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Accessibility & Compliance

- **WCAG 2.2 AA:** Verified via accessibility audit on all public and core member pages.
- **Multilingual:** Infrastructure for English, French, Swahili, and Arabic.
- **Security:** JWT-based authentication with role-based access control.

## Project structure

```
ie-HUB/
├── backend/           # Django + DRF (Auth, Forum, Public APIs, Media)
├── frontend/          # React + Vite + TypeScript + TanStack Query + i18next
├── docker-compose.yml
├── ROADMAP.MD         # Development milestones
└── IE_HUB_MASTER_INSTRUCTIONS.md # Detailed technical specifications
```

---
*Last Updated: 28 May 2026*
