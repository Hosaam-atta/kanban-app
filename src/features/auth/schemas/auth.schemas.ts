import { z } from 'zod';

export const emailLoginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
});

export const otpVerificationSchema = z.object({
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit verification code.'),
});

export type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;
export type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;
