
import askGemini from '../AI/AI.text2Sql.js';
// import askGemini from '../AI/AI.text2sql.Gemini.js';
import pool from '../config/database.js';
import { state } from '../State/sharedState.js';

export const executeCustomQuery = async (req, res ,next) => {

  const  customQuery = req.body.query;

  console.log('Received query:', customQuery);

  if (!customQuery || customQuery.trim() === '') {
      return res.status(400).json({ error: 'No query provided' });
  }

  try {
      // Store the original query
    //  state.lastQuery = customQuery;

      // Converting text to SQL query using OpenAI
      const response = await askGemini(customQuery); 
  
      
      // Store the OpenAI response
      state.openAIResponse = response;
      console.log('Generated_SQL', response);

      // Fetching data from database
      const result = await pool.query(response);
      
      // Store the query result from postgredatabase
      state.queryResult = result.rows;

      next(); // using chain controllers to pass the data to anylze by AI

    //   res.status(200).json(result.rows);
      console.log('Query result:', result.rows);

     
  } catch (error) {
      console.error('Error executing query:', error.message);
    //   res.status(700).json({
    //       error: 'Query execution failed',
    //       details: error.message,
    //   });
  }

};

export default executeCustomQuery;



