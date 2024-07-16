"use server";
import { sql } from "@/app/db";
import { DeleteItemSchema, SaveItemSchema, UpdateItemSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ItemsActionsResult = {
  success: boolean;
  message?: string;
  errors?: string;
};
type SaveItemType = z.infer<typeof SaveItemSchema>;
type UpdateItemType = z.infer<typeof UpdateItemSchema>;
type DeleteItemType = z.infer<typeof DeleteItemSchema>;

type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: string;
};

async function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
): Promise<ValidationResult<T>> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.errors.map((error) => error.message).join(", ");
    return { success: false, errors };
  }
}

export async function saveAction(
  formData: FormData,
  userId: string,
): Promise<ItemsActionsResult> {
  await new Promise((res) => setTimeout(res, 2000));

  // validate data
  const text = formData.get("item");
  const data = { text, userId };
  const {
    success,
    data: validatedData,
    errors,
  } = await validateData<SaveItemType>(data, SaveItemSchema);

  if (!success) {
    return { success, errors };
  }

  if (!validatedData) {
    return { success: false, errors: "Could not save item - unknown" };
  }

  try {
    await sql`
        INSERT INTO itemslist (user_id, text)
        VALUES (${validatedData.userId}, ${validatedData.text});
    `;
  } catch {
    throw new Error("Error adding to the database");
  }

  revalidatePath("/");
  return { success: true, message: "Item added successfully" };
}

export async function deleteAction(
  id: number,
  userId: string,
): Promise<ItemsActionsResult> {
  await new Promise((res) => setTimeout(res, 2000));

  // validate data
  const data = { id, userId };
  const {
    success,
    data: validatedData,
    errors,
  } = await validateData<DeleteItemType>(data, DeleteItemSchema);

  if (!success) {
    return { success, errors };
  }

  if (!validatedData) {
    return { success: false, errors: "Could not delete item - Unknown" };
  }

  try {
    const deleteResult = await sql`
        DELETE
        FROM itemslist
        WHERE id = ${validatedData.id}
          AND user_id = ${validatedData.userId};
    `;
    if (deleteResult.count === 0) {
      return { success: false, errors: "Could not delete item - Not found" };
    }
  } catch {
    throw new Error("Error deleting item");
  }

  revalidatePath("/");
  return { success: true, message: "Item deleted successfully" };
}

export async function updateAction(
  id: number,
  formData: FormData,
  userId: string,
): Promise<ItemsActionsResult> {
  await new Promise((res) => setTimeout(res, 2000));

  // validate data
  const text = formData.get("updateText");
  const data = { id, text, userId };
  const {
    success,
    data: validatedData,
    errors,
  } = await validateData<UpdateItemType>(data, UpdateItemSchema);

  if (!success) {
    return { success, errors };
  }

  if (!validatedData) {
    return { success: false, errors: "Could not Update item - Unknown" };
  }

  try {
    await sql`
        UPDATE itemslist
        SET text = ${validatedData.text}
        WHERE id = ${validatedData.id}
          AND user_id = ${validatedData.userId};
    `;
  } catch {
    throw new Error("Error updating item");
  }

  revalidatePath("/");
  return { success: true, message: "Item updated successfully" };
}
