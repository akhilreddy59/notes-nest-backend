# Notes Nest — Backend

Minimal Express + MongoDB backend for Notes Nest. This README explains how to run locally and deploy.

Environment variables (create a `.env` file based on `.env.example`):

- MONGO_URI — MongoDB connection string
- ADMIN_PASSWORD — Admin password for simple login flow (use a secure secret)
- JWT_SECRET — Secret used to sign admin JWTs
- PORT — Optional, default 5000

Quick local run

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies and start the server:

```powershell
npm install
node .\server.js
```

Admin login (returns JWT)

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/admin/login -ContentType 'application/json' -Body (@{ password = 'your_admin_password' } | ConvertTo-Json)
```

Protect admin endpoints by sending the token as `Authorization: Bearer <token>` header.

Endpoints summary

- POST /api/notes/upload — upload file (multipart/form-data, field `file`) or submit `driveLink` in JSON body
- POST /api/admin/login — admin login to get JWT
- GET /api/notes/approved — public list of approved documents
- GET /api/notes/pending — admin only
- PATCH /api/notes/approve/:id — admin only
- DELETE /api/notes/delete/:id — admin only

Notes about production readiness

- Do NOT commit real `.env` files or secrets.
- Use a real secret manager for `JWT_SECRET` and rotate credentials.
- Replace local file uploads with S3 (or other durable store) for horizontal scaling.
- Add a process manager (pm2) or run in containers with orchestration for reliability.

# notes-nest-backend
