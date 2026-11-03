import { z } from "zod";

const t = (max: number) => z.string().trim().max(max).default("");

export const trekSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  phone: t(40),
  country: z.string().trim().min(2, "Please enter your country.").max(80),

  trek: z.string().trim().min(1, "Please choose a trek (or 'Not sure yet').").max(120),
  tripType: z.string().trim().min(1, "Please choose a trip type.").max(60),
  dates: t(160),
  duration: t(60),

  groupSize: t(40),
  experience: t(80),
  accommodation: t(80),
  budget: t(80),
  requirements: t(1500),
  message: t(1500),

  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm that we may contact you about this enquiry." }) }),
  website_hp: z.string().max(200).optional(),
  idempotencyKey: z.string().min(8).max(80)
});

export type TrekInput = z.infer<typeof trekSchema>;
