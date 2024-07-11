"use server";
import { initializeDB, sql } from "@/app/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ItemSchema = z.object({
  text: z.string().min(1, "Item text is required"),
});

export async function saveAction(formData: FormData) {
  await initializeDB();
  //await new Promise((res) => setTimeout(res, 1000));
  let text = formData.get("item") as string;
  const result = ItemSchema.safeParse({ text });
  if (!result.success) {
    return { success: false, errors: result.error.errors.map(e => e.message) };
  }
  await sql`
      INSERT INTO itemsList (text)
      VALUES (${result.data.text});
  `;
  revalidatePath("/");
  return { success: true, message: "Item added successfully" };
}
