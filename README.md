# Inclusive Education Hub for Africa (IE Hub)

Continental platform for inclusive education — public website and Community of Practice.

**Client:** LM International · **Developer:** ADRES Group (Derek Muriuki)

## Current status

**Phase: Public website (frontend + backend API)** — React app wired to Django APIs for resources, news, events, and contact messages.

### Public pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/resources` | Resource library (search & filter) |
| `/resources/:id` | Resource detail |
| `/news` | News & events |
| `/news/:slug` | News article |
| `/contact` | Contact & join interest |
| `/accessibility` | Accessibility statement |

Design references: [APDK](https://apdk.org/) (hero, impact, programs, news/events) and [IDDC](https://iddcconsortium.net/) (stat highlights, values, library focus).

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
python manage.py runserver
```

Frontend:
```bash
cd frontend
cp .env.example .env.local   # optional: set VITE_USERWAY_KEY
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Accessibility

- WCAG 2.2 AA target on all public pages
- Skip to main content, semantic landmarks, focus styles, labelled forms
- [UserWay](https://userway.org/) widget when `VITE_USERWAY_KEY` is set

## Project structure

```
ie-HUB/
├── backend/           # Django + DRF public APIs
├── frontend/          # React + Vite + TypeScript + Tailwind
├── docker-compose.yml
├── ROADMAP.MD
└── IE_HUB_MASTER_INSTRUCTIONS.md
```

## Next steps

1. Add CustomUser + JWT auth foundation
2. Start forum and member platform APIs
3. Complete accessibility audit and deployment hardening

See `ROADMAP.MD` for full sprint plan.
