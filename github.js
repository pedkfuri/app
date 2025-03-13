import dotenv from 'dotenv';
dotenv.config();

import { Octokit } from "octokit";

const token = process.env.GITHUB_TOKEN;
export const githubAPI = new Octokit({ auth: token });

export async function createGithubWebhook(webhookUrl) {
  try {
    const response = await githubAPI.rest.repos.createWebhook({
      owner: "pedkfuri",
      repo: "career",
      config: {
        url: webhookUrl, 
        content_type: "json",
        //secret: "segredo",
        insecure_ssl: "1"
      },
      events: ["push", "pull_request"],
      active: true
    });

    console.log("Webhook criado com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao criar webhook:", error);
  }
}