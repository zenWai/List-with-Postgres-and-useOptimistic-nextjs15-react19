"use server";
import { initializeDB, sql } from "@/app/db";
import { revalidatePath } from "next/cache";

export async function saveAction(formData: FormData) {
  await initializeDB();
  //await new Promise((res) => setTimeout(res, 1000));
  let text = formData.get("item") as string;
  await sql`
      INSERT INTO itemsList (text)
      VALUES (${text});
  `;
  revalidatePath("/");
}
