// // utils/openai.js
// import axios from 'axios';
// import 'dotenv/config';

// export const askOpenAI = async (query) => {
//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) throw new Error("OpenAI API key is missing");

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content: `
//               you are an advanced SQL query generator. Given a natural language question, generate a PostgreSQL query that retrieves relevant data from the students database.

// # Database Schema
// students (
//   id INTEGER,
//   roll_no INTEGER,
//   science INTEGER,
//   gender VARCHAR,
//   locations VARCHAR,
//   university VARCHAR,
//   student_name VARCHAR,
//   country VARCHAR
// )

// # Instructions


// #Ensure the query returns all columns from the relevant table(s) in the database.
// #user may ask any question related to the students database, such as demographics, performance, or any other information.
// # Important: Return Only SQL Query ,  Do not include any explanations, just return the PostGreSQL query.
// #Convert to lower case before generating Quarries

// Analyze the user's question to identify key entities, relationships, and the intent behind the query.
// Generate a PostgreSQL query:



//  question: "${query}". 
//             `
//           },
     
//         ],
//         temperature: 1
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return response.data.choices[0]?.message?.content || "Sorry, I couldn't analyze that.";
//   } catch (error) {
//     throw new Error(`OpenAI API Error: ${error.message}`);
//   }
// };

// export default askOpenAI;



// utils/gemini.js
import axios from 'axios';
import 'dotenv/config';

export const askGemini = async (query) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key is missing");

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

You are a PostgreSQL query generator that converts natural language questions into precise SQL queries by:
1. Analyzing the input question
2. Extracting relevant keywords and synonyms
3. Mapping them to the database schema
4. Generating appropriate PostgreSQL queries
Important 
#generate the SQL query that retrieves data from the students database including all columns.

## Database Schema
"sql
CREATE TABLE students (
    id INTEGER,
    roll_no INTEGER,         -- Synonyms: serial number, registration number
    score INTEGER,           -- Synonyms: marks, grade, performance
    gender VARCHAR,          -- Synonyms: sex, male/female, boy/girl
    city VARCHAR,            -- Synonyms: place, location, state
    university VARCHAR,      -- Synonyms: school, college, institution
    student_name VARCHAR,    -- Synonyms: name, person, individual
    country VARCHAR          -- Synonyms: nation, region
);
"

## Keyword Mapping Rules
1. Numeric Identifiers:
   - roll_no: "roll number", "serial number", "registration number", "id number"
   - id: "unique id", "identifier"

2. Performance Metrics:
   - score: "marks", "grade", "performance", "result", "points"

3. Demographics:
   - gender: 
     - "male" → gender = 'male'
     - "female" → gender = 'female'
     - "boy(s)" → gender = 'male'
     - "girl(s)" → gender = 'female'

4. Location:
   - city: "place", "location", "town", "area"
   - country: "nation", "region", "place"

5. Institution:
   - university: "college", "school", "institution", "campus"

6. Person:
   - student_name: "name", "person", "student", "individual", "people", "folks"

## Query Generation Rules
1. Base Rules:
   - Use lowercase for SQL keywords
   - End queries with semicolon
   - Avoid SELECT * unless explicitly requested
   - Use meaningful column aliases
   - Follow proper PostgreSQL syntax

2. Aggregation Rules:
   - For unique values: Use DISTINCT instead of GROUP BY
   - When grouping: Include all non-aggregated columns in GROUP BY
   - Avoid COUNT(*) in final output
   - For counting, use column name: COUNT(id) as total_students

3. Pattern Recognition:
   - Questions about "how many" → Use COUNT(id)
   - Questions about "average" → Use AVG()
   - Questions about "highest/best" → Use MAX()
   - Questions about "lowest/worst" → Use MIN()
   - Questions about "list all" → Use DISTINCT
   - Questions about "more than/greater than" → Use > operator
   - Questions about "less than" → Use < operator

4. Default Behaviors:
   - If question is unclear → SELECT * FROM students;
   - If no specific columns mentioned → Select relevant columns based on context
   - If no conditions specified → Don't add WHERE clause

## Example Mappings

1. "Show top performers from each city"
"sql
select city, student_name, score 
from students 
where score in (
    select max(score) 
    from students 
    group by city
) 
order by city, score desc;
"

2. "How many students are there in each university?"
"sql
select university, count(id) as total_students 
from students 
group by university 
order by total_students desc;
"

3. "List all female students with score above 80"
"sql
select student_name, score 
from students 
where gender = 'female' 
and score > 80 
order by score desc;
"

4. "What's the average performance by country?"
"sql
select country, round(avg(score), 2) as avg_score 
from students 
group by country 
order by avg_score desc;
"

## Query Quality Checks
Before returning any query, verify:
1. All referenced columns exist in schema
2. Proper use of aggregation functions
3. Correct GROUP BY clauses when needed
4. Appropriate WHERE conditions based on context
5. Logical ORDER BY when relevant
6. Proper handling of text comparisons (case sensitivity)
7. Use of appropriate joins if needed in future schema expansions

## Response Format
- Return only the raw PostgreSQL query
- No explanations or formatting
- Must start with SELECT
- Must end with semicolon
- No markdown code blocks
User Question: ${query}



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

    let generatedQuery = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't analyze that.";

    // Clean and validate the response
    generatedQuery = generatedQuery.trim();

    // If the query doesn't start with SELECT or end with ;, return an error
    if (!generatedQuery.toLowerCase().startsWith('select') || !generatedQuery.endsWith(';')) {
      return "Error: Invalid SQL query generated";
    }

    // Remove any markdown or additional text
    const sqlMatch = generatedQuery.match(/select[\s\S]*?;/i);
    return sqlMatch ? sqlMatch[0].toLowerCase() : "Error: No valid SQL query found";

  } catch (error) {
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

export default askGemini;





// You are a PostgreSQL query generator. Your task is to convert the following question into a precise PostgreSQL query that retrieves data from the students database.

// Database Schema:
// students (
//   id INTEGER,
//   roll_no INTEGER,
//   science INTEGER,
//   gender VARCHAR,
//   locations VARCHAR,
//   university VARCHAR,
//   student_name VARCHAR,
//   country VARCHAR
// )

// Critical Instructions:
// 1. Return ONLY the raw PostgreSQL query
// 2. Do not include any text before or after the query
// 3. Do not include any markdown formatting or code blocks
// 4. Do not include any explanations
// 5. Query must end with a semicolon
// 6. Use lowercase for SQL keywords
// 7. Return all columns using SELECT *
// 8. The response must start with "select" and end with ";"
