import { z } from "zod";

const t = (max: number) => z.string().trim().max(max).default("");
const url = z.string().trim().max(300).default("");

export const experienceSchema = z.object({ role: t(120), org: t(120), period: t(60), details: t(800) });
export const educationSchema = z.object({ school: t(160), degree: t(160), period: t(60) });
export const projectSchema = z.object({ title: t(120), details: t(900), link: url, image: url });

export const portfolioSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  phone: t(40),
  location: t(120),
  headline: z.string().trim().min(2, "Please tell us your profession or headline.").max(160),
  bio: z.string().trim().min(20, "Please write a short bio (at least a couple of sentences).").max(2000),
  photo: url,

  purpose: z.string().trim().min(1, "Please choose what the portfolio is for.").max(80),
  style: t(80),
  colour: t(60),
  domain: t(120),
  inspiration: t(600),

  skills: z.array(z.string().trim().min(1).max(60)).min(1, "Add at least one skill.").max(40),
  experience: z.array(experienceSchema).max(8),
  education: z.array(educationSchema).max(6),
  achievements: t(1200),

  projects: z.array(projectSchema).max(8),
  services: t(1200),

  linkedin: url,
  github: url,
  instagram: url,
  behance: url,
  website: url,
  resume: url,
  otherLinks: t(600),

  extra: t(1500),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm that we may use your details to build your portfolio." }) }),
  website_hp: z.string().max(200).optional(), // honeypot
  idempotencyKey: z.string().min(8).max(80)
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
