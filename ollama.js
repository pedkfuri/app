import dotenv from 'dotenv';
dotenv.config();

import { Ollama } from 'ollama'

const ollamaAPI = new Ollama({ host: process.env.OLLAMA_API });

export async function requestLLM(prompt) {
  try {
    await ollamaAPI.generate({
      model: 'llama3.2',
      prompt: prompt,
      stream: false
    }).then(response => { console.log(response.response); });
  } catch (error) {
    console.error("Erro ao consultar LLM: ", error);
  }
}