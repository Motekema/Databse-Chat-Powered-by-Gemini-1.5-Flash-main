// utils/dataAnalyzer.js
import axios from "axios";

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
- If greeting (hi/hello): "Hi! I can help you find information about product inventory, sales history, transactions, categories, and more. What would you like to know?"
- If not greeting: "Please provide a clearer question related to the sales database."
- if question is not related example : "how can you help me " or "what you can do for me " or "what information you can provide" etc : "I can help you find information about product inventory, sales history, transactions, categories, and more. What would you like to know?"

## Examples:

Data: [{"product_name": "Widget", "sales": 100}]
User: "What's the sales for Gadget?"
✓ "*Widget* has sales of **100**."
❌ "No information about Gadget..."

Data: [{"category": "Electronics", "sales": 500}, {"category": "Clothing", "sales": 300}]
User: "How many sales in Furniture?"
✓ "In *Electronics*, there are **500** sales, and *Clothing* has **300** sales."
❌ "No data for Furniture..."

Data: [{"total": 500}]
User: "What's the total sales?"
✓ "The total sales are **500**."
❌ "I don't see total sales information..."


User: "do we have sales from vendor X?"
✓ extract important information from user questions and try to create postgresql query to fetch data from database.
✓ example : "SELECT * FROM sales WHERE vendor = 'X';"
✓ "Yes, I found sales from vendor X, here are the details:"

Data: []
User: "any random questions?"

If the Data array is empty and the user asks a question:
✓ analyze the user's question and understand the intent and respond accordingly with respect to their questions
✓ politely and inform them that you are specifically designed to answer questions related to the sales database, such as product inventory, sales history, transactions, categories, and similar topics.
✓ Avoid answering unrelated questions and gently redirect them to relevant topics.


## Remember:
use user question intelligently, and be conversational to present the data in a natural way.

Here’s the search database: ${JSON.stringify(FetchData)}.
User's question: "${query}".


                `,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the full response to maintain compatibility with existing code
    return {
      data: {
        choices: [
          {
            message: {
              content:
                response.data.candidates[0]?.content?.parts[0]?.text ||
                "Sorry, I couldn't analyze that data.",
            },
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw error;
  }
};

export default analyzeData;
