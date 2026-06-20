import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return (
    <div className="text-2xl font-bold p-4 flex flex-col">
      from server {message}
      <Button>Click me</Button>
    </div>
  );
}

export default App;
