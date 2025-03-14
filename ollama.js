import dotenv from 'dotenv';
dotenv.config();

import { Ollama } from 'ollama'

const ollamaAPI = new Ollama({ host: process.env.OLLAMA_API });

export async function requestLLM(prompt) {
  try {
    return await ollamaAPI.generate({
      model: process.env.OLLAMA_MODEL,
      prompt: prompt,
      stream: false
    });
  } catch (error) {
    console.error("Error to request to Ollama: ", error);
  }
}