import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiExternalLink } from "react-icons/fi";

export type Messages = {
   prompt: string;
   role: "user" | "bot";
}[];

function Messages({ messages }: { messages: Messages }) {
   const responseRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      responseRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   function handleCopy(e: React.ClipboardEvent<HTMLDivElement>) {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData("text/plain", selection);
      }
   }
   return (
      <div className="flex flex-1 flex-col gap-3 overflow-y-scroll">
         {messages.map((msg, index) => (
            <div
               ref={index === messages.length - 1 ? responseRef : null}
               onCopy={handleCopy}
               className={`rounded-xl px-3 py-1 ${msg.role === "user" ? "self-start bg-blue-600 text-white" : "self-end bg-gray-100 text-black"}`}
               key={index}
            >
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
         ))}
      </div>
   );
}

export default Messages;
