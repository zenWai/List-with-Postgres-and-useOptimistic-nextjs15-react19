This project started as a simple list application to experiment with React's `useOptimistic`, `startTransition`, and `server actions`.

I kinda overengineered a bit ¯\_(ツ)_/¯

The goal of this app is to create an experience that simulates a client-side application while saving and updating data in the background using a PostgreSQL database on a server that is lagging.

https://nextjs15-react19-list-with-useoptimistic.vercel.app/

# Key Features
<ul>
  <li>
    🚀 <strong>useOptimistic</strong>
  </li>
  <li>
    🔄 <strong>startTransition</strong>
  </li>
  <li>
    🌐 <strong>Next.js server actions</strong>
  </li>
  <li>
    👤 Unique accounts with middleware cookie handling.
  </li>
  <li>
    ⚡ Immediate feedback on actions
  </li>
  <li>
    🔐 <strong>Next.js middleware</strong> for cookie handling, new user creation, and edge cases
  </li>
  <li>
    🛠️ <strong>PostgreSQL</strong> as DB
  </li>
  <li>Experimental React 19 compiler.</li>
  <li>
    🔍 Sorting and Filtering with <strong>useOptimistic</strong>
  </li>
  <li>
    🛡️ Error handling
  </li>
  <li>
    📏 Zod
  </li>
</ul>

# Run locally

```
Add your POSTGRES_URL= in a .env, follow the .env.example
POSTGRES_URL="postgres://default:xxx@xxx:PORT/xxx?sslmode=require"
```

