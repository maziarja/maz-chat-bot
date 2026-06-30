import axios from "axios";
import { type FieldValues } from "react-hook-form";
import { useRef, useState } from "react";
import Messages, { type Messages as MessagesType } from "./Messages";
import LoadingIndicator from "./LoadingIndicator";
import ChatInput from "./ChatInput";

type Response = {
   message: string;
};

function Chatbot() {
   const conversationIdRef = useRef(crypto.randomUUID());
   const [messages, setMessages] = useState<MessagesType>([]);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   async function onSubmit({ prompt }: FieldValues) {
      try {
         setMessages((prev) => [...prev, { prompt, role: "user" }]);
         setLoading(true);

         const { data } = await axios.post<Response>("/api/chat", {
            prompt,
            conversationId: conversationIdRef.current,
         });

         setMessages((prev) => [
            ...prev,
            { prompt: data.message, role: "bot" },
         ]);
      } catch (error) {
         if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message ?? "Something went wrong");
         }
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="flex h-full flex-col gap-2">
         <Messages messages={messages} />
         {loading && <LoadingIndicator />}
         {error && <p className="p-1 text-sm text-red-500">{error}</p>}
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
}

export default Chatbot;
