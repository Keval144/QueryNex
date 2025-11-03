import z from "zod";

export const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/\d/, { message: "Password must contain at least one number" })
  .regex(/[@$!%*?&]/, {
    message: "Password must contain at least one special character (@$!%*?&)",
  });

export const createChatSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  database: z.string().min(1, "Please select a database type"), // Changed from enum to string
  dataString: z.string().min(1, "Connection string is required"),
  safemode: z.boolean(),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
