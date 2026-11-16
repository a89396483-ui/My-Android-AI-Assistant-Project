import { z } from "zod";

export const chatInput = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    text: z.string().max(4000),
    image: z.string().max(6_000_000).startsWith("data:image/").optional(),
  })).min(1).max(100),
  lang: z.enum(["auto", "ur", "hi", "pa", "en", "roman-ur"]).optional(),
  memories: z.array(z.string().max(200)).max(20).optional(),
  mode: z.enum(["game", "manager"]).optional(),
});

export const songInput = z.object({
  idea: z.string().trim().min(1).max(1000),
  lang: z.enum(["Urdu", "Hindi", "Punjabi", "English"]).optional(),
  voice: z.enum(["male", "female"]).optional(),
  style: z.enum(["romantic", "sad", "emotional", "rap", "pop", "modern", "cinematic"]).optional(),
});
