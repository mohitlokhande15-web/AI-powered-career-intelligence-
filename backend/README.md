# Career AI Platform — Backend (FastAPI, Python 3.14)

Matches the existing Next.js frontend's API contract exactly (see `src/lib/api.ts`
and the `fetch()` calls in `login`, `register`, `onboarding`, `dashboard` pages).

## Stack
- **FastAPI** — API framework
- **SQLAlchemy 2.x** — ORM, **PostgreSQL** via `psycopg` (v3, has native Python 3.14 wheels)
- **JWT (python-jose)** for tokens, **bcrypt** (direct, no passlib) for password hashing
- **PyPDF2 / python-docx** — resume text extraction
- Rule-based **AI modules** for resume parsing, ATS scoring, job matching, and
  skill-gap analysis (see `app/ai_modules/`) — swappable for an LLM-backed
  implementation behind the same function signatures.

## Setup (Python 3.14 + PostgreSQL)

1. Start PostgreSQL (Docker is easiest — run from the `project/` root):
   ```bash
   docker compose up -d
   ```
   This starts Postgres 16 on `localhost:5432` with db `career_ai` / user `postgres` / password `postgres`.
   Not using Docker? Create the database yourself: `createdb career_ai`.

2. Create the venv and install dependencies:
   ```bash
   cd backend
   python3.14 -m venv venv
   source venv/bin/activate        # Windows: venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. Configure environment (a working `.env` is already included; edit if your
   Postgres credentials differ):
   ```bash
   cp .env.example .env   # only if you need to regenerate it
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Tables are created automatically on startup via `Base.metadata.create_all`.

Docs: `http://127.0.0.1:8000/docs`


## Endpoints (match the frontend exactly)
| Method | Path | Used by |
|---|---|---|
| GET | `/api/health` | `BackendStatus.tsx` |
| POST | `/api/auth/register` | `register/page.tsx` |
| POST | `/api/auth/login` | `login/page.tsx` |
| GET | `/api/auth/me` | `dashboard/page.tsx` |
| GET | `/api/profile` | `lib/api.ts` |
| PUT | `/api/profile` | `onboarding/page.tsx`, `lib/api.ts` |
| GET | `/api/profile/completion` | `lib/api.ts` |

## Additional endpoints (power the AI features described in the product vision)
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/resume/upload` | Parse a PDF/DOCX/TXT resume, compute ATS score |
| GET | `/api/resume/history` | List a user's past resume uploads + scores |
| GET | `/api/resume/{id}` | Fetch one parsed resume + ATS breakdown |
| POST | `/api/job-analysis` | Match a resume against a pasted job description |
| GET | `/api/career/skill-gap?target_role=...` | Missing skills + course recommendations |

All endpoints except `/api/health`, `/api/auth/register`, `/api/auth/login`
require `Authorization: Bearer <token>`.
