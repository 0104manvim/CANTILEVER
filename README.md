# Inkwell — React + Firebase Animated Blog

A production-ready, full-stack blog built with **React (Vite)**, **Firebase (Auth + Firestore)**,
**Tailwind CSS**, and **Framer Motion**. Includes secure auth, full CRUD for posts, animated
page transitions, scroll-reveal cards, and an animated create/edit modal.

Sample posts included on: **Virat Kohli, Sleeping, Harry Potter, and Dancing.**

---

## 1. Project Setup

These are the exact commands used to create this project (already scaffolded for you — you
only need to run steps 4 onward):

```bash
# 1. Scaffold a Vite + React project
npm create vite@latest react-blog-app -- --template react

# 2. Move into the project
cd react-blog-app

# 3. Install core dependencies
npm install firebase react-router-dom framer-motion react-hot-toast react-icons date-fns

# 4. Install Tailwind CSS + PostCSS + Autoprefixer
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# --- From here on, since this project is pre-built, just do: ---

# 5. Install all dependencies from package.json
npm install

# 6. Add your Firebase credentials (see Section 2 below)
cp .env.example .env
# then edit .env with your real Firebase project values

# 7. Run the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 2. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Under **Build → Authentication**, click **Get Started**, then enable the
   **Email/Password** sign-in provider.
3. Under **Build → Firestore Database**, click **Create database** (start in production mode).
4. Go to **Project settings → General → Your apps**, click the **Web (`</>`)** icon to register
   a web app, and copy the config values it gives you into your `.env` file:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

5. Go to **Firestore Database → Rules**, and paste in the contents of `firestore.rules`
   (included in this project) to lock down who can create/edit/delete posts. Publish the rules.

That's it — no backend server needed. Firebase handles auth + the database directly from
the React app.

---

## 3. Folder Structure

```
react-blog-app/
├── firestore.rules              # Firestore security rules (see Section 2)
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env.example                 # Copy to .env and fill with your Firebase keys
└── src/
    ├── main.jsx                 # App entry point (Router + AuthProvider + Toaster)
    ├── App.jsx                  # Route definitions + animated page transitions
    ├── index.css                # Tailwind directives + shared utility classes
    ├── firebase/
    │   └── config.js            # Firebase initialization (auth, db exports)
    ├── context/
    │   └── AuthContext.jsx      # Global auth state (signup/login/logout/currentUser)
    ├── hooks/
    │   └── usePosts.js          # All Firestore CRUD logic, real-time subscription
    ├── components/
    │   ├── Navbar.jsx           # Top nav, auth-aware, animated mobile menu
    │   ├── Auth.jsx             # Shared login/register form
    │   ├── BlogFeed.jsx         # Filter/search + grid of PostCards
    │   ├── PostCard.jsx         # Individual post preview, scroll-reveal + hover
    │   ├── PostEditor.jsx       # Animated modal for create/edit
    │   ├── ProtectedRoute.jsx   # Redirects unauthenticated users
    │   └── Loader.jsx           # Reusable animated spinner
    ├── pages/
    │   ├── Home.jsx             # Hero + public blog feed
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx        # Authenticated: manage/create/seed posts
    │   └── PostPage.jsx         # Full single-post view
    └── utils/
        └── seedData.js          # 4 sample posts (Kohli, Sleeping, Harry Potter, Dancing)
```

---

## 4. How State Flows

- **`AuthContext`** wraps the entire app in `main.jsx`. Any component can call
  `const { currentUser, login, signup, logout } = useAuth();` to read or change auth state.
- **`usePosts`** is a self-contained hook that opens a live Firestore subscription
  (`onSnapshot`) so the UI updates in real time whenever any post is created, edited, or
  deleted — by any user, in any tab.
- Pages (`Home`, `Dashboard`) call `usePosts()` and pass `posts`, `addPost`, `editPost`,
  `removePost` down to `BlogFeed` / `PostCard` / `PostEditor` as props — keeping those
  components "dumb" and reusable.

---

## 5. Trying It Out

1. Register a new account on `/register`.
2. Go to `/dashboard` and click **"Seed Sample Posts"** to instantly populate the blog with
   4 example posts (Virat Kohli, Sleeping, Harry Potter, Dancing).
3. Click **"New Post"** to open the animated editor modal and publish your own post.
4. Visit the homepage (`/`) to see the animated, scroll-revealing public feed.
5. Hover over your own post cards to reveal edit/delete controls (only visible to the author).

---

## 6. Production Build

```bash
npm run build     # outputs to /dist
npm run preview   # preview the production build locally
```

Deploy the `dist/` folder to any static host (Firebase Hosting, Vercel, Netlify, etc.).
