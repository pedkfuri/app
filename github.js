import { Octokit } from "octokit";
import { ENV } from './index.js';

const token = ENV.GITHUB_TOKEN;
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

    console.log("Webhook created:", response.data);
  } catch (error) {
    console.error("Error creating webhook:", error);
  }
}