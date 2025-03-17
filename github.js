import { Octokit } from 'octokit';
import { logger } from './logger.js';
import { ENV } from './constants.js';

const githubAPI = new Octokit({ auth: ENV().GITHUB_TOKEN });

/**
 * Creates a webhook in the specified GitHub repository to listen for pull request events.
 *
 * @param {string} webhookUrl - The URL that will receive the webhook payloads.
 * @returns {Promise<void>} A promise that resolves when the webhook is successfully created.
 */
export async function createGithubWebhook(webhookUrl) {
  await githubAPI.rest.repos.createWebhook({
    owner: ENV().GITHUB_OWNER,
    repo: ENV().GITHUB_REPO,
    config: {
      url: webhookUrl, 
      content_type: 'json',
      insecure_ssl: '0',
      secret: 'webhook_app'
    },
    events: ["pull_request"],
    active: true
  }).then(() => {
    logger.info("Webhook created.");
  }).catch(error => logger.error("Error creating webhook:", error));
}

/**
 * Retrieves the list of files changed in a specific pull request.
 *
 * @param {number} prNumber - The number of the pull request.
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects representing the modified files.
 */
export async function getPullRequestDiffContent(prNumber) {
  try {
    return await githubAPI.rest.pulls.listFiles({
      owner: ENV().GITHUB_OWNER,
      repo: ENV().GITHUB_REPO,
      pull_number: prNumber
    });
  } catch (error) {
    logger.error("Error fetching diff content:", error);
  }
}

/**
 * Creates a comment on a pull request using the GitHub API.
 *
 * @param {number} prNumber - The number of the pull request to comment on.
 * @param {string} content - The content of the comment.
 * @returns {Promise<void>} A promise that resolves when the comment is successfully created.
 */
export async function createPullRequestComment(prNumber, content) {
  await githubAPI.rest.pulls.createReview({
    owner: ENV().GITHUB_OWNER,
    repo: ENV().GITHUB_REPO,
    pull_number: prNumber,
    event: "COMMENT",
    body: content
  }).then(() => {
    logger.info('Comment created');
  }).catch(error => {
    logger.error('Error creating PR comment', error);
  });
}