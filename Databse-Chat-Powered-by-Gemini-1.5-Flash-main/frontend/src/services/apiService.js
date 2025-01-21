import axios from 'axios';

/**
 * Reusable function to send POST requests to the backend
 * @param {string} url - The API endpoint (e.g., '/query')
 * @param {object} data - The payload to send (e.g., { customQuery: 'SELECT * FROM students' })
 * @returns {Promise<object>} - Returns the response data
 * @throws {object} - Throws an error object if the request fails
 */
export async function postRequest(url, data) {
  try {
    // Send a POST request using Axios
    const response = await axios.post(`http://localhost:3001/api${url}`, data);

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error(`Error in POST ${url}:`, error.message);

    // Throw the error with a custom message
    throw {
      message: error.response?.data?.error || 'Request failed',
      details: error.response?.data?.details || error.message,
    };
  }
}




// import { postRequest } from '../services/apiService';

    // // Call the reusable POST function

    // try {
    //   const data = await postRequest('/query', { customQuery: query });
    //   setResult(data); // Update the result with the API response
    //   console.log('Query Result:', data); // Log the result
    // } catch (error) {
      
    // }
