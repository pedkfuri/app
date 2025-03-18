import { createMergeRequestComment, getMergeRequestChanges } from './gitlab.js';
import { createPullRequestComment, getPullRequestDiffContent } from './github.js';
import { WEBHOOK_USERNAME } from './constants.js';
import { requestLLM } from './ollama.js';
import { logger } from './logger.js';

/**
 * Handles the GitLab webhook event, processes the merge request changes, 
 * and requests a code review from the LLM.
 *
 * @param {number|string} projectID - The ID of the GitLab project.
 * @param {number|string} mergeRequestID - The ID of the merge request.
 * @returns {Promise<void>} - Logs the results and triggers actions for code analysis.
 */
export function gitlabWebhook(projectID, mergeRequestID) {
  getMergeRequestChanges(projectID, mergeRequestID).then(async (changes) => {
    if (!changes || changes.length < 1) return logger.error(`MR event not assigned to ${WEBHOOK_USERNAME} or in unprocessable state`);
    let diffs = '';

    changes.forEach((change, index) => {
      diffs = `${diffs}\n${index}> ${change.renamed_file}: \n${change.diff}`;
    });

    logger.info('Ollama code analysis starting...');
    requestLLM(diffs).then(async (llmOutput) => {
      return await createMergeRequestComment(projectID, mergeRequestID, llmOutput.response);
    });
  });
}

/**
 * Handles the Github webhook event, processes the pull request changes, 
 * and requests a code review from the LLM.
 *
 * @param {number|string} prNumber - The pull request number to fetch diff content for.
 * @returns {Promise<void>} - Logs the results and triggers actions for code analysis.
 */
export async function githubWebhook(prNumber) {
  await getPullRequestDiffContent(prNumber).then(response => {
    let fullPatches = '';
    response.data.forEach((patchContent, index) => {
      fullPatches += `\nDiff ${index}: ${patchContent.patch}\n`;
    });
    logger.info('Ollama code analysis starting...');
    requestLLM(fullPatches).then(async (llmOutput) => {
      return await createPullRequestComment(prNumber, llmOutput.response);
    });
    
  });
}