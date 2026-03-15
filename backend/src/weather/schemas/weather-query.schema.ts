import { z } from "zod";

export const cityQuerySchema = z.object({
  city: z.string().min(1, "city is required"),
});
