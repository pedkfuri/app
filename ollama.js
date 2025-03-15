import dotenv from 'dotenv';
dotenv.config();

import { Ollama } from 'ollama';
import { logger } from './logger.js';
import { ENV } from './index.js';

const ollamaAPI = new Ollama({ host: process.env.OLLAMA_API });

/**
 * Sends a request to the Ollama LLM API to generate a response based on a given prompt.
 *
 * @param {string} prompt - The input text to send to the LLM.
 * @returns {Promise<object|undefined>} - The response object from the LLM API, or undefined if an error occurs.
 */
export async function requestLLM(content) {
  try {
    return await ollamaAPI.generate({
      model: process.env.OLLAMA_MODEL,
      prompt: `You are a senior lead engineer who is doing a code review so be careful with words and give ideas, 
      show you want to help. Analyze the code and make a brief (2-5 lines) statement about it, what is good, what should be changed.
      You should answer in ${ENV.OLLAMA_PROMPT_LANGUAGE || 'brazilian portuguese'}
      Here is the diff content: ${content}.`,
      stream: false
    });
  } catch (error) {
    logger.error("Error to request to Ollama: ", error);
    return null;
  }
}