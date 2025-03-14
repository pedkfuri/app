import { Ollama } from 'ollama'
import { ENV } from '.';

const ollamaAPI = new Ollama({ host: ENV.OLLAMA_API });

export async function requestLLM(prompt) {
  try {
    return await ollamaAPI.generate({
      model: ENV.OLLAMA_MODEL,
      prompt: prompt,
      stream: false
    });
  } catch (error) {
    console.error("Error to request to Ollama: ", error);
  }
}