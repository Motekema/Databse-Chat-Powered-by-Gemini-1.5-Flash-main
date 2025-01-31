import axios from "axios";
import "dotenv/config";

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
#generate the SQL query that retrieves data from the sales database including all columns.

## Database Schema
"sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    vendor_id INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    sale_price DECIMAL(10, 2) NOT NULL,
    sale_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE returns (
    return_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL,
    return_quantity INTEGER NOT NULL,
    return_reason VARCHAR(255),
    return_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id)
);

CREATE TABLE vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255)
);
"

## Keyword Mapping Rules
1. Product Identifiers:
   - product_id: "product id", "item id", "product identifier"
   - product_name: "product name", "item name", "product"

2. Sales Metrics:
   - sale_id: "sale id", "transaction id", "sale identifier"
   - quantity: "quantity", "amount", "number of items"
   - sale_price: "sale price", "price", "cost"

3. Categories:
   - category_id: "category id", "category identifier"
   - category_name: "category name", "category"

4. Returns:
   - return_id: "return id", "return identifier"
   - return_quantity: "return quantity", "number of returns"
   - return_reason: "return reason", "reason for return"

5. Vendors:
   - vendor_id: "vendor id", "vendor identifier"
   - vendor_name: "vendor name", "vendor"

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
   - For counting, use column name: COUNT(product_id) as total_products

3. Pattern Recognition:
   - Questions about "how many" → Use COUNT(product_id)
   - Questions about "average" → Use AVG()
   - Questions about "highest/best" → Use MAX()
   - Questions about "lowest/worst" → Use MIN()
   - Questions about "list all" → Use DISTINCT
   - Questions about "more than/greater than" → Use > operator
   - Questions about "less than" → Use < operator

4. Default Behaviors:
   - If question is unclear → SELECT * FROM products;
   - If no specific columns mentioned → Select relevant columns based on context
   - If no conditions specified → Don't add WHERE clause

## Example Mappings

1. "Show top-selling products by category"
"sql
select category_name, product_name, sum(quantity) as total_quantity 
from sales 
join products on sales.product_id = products.product_id 
join categories on products.category_id = categories.category_id 
group by category_name, product_name 
order by total_quantity desc;
"

2. "How many sales transactions occurred last month?"
"sql
select count(sale_id) as total_sales 
from sales 
where sale_timestamp >= date_trunc('month', current_date - interval '1 month') 
and sale_timestamp < date_trunc('month', current_date);
"

3. "List all products with stock quantity less than 10"
"sql
select product_name, stock_quantity 
from products 
where stock_quantity < 10 
order by stock_quantity asc;
"

4. "What's the average sale price by vendor?"
"sql
select vendor_name, round(avg(sale_price), 2) as avg_sale_price 
from sales 
join products on sales.product_id = products.product_id 
join vendors on products.vendor_id = vendors.vendor_id 
group by vendor_name 
order by avg_sale_price desc;
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

    let generatedQuery =
      response.data.candidates[0]?.content?.parts[0]?.text ||
      "Sorry, I couldn't analyze that.";

    // Clean and validate the response
    generatedQuery = generatedQuery.trim();

    // If the query doesn't start with SELECT or end with ;, return an error
    if (
      !generatedQuery.toLowerCase().startsWith("select") ||
      !generatedQuery.endsWith(";")
    ) {
      return "Error: Invalid SQL query generated";
    }

    // Remove any markdown or additional text
    const sqlMatch = generatedQuery.match(/select[\s\S]*?;/i);
    return sqlMatch
      ? sqlMatch[0].toLowerCase()
      : "Error: No valid SQL query found";
  } catch (error) {
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

export default askGemini;
