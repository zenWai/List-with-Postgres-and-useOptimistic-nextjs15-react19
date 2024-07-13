import "server-only";
import postgres from "postgres";

export const sql = postgres(process.env.POSTGRES_URL as string, {
  ssl: "allow",
});

export async function initializeDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS itemslist (
      id SERIAL PRIMARY KEY,
      text VARCHAR(255) NOT NULL
    );
  `;
}

export async function getItems() {
  await initializeDB();
  //await new Promise((res) => setTimeout(res, 1000));
  const items = await sql<Item[]>`
      SELECT id, text FROM itemslist;
  `;
  return items;
}
