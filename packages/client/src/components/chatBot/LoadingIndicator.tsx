function LoadingIndicator() {
   return (
      <div className="flex items-center gap-1 p-3">
         <Dot />
         <Dot className="[animation-delay:0.2s]" />
         <Dot className="[animation-delay:0.4s]" />
      </div>
   );
}

function Dot({ className }: { className?: string }) {
   return (
      <div
         className={`${className} size-2 animate-pulse rounded-full bg-gray-800`}
      />
   );
}

export default LoadingIndicator;
