import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), "");

  console.log(
    "VITE_CLERK_PUBLISHABLE_KEY (vite.config.js):",
    env.VITE_CLERK_PUBLISHABLE_KEY
  ); // Add this line to check the value
  console.log("VITE_API_BASE_URL (vite.config.js):", env.VITE_API_BASE_URL); // Add this line to check the value

  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    // ...other configurations...
  };
});
