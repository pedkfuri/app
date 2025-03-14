import dotenv from 'dotenv';
dotenv.config();

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

//TODO: choose prompt to ask to LLM 
//TODO: define which model will analyze the code
//TODO: modularize
//TODO: unit tests
//TODO: Linting
//TODO: document methods parameters, returns
//TODO: logger + structure log messages and errors
//TODO: error handling