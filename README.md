# 🎬 YouTube — Full-Stack AI-Powered Video Streaming Platform

<div align="center">

![YouTube Clone](https://img.shields.io/badge/Project-YouTube%20Clone-red?style=for-the-badge&logo=youtube)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4.18-green?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-3.7-231F20?style=for-the-badge&logo=apachekafka)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)

A production-ready, full-stack video streaming platform inspired by YouTube — featuring real-time notifications, event-driven microservices, cloud media delivery, and an AI-powered content assistant.

</div>

---

## 📖 Description

This is a feature-complete YouTube-like video streaming platform built with a microservices architecture. It supports video upload and streaming, a community tweet system, nested comments, subscriptions, playlists, watch history, and real-time notifications. A built-in AI assistant powered by **LangChain** and **Groq LLM** helps creators generate content ideas, analyze transcripts, and answer viewer questions — all directly within the platform.

The platform uses **Apache Kafka** for event streaming between services, **Socket.IO** for real-time communication, and **Cloudinary** for scalable media delivery.

---

## ✨ Features

### 👤 User & Authentication
- Secure registration and login with **JWT** (access + refresh tokens)
- HTTP-only cookie-based session management
- Protected routes with server-side middleware

### 🎥 Video
- Upload videos with thumbnails to **Cloudinary**
- Video search, filtering, and pagination
- Watch history and Watch Later list
- Video transcript extraction
- Live stream start/end support

### 💬 Community & Engagement
- Nested **comment system** on videos and tweets
- **Tweet/post system** for channel community posts
- Like/unlike videos, comments, and tweets
- **Subscriptions** with subscriber management

### 📋 Playlists & Dashboard
- Create and manage playlists
- Add/remove videos from playlists
- Channel analytics dashboard (views, likes, subscribers)

### 🔔 Real-Time Notifications
- Instant push notifications via **Socket.IO**
- Event-driven triggers using **Apache Kafka**
- Notifications for new uploads and live streams

### 🤖 AI-Powered Features (LangChain + Groq LLM)
- Generate creative prompts from video transcripts
- AI-powered Q&A based on video content
- Suggested video topics for creators
- Comment analysis and prompt generation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| **Backend** | Node.js, Express.js 4, ES Modules |
| **Database** | MongoDB (Mongoose ODM 8) |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **Media Storage** | Cloudinary |
| **Message Broker** | Apache Kafka 3.7 (KafkaJS) |
| **Real-Time** | Socket.IO 4.8 |
| **AI / LLM** | LangChain, LangGraph, Groq (llama-3.3-70b-versatile), Zod |
| **Containerization** | Docker, Docker Compose |
| **File Handling** | Multer |

---

## 🏗️ Architecture Overview

This project follows an **event-driven microservices architecture** with three independently deployable services:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                     Next.js 16 Frontend (:3000)                 │
└──────────────────┬───────────────────────────┬──────────────────┘
                   │ REST API                  │ WebSocket
                   ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────────────┐
│   Backend API (:4000)    │   │  Notification Service (:8080)    │
│   Express.js + MongoDB   │   │  Express + Socket.IO             │
│   Cloudinary + LangChain │   │  Kafka Consumer                  │
└────────────┬─────────────┘   └──────────────┬───────────────────┘
             │ Kafka Produce                  │ Kafka Consume
             ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Apache Kafka (:9092)                         │
│           Topics: video.uploaded | stream.started               │
└─────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────┐
│  Kafdrop UI (:9000) │   ← Kafka monitoring dashboard
└────────────────────┘
```

**Flow:** When a user uploads a video or starts a live stream, the **Backend** publishes an event to **Kafka**. The **Notification Service** consumes that event and pushes real-time alerts to all connected subscribers via **Socket.IO**.

---

## 📁 Folder Structure

```
main-project/
├── backend/                       # Express.js REST API
│   ├── api/
│   │   ├── controllers/           # Business logic (11 controllers)
│   │   ├── models/                # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── video.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── tweet.model.js
│   │   │   ├── like.model.js
│   │   │   ├── subscription.model.js
│   │   │   ├── playlist.model.js
│   │   │   └── Notification.model.js
│   │   ├── routes/                # Route definitions (11 files)
│   │   ├── middlewares/           # Auth, error handling, multer
│   │   ├── utils/                 # Helpers, API response utils
│   │   ├── db/                    # MongoDB & Kafka setup
│   │   ├── kafka/                 # Kafka producer
│   │   └── GenAI/                 # LangChain AI integration
│   │       ├── llm/               # Groq LLM config
│   │       ├── prompt/            # Prompt templates
│   │       ├── schema/            # Zod validation schemas
│   │       └── node/              # LangGraph nodes
│   ├── .env.example
│   └── package.json
│
├── nextjs-frontend/               # Next.js 16 App Router frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/            # signin, signup
│   │   │   └── (protected)/       # watch, channel, dashboard, history...
│   │   ├── components/            # 40+ reusable React components
│   │   ├── APIS/                  # Axios API call functions
│   │   ├── contextAPI/            # Global YouTube context
│   │   ├── types/                 # TypeScript type definitions
│   │   └── hooks/                 # Custom React hooks
│   ├── .env.example
│   └── package.json
│
├── notification-service/          # Real-time notification microservice
│   ├── src/
│   │   ├── server.js              # Express + Socket.IO server
│   │   ├── socket/                # Socket.IO connection handlers
│   │   ├── kafka/                 # Kafka consumer
│   │   ├── config.js
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
└── docker/
    └── docker-compose.yml         # Kafka + Kafdrop services
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Docker & Docker Compose** (for Kafka)
- **Cloudinary** account
- **Groq API** key ([console.groq.com](https://console.groq.com))

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/UMESHA123/YouTube-Full-Stack-AI-Powered-Video-Streaming-Platform---Frontend.git
cd YouTube-Full-Stack-AI-Powered-Video-Streaming-Platform---Frontend
```

---

### Step 2 — Start Kafka with Docker

```bash
cd docker
docker-compose up -d
```

This starts:
- **Kafka** on `localhost:9092`
- **Kafdrop** (Kafka UI) on `http://localhost:9000`

---

### Step 3 — Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables section)
npm run dev
```

Backend runs at `http://localhost:4000`

---

### Step 4 — Set Up the Notification Service

```bash
cd notification-service
npm install
cp .env.example .env
# Fill in your .env values
npm start
```

Notification service runs at `http://localhost:8080`

---

### Step 5 — Set Up the Frontend

```bash
cd nextjs-frontend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017
DB_NAME=youtube

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Kafka
KAFKA_BROKERS=localhost:9092

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Groq AI (for LangChain features)
GROQ_API_KEY=your_groq_api_key
```

### Frontend — `nextjs-frontend/.env`

```env
NEXT_PUBLIC_APP_URL=http://localhost:4000
NEXT_PUBLIC_NOTIFICATION_SOCKET_URL=http://localhost:8080
```

### Notification Service — `notification-service/.env`

```env
PORT=8080
BACKEND_URL=http://localhost:4000
KAFKA_BROKERS=localhost:9092
CORS_ORIGINS=http://localhost:3000
```

---

## 🚀 Usage

| Service | URL | Description |
|---|---|---|
| Frontend | `http://localhost:3000` | Main application |
| Backend API | `http://localhost:4000/api/v1` | REST API |
| Notification Service | `http://localhost:8080` | Socket.IO server |
| Kafdrop (Kafka UI) | `http://localhost:9000` | Kafka monitoring |

1. **Sign up** at `/signup` to create an account
2. **Upload a video** from your channel dashboard
3. **Explore** the home feed, search for videos, and subscribe to channels
4. **Use the AI assistant** on any video page to ask questions or get content suggestions
5. **Receive real-time notifications** when channels you subscribe to upload or go live

---

## 📡 API Endpoints

### Auth & Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/register` | Register a new user |
| `POST` | `/api/v1/users/login` | Login |
| `POST` | `/api/v1/users/logout` | Logout |
| `POST` | `/api/v1/users/refresh-token` | Refresh access token |
| `GET` | `/api/v1/users/current-user` | Get logged-in user |
| `GET` | `/api/v1/users/c/:username` | Get channel profile |
| `GET` | `/api/v1/users/history` | Get watch history |

### Videos
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/videos` | Get all videos (paginated) |
| `POST` | `/api/v1/videos` | Upload a new video |
| `GET` | `/api/v1/videos/result/search_query` | Search videos |
| `GET` | `/api/v1/videos/topics/suggestions` | AI-suggested topics |
| `GET` | `/api/v1/videos/transcript/:videoId` | Get video transcript |
| `POST` | `/api/v1/videos/prompts` | Generate AI prompts |
| `POST` | `/api/v1/videos/prompts/response` | AI Q&A on video content |
| `POST` | `/api/v1/videos/live/start` | Start live stream |
| `PATCH` | `/api/v1/videos/live/end/:videoId` | End live stream |

### Engagement
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/v1/comments/:videoId` | Get / post video comments |
| `POST` | `/api/v1/likes/toggle/v/:videoId` | Toggle video like |
| `POST` | `/api/v1/likes/toggle/c/:commentId` | Toggle comment like |
| `GET` | `/api/v1/likes/videos` | Get liked videos |

### Subscriptions & Playlists
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/subscriptions/channel/:channelId` | Subscribe / unsubscribe |
| `GET` | `/api/v1/subscriptions/my-subscriptions` | My subscriptions |
| `POST` | `/api/v1/playlist` | Create playlist |
| `PATCH` | `/api/v1/playlist/add/:videoId/:playlistId` | Add video to playlist |
| `GET` | `/api/v1/playlist/user/:userId` | Get user playlists |

### Dashboard & Notifications
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | Channel analytics |
| `GET` | `/api/v1/notifications/my` | Get my notifications |

---

## 📸 Screenshots

> _Screenshots coming soon_

| Page | Preview |
|---|---|
| 🏠 Home Feed | _(placeholder)_ |
| 🎥 Watch Page with AI Assistant | _(placeholder)_ |
| 📊 Channel Dashboard / Analytics | _(placeholder)_ |
| 🔔 Real-Time Notifications | _(placeholder)_ |
| 📋 Playlist Management | _(placeholder)_ |

---

## 🐳 Deployment

### Docker (Kafka Infrastructure)

```bash
cd docker
docker-compose up -d
```

### Backend (Render / Railway / EC2)

```bash
cd backend
npm install
npm start
```

Set all environment variables in your hosting provider's dashboard.

### Notification Service (Render / Railway)

```bash
cd notification-service
npm install
npm start
```

### Frontend (Vercel — Recommended)

```bash
cd nextjs-frontend
npm run build
npm start
```

For Vercel, connect the `nextjs-frontend` directory as the root and configure environment variables in the Vercel dashboard.

> **Note:** Ensure the backend and notification service URLs are correctly set in the frontend environment variables for production.

---

## 🔮 Future Improvements

- [ ] **Video Recommendations** — ML-based personalized feed using watch history
- [ ] **Full-Text Search** — Elasticsearch integration for fast video discovery
- [ ] **Video Transcoding** — FFmpeg pipeline for multi-quality HLS streaming
- [ ] **Monetization** — Ad integration and creator revenue dashboard
- [ ] **Mobile App** — React Native companion app
- [ ] **End-to-End Testing** — Cypress test suite for critical user flows
- [ ] **CI/CD Pipeline** — GitHub Actions for automated testing and deployment
- [ ] **Rate Limiting & Throttling** — Redis-based API rate limiting
- [ ] **Content Moderation** — AI-powered thumbnail and content review

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and include tests where applicable.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **Umesha** | [GitHub](https://github.com/UMESHA123)

</div>
