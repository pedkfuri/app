import { Ollama } from 'ollama';
import { logger } from './logger.js';
import { OLLAMA_MODEL, OLLAMA_PROMPT_LANGUAGE, OLLAMA_API } from './constants.js';

const ollamaAPI = new Ollama({ host: OLLAMA_API });

/**
 * Sends a request to the Ollama LLM API to generate a response based on a given prompt.
 *
 * @param {string} prompt - The input text to send to the LLM.
 * @returns {Promise<object|null>} - The response object from the LLM API, or undefined if an error occurs.
 */
export async function requestLLM(content) {
  try {
    return await ollamaAPI.generate({
      model: OLLAMA_MODEL,
      prompt: `You are a lead engineering manager performing a code review of diff/patch content from GitHub/GitLab. 
        Your task is to analyze only the actual code logic—ignoring boilerplate symbols (e.g., '+', '@') and diff formatting—and provide:
          An overall analysis score from 0 to 10 based on programming best practices and project needs.
          A concise overview of the changes.
          Detailed comments for each change (labelled as 'change 1', 'change 2', etc.).
        Exclude code comments from the analysis and focus solely on the code's logic. 
        Answer in ${OLLAMA_PROMPT_LANGUAGE || 'Brazilian Portuguese'}.
        Here is the diff content: ${content}`,
      stream: false
    });
  } catch (error) {
    logger.error("Error to request to Ollama: ", error);
    return null;
  }
}