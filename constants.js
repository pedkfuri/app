import dotenv from 'dotenv';
dotenv.config();

export const SERVICE = process.env.SERVICE;
export const NODE_ENV = process.env.NODE_ENV || 'local';
export const PORT = process.env.PORT || 5000;
export const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const WEBHOOK_USERNAME = process.env.WEBHOOK_USERNAME || 'webhookApp';
export const WEBHOOK_URL = process.env.WEBHOOK_URL;
export const GITLAB_TOKEN = process.env.GITLAB_TOKEN; 
export const GITLAB_HOST = process.env.GITLAB_HOST || 'gitlab.com';
export const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;
export const OLLAMA_API = process.env.OLLAMA_API;
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'codellama';
export const OLLAMA_PROMPT_LANGUAGE = process.env.OLLAMA_PROMPT_LANGUAGE || 'portuguese';
export const GITHUB_REPO = process.env.GITHUB_REPO;
export const GITHUB_OWNER = process.env.GITHUB_OWNER;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

import { logger } from './logger.js';

function env() {
  return {
    SERVICE,
    NODE_ENV,
    PORT,
    HOSTNAME,
    WEBHOOK_USERNAME,
    WEBHOOK_URL,
    GITLAB_TOKEN,
    GITLAB_HOST,
    GITLAB_PROJECT_ID,
    OLLAMA_API,
    OLLAMA_MODEL,
    OLLAMA_PROMPT_LANGUAGE,
    GITHUB_REPO,
    GITHUB_OWNER,
    GITHUB_TOKEN
  }
}

export function assertVariablesValues() {
  if (SERVICE && SERVICE === 'gitlab') {
    if (!GITLAB_HOST || !GITLAB_PROJECT_ID || !GITLAB_TOKEN) {
      logger.error('Fill the environment variables correctly');
      process.exit();
    }
  }
  
  if (SERVICE && SERVICE === 'github') {
    if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
      logger.error('Fill the environment variables correctly');
      process.exit();
    }
  }
  
  if (!WEBHOOK_URL || !OLLAMA_API || !SERVICE) {
    logger.error('Fill the environment variables correctly');
    process.exit();
  } else {
    logger.info(`Starting app: `, env());
  }
}