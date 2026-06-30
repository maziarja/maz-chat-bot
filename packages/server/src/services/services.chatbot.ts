import OpenAI from "openai";
import ollama from "ollama";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { Response as ExpressResponse } from "express";
import conversationRepository, {
   ollamaConversationRepository,
} from "../repositories/conversationRepositories";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const instruction = readFileSync(
   join(__dirname, "../prompt/maziar-ai-prompt-v2.md"),
   "utf8"
);

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export const chatbotServices = {
   openAI: async (prompt: string, conversationId: string) => {
      const response = await client.responses.create({
         model: "gpt-5-nano",
         input: prompt,
         instructions: instruction,
         // max_output_tokens: 1000,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return response.output_text;
   },

   openAIStream: async (
      prompt: string,
      conversationId: string,
      res: ExpressResponse
   ) => {
      const stream = await client.responses.create({
         model: "gpt-5-nano",
         input: prompt,
         instructions: instruction,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
         stream: true,
      });

      for await (const event of stream) {
         if (event.type === "response.output_text.delta") {
            res.write(`data: ${JSON.stringify({ delta: event.delta })}\n\n`);
         }
         if (event.type === "response.completed") {
            conversationRepository.setLastResponseId(
               conversationId,
               event.response.id
            );
         }
      }

      res.write("data: [DONE]\n\n");
      res.end();
   },

   ollama: async (prompt: string, conversationId: string) => {
      const history = ollamaConversationRepository.getMessages(conversationId);

      if (history.length === 0) {
         history.push({ role: "system", content: instruction });
      }

      history.push({ role: "user", content: prompt });

      const response = await ollama.chat({
         model: "gemma3:4b",
         messages: history,
      });

      history.push(response.message);
      ollamaConversationRepository.setMessages(conversationId, history);

      return response.message.content;
   },
};
