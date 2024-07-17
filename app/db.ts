import { fakeItems } from "@/utils/fakeItemsData";
import { uuidValidateV4 } from "@/utils/uuidValidate";
import postgres from "postgres";

export const sql = postgres(process.env.POSTGRES_URL as string, {
  ssl: "allow",
});

async function initializeDB() {
  console.log("hi from initializeDB");
  try {
    await sql.begin(async (sql) => {
      await sql`
          CREATE TABLE IF NOT EXISTS users
          (
              id         UUID PRIMARY KEY,
              name       VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      `;
      await sql`
          CREATE TABLE IF NOT EXISTS itemslist
          (
              id         SERIAL PRIMARY KEY,
              user_id    UUID         NOT NULL REFERENCES users (id),
              text       VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      `;
    });
  } catch (err) {
    console.error("Error initializing the database:", err);
    throw new Error("Database initialization failed");
  }
}

(async () => {
  await initializeDB();
})();

async function createNewUser(userId: string): Promise<string> {
  if (!userId || !uuidValidateV4(userId)) {
    throw new Error("Invalid userId");
  }
  const [{ count }] = await sql`SELECT COUNT(*)::integer AS count
                                FROM users`;
  const userName = `${count + 1}`;
  await sql`INSERT INTO users (id, name)
            VALUES (${userId}, ${userName})`;
  // Insert fake items into the itemslist table for the new user
  await sql.begin(async (sql) => {
    for (const item of fakeItems) {
      await sql`INSERT INTO itemslist (user_id, text, created_at) VALUES (${userId}, ${item.text}, ${item.created_at})`;
    }
  });
  return userId; //userId or (possibly) the new userId
}

async function ensureUserExists(userId: string | undefined): Promise<boolean> {
  if (!userId || !uuidValidateV4(userId)) {
    return false;
  }
  try {
    const existingUser = await sql`SELECT id
                                   FROM users
                                   WHERE id = ${userId}`;
    return existingUser.length === 1;
  } catch (e) {
    console.log("error ensuring user exists", e);
    return false;
  }
}

async function getUser(userId: string) {
  try {
    const user = await sql<{ id: string; name: string; created_at: Date }[]>`
        SELECT id, name, created_at
        FROM users
        WHERE id = ${userId};
    `;
    if (user.length === 0) throw new Error("User not found");
    return user[0];
  } catch (err) {
    throw new Error("Failed to get user");
  }
}

async function getItemsFromDB(userId: string, delay = true): Promise<Item[]> {
  try {
    if(delay) await new Promise((res) => setTimeout(res, 2000));
    return await sql<Item[]>`
        SELECT id, text, created_at
        FROM itemslist
        WHERE user_id = ${userId};
    `;
  } catch (err) {
    throw new Error("Failed to get items");
  }
}

export async function getItems(
  userId: string,
  delay: boolean
): Promise<{ items: Item[]; user: User }> {
  const userIdExists = await ensureUserExists(userId);

  if (!userIdExists) {
    userId = await createNewUser(userId);
  }

  const [items, user] = await Promise.all([
    getItemsFromDB(userId, delay),
    getUser(userId),
  ]);

  return { items, user };
}
