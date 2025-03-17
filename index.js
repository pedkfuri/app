import { logger } from './logger.js';
import { ENV } from './constants.js';

if (ENV().SERVICE && ENV().SERVICE === 'gitlab') {
  if (!ENV().GITLAB_HOST || !ENV().GITLAB_PROJECT_ID || !ENV().GITLAB_TOKEN) {
    logger.error('Fill the environment variables correctly');
    process.exit();
  }
}

if (ENV().SERVICE && ENV().SERVICE === 'github') {
  if (!ENV().GITHUB_OWNER || !ENV().GITHUB_REPO || !ENV().GITHUB_TOKEN) {
    logger.error('Fill the environment variables correctly');
    process.exit();
  }
}

if (!ENV().WEBHOOK_URL || !ENV().OLLAMA_API || !ENV().SERVICE) {
  logger.error('Fill the environment variables correctly');
  process.exit();
} else {
  logger.info(`Starting app: `, ENV());
}

import { createHttpServer } from './server.js';
import { createGithubWebhook } from './github.js';
import { createGitlabWebhook } from './gitlab.js';

createHttpServer();

if (ENV().SERVICE.match('gitlab')) {
  createGitlabWebhook(ENV().GITLAB_PROJECT_ID, ENV().WEBHOOK_URL);
}

if (ENV().SERVICE.match('github')) {
  createGithubWebhook(ENV().WEBHOOK_URL);
}

//TODO: unit tests
//TODO: error handling: /webhook request with wrong payload, ollama timeout, duplicate comment/MR or PR event
//TODO: get only open MR/PR, assigned to the webhook user, accept or reject MR/PR
//TODO: AI classify if code is good to approve or not
//TODO: check patch/diff content constraints (too large, too many symbols etc)
//TODO: avoid github webhook duplication