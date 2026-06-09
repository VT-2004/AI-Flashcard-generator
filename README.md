# FlashAI — AI-Powered Flashcard Generator

> Turn any text into smart flashcards in seconds using AI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express-5-black?style=flat-square&logo=express)

## Live Demo

- **Frontend:** https://ai-flashcard-generator-one.vercel.app
- **Backend API:** https://flashai-backend.onrender.com/api/health

---

## What it does

FlashAI lets users paste any text — lecture notes, textbook content, articles — and instantly generates study-ready flashcards using the Groq AI API. Users can study their decks with an interactive 3D flip-card UI, track study sessions, and manage all their decks from a dashboard.

---

## Features

- **AI Flashcard Generation** — Paste text, get structured flashcards via Groq (Llama 3.1)
- **3D Flip Card UI** — CSS 3D transforms with smooth animations
- **Authentication** — Full auth flow with Clerk (sign up, sign in, protected routes)
- **Dashboard** — Real-time stats: total decks, cards generated, study sessions
- **Deck Management** — Create, study, and delete decks
- **Study Session Tracking** — Tracks how many times each deck has been studied
- **Progress Bar** — Visual progress indicator during study sessions
- **Responsive Design** — Works on mobile and desktop

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Clerk | Authentication |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| Clerk Backend SDK | JWT verification |
| Groq SDK | AI flashcard generation |
| Zod | Environment variable validation |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |
| Groq | AI model (Llama 3.1 8B) |

---

## Architecture

```
┌─────────────────┐         ┌──────────────────┐        ┌─────────────┐
│   Next.js App   │ ──────► │  Express REST API │ ──────►│  MongoDB    │
│   (Vercel)      │         │  (Render)         │        │  Atlas      │
└─────────────────┘         └──────────────────┘        └─────────────┘
        │                            │
        │ Clerk Auth                 │ Groq AI API
        ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│  Clerk (Auth)   │         │  Llama 3.1 8B    │
└─────────────────┘         └──────────────────┘
```

---

## Project Structure

```
ai-flashcard-generator/
├── frontend/                  # Next.js App Router
│   └── src/
│       ├── app/
│       │   ├── (auth)/        # Sign in / Sign up pages
│       │   ├── (dashboard)/   # Protected dashboard pages
│       │   │   ├── dashboard/ # Home with stats
│       │   │   ├── generate/  # AI generation page
│       │   │   └── decks/     # Deck list + study page
│       │   └── page.tsx       # Landing page
│       ├── hooks/             # useGenerate custom hook
│       ├── lib/               # Axios client
│       └── types/             # TypeScript interfaces
│
└── backend/                   # Express REST API
    └── src/
        ├── config/            # DB + env config
        ├── controllers/       # Request handlers
        ├── middleware/        # Auth + error handling
        ├── models/            # Mongoose schemas
        ├── prompts/           # AI prompt engineering
        ├── routes/            # API endpoints
        └── services/          # Business logic + AI service
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/health` | Server health check | No |
| POST | `/api/users/sync` | Sync Clerk user to MongoDB | Yes |
| GET | `/api/users/me` | Get current user profile | Yes |
| POST | `/api/decks/generate` | Generate AI flashcards | Yes |
| GET | `/api/decks` | Get all user decks | Yes |
| GET | `/api/decks/:id` | Get single deck | Yes |
| DELETE | `/api/decks/:id` | Delete a deck | Yes |
| PATCH | `/api/decks/:id/study` | Track study session | Yes |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Clerk account
- Groq API key (free at console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/VT-2004/AI-Flashcard-generator.git
cd AI-Flashcard-generator
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret_key
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Open `http://localhost:3000`

---

## How the AI works

The app sends user text to the Groq API with a carefully engineered prompt that forces structured JSON output:

```json
{
  "title": "deck title",
  "cards": [
    { "front": "question", "back": "answer", "order": 1 }
  ]
}
```

The prompt instructs the model to generate questions that test understanding rather than memorization, cover the most important concepts, and keep answers concise (1-3 sentences).

---

## Deployment

| Service | Config |
|---|---|
| Vercel | Root directory: `frontend` |
| Render | Root directory: `backend`, Build: `npm install && npm run build`, Start: `node dist/server.js` |

---

## License

MIT
