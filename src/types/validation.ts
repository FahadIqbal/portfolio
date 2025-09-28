import { z } from 'zod';

// Define common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address');

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .or(z.literal(''));

export const phoneSchema = z
  .string()
  .regex(
    /^(\+\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    'Please enter a valid phone number'
  )
  .or(z.literal(''));

// Project schema
export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image URL is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  category: z.string().min(1, 'Category is required'),
  url: urlSchema,
  github: urlSchema,
  stats: z
    .object({
      stars: z.number().int().nonnegative().optional(),
      forks: z.number().int().nonnegative().optional(),
      issues: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Skill schema
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.number().min(0).max(100),
  category: z.string().min(1, 'Category is required'),
});

export type Skill = z.infer<typeof skillSchema>;

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: phoneSchema,
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// User preferences schema
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  reducedMotion: z.boolean(),
  fontSize: z.enum(['small', 'medium', 'large']),
  language: z.string().min(2).max(5),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;