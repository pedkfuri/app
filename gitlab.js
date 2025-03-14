import dotenv from 'dotenv';
dotenv.config();

import { Gitlab } from '@gitbeaker/rest';

export const gitlabAPI = new Gitlab({
  token: process.env.GITLAB_TOKEN,
  host: process.env.GITLAB_HOST
});

/**
 * Creates a GitLab webhook for a given project if it does not already exist.
 *
 * @param {number|string} projectID - The ID of the GitLab project.
 * @param {string} webhookUrl - The URL where the webhook should send events.
 * @returns {Promise<void>} - Logs the webhook creation status.
 */
export async function createGitlabWebhook(projectID, webhookUrl) {
  try {
    const currentHooks = await gitlabAPI.ProjectHooks.all(projectID);
    
    const exists = currentHooks.some(currentHook => currentHook.url.match(webhookUrl));
    if (!exists) {
      const hook = await gitlabAPI.ProjectHooks.add(projectID, webhookUrl, {
        mergeRequestsEvents: true,
        pushEvents: true,
        enableSslVerification: false
      });
      return console.log("Webhook created:", hook);
    }
    return console.log('Webhook already exists!');
  } catch (error) {
    console.error("Error creating webhook:", error);
  }
}

/**
 * Retrieves the user ID of a given GitLab username.
 *
 * @param {string} username - The GitLab username to search for.
 * @returns {Promise<number|null>} - The user ID if found, otherwise null.
 */
export async function getUserId(username) {
  const users = await gitlabAPI.Users.all({ username });
  return users.length ? users[0].id : null;
}

/**
 * Retrieves the changes of a merge request in a GitLab project if certain conditions are met.
 *
 * @param {number|string} projectID - The ID of the GitLab project.
 * @param {number|string} mergeRequestID - The ID of the merge request.
 * @returns {Promise<object[]|null>} - An array of changes if conditions are met, otherwise null.
 */
export async function getMergeRequestChanges(projectID, mergeRequestID) {
  try {
    const response = await gitlabAPI.MergeRequests.showChanges(projectID, mergeRequestID, {
      accessRawDiffs: true,
      showExpanded: true,
      enableSslVerification: false
    });
    if (response.data.reviewers.some(async reviewer => reviewer.name.match(await getUserId(process.env.WEBHOOK_USERNAME))) && response.data.state.match('opened')) {
      return response.data.changes;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching MR changes: ", error);
  }
}

/**
 * Creates a comment on a merge request in a GitLab project.
 *
 * @param {number|string} projectID - The ID of the GitLab project.
 * @param {number|string} mergeRequestID - The ID of the merge request.
 * @param {string} content - The content of the comment to be added.
 * @returns {Promise<void>} - Logs the result of the comment creation.
 */
export async function createMergeRequestComment(projectID, mergeRequestID, content) {
  gitlabAPI.MergeRequestNotes.create(projectID, mergeRequestID, content).then(result => {
    console.log('Comment created', result);
  }).catch(error => {
    console.log('Error creating MR comment', error);
  });
}