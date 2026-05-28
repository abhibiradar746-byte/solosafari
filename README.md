# SoloSafiri

A solo travel safety and planning web/mobile app for India. The repo contains a static frontend in `frontend/` and a Node.js backend in `backend/`.

## Local setup

### Frontend
1. Open `frontend/index.html` in a browser.
2. The frontend currently expects the API at `http://localhost:5000`.

### Backend
1. From `backend/`, run:
   ```bash
   npm install
   npm run build
   npm start
   ```
2. Or during development:
   ```bash
   npm run dev
   ```

## Free hosting guidance

### 1. GitHub Pages (frontend only)
- Add the static site files from `frontend/` to the repository root or configure GitHub Pages to serve from a `docs/` folder.
- Enable GitHub Pages in the repository settings.
- The likely URL will be:
  `https://abhibiradar746-byte.github.io/solosafari/`

> Note: GitHub Pages can host only the frontend. The backend still needs a separate free host.

### 2. Free backend hosting options
- Render free web service: https://render.com/
- Railway free service: https://railway.app/
- Fly.io free tier: https://fly.io/

For these hosts, point the frontend API URL in `frontend/app.js` from `http://localhost:5000` to the deployed backend URL.

## GitHub deployment commands

```bash
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/abhibiradar746-byte/solosafari.git
git push -u origin main
```

If pushing requires authentication, complete GitHub login in your browser and rerun the push.
