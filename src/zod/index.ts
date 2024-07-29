import { z } from "zod";

export const urlSchema = z
  .string()
  .url()
  .startsWith("https://twitter.com")
  .or(z.string().url().startsWith("https://x.com"));
