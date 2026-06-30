import { useForm, type FieldValues } from "react-hook-form";
import { Button } from "../ui/button";
import { FaArrowUp } from "react-icons/fa";

type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit({ prompt }: FieldValues): Promise<void>;
};

function ChatInput({ onSubmit }: Props) {
   const { handleSubmit, register, formState, reset } = useForm<ChatFormData>();

   function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   }

   const submit = handleSubmit((data) => {
      reset({ prompt: "" });
      onSubmit(data);
   });

   return (
      <form
         onSubmit={submit}
         className="flex flex-col items-end rounded-2xl border-2 p-4"
      >
         <textarea
            {...register("prompt", {
               required: true,
               validate: (val) => val.trim().length > 0,
            })}
            autoFocus
            onKeyDown={handleKeyDown}
            className="w-full resize-none outline-none"
            maxLength={400}
            placeholder="say something..."
         />
         <Button
            disabled={!formState.isValid}
            className="size-9 rounded-full"
            aria-label="send message"
         >
            <FaArrowUp />
         </Button>
      </form>
   );
}
export default ChatInput;
