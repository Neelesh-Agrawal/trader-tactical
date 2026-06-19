# Easy Option Learning

Options trading education platform (React + Django).

## Quick start (local testing)

### 1. Environment files

```powershell
# From project root
copy .env.example .env
copy frontend\.env.example frontend\.env
```

Edit `.env` and `frontend/.env` if needed. Defaults work for local SQLite + DEV auth.

| File | Purpose |
|------|---------|
| `.env` (project root) | Backend: DB, SECRET_KEY, APP_MODE, email/SMS |
| `frontend/.env` | Frontend: API URL, VITE_APP_MODE |

**Keep `APP_MODE` and `VITE_APP_MODE` in sync:**

- `DEV` / `DEV` — fastest testing (no login required)
- `PROD` / `PROD` — full register → OTP → login flow

### 2. Backend

```powershell
cd backend
pip install -r requirements.txt
python scripts/verify_local_setup.py
python manage.py migrate
python manage.py seed_course
python manage.py createsuperuser
python manage.py runserver
```

Admin: http://localhost:8000/admin/

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

App: http://localhost:8080

### 4. OTP without email/SMS

With `DEBUG=True` and empty `MOPLET_API_KEY` / email credentials, OTP codes are included in API responses during registration (check browser devtools network tab or backend console).

## Frontend stack

- Vite, TypeScript, React, Tailwind CSS, shadcn/ui
