import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().int().positive("Price must be a positive number (in cents)"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
});

export type ProductInput = z.infer<typeof productSchema>;
