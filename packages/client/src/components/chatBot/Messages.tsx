import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiExternalLink } from "react-icons/fi";
import { Bot } from "lucide-react";

export type Messages = {
   id: string;
   prompt: string;
   role: "user" | "bot";
}[];

function Messages({ messages }: { messages: Messages }) {
   const bottomRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   function handleCopy(e: React.ClipboardEvent<HTMLDivElement>) {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData("text/plain", selection);
      }
   }

   return (
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
         {messages.map((msg) =>
            msg.role === "user" ? (
               <div
                  key={msg.id}
                  className="flex animate-message-in justify-end"
               >
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 text-sm text-white">
                     {msg.prompt}
                  </div>
               </div>
            ) : (
               <div
                  key={msg.id}
                  className="flex animate-message-in items-start gap-2.5"
                  onCopy={handleCopy}
               >
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                     <Bot className="size-4" />
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
                     <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                           a: ({ href, children }) => (
                              <a
                                 href={href}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                              >
                                 {children}
                                 <FiExternalLink className="size-3" />
                              </a>
                           ),
                        }}
                     >
                        {msg.prompt}
                     </ReactMarkdown>
                  </div>
               </div>
            )
         )}
         <div ref={bottomRef} />
      </div>
   );
}

export default Messages;
