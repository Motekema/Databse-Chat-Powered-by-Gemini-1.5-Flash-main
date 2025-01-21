import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

const app = express();



// CORS Middleware to Allow All Origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: false, // No credentials required (disable cookies and authorization headers for simplicity)
  maxAge: 86400, // Cache preflight requests for 24 hours
}));

// Explicitly Handle Preflight Requests
app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.sendStatus(200); // Explicitly return 200 for preflight
});




app.use(express.json());

// Routes
app.use('/api', apiRoutes);



app.get('/test', (req, res) => {
  res.send('This is Chatbot Backend by powered by gemini 1.5 Flash !')
})

// Start the Express server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});