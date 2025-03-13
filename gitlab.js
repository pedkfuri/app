import dotenv from 'dotenv';
dotenv.config();

import { Gitlab } from '@gitbeaker/rest';

export const gitlabAPI = new Gitlab({
  token: process.env.GITLAB_TOKEN,
  host: process.env.GITLAB_HOST
});

export async function createGitlabWebhook(webhookUrl) {
  try {
    const response = await gitlabAPI.ProjectHooks.add(1, webhookUrl, {
      mergeRequestsEvents: true,
      pushEvents: true,
      enableSslVerification: false
    });
    console.log("Webhook criado com sucesso:", response);
  } catch (error) {
    console.error("Erro ao criar webhook:", error);
  }
}