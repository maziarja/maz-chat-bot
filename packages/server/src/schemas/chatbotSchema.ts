import z from "zod";

export const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, "prompt is required")
      .max(400, "max prompt character is 400"),
   conversationId: z.uuid(),
});
