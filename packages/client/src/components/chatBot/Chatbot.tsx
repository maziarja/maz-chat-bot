import { type FieldValues } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import Messages, { type Messages as MessagesType } from "./Messages";
import LoadingIndicator from "./LoadingIndicator";
import ChatInput from "./ChatInput";
import { Bot, Moon, Sun, SquarePen } from "lucide-react";
import { Button } from "../ui/button";

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
   const [isStreaming, setIsStreaming] = useState(false);

   useEffect(() => {
      if (!error) return;
      const t = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(t);
   }, [error]);

   function resetChat() {
      setMessages([]);
      setError("");
      setLoading(false);
      setIsStreaming(false);
      conversationIdRef.current = crypto.randomUUID();
   }

   async function onSubmit({ prompt }: FieldValues) {
      setError("");
      setLoading(true);
      setIsStreaming(true);
      setMessages((prev) => [
         ...prev,
         { id: crypto.randomUUID(), prompt, role: "user" },
      ]);

      try {
         const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               prompt,
               conversationId: conversationIdRef.current,
            }),
         });

         if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message ?? "Something went wrong");
         }

         const botId = crypto.randomUUID();
         setMessages((prev) => [
            ...prev,
            { id: botId, prompt: "", role: "bot" },
         ]);
         setLoading(false);

         const reader = res.body!.getReader();
         const decoder = new TextDecoder();
         let buffer = "";

         while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
               if (!line.startsWith("data: ")) continue;
               const payload = line.slice(6);
               if (payload === "[DONE]") break;
               try {
                  const parsed = JSON.parse(payload);
                  if (parsed.error) throw new Error(parsed.error);
                  if (parsed.delta) {
                     setMessages((prev) =>
                        prev.map((m) =>
                           m.id === botId
                              ? { ...m, prompt: m.prompt + parsed.delta }
                              : m
                        )
                     );
                  }
               } catch (parseErr) {
                  if (parseErr instanceof Error && parseErr.message !== "Unexpected token") {
                     throw parseErr;
                  }
               }
            }
         }
      } catch (err) {
         setError(
            err instanceof Error ? err.message : "Something went wrong"
         );
         setLoading(false);
      } finally {
         setIsStreaming(false);
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

         <ChatInput onSubmit={onSubmit} loading={loading || isStreaming} />
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
