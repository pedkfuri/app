import { createMergeRequestComment, getMergeRequestChanges } from './gitlab.js';
import { requestLLM } from './ollama.js';

export function gitlabWebhook(projectID, mergeRequestID) {
  getMergeRequestChanges(projectID, mergeRequestID).then(async (changes) => {
    if (!changes || changes.length < 1) return console.log(`MR event not assigned to ${process.env.WEBHOOK_USERNAME} or in unprocessable state`);
    let diffs = '';

    changes.forEach((change, index) => {
      diffs = `${diffs}\n${index}> ${change.renamed_file}: \n${change.diff}`;
    });

    console.log('Ollama code analysis starting...');
    requestLLM(`You are a senior lead engineer who is doing a code review so be careful with words and give ideas, 
      show you want to help. Analyze the code and make a brief (2-5 lines) statement about it, what is good, what should be changed.
      You should answer in ${process.env.OLLAMA_PROMPT_LANGUAGE || 'brazilian portuguese'}
      Here is the diff content: ${diffs}.`).then(llmOutput => {
      createMergeRequestComment(projectID, mergeRequestID, llmOutput.response);
    });
  });
}