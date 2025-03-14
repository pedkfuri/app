import { createMergeRequestComment, getMergeRequestChanges } from './gitlab.js';
import { ENV } from './index.js';
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
    if (!changes || changes.length < 1) return console.log(`MR event not assigned to ${ENV.WEBHOOK_USERNAME} or in unprocessable state`);
    let diffs = '';

    changes.forEach((change, index) => {
      diffs = `${diffs}\n${index}> ${change.renamed_file}: \n${change.diff}`;
    });

    logger.info('Ollama code analysis starting...');
    requestLLM(`You are a senior lead engineer who is doing a code review so be careful with words and give ideas, 
      show you want to help. Analyze the code and make a brief (2-5 lines) statement about it, what is good, what should be changed.
      You should answer in ${ENV.OLLAMA_PROMPT_LANGUAGE || 'brazilian portuguese'}
      Here is the diff content: ${diffs}.`).then(llmOutput => {
      createMergeRequestComment(projectID, mergeRequestID, llmOutput.response);
    });
  });
}