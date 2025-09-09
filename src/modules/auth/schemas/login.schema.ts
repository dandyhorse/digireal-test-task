import { registerSchema, RegisterDto } from './register.schema';

// Не применимо для работы, т.к. в реальности это будут разные проверки.
// В данном случае разделение чисто семантическое:

export const loginSchema = registerSchema;
export type LoginDto = RegisterDto;
