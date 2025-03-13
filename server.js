import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { gitlabAPI } from './gitlab.js';

export const httpServer = express();

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

httpServer.use(express.json());

export function createHttpServer() {
  httpServer.listen(PORT, (hostname, port) => {
    console.log(`Servidor HTTP iniciado em [${HOSTNAME}:${PORT}]`);
  });
}

httpServer.get('/', (req, res) => {
  res.send('HTTP Server running');
});

httpServer.use(cors({
  origin: ['http://localhost:*']
}));

httpServer.use((req, res) => {
  res.status(404);
});

httpServer.post('/webhook', (req, res) => {
  const mergeRequestID = req.body.object_attributes.iid;
  const projectID = req.body.project.id;
  console.log(projectID, 'projectID');
  console.log(mergeRequestID, 'mergeRequestID')

  gitlabAPI.MergeRequestNotes.create(projectID, mergeRequestID, 'testing automation').then(result => {
    console.log(result)
    res.send('MR Webhook event created');
  });
});