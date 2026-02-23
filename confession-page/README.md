# confess. — Anonymous Confession Wall

A full-stack MERN application where users can share anonymous confessions, react to them, and reply in threads. Features Google OAuth, sentiment analysis, auto-expiry, and a premium dark-themed UI.

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js** (ES Modules)
- **MongoDB** + **Mongoose**
- **Passport.js** (Google OAuth 2.0)
- **bcrypt** for secret code hashing
- **sentiment** npm for auto-detection
- **node-cron** for expired confession cleanup
- **express-validator** for input validation
- **helmet** + **express-rate-limit** for security

### Frontend
- **React** (Vite)
- **Tailwind CSS v4**
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for API calls

## 📁 Project Structure

```
confession-page/
├── backend/
│   ├── src/
│   │   ├── config/        # DB, passport, env config
│   │   ├── controllers/   # Request handlers
│   │   ├── jobs/          # Cron jobs (expiry cleanup)
│   │   ├── middlewares/   # Auth, validation, error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routes
│   │   ├── services/      # Business logic layer
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Entry point
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── context/       # Auth & Toast providers
    │   ├── pages/         # Page components
    │   └── services/      # API service layer
    └── package.json
```

## ⚙️ Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally or Atlas URI
- Google OAuth credentials (from Google Cloud Console)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/confession-wall
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
NODE_ENV=development
```

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |
| GET | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |

### Confessions
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/confessions?sort=latest\|mostLoved\|trending` | Get all confessions |
| POST | `/api/confessions` | Create confession |
| PUT | `/api/confessions/:id` | Update (requires secret code) |
| DELETE | `/api/confessions/:id` | Delete (requires secret code) |
| POST | `/api/confessions/:id/react` | Add reaction (like/love/laugh) |
| POST | `/api/confessions/:id/reply` | Add reply |
| GET | `/api/confessions/:id/replies` | Get replies |

## ✨ Features

- **Anonymous Posting** — No login required to confess
- **Secret Code System** — Edit/delete your confession with a secret code
- **Sentiment Analysis** — Auto-detects mood (Happy, Sad, Romantic, Funny, Regret, Neutral)
- **Reactions** — Like 👍, Love ❤️, Laugh 😂
- **Reply Threads** — Threaded replies on each confession
- **Sort Options** — Latest, Most Loved, Trending
- **Auto-Expiry** — Set 24h, 7d, 30d, or permanent
- **Google OAuth** — Optional sign-in for enhanced experience
- **Dark Theme** — Premium glassmorphism UI
- **Rate Limiting** — API protection against abuse
- **Input Validation** — Server-side validation with express-validator

## 📝 License

ISC
