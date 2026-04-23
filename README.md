# Command Center Dashboard v0.1.0

Unified command center dashboard for email, calendar, projects, automation rules, and predictions. Built with Node.js + Express + React + Vite + SQLite.

## Features

- **Email**: Read, search, filter emails via `gog` CLI
- **Calendar**: View upcoming events (7-day week view)
- **Projects**: Track Skyridge (coaching), KeyVault (crypto fund), and TeamDrip (apparel business)
- **Automation**: Create and manage email rules
- **Predictions**: Log and track prediction accuracy (crypto, sports, politics)
- **Homepage**: Summary dashboard with stats and project overview
- **Settings**: Configure refresh intervals and preferences

## Tech Stack

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React + Vite + Tailwind CSS
- **Integration**: `gog` CLI for Google Workspace
- **Database**: SQLite (local, file-based)
- **API**: RESTful routes

## Installation (Local Development)

### Prerequisites

- Node.js 16+
- `gog` CLI installed and authorized (already set up for brettniels@gmail.com)
- npm or yarn

### Setup

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client && npm install && cd ..
```

3. Install Tailwind CSS dependencies:
```bash
cd client && npm install -D tailwindcss postcss autoprefixer && cd ..
```

## Running Locally

### Development Mode

Run both backend and frontend with hot reload:

```bash
npm run dev
```

This will:
- Start Express server on `http://localhost:3000`
- Start Vite dev server on `http://localhost:5173` (proxied to backend)
- Open the dashboard at `http://localhost:3000`

### Backend Only

```bash
npm run server
```

### Frontend Only

```bash
cd client && npm run dev
```

## Building for Production

```bash
npm run build
```

This creates:
- `client/dist/` - Built React app (static files)
- Ready to deploy to Railway.app

## API Routes

All routes prefixed with `/api/`:

### Email
- `GET /email/unread-count` - Get unread email count
- `GET /email/list?limit=20` - List emails
- `GET /email/:id` - Get email detail
- `GET /email/search/:query` - Search emails
- `POST /email/:id/read` - Mark as read
- `DELETE /email/:id` - Delete email

### Calendar
- `GET /calendar/week` - Get events for next 7 days
- `GET /calendar/upcoming?days=30` - Get upcoming events
- `GET /calendar/:id` - Get event detail
- `POST /calendar/create` - Create event

### Projects
- `GET /projects` - List all projects
- `GET /projects/:id` - Get project detail
- `PATCH /projects/:id` - Update project (progress, status, etc.)

### Automation Rules
- `GET /rules` - List all rules
- `GET /rules/active` - List enabled rules only
- `GET /rules/:id` - Get rule detail
- `POST /rules` - Create rule
- `PATCH /rules/:id` - Update rule
- `DELETE /rules/:id` - Delete rule
- `POST /rules/:id/toggle` - Toggle enabled/disabled

### Predictions
- `GET /predictions` - List all predictions
- `GET /predictions/category/:category` - Filter by category
- `GET /predictions/stats/accuracy` - Get accuracy stats
- `POST /predictions` - Create prediction
- `PATCH /predictions/:id/resolve` - Resolve with result
- `DELETE /predictions/:id` - Delete prediction

## Database Schema

### Rules
```sql
CREATE TABLE rules (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE,
  trigger_type TEXT,
  trigger_condition TEXT,
  action_type TEXT,
  action_config TEXT,
  enabled BOOLEAN DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
)
```

### Predictions
```sql
CREATE TABLE predictions (
  id INTEGER PRIMARY KEY,
  category TEXT,
  prediction TEXT,
  prediction_date DATETIME,
  result TEXT,
  accuracy_score REAL,
  notes TEXT,
  created_at DATETIME,
  resolved_at DATETIME
)
```

### Cache, Logs, Preferences
SQLite tables for caching gog data, logging, and storing user preferences.

## Deployment to Railway.app

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: Command Center v0.1.0"
git remote add origin https://github.com/YOUR_USERNAME/command-center.git
git push -u origin main
```

### 2. Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `YOUR_USERNAME/command-center`
5. Railway will detect `package.json` and auto-configure

### 3. Set Environment Variables

In Railway dashboard → Variables:

```
PORT=3000
NODE_ENV=production
```

If using Google Workspace API (optional):
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

### 4. Deploy

Railway auto-deploys on push. To trigger deployment:

```bash
git push origin main
```

### 5. Access Live URL

Railway assigns a public URL like:
```
https://your-project-abc123.railway.app
```

View in Railway dashboard → Deployments → Your app → Public URL

## Environment Variables

Create `.env` in root:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=./data/command-center.db
```

## Troubleshooting

### `gog` CLI not found
- Ensure `gog` is installed globally: `which gog`
- If not installed, follow [gog documentation](https://github.com/pimalaya/himalaya)

### Database lock errors
- Check that only one server instance is running
- Delete `data/*.db-shm` and `data/*.db-wal` if corrupted

### Vite proxy not working
- Ensure backend runs on port 3000
- Check `client/vite.config.js` proxy target

### React components not loading
- Clear browser cache: Cmd+Shift+Delete (Chrome) or Cmd+Option+E (Firefox)
- Restart dev servers: `npm run dev`

## Git Workflow

Commit frequently with clear messages:

```bash
git add .
git commit -m "feat: add email search functionality"
git push
```

## Future Enhancements (Phase 2+)

- [ ] Email template/draft system
- [ ] Calendar recurring events
- [ ] Project milestone tracking
- [ ] Rule analytics & performance
- [ ] Prediction portfolio dashboard
- [ ] Dark mode
- [ ] Mobile-optimized views
- [ ] WebSocket real-time updates
- [ ] User authentication
- [ ] Multi-user support

## License

MIT

## Author

Brett Nielsen | Cornwallis Bot

---

**Version**: 0.1.0  
**Last Updated**: April 2026  
**Status**: MVP - Fast iteration, MVP first
