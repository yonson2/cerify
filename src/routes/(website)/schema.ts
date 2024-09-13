import { z } from "zod";

export const formSchema = z.object({
  q: z.string().min(2).max(100),
});

export type FormSchema = typeof formSchema;
