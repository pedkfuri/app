import { SERVICE, GITLAB_PROJECT_ID, WEBHOOK_URL, assertVariablesValues } from './constants.js';
import { createHttpServer } from './server.js';
import { createGithubWebhook } from './github.js';
import { createGitlabWebhook } from './gitlab.js';

assertVariablesValues();
createHttpServer();

if (SERVICE.match('gitlab')) {
  createGitlabWebhook(GITLAB_PROJECT_ID, WEBHOOK_URL);
}

if (SERVICE.match('github')) {
  createGithubWebhook(WEBHOOK_URL);
}

//TODO: unit tests
//TODO: error handling: /webhook request with wrong payload, ollama timeout, duplicate comment/MR or PR event
//TODO: get only open MR/PR, assigned to the webhook user, accept or reject MR/PR
//TODO: AI classify if code is good to approve or not
//TODO: check patch/diff content constraints (too large, too many symbols etc)
//TODO: avoid github webhook duplication