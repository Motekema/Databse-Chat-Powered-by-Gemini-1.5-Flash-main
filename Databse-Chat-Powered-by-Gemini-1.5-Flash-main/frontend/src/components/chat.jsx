import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log("API Base URL:", API_BASE_URL); // Add this line to check the value

  const handleSend = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ask`, { message });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      setResponse(res.data);
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <div>{response}</div>
    </div>
  );
};

export default Chat;
