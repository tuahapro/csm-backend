## React + Express Fullstack (Vite + Tailwind)

Structure:
- `frontend`: React + Vite + Tailwind CSS
- `backend`: Express API with CORS and dotenv

### Prerequisites
- Node.js 18+ and npm

### Install
Run in two terminals or sequentially:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Run (Development)
- Start backend (http://localhost:5000):
```bash
cd backend
npm run dev
```

- Start frontend (http://localhost:5173):
```bash
cd frontend
npm run dev
```

The frontend is configured to proxy `/api/*` to `http://localhost:5000`.

### Build (Frontend)
```bash
cd frontend
npm run build
```

### API Endpoints
- `GET /api/health` → `{ status: "ok", uptimeSeconds: number }`
- `GET /api/hello` → `{ message: "Hello from Express backend!" }`
- `GET /api/todos` → list todos
- `POST /api/todos` → `{ title }` create
- `PATCH /api/todos/:id` → update `{ title?, completed? }`
- `DELETE /api/todos/:id` → delete

### MongoDB
- Set `MONGO_URI` in `backend/.env` (default falls back to `mongodb://127.0.0.1:27017/appdb`)
- Start a local MongoDB or use MongoDB Atlas
- Connection is initialized on backend startup via `connectMongo()`


