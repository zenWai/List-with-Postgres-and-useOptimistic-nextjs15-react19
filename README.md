This project started as a simple list application to experiment with React's `useOptimistic`, `startTransition`, and `server actions`.

I kinda overengineered a bit ¯\_(ツ)_/¯

The goal of this app is to create an experience that simulates a client-side application while saving and updating data in the background using a PostgreSQL database on a server that is lagging.

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
  <li>
    🔍 Sorting and Filtering with <strong>useOptimistic</strong> and server-side for no content-flickering on a page refresh.
  </li>
  <li>
    🛡️ Error handling throughout the application.
  </li>
</ul>
