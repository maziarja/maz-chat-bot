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
  console.log(message);
  return <div>from server {message}</div>;
}

export default App;
