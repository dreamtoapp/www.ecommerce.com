import { z } from 'zod';

export const schema = z.object({
  promotionId: z.string(),
  locale: z.string(),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  openGraphTitle: z.string().optional(),
  openGraphDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.string().optional(),
  openGraphImage: z.string().optional(),
  twitterImage: z.string().optional(),
  schemaOrg: z.string().optional(),
  twitterCardType: z.string().optional(),
  customMetaTag: z.string().optional(),
});