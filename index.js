import dotenv from 'dotenv';
dotenv.config();

import { createHttpServer } from './server.js';
import { createGithubWebhook } from './github.js';
import { createGitlabWebhook } from './gitlab.js';
import { requestLLM } from './ollama.js';

createHttpServer();

// createGitlabWebhook(process.env.WEBHOOK_URL);

// createGithubWebhook(process.env.WEBHOOK_URL);

requestLLM('Testando. Responda com uma palavra nova inventada agora');

//TODO: check if incoming event on /webhook is an MR being open, if not, return
//TODO: decode which type of code and how to show it to ollama to be reviewed
//TODO: send code received to the ollama instance via rest API
//TODO: receive ollama return with code review and suggestions
//TODO: comment on pull request using gitbeaker/gitlab API
//TODO: dont create projecthook if it's already created

//TODO: choose service when first running (app args = gitlab || github)