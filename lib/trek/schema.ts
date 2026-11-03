import { z } from "zod";

const t = (max: number) => z.string().trim().max(max).default("");

export const trekSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  country: z.string().trim().min(2, "Please enter your country.").max(80),
  phone: t(40),
  enquiryType: z.string().trim().min(1, "Please choose an enquiry type.").max(80),
  region: t(80),
  travelDate: t(80),
  message: z.string().trim().min(10, "Please write a short message (at least a sentence).").max(2000),
  website_hp: z.string().max(200).optional(),
  idempotencyKey: z.string().min(8).max(80)
});

export type TrekInput = z.infer<typeof trekSchema>;
