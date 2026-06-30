import { useState, useEffect } from "react";
import Chatbot from "./components/chatBot/Chatbot";

function App() {
   const [dark, setDark] = useState(
      () => localStorage.getItem("theme") === "dark"
   );

   useEffect(() => {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
   }, [dark]);

   return (
      <div className="mx-auto h-dvh w-full max-w-2xl px-2 py-4">
         <Chatbot dark={dark} onToggleDark={() => setDark((d) => !d)} />
      </div>
   );
}

export default App;
