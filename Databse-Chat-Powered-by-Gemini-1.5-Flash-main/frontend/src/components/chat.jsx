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
    <div
      className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #2c3e50, #04101b)" }}
    >
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat Interface</h1>
        <label htmlFor="chat-input" className="sr-only">
          Type your message
        </label>
        <input
          id="chat-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <div className="bg-white rounded-lg p-4 shadow-inner">{response}</div>
      </div>
    </div>
  );
};

export default Chat;
