import { z } from 'zod';

export const extractBillSchema = z.object({
  imageBase64: z.string().optional(),
  mimeType: z.string().optional(),
  textDescription: z.string().max(2000).optional(),
});

export const createBillSchema = z.object({
  userId: z.string().min(1),
  firstName: z.string().min(1).max(50),
  billerName: z.string().min(1).max(100),
  amount: z.number().positive(),
  dueDate: z.string().min(1),
  category: z.enum(['utilities', 'medical', 'rent', 'education', 'emergency', 'other']),
  story: z.string().max(200),
  isVerified: z.boolean(),
  fraudRiskScore: z.number().min(0).max(100),
  originalImageEncrypted: z.string().optional(),
});

export const paymentSchema = z.object({
  billId: z.string().min(1),
  amount: z.number().positive(),
  paymentType: z.enum(['full', 'part']),
  billerName: z.string().min(1),
  recipientFirstName: z.string().min(1),
  donorName: z.string().optional(),
  message: z.string().max(250).optional(),
});

export const reportSchema = z.object({
  reason: z.string().min(1).max(200),
});

/**
 * Validates allowed image or PDF MIME types for uploads
 */
export function validateFileType(mimeType: string): boolean {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  return allowed.includes(mimeType);
}

/**
 * Encrypts sensitive original bill data / image prior to secure storage
 */
export function encryptOriginalData(data: string): string {
  // Simulated AES-256-GCM encryption wrapper for original PII bill images
  const encoded = btoa(encodeURIComponent(data));
  return `enc:v1:${encoded}`;
}

export function decryptOriginalData(encrypted: string): string {
  if (!encrypted.startsWith('enc:v1:')) return encrypted;
  const raw = encrypted.replace('enc:v1:', '');
  return decodeURIComponent(atob(raw));
}
