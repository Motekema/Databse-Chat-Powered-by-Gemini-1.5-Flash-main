import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

const LoadingIndicator = () => (
  <div className="flex items-center space-x-2 text-blue-500">
    <div
      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
      style={{ animationDelay: "0ms" }}
    />
    <div
      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
      style={{ animationDelay: "150ms" }}
    />
    <div
      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
      style={{ animationDelay: "300ms" }}
    />
    <span className="ml-2 text-sm font-medium">Thinking...</span>
  </div>
);

const ChatMessage = ({ message, isUser, isLoading }) => {
  const messageClass = isUser
    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
    : "bg-gradient-to-r from-gray-200 to-gray-300 text-black rounded-bl-none";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`px-4 py-3 rounded-lg max-w-[80%] ${messageClass}`}>
        {isLoading ? (
          <LoadingIndicator />
        ) : isUser ? (
          <span className="text-base">{message}</span>
        ) : (
          <ReactMarkdown
            className="prose prose-sm dark:prose-invert"
            components={{
              p: ({ children }) => (
                <p className="mb-2 leading-relaxed">{children}</p>
              ),
              strong: ({ children }) => (
                <span className="font-semibold">{children}</span>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-4 mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-4 mb-2">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
            }}
          >
            {message}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

const DatasetChatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I can analyze data for you. Ask me anything about it!",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, isUser: true }]);
    setInputText("");
    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error calling backend:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm sorry, something went wrong while analyzing the data.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Dataset Chatbot
      </h1>
      <div className="h-[500px] overflow-y-auto mb-6 space-y-4 bg-white rounded-lg p-4 shadow-inner">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {isLoading && (
          <ChatMessage message="" isUser={false} isLoading={true} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend(inputText)}
          placeholder="Ask anything about your data..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={isLoading}
          className={`p-3 rounded-lg bg-blue-600 text-white transition-colors ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DatasetChatbot;
