import React, { useState } from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';


// Initialize Markdown parser
const md = new MarkdownIt();



const GeminiAI = ({ text = 'Create Postgresql quaries and list all', aiResponse }) => {
  const [response, setResponse] = useState(aiResponse || '');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'AIzaSyCuxGxoLnbPjVdgwY7ahXGOrPShzM7CbfM';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  const fetchExplanation = async () => {
    setLoading(true);
    setResponse('');
    console.log('Starting API call...');

    try {
      // Step 1: Log request payload
      const requestBody = {
        contents: [
          {
            parts: [{ text }],
          },
        ],
      };
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      // Step 2: Make the API call
      const res = await axios({
        method: 'POST',
        url: `${API_URL}?key=${API_KEY}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: requestBody,
      });

      

      // Step 4: Log full response
      console.log('Full API response:', JSON.stringify(res.data, null, 2));

      // Step 5: Extract and set AI response
      const aiResponseText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response available or unexpected structure.';
      console.log('Extracted AI response:', aiResponseText);

      // setResponse(aiResponseText);
        setResponse(md.render(aiResponseText));
      // const html = md.render(aiResponseText);

      // console.log(html); // Rendered HTML output

    } catch (error) {
      // Step 6: Log errors in the catch block
      console.error('Error during API call:', error);
      setResponse('Failed to fetch explanation. Please try again.');
    } finally {
      // Step 7: Log finalization of the process
      console.log('API call completed.');
      setLoading(false);
    }
  };



  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Ask AI for an Explanation</h1>
      <button
        onClick={fetchExplanation}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Explain AI'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2>Response:</h2>
        <p
          style={{
            backgroundColor: '#F9F9F9',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >
        
         { response||  'No response yet.'}
        </p>
      </div>
    </div>
  );
};

export default GeminiAI;







// // Example usage in your main program (App.js or any other component)
// import React from 'react';
// import GeminiAI from './GeminiAI';

// const App = () => {
//   return (
//     <GeminiAI 
//       text="What are some common PostgreSQL queries for user management?"
//       aiResponse="Initial response if any"
//     />
//   );
// };

// export default App;




// to use it with dataset chatbot
// Example usage in your main program (App.js or any other component)
// import React from 'react';
// import GeminiAI from './GeminiAI';

// const App = () => {
//   // Example reference dataset
//   const referenceDataset = [
//     {
//       title: "User Table Schema",
//       content: {
//         tableName: "users",
//         columns: [
//           { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
//           { name: "username", type: "VARCHAR(50)", constraints: "UNIQUE NOT NULL" },
//           { name: "email", type: "VARCHAR(100)", constraints: "UNIQUE NOT NULL" },
//           { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
//         ]
//       }
//     },
//     {
//       title: "Common Queries",
//       content: {
//         queries: [
//           { name: "Find User", query: "SELECT * FROM users WHERE username = $1" },
//           { name: "Insert User", query: "INSERT INTO users (username, email) VALUES ($1, $2)" }
//         ]
//       }
//     }
//   ];

//   return (
//     <GeminiAI 
//       text="How can I create a query to find all users who registered in the last 7 days?"
//       aiResponse=""
//       referenceData={referenceDataset}
//     />
//   );
// };

// export default App;