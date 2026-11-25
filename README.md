# Contract repayment — Web

Vite + React UI for [contract-repayment](https://github.com/Tlhogi007/contract-repayment) (Nest API). Separate repo so CI, deploys, and reviews stay independent of the API.

|     | Local                 | Live (Vercel + Fly)                         |
| --- | --------------------- | ------------------------------------------- |
| UI  | http://localhost:5173 | https://contract-repayment-web.vercel.app   |
| API | http://localhost:3000 | https://contract-repayment-api.fly.dev      |

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

Hosted on **[Vercel](https://vercel.com)** from this repo. Set build-time `VITE_API_BASE_URL=https://contract-repayment-api.fly.dev` (no trailing slash). The Fly API must allow this origin via `CORS_ORIGINS`.

Legacy Render static blueprint remains in [`render.yaml`](./render.yaml) for reference only.

## License

UNLICENSED — assessment / team submission.
