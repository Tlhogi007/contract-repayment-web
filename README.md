# Contract repayment — Web

Vite + React UI for [contract-repayment](https://github.com/Tlhogi007/contract-repayment) (Nest API). Separate repo so CI, deploys, and reviews stay independent of the API.

| | Local | Live (Render) |
| -- | -- | -- |
| UI | http://localhost:5173 | https://contract-repayment-web.onrender.com |
| API | http://localhost:3000 | https://contract-repayment-api.onrender.com |

## Quick start

```bash
npm install
cp .env.example .env   # leave VITE_API_BASE_URL empty for proxy
npm run dev            # proxies /auth, /contracts, /health, … → :3000
```

Run the API from the sibling repo (`npm run start:dev` there).

## Quality

```bash
npm run lint
npm run test:cov   # ≥90% on helpers
npm run build
```

CI on `main` / `develop`: lint → Vitest coverage → Vite build.

## Deploy

Render Static Site from [`render.yaml`](./render.yaml). Build-time `VITE_API_BASE_URL` comes from the API service’s `RENDER_EXTERNAL_URL` in the same Render workspace. The API must allow this origin via `CORS_ORIGINS`.

## License

UNLICENSED — assessment / team submission.
