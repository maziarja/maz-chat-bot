import type { Message } from "ollama";

const conversations = new Map<string, string>();

const conversationRepository = {
   getLastResponseId: (conversationId: string) => {
      return conversations.get(conversationId);
   },

   setLastResponseId: (conversationId: string, responseId: string) => {
      return conversations.set(conversationId, responseId);
   },
};

export default conversationRepository;

const ollamaConversations = new Map<string, Message[]>();

export const ollamaConversationRepository = {
   getMessages: (conversationId: string): Message[] =>
      ollamaConversations.get(conversationId) ?? [],

   setMessages: (conversationId: string, messages: Message[]) =>
      ollamaConversations.set(conversationId, messages),
};
