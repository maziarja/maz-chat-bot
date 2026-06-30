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

   const output = await chatbotServices.openAI(prompt, conversationId);

   // const output = await chatbotServices.ollama(prompt, conversationId);

   res.json({ message: output });
};

export default chatbotController;
