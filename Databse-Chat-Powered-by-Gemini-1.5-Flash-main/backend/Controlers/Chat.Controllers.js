
import 'dotenv/config';

import { state } from '../State/sharedState.js';

import {analyzeData } from '../AI/AI.think.js';



export const chatcontroller = async (req, res) => {
  try {
    const { query } = req.body;

    
    if (!query) {
      return res.status(400).json({ 
        error: 'Query is required' 
      });
    }

// const lastQuery = state.lastQuery;
    const FetchData = state.queryResult;
    console.log('Postgre_result:', FetchData);

    const apiKey = process.env.GEMINI_API_KEY;


    if (!apiKey) {
      throw new Error("API key is missing in environment variables");
    }


    const response = await analyzeData(FetchData, query, apiKey);


    const aiResponse = response.data.choices[0]?.message?.content || 
                      "Sorry, I couldn't analyze that.";
                    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
};


export default chatcontroller;