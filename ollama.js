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
      prompt: `You are a lead engineer manager who is doing a code review so be careful with words and give ideas, 
      show you want to help. Analyze the code and make a brief (2-5 lines) statement about how is it, if it requires improvements, what is good, 
      what should be changed. You should answer in ${ENV.OLLAMA_PROMPT_LANGUAGE || 'brazilian portuguese'}
      Pay attention to the most important part in the code which is the code itself, not the diff/patch boilerplates.
      You shouldn't consider git characters if they mean to organize the diff content, characters such as + or @ should be validated if they are part of
      code logic or just the diff structure. You should consider only code logic, not the symbols that may come as a diff content boilerplate.
      Give statements about each diff content listed.
      Don't consider comments contents on your review, only code logic. Give statements about the diffs listing them in your review as "change number X", "change number X+1" etc.
      Here is the diff content listed in numbers so you can give a review of each: ${content}.`,
      stream: false
    });
  } catch (error) {
    logger.error("Error to request to Ollama: ", error);
    return null;
  }
}