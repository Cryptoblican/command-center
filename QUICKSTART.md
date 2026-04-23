# Quick Start Guide

Get the Command Center Dashboard running locally in 2 minutes.

## 1. Clone & Install

```bash
cd /Users/brettnielsen/.openclaw/workspace/command-center

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

## 2. Run Locally

### Development Mode (Hot Reload)

```bash
npm run dev
```

This starts:
- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:5173` (proxied to backend)
- Dashboard: `http://localhost:3000`

### Or Run Separately

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend (in client/)
cd client && npm run dev
```

## 3. Test It

Open browser:
- 🏠 Dashboard: **http://localhost:3000**
- 📧 Email tab: View unread count + list
- 📅 Calendar tab: View upcoming events (requires `gog` CLI)
- 📊 Projects tab: Skyridge, KeyVault, TeamDrip status
- ⚙️ Automation tab: Create email rules (stored in SQLite)
- 🎯 Predictions tab: Log predictions with accuracy
- ⚡ Settings tab: Adjust preferences

## 4. Verify Setup

### Check Backend API

```bash
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Check Database

```bash
ls -la data/command-center.db
# Database should exist and be ~5-10 KB initially
```

### Check gog CLI

```bash
gog --help
# Should show gog command help (required for email/calendar)
```

## Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| `gog` command not found | `which gog` → if not found, reinstall gog CLI |
| React not loading | Clear cache: Cmd+Shift+Delete, restart servers |
| Database locked | Kill all node processes: `pkill -f "node server.js"` |
| Tailwind CSS not working | Rebuild: `cd client && npm run build && cd ..` |

## File Structure

```
command-center/
├── server.js                 # Express server entry
├── package.json              # Backend dependencies
├── src/
│   ├── db.js                # SQLite database setup
│   └── routes/
│       ├── email.js         # Email API routes
│       ├── calendar.js      # Calendar routes
│       ├── projects.js      # Projects routes
│       ├── rules.js         # Automation rules routes
│       └── predictions.js   # Predictions routes
├── client/                   # React frontend (Vite)
│   ├── package.json
│   ├── vite.config.js       # Vite + proxy config
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── src/
│   │   ├── App.jsx          # Main app + navigation
│   │   ├── main.jsx         # React entry
│   │   ├── index.css        # Global styles
│   │   └── pages/           # Components
│   │       ├── HomePage.jsx
│   │       ├── EmailPage.jsx
│   │       ├── CalendarPage.jsx
│   │       ├── ProjectsPage.jsx
│   │       ├── AutomationPage.jsx
│   │       ├── PredictionsPage.jsx
│   │       └── SettingsPage.jsx
│   └── dist/                # Built React app (after build)
├── data/
│   └── command-center.db    # SQLite database (auto-created)
├── README.md                # Full documentation
├── DEPLOY.md                # Railway deployment guide
├── Procfile                 # Railway config
└── .gitignore               # Git ignore rules
```

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🚀 See [DEPLOY.md](./DEPLOY.md) to deploy to Railway.app
- 💻 Modify pages in `client/src/pages/` to customize
- 🔌 Add new API routes in `src/routes/` as needed
- 🎨 Update Tailwind config for custom colors/themes

## API Endpoints (Quick Reference)

```
GET  /api/health                     # Health check
GET  /api/email/unread-count         # Unread count
GET  /api/email/list?limit=20        # List emails
GET  /api/calendar/week              # Next 7 days events
GET  /api/projects                   # All projects
GET  /api/rules                      # All rules
POST /api/rules                      # Create rule
GET  /api/predictions                # All predictions
POST /api/predictions                # Create prediction
```

See [README.md](./README.md) for complete API docs.

## Common Tasks

### Create a New Rule

1. Click **Automation** tab
2. Click **Create Rule**
3. Fill out form:
   - Name: "Archive promos"
   - Trigger: "Subject contains"
   - Condition: "promo" or "sale"
   - Action: "Archive"
4. Click **Create Rule** → Rule saved to SQLite

### Add a Prediction

1. Click **Predictions** tab
2. Click **New Prediction**
3. Fill out form:
   - Category: Crypto / Sports / Politics
   - Prediction: "Bitcoin hits $100k by June"
   - Date: Pick date
4. Click **Create** → Tracked in database
5. When outcome known: Click **Correct**/**Incorrect** → Accuracy tracked

### View Project Status

1. Click **Projects** tab
2. See Skyridge (coaching), KeyVault (fund), TeamDrip (apparel)
3. Drag progress bar to update status
4. Changes persist in memory (reset on server restart)

## Git Workflow

```bash
# Make changes
git status
git add .
git commit -m "feat: your feature description"

# When ready to deploy
git push origin main
# → If connected to Railway, auto-deploys!
```

## Environment Variables

Create `.env` file in root (optional):

```
PORT=3000
NODE_ENV=development
DATABASE_URL=./data/command-center.db
```

See `.env.example` for reference.

## Support

- **Backend issues**: Check `server.js` and `src/` files
- **Frontend issues**: Check `client/src/` components
- **Database issues**: Check `data/command-center.db` exists
- **API issues**: Test with `curl http://localhost:3000/api/health`

---

**You're all set!** 🚀 Start building.
