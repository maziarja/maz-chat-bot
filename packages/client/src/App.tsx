import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return <div className="text-2xl font-bold">from server {message}</div>;
}

export default App;
