import { logger } from './logger.js';
import { env, 
  SERVICE, 
  GITLAB_PROJECT_ID, 
  GITLAB_HOST, 
  GITLAB_TOKEN, 
  GITHUB_OWNER, 
  GITHUB_REPO, 
  GITHUB_TOKEN, 
  WEBHOOK_URL, 
  OLLAMA_API 
} from './constants.js';

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

import { createHttpServer } from './server.js';
import { createGithubWebhook } from './github.js';
import { createGitlabWebhook } from './gitlab.js';

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