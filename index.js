import dotenv from 'dotenv';
dotenv.config();

import { createHttpServer } from './server.js';
import { createGithubWebhook } from './github.js';
import { createGitlabWebhook } from './gitlab.js';

createHttpServer();
createGitlabWebhook(68005822, process.env.WEBHOOK_URL);
// createGithubWebhook(process.env.WEBHOOK_URL);

//TODO: check if incoming event on /webhook is an MR being open, if not, return
//TODO: implement choose strategy (gitlab || github) when /webhook is requested 
//TODO: choose service when first running (app args = gitlab || github)
//TODO: receber o ID de projeto como variavel de ambiente ao executar container/app
//TODO: modularize
//TODO: unit tests
//TODO: Linting
//TODO: logger + structure log messages and errors
//TODO: error handling