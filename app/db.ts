import "server-only";
import postgres from "postgres";

export const sql = postgres(process.env.POSTGRES_URL as string, {
  ssl: "allow",
});

export async function initializeDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS itemslist (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      text VARCHAR(255) NOT NULL
    );
  `;
}

/*
initializeDB().catch(err => console.error("Error initializing the database:", err));
*/

export async function ensureUserExists(userId: string) {
  const existingUser = await sql`SELECT id FROM users WHERE id = ${userId}`;

  if (existingUser.length === 0) {
    const [{ count }] = await sql`SELECT COUNT(*) FROM users`;
    const userName = `${count + 1}`;
    await sql`INSERT INTO users (id, name) VALUES (${userId}, ${userName})`;
  }
}

export async function getItems(userId: string) {
  await ensureUserExists(userId);
  await new Promise((res) => setTimeout(res, 2000)); // Simulate delay
  const items = await sql<
    Item[]
  >`SELECT id, text FROM itemslist WHERE user_id = ${userId};`;
  console.log(items);
  return items;
}
