import { Bot } from "lucide-react";

function LoadingIndicator() {
   return (
      <div className="flex items-center gap-2.5">
         <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="size-4" />
         </div>
         <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
            <Dot />
            <Dot className="[animation-delay:0.2s]" />
            <Dot className="[animation-delay:0.4s]" />
         </div>
      </div>
   );
}

function Dot({ className }: { className?: string }) {
   return (
      <div
         className={`${className ?? ""} size-2 animate-pulse rounded-full bg-foreground/40`}
      />
   );
}

export default LoadingIndicator;
