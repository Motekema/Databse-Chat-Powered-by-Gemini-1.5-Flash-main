import express from "express";
import pkg from "pg"; // Import the default export from 'pg'
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";

const { Pool } = pkg; // Destructure 'Pool' from the CommonJS default export

// PostgreSQL connection string
const connectionString =
  "postgres://Demo_Chat_owner:cxCW6znr0Edf@ep-shiny-sky-a1s1aiim.ap-southeast-1.aws.neon.tech/Demo_Chat?sslmode=require";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString,
});

const app = express();

// CORS Middleware to Allow All Origins
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow all common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: false, // No credentials required (disable cookies and authorization headers for simplicity)
    maxAge: 86400, // Cache preflight requests for 24 hours
  })
);

// Explicitly Handle Preflight Requests
app.options("*", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.sendStatus(200); // Explicitly return 200 for preflight
});

app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// API endpoint to handle custom SQL queries
app.post("/api/query", async (req, res) => {
  const { customQuery } = req.body; // Extract the query from the request body

  console.log("Received query:", customQuery); // Log for debugging

  // Validate input
  if (!customQuery || customQuery.trim() === "") {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    // Execute the query
    const result = await pool.query(customQuery);
    res.status(200).json(result.rows); // Send the result back to the client
  } catch (error) {
    console.error("Error executing query:", error.message); // Log error
    res.status(500).json({
      error: "Query execution failed",
      details: error.message,
    });
  }
});

// Test endpoint to verify database connection
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json(result.rows); // Return current timestamp
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
});

app.get("/test", (req, res) => {
  res.send("This is Chatbot Backend by powered by gemini 1.5 Flash !");
});

// Start the Express server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
