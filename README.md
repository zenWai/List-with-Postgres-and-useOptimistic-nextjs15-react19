This project started as a simple list application to experiment with React's `useOptimistic`, `startTransition`, and `server actions`.

I kinda overengineered a bit ¯\_(ツ)_/¯

The goal of this app is to create an experience that simulates a client-side application while saving and updating data in the background using a PostgreSQL database on a server that is lagging.

https://nextjs15-react19-list-with-useoptimistic.vercel.app/

As per my PR #9 I got the new react19 compiler, it actually fixed one bug i was having trouble with.
See PR https://github.com/zenWai/List-with-Postgres-and-useOptimistic-nextjs15-react19/pull/9

### Build without the react19 compiler
https://list-with-postgres-and-use-optimist-git-2b26c4-my-team-00a21fbb.vercel.app?_vercel_share=A4CEnXoBDzHQkCoOG70g3arr0GMsHlij

### Build with the react19 compiler - most recent
https://nextjs15-react19-list-with-useoptimistic.vercel.app/

# Key Features
<ul>
  <li>
    🚀 <strong>useOptimistic</strong> to update the UI immediately and without refs leveraging the React 19 capability, providing a smooth user experience even when the server is lagging.
  </li>
  <li>
    🔄 <strong>startTransition</strong> to manage state transitions.
  </li>
  <li>
    🌐 <strong>Next.js server actions</strong> to handle database interactions coming from the client-side.
  </li>
  <li>
    👤 Each user gets their own account with a unique list of items.
  </li>
  <li>
    ⚡ Immediate feedback on actions (like adding, updating, or deleting items) through optimistic UI updates.
  </li>
  <li>
    🔐 <strong>Next.js middleware</strong> for cookie handling, new user creation, and edge cases where the user was not found.
  </li>
  <li>
    🛠️ <strong>PostgreSQL</strong> for data persistence, ensuring that all changes are saved and updated in the database.
  </li>
  <li>Experimental React 19 compiler.</li>
  <li>
    🔍 Sorting and Filtering with <strong>useOptimistic</strong> and server-side for no content-flickering on a page refresh.
  </li>
  <li>
    🛡️ Error handling throughout the application.
  </li>
  <li>
    📏 Zod for schema and data validation.
  </li>
</ul>

# Run locally

```
Add your POSTGRES_URL= in a .env, follow the .env.example
POSTGRES_URL="postgres://default:xxx@xxx:PORT/xxx?sslmode=require"
```

