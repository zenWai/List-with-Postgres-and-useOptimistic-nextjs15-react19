import * as z from "zod";

const ItemTextSchema = z
  .string()
  .trim()
  .min(1, "Item text is required")
  .max(255, "Item text must be less than 255 characters");
const UserIdSchema = z.string().trim().uuid("Invalid User ID");
const ItemIdSchema = z.number().positive().int();

export const SaveItemSchema = z.object({
  text: ItemTextSchema,
  userId: UserIdSchema,
});

export const DeleteItemSchema = z.object({
  id: ItemIdSchema,
  userId: UserIdSchema,
});

export const UpdateItemSchema = z.object({
  id: ItemIdSchema,
  text: ItemTextSchema,
  userId: UserIdSchema,
});
