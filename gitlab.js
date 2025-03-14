import dotenv from 'dotenv';
dotenv.config();

import { Gitlab } from '@gitbeaker/rest';

export const gitlabAPI = new Gitlab({
  token: process.env.GITLAB_TOKEN,
  host: process.env.GITLAB_HOST
});

export async function createGitlabWebhook(projectID, webhookUrl) {
  try {
    const currentHooks = await gitlabAPI.ProjectHooks.all(projectID);
    
    const exists = currentHooks.some(currentHook => currentHook.url === webhookUrl);
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

export async function getMergeRequestChanges(projectID, mergeRequestID) {
  try {
    const response = await gitlabAPI.MergeRequests.showChanges(projectID, mergeRequestID, {
      accessRawDiffs: true,
      showExpanded: true,
      enableSslVerification: false
    });
    console.log('Merge Request changes fetched: ', response);
    return response; //.data.changes[0].diff
  } catch (error) {
    console.error("Error fetching MR changes: ", error);
  }
}

export async function createMergeRequestComment(projectID, mergeRequestID, content) {
  gitlabAPI.MergeRequestNotes.create(projectID, mergeRequestID, content).then(result => {
    console.log('Comment created', result);
  }).catch(error => {
    console.log('Error creating MR comment', error);
  });
}