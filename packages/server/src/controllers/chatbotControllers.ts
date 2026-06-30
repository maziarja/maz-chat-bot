import type { Request, Response } from "express";
import z from "zod";
import { chatSchema } from "../schemas/chatbotSchema";
import { chatbotServices } from "../services/services.chatbot";

const chatbotController = async (req: Request, res: Response) => {
   const parsed = chatSchema.safeParse(req.body);

   if (!parsed.success) {
      res.status(400).json({ message: z.prettifyError(parsed.error) });
      return;
   }

   const { prompt, conversationId } = parsed.data;

   res.setHeader("Content-Type", "text/event-stream");
   res.setHeader("Cache-Control", "no-cache");
   res.setHeader("Connection", "keep-alive");
   res.flushHeaders();

   try {
      await chatbotServices.openAIStream(prompt, conversationId, res);
   } catch (err) {
      const message =
         err instanceof Error ? err.message : "Failed to generate a response";
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
   }
};

export default chatbotController;
