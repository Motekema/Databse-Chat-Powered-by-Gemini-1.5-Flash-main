import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import Header from "./Dashboard/header";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("PUBLISHABLE_KEY (main.jsx):", PUBLISHABLE_KEY); // Add this line to check the value
console.log("API_BASE_URL (main.jsx):", API_BASE_URL); // Add this line to check the value

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please ensure you have set the VITE_CLERK_PUBLISHABLE_KEY environment variable."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Header" element={<Header />} />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
