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

