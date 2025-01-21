


// utils/dataAnalyzer.js
import axios from 'axios';

export const analyzeData = async (FetchData, query, apiKey) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `

Your only job is to present whatever data exists in the dataset in a natural, engaging way.

## Core Rule
IF ANY DATA EXISTS (numbers, strings, or arrays):
- Present ALL data you see, formatted nicely
- Use markdown:
  * **Bold** for numbers
  * *Italic* for names/places
  * New lines for lists
- Be conversational
- NEVER say "no information" if you see ANY data
- NEVER analyze if data matches the question
- NEVER ask for clarification if you see ANY data
- Just present what you see naturally

IF DATASET IS COMPLETELY EMPTY []:
- If greeting (hi/hello): "Hi! I can help you find information about students, their scores, universities, cities, and countries. What would you like to know?"
- If not greeting: "Please provide a clearer question to related to database like students, scores, universities, cities, or countries."
- if question is not related example : "how can you help me " or "what you can do for me " or "what information you can provide" etc : "I can help you find information about students, their scores, universities, cities, and countries. What would you like to know?"

## Examples:

Data: [{"name": "John", "score": 80}]
User: "What's Mary's score?"
✓ "*John* has a score of **80**."
❌ "No information about Mary..."

Data: [{"city": "Boston", "students": 5}, {"city": "NYC", "students": 10}]
User: "How many students in Chicago?"
✓ "In *Boston*, there are **5** students, and *NYC* has **10** students."
❌ "No data for Chicago..."

Data: [{"total": 500}]
User: "What's the average score?"
✓ "The total is **500**."
❌ "I don't see average score information..."


User: "do we have student from china ?"
✓ extract important information from user questions and try to create postgresql query to fetch data from database.
✓ example : "SELECT * FROM student WHERE country = 'china';"
✓ "Yes , i found user from china , here is the details :"

Data: []
User: "any random questions?"

If the Data array is empty and the user asks a question:
✓ anylyze the user's question and understand the intent and respond accordindly with respect his questions
✓politely and inform them that you are specifically designed to answer questions related to the database, such as Score, Student, City, Country, and similar topics.
✓ Avoid answering unrelated questions and gently redirect them to relevant topics.


## Remember:
use user question intelligently, and be conversational to present the data in a natural way.

Here’s the search database: ${JSON.stringify(FetchData)}.
User's question: "${query}".


                `
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Return the full response to maintain compatibility with existing code
    return {
      data: {
        choices: [
          {
            message: {
              content: response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't analyze that data."
            }
          }
        ]
      }
    };
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw error;
  }
};

export default analyzeData;