import dotenv from 'dotenv';
dotenv.config();

export const ENV = () => {
  return {
    SERVICE: process.env.SERVICE,
    NODE_ENV: process.env.NODE_ENV || 'local',
    PORT: process.env.PORT || 5000,
    HOSTNAME: process.env.HOSTNAME || 'localhost',
    WEBHOOK_USERNAME: process.env.WEBHOOK_USERNAME || 'webhookApp',
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    GITLAB_TOKEN: process.env.GITLAB_TOKEN, 
    GITLAB_HOST: process.env.GITLAB_HOST || 'gitlab.com',
    GITLAB_PROJECT_ID: process.env.GITLAB_PROJECT_ID,
    OLLAMA_API: process.env.OLLAMA_API,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'codellama',
    OLLAMA_PROMPT_LANGUAGE: process.env.OLLAMA_PROMPT_LANGUAGE || 'portuguese',
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  }
}