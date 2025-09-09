import z from 'zod';

export const registerSchema = z.object({
  login: z.email(),
  password: z.string(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
