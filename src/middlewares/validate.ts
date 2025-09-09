import { z, ZodObject } from 'zod';

export const validate = <T extends ZodObject<any>>(schema: T, data: unknown) => {
  const { success, error } = schema.safeParse(data);

  if (!success) {
    const validationIssues = error.issues.reduce((acc, issue) => {
      const path = issue.path.join('.');
      acc[path] = acc[path] || [];
      acc[path].push(issue.message);
      return acc;
    }, {} as Record<string, string[]>);

    throw { type: z.ZodError, validationIssues };
  }

  return data as z.infer<T>;
};
