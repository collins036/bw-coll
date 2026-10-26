import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
const [message, setMessage] = useState("Joining...");
const [error, setError] = useState(false);

useEffect(() => {
let timeoutId;
let cancelled = false;

async function joinGroup() {
  try {
    const response = await fetch("/api/visit", {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    if (!data.url) {
      throw new Error("Destination URL missing");
    }

    if (cancelled) return;

    timeoutId = setTimeout(() => {
      window.location.assign(data.url);
    }, 400);
  } catch (error) {
    if (cancelled) return;

    console.error("Group redirect failed:", error);

    setMessage("Could not continue. Please try again.");
    setError(true);
  }
}

joinGroup();

return () => {
  cancelled = true;
  clearTimeout(timeoutId);
};

}, []);

return (
<main>
<h1>Dumelang Welcome</h1>

  <p>
    You are now Joining my New WhatsApp Group. Thank you!
  </p>

  <p
    role="status"
    className={error ? "error-message" : "joining-message"}
  >
    {message}
  </p>
</main>

);
}