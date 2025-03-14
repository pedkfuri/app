import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createMergeRequestComment, getMergeRequestChanges, gitlabAPI } from './gitlab.js';
import { requestLLM } from './ollama.js';

export const httpServer = express();

const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

httpServer.use(express.json());

export function createHttpServer() {
  httpServer.listen(process.env.PORT, () => {
    console.log(`Servidor HTTP iniciado em [${HOSTNAME}:${process.env.PORT}]`);
  });
}

httpServer.get('/', (req, res) => {
  res.send('HTTP Server running');
});

httpServer.post('/webhook', (req, res) => {
  const mergeRequestID = req.body.object_attributes.iid;
  const projectID = req.body.project.id;
  if (!projectID || !mergeRequestID) {
    res.status(400).send('Event cannot be processed');
    return console.log('Event cannot be processed');
  }
  getMergeRequestChanges(projectID, mergeRequestID).then(async (changes) => {
    if (!changes || changes.length < 1) return console.log(`MR event not assigned to ${process.env.WEBHOOK_USERNAME} or in unprocessable state`);
    let diffs = '';
    changes.forEach((change, index) => {
      diffs = `${diffs}\n${index}> ${change.renamed_file}: \n${change.diff}`;
    });
    console.log('Ollama code analysis starting...');
    requestLLM(`You are a senior lead engineer who is doing a code review so be careful with words and give ideas, show you want to help. Analyze the code and make a brief (2-5 lines) statement about it, what is good, what should be changed. Here is the diff content: ${diffs}`).then(llmOutput => {
      createMergeRequestComment(projectID, mergeRequestID, llmOutput.response);
      res.status(200).send('Code fetched and analysed.');
    });
  });
});

httpServer.use(cors({
  origin: ['http://localhost:*']
}));


httpServer.use((req, res) => {
  res.status(404);
});
