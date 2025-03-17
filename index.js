import dotenv from 'dotenv';
dotenv.config();

import { logger } from './logger.js';

export const ENV = {
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

if (ENV.SERVICE && ENV.SERVICE === 'gitlab') {
  if (!ENV.GITLAB_HOST || !ENV.GITLAB_PROJECT_ID || !ENV.GITLAB_TOKEN) {
    logger.error('Fill the environment variables correctly');
    process.exit();
  }
}

if (ENV.SERVICE && ENV.SERVICE === 'github') {
  if (!ENV.GITHUB_OWNER || !ENV.GITHUB_REPO || !ENV.GITHUB_TOKEN) {
    logger.error('Fill the environment variables correctly');
    process.exit();
  }
}

if (!ENV.WEBHOOK_URL || !ENV.OLLAMA_API || !ENV.SERVICE) {
  logger.error('Fill the environment variables correctly');
  process.exit();
} else {
  logger.info(`Starting app: `, ENV);
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
//TODO: error handling: /webhook request with wrong payload, ollama timeout, duplicate comment/MR or PR event
//TODO: get only open MR/PR, assigned to the webhook user, accept or reject MR/PR
//TODO: AI classify if code is good to approve or not
//TODO: check patch/diff content constraints (too large, too many symbols etc)
//TODO: avoid github webhook duplication