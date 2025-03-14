import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { gitlabWebhook } from './webhook.js';


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
  if (process.env.SERVICE.match('gitlab')) {
    console.log('Triggered Gitlab Webhook');
    const mergeRequestID = req.body.object_attributes.iid || null;
    const projectID = req.body.project.id || null;
    if (!projectID || !mergeRequestID) {
      res.status(400).send('Event cannot be processed');
      return console.log('Event cannot be processed', req.body);
    }
    gitlabWebhook(projectID, mergeRequestID);
    res.status(200).send('Gitlab code fetched and analysed.');
  }

  if (process.env.SERVICE.match('github')) {
    console.log('Triggered Github Webhook');
    // const mergeRequestID = req.body.object_attributes.iid || null;
    // const projectID = req.body.project.id || null;
    // if (!projectID || !mergeRequestID) {
    //   res.status(400).send('Event cannot be processed');
    //   return console.log('Event cannot be processed', req.body);
    // }
    // gitlabWebhook(projectID, mergeRequestID);
  }

});

httpServer.use(cors({
  origin: ['http://localhost:*']
}));


httpServer.use((req, res) => {
  res.status(404);
});
