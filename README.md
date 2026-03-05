# DevBoard

A full-stack developer dashboard built with **Next.js App Router, TypeScript, Tailwind CSS, Prisma, and Neon PostgreSQL**. DevBoard provides a clean, dark IDE-themed interface for managing tasks, notes, and code snippets — with full user authentication and per-user data isolation.

🔗 **Live Demo:** https://devboard-amber.vercel.app

---

## ✨ Features

- **Authentication** — Email/password and Google OAuth via NextAuth v5
- **Kanban Board** — 3-column board (Todo / In Progress / Done) with priority cycling, tags, and inline task creation
- **Notes & Snippets** — Save notes and code snippets with language tags, pinning, and full-text search
- **Dashboard** — Stats widgets, completion ring, priority breakdown, quick-add, and recent activity
- **Per-user Data** — All tasks and notes are fully isolated per user
- **Persistent Storage** — Neon PostgreSQL database via Prisma ORM
- **Dark IDE Theme** — JetBrains Mono + Syne fonts, cyan accents, terminal aesthetics
- **Fully Responsive** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth v5 |
| ORM | Prisma 7 |
| Database | Neon (PostgreSQL) |
| Deployment | Vercel |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── register/route.ts        # Registration endpoint
│   │   ├── tasks/
│   │   │   ├── route.ts                 # GET, POST tasks
│   │   │   └── [id]/route.ts            # PATCH, DELETE task
│   │   └── notes/
│   │       ├── route.ts                 # GET, POST notes
│   │       └── [id]/route.ts            # PATCH, DELETE note
│   ├── login/page.tsx                   # Login page
│   ├── register/page.tsx                # Register page
│   ├── layout.tsx
│   ├── page.tsx                         # Main dashboard
│   ├── providers.tsx                    # SessionProvider wrapper
│   └── globals.css
├── components/
│   ├── Navbar.tsx                       # Nav with live clock + user menu
│   ├── Dashboard.tsx                    # Overview tab
│   ├── KanbanBoard.tsx                  # Kanban tab
│   ├── NotesPanel.tsx                   # Notes tab
│   └── StatsWidgets.tsx                 # Stats cards + charts
├── lib/
│   ├── auth.ts                          # NextAuth config
│   └── prisma.ts                        # Prisma client singleton
├── types/
│   ├── task.ts                          # Task + Note types
│   └── next-auth.d.ts                   # NextAuth type augmentation
└── middleware.ts                        # Route protection
prisma/
└── schema.prisma                        # Database schema
```

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) account (free tier works)
- A [Google Cloud](https://console.cloud.google.com) project for OAuth

### 1. Clone the repository

```bash
git clone https://github.com/anuragdatta936/devboard.git
cd devboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-xxxx.region.aws.neon.tech/devboard?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://user:password@ep-xxxx.region.aws.neon.tech/devboard?sslmode=require

# NextAuth
NEXTAUTH_SECRET=your-secret-run-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Also create a `.env` file (used by Prisma CLI):
```env
DATABASE_URL=same-as-above
DIRECT_URL=same-as-above
```

### 4. Generate Prisma client and push schema

```bash
npx prisma generate
npx prisma db push --url="your-direct-url"
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

This project is deployed on **Vercel**.

1. Push your code to GitHub
2. Import the repository at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in Vercel's project settings
4. Set the build command to:
   ```
   npx prisma generate && next build
   ```
5. Update `NEXTAUTH_URL` to your Vercel deployment URL
6. Add your Vercel URL to **Authorized redirect URIs** in Google Cloud Console:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

---

## 📸 Screenshots

> Add screenshots of the dashboard, kanban board, and login page here.

---

## 📈 Future Improvements

- Drag-and-drop Kanban cards
- Task due dates and reminders
- Email notifications
- Team/shared workspaces
- Dark/light theme toggle
- Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome. Fork the repository and submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Anurag Datta](https://github.com/anuragdatta936)
