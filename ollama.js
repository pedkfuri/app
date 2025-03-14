import dotenv from 'dotenv';
dotenv.config();

import { Ollama } from 'ollama'

const ollamaAPI = new Ollama({ host: process.env.OLLAMA_API });

/**
 * Sends a request to the Ollama LLM API to generate a response based on a given prompt.
 *
 * @param {string} prompt - The input text to send to the LLM.
 * @returns {Promise<object|undefined>} - The response object from the LLM API, or undefined if an error occurs.
 */
export async function requestLLM(prompt) {
  try {
    return await ollamaAPI.generate({
      model: process.env.OLLAMA_MODEL,
      prompt: prompt,
      stream: false
    });
  } catch (error) {
    console.error("Error to request to Ollama: ", error);
    return null;
  }
}