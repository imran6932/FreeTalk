# FreeTalk — AI Companion Chatbot with Admin Dashboard

A full-stack conversational AI application built with **React**, **FastAPI**, **Ollama**, and **Redis**. Includes a companion chatbot frontend and an admin dashboard to view all user conversations and metadata.

---

## 🎯 Features

### User App (Frontend)
- 💬 **Real-time chat** with Ollama-powered LLM
- 🌍 **Multi-language support** — Hindi, English, Hinglish
- 👥 **Dynamic companion persona** — Priya (for male users) / Imran (for female users)
- 📱 **Device detection** — tracks device name per user
- 💾 **Full chat history** — stored in Redis, persists across sessions
- 🧠 **Smart model selection** — dynamically load available models from backend
- 🎨 **Beautiful dark UI** — rose/purple accent theme

### Admin Dashboard (Separate App)
- 🛡️ **Secure login** — HTTP Basic Auth with credentials from `.env`
- 👥 **User management** — browse all users with metadata
- 💬 **Full chat history** — view complete conversation for any user
- 📊 **User metadata** — device name, gender, message count, first/last seen timestamps
- 🔍 **Search & filter** — find users by ID, device, or gender

---

## 📋 Project Structure

```
freetalk-v2/
├── backend/                 # FastAPI server
│   ├── main.py             # Core API + admin routes
│   ├── requirements.txt
│   └── .env.example
├── frontend/               # User chat app (React + Vite)
│   ├── src/
│   │   ├── App.jsx         # Main app logic
│   │   ├── components/     # Chat, header, input, welcome
│   │   ├── utils/api.js    # API client
│   │   └── App.css         # Dark theme styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── admin/                  # Admin dashboard (React + Vite)
    ├── src/
    │   ├── App.jsx         # Auth + dashboard router
    │   ├── Login.jsx       # Login page
    │   ├── Dashboard.jsx   # Main admin UI
    │   ├── UserList.jsx    # User list sidebar
    │   ├── ChatView.jsx    # Chat history viewer
    │   ├── admin.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Setup

### Prerequisites
- **Ollama** running (`ollama serve`)
- **Redis** running on `localhost:6379`
- **Node.js** 16+ and **Python** 3.8+

### Step 1: Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Copy and edit .env
cp .env.example .env
# Set ADMIN_USERNAME and ADMIN_PASSWORD

# Run server
uvicorn main:app --reload --port 8000
```

Backend will be live at: `http://localhost:8000`

### Step 2: Frontend Setup (User App)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend will be live at: `http://localhost:5173`

### Step 3: Admin Dashboard Setup

```bash
cd admin

# Install dependencies
npm install

# Run dev server (runs on port 5174)
npm run dev
```

Admin dashboard will be live at: `http://localhost:5174`

---

## 🔧 Configuration

### Backend (.env)
```env
REDIS_URL=redis://localhost:6379
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_strong_password_here
```

### Environment Variables
- `REDIS_URL` — Redis connection string (default: `redis://localhost:6379`)
- `ADMIN_USERNAME` — Admin login username
- `ADMIN_PASSWORD` — Admin login password

---

## 💬 How It Works

### User Flow

1. **First visit** — User generates unique ID (stored in localStorage)
2. **Send message** — App detects device name automatically
3. **Gender detection** — API extracts gender from first messages
4. **Persona assignment**:
   - Male user → Companion name shows as **"Priya"**
   - Female user → Companion name shows as **"Imran"**
   - Other → Shows **"FreeTalk"**
5. **Full history stored** — All messages saved in Redis with 30-day TTL
6. **Clear chat** — Removes local data + generates new user ID (no API call)

### Admin Flow

1. **Login** — HTTP Basic Auth with credentials from `.env`
2. **See all users** — Lists users with metadata (device, gender, message count)
3. **View history** — Click any user to see full chat conversation
4. **Filter/search** — Search by user ID, device name, or gender

---

## 📡 API Endpoints

### Chat Endpoints
- `POST /chat/{user_id}` — Send message (with device_name in body)
- `GET /history/{user_id}` — Fetch chat history
- `DELETE /history/{user_id}` — Clear history (API kept, but frontend doesn't call it)
- `GET /models` — List available models

### Admin Endpoints (HTTP Basic Auth)
- `GET /admin/users` — List all users with metadata
- `GET /admin/users/{user_id}/history` — Get full chat history for a user

### Health
- `GET /health` — Check API, Redis, and Ollama status

---

## 🗄️ Redis Key Structure

```
chat:history:{user_id}     → [messages...]              (TTL: 30 days)
chat:meta:{user_id}        → {device_name, first_seen, last_seen, ...}
gender:{user_id}           → "male" | "female" | "other"
freetalk:users             → Set of all user_ids
```

---

## 🎨 Styling

Both apps use a dark theme with rose/purple accents:

**Color Variables:**
- Background: `#0f0f13`
- Surface: `#1a1a24`
- Accent (Priya): `#c2678a` (rose)
- Accent (Arjun): `#7c6af7` (purple)
- Text: `#e8e8f0`

Fully responsive — works on desktop, tablet, mobile.

---

## 🧠 Models

Backend supports models that are pulled in Ollama:

- `llama3.2:3b` — Fast, balanced
- `llama3.1:8b` — Higher quality

Models loaded dynamically from `/models` endpoint.

---

## 🔐 Security

- **Admin login** — HTTP Basic Auth (use HTTPS in production!)
- **User IDs** — Random, non-sequential
- **No passwords stored** — Credentials in `.env` only
- **Conversation privacy** — Full history in Redis, admin-only access

**For production:**
- Use HTTPS/TLS
- Add rate limiting
- Implement JWT or OAuth for admin
- Use environment variables from a secrets manager

---

## 🛑 Clear Chat Behavior

When user clicks "Clear":
1. ✅ Removes all localStorage data
2. ✅ Generates new user ID
3. ✅ **Does NOT** call delete API (history remains in Redis for admin)
4. ✅ Starts fresh conversation

---

## 📊 Admin Dashboard Features

### User List
- Sort by last seen (most recent first)
- See device type (iPhone, Android, Windows PC, Mac, etc.)
- Message count per user
- First and last seen timestamps
- Gender indicator

### Chat View
- Full conversation history
- Timestamps for each message (if available)
- User vs bot messages clearly marked
- User metadata (device, gender, first/last seen)

---

## 🚨 Troubleshooting

### Models not loading
```bash
# Check Ollama is running
ollama list

# Pull a model if needed
ollama pull llama3.1:8b
```

### Redis connection failed
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# If not installed:
sudo systemctl start redis  # Linux
brew services start redis   # macOS
```

### Admin login fails
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`
- Check backend is running on port 8000
- Clear browser auth cache (open dev tools → Network tab)

### Frontend can't connect to backend
- Check backend runs on `http://localhost:8000`
- Verify CORS is enabled (should be by default)
- Check `.env` in frontend/admin for correct `VITE_API_URL`

---

## 📝 Notes

- Chat history is **never deleted** from Redis, only when admin explicitly uses DELETE API
- User IDs are persistent — same ID = same user across sessions
- Models are loaded dynamically — add more models to Ollama and they appear automatically
- Admin dashboard is **separate app** on port 5174 to keep concerns clean

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development (React + FastAPI)
- Real-time streaming (SSE)
- Multi-language NLP prompt engineering
- Redis for session management
- Admin authentication and authorization
- Responsive UI design

---

## 📄 License

MIT — Free to use and modify.

---

**Built with ❤️ using React, FastAPI, Ollama, and Redis**


---
