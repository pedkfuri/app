import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { getMergeRequestChanges } from './gitlab.js';
import { requestLLM } from './ollama.js';

export const httpServer = express();

const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

httpServer.use(express.json());

export function createHttpServer() {
  httpServer.listen(PORT, () => {
    console.log(`Servidor HTTP iniciado em [${HOSTNAME}:${process.env.PORT}]`);
  });
}

httpServer.get('/', (req, res) => {
  res.send('HTTP Server running');
});

httpServer.post('/webhook', (req, res) => {
  const mergeRequestID = req.body.object_attributes.iid;
  const projectID = req.body.project.id;

  const outputLLM = getMergeRequestChanges(projectID, mergeRequestID).then(async (response) => {
    let diffs = '';
    response.data.changes.forEach((change, index) => {
      diffs = `${diffs}\n${index}> ${change.renamed_file}: \n${change.diff}`;
    });
    return await requestLLM(`Analise os seguintes arquivos diff e faça um breve comentário de 2 linhas sobre todas as mudanças: ${diffs}`).then(response => { return response.response } );
  });

  gitlabAPI.MergeRequestNotes.create(projectID, mergeRequestID, outputLLM).then(result => {
    console.log('Comment created', result);
    res.status(200).send('Code fetched and analysed.').json({msg: ollamaReturn});
  }).catch(error => {
    console.log('Error creating MR comment', error)
  });
});

httpServer.use(cors({
  origin: ['http://localhost:*']
}));


httpServer.use((req, res) => {
  res.status(404);
});
