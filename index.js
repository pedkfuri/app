import dotenv from 'dotenv';
dotenv.config();

import fs from 'node:fs/promises'

import { createHttpServer } from './server.js';
import { createGithubWebhook } from './github.js';
import { createGitlabWebhook, getMergeRequestChanges } from './gitlab.js';

createHttpServer();
createGitlabWebhook(68005822, process.env.WEBHOOK_URL);
// createGithubWebhook(process.env.WEBHOOK_URL);


//TODO: check if incoming event on /webhook is an MR being open, if not, return
//TODO: dont create projecthook if it's already created
//TODO: PASSAR TUDO PRA INGLES NO CÓDIGO
//TODO: choose service when first running (app args = gitlab || github)
//TODO: receber o ID de projeto como variavel de ambiente ao executar container/app
//TODO: modularize
//TODO: unit tests