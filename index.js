import dotenv from 'dotenv';
dotenv.config();

import { logger } from './logger.js';

export const ENV = {
  SERVICE: process.env.SERVICE || 'gitlab',
  NODE_ENV: process.env.NODE_ENV || 'local',
  PORT: process.env.PORT || 5000,
  HOSTNAME: process.env.HOSTNAME || 'localhost',
  WEBHOOK_USERNAME: process.env.WEBHOOK_USERNAME || 'tcc',
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  GITLAB_TOKEN: process.env.GITLAB_TOKEN, 
  GITLAB_HOST: process.env.GITLAB_HOST || 'gitlab.com',
  GITLAB_PROJECT_ID: process.env.GITLAB_PROJECT_ID,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  OLLAMA_API: process.env.OLLAMA_API,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'codellama',
  OLLAMA_PROMPT_LANGUAGE: process.env.OLLAMA_PROMPT_LANGUAGE || 'portuguese'
}

if (!ENV.WEBHOOK_URL || !ENV.GITLAB_TOKEN || !ENV.GITLAB_PROJECT_ID || !ENV.GITHUB_TOKEN || !ENV.OLLAMA_API) {
  logger.error('Fill the environment variables correctly');
  process.exit();
} else {
  logger.info('Starting app: ', ENV);
}

import { createHttpServer } from './server.js';
import { createGithubWebhook } from './github.js';
import { createGitlabWebhook } from './gitlab.js';

createHttpServer();

if (process.env.SERVICE.match('gitlab')) {
  createGitlabWebhook(process.env.GITLAB_PROJECT_ID, process.env.WEBHOOK_URL);
}

if (process.env.SERVICE.match('github')) {
  createGithubWebhook(process.env.WEBHOOK_URL);
}

//TODO: unit tests
//TODO: logger + structure log messages and errors
//TODO: error handling