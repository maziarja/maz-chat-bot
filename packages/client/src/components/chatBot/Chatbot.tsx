import axios from "axios";
import { type FieldValues } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import Messages, { type Messages as MessagesType } from "./Messages";
import LoadingIndicator from "./LoadingIndicator";
import ChatInput from "./ChatInput";
import { Bot, Moon, Sun, SquarePen } from "lucide-react";
import { Button } from "../ui/button";

type Response = { message: string };

const EXAMPLE_PROMPTS = [
   "What are your best projects?",
   "What technologies do you specialize in?",
   "Are you available for hire?",
];

type Props = { dark: boolean; onToggleDark: () => void };

function Chatbot({ dark, onToggleDark }: Props) {
   const conversationIdRef = useRef(crypto.randomUUID());
   const [messages, setMessages] = useState<MessagesType>([]);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!error) return;
      const t = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(t);
   }, [error]);

   function resetChat() {
      setMessages([]);
      setError("");
      conversationIdRef.current = crypto.randomUUID();
   }

   async function onSubmit({ prompt }: FieldValues) {
      setError("");
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
      } catch (err) {
         if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message ?? "Something went wrong");
         }
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="flex h-full flex-col gap-3">
         <header className="flex items-center gap-2 border-b pb-3">
            <Bot className="size-5 text-primary" />
            <span className="font-semibold">maz-chatbot</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
               gpt-5-nano
            </span>
            <div className="ml-auto flex items-center gap-1">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleDark}
                  aria-label="toggle dark mode"
               >
                  {dark ? (
                     <Sun className="size-4" />
                  ) : (
                     <Moon className="size-4" />
                  )}
               </Button>
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetChat}
                  aria-label="new chat"
               >
                  <SquarePen className="size-4" />
               </Button>
            </div>
         </header>

         {messages.length === 0 && !loading ? (
            <WelcomeState onSelect={(p) => onSubmit({ prompt: p })} />
         ) : (
            <Messages messages={messages} />
         )}

         {loading && <LoadingIndicator />}

         {error && (
            <div className="flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
               <span>{error}</span>
               <button
                  onClick={() => setError("")}
                  className="ml-2 opacity-60 hover:opacity-100"
                  aria-label="dismiss error"
               >
                  ✕
               </button>
            </div>
         )}

         <ChatInput onSubmit={onSubmit} loading={loading} />
      </div>
   );
}

function WelcomeState({ onSelect }: { onSelect: (p: string) => void }) {
   return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
         <div className="flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
               <Bot className="size-7" />
            </div>
            <div>
               <h1 className="text-2xl font-semibold">How can I help you?</h1>
               <p className="mt-1 text-sm text-muted-foreground">
                  Ask about my projects, skills, or how to get in touch.
               </p>
            </div>
         </div>
         <div className="flex w-full max-w-sm flex-col gap-2">
            {EXAMPLE_PROMPTS.map((p) => (
               <button
                  key={p}
                  onClick={() => onSelect(p)}
                  className="rounded-xl border px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
               >
                  {p}
               </button>
            ))}
         </div>
      </div>
   );
}

export default Chatbot;
