"use server";
import { sql } from "@/app/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ItemSchema = z.object({
  text: z
    .string()
    .min(1, "Item text is required")
    .max(255, "Item text must be less than 255 characters"),
});

const IdSchema = z.number().positive().int();

export async function saveAction(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));
  let text = formData.get("item") as string;
  const result = ItemSchema.safeParse({ text });
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  await sql`
      INSERT INTO itemslist (text)
      VALUES (${result.data.text});
  `;
  revalidatePath("/");
  return { success: true, message: "Item added successfully" };
}

export async function deleteAction(id: number) {
  await new Promise((res) => setTimeout(res, 2000));
  const result = IdSchema.safeParse(id);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  const deleteResult = await sql`
    DELETE FROM itemslist WHERE id = ${result.data};
  `;

  if (deleteResult.count === 0) {
    return { success: false, message: "Item not found or already deleted" };
  }
  revalidatePath("/");
  return { success: true, message: "Item deleted successfully" };
}

export async function updateAction(id: number, formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));
  const idResult = IdSchema.safeParse(id);
  const text = formData.get("updateText") as string;
  const textResult = ItemSchema.safeParse({ text });

  if (!idResult.success || !textResult.success) {
    return {
      success: false,
      errors: [
        ...(idResult.error ? idResult.error.errors.map((e) => e.message) : []),
        ...(textResult.error
          ? textResult.error.errors.map((e) => e.message)
          : []),
      ],
    };
  }

  await sql`
    UPDATE itemslist SET text = ${textResult.data.text} WHERE id = ${id};
  `;

  revalidatePath("/");
  return { success: true, message: "Item updated successfully" };
}
