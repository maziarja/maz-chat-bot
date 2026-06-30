import { useForm, type FieldValues } from "react-hook-form";
import { Button } from "../ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useEffect, useRef } from "react";

type ChatFormData = { prompt: string };
type Props = {
   onSubmit({ prompt }: FieldValues): Promise<void>;
   loading: boolean;
};

const MAX_LENGTH = 400;

function ChatInput({ onSubmit, loading }: Props) {
   const { handleSubmit, register, formState, reset, watch } =
      useForm<ChatFormData>();
   const prompt = watch("prompt") ?? "";
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const { ref: registerRef, ...registerRest } = register("prompt", {
      required: true,
      validate: (val) => val.trim().length > 0,
   });

   function mergeRef(el: HTMLTextAreaElement | null) {
      textareaRef.current = el;
      registerRef(el);
   }

   useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
   }, [prompt]);

   function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   }

   const submit = handleSubmit((data) => {
      reset({ prompt: "" });
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      onSubmit(data);
   });

   const charCount = prompt.length;
   const nearLimit = charCount > MAX_LENGTH * 0.8;

   return (
      <form
         onSubmit={submit}
         className="rounded-2xl border-2 p-3 transition-colors focus-within:border-primary"
      >
         <textarea
            {...registerRest}
            ref={mergeRef}
            autoFocus
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
            style={{ minHeight: "24px", maxHeight: "160px" }}
            maxLength={MAX_LENGTH}
            placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
            rows={1}
         />
         <div className="flex items-center justify-between pt-2">
            <span
               className={`text-xs ${nearLimit ? "text-destructive" : "text-muted-foreground"}`}
            >
               {charCount} / {MAX_LENGTH}
            </span>
            <Button
               disabled={!formState.isValid || loading}
               className="size-8 rounded-full"
               aria-label="send message"
            >
               <FaArrowUp className="size-3" />
            </Button>
         </div>
      </form>
   );
}

export default ChatInput;
