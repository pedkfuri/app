import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { gitlabWebhook } from './webhook.js';
import { logger } from './logger.js';

export const httpServer = express();

const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

httpServer.use(express.json());

/**
 * Starts an HTTP server and listens on the specified port.
 *
 * @returns {void} - Logs a message when the server starts.
 */
export function createHttpServer() {
  httpServer.listen(process.env.PORT, () => {
    logger.info(`HTTP Server started @ ${HOSTNAME}:${process.env.PORT}`);
  });
}

httpServer.get('/', (req, res) => {
  res.send('HTTP Server running');
});

httpServer.post('/webhook', (req, res) => {
  if (process.env.SERVICE.match('gitlab')) {
    logger.info('Triggered Gitlab Webhook');
    const mergeRequestID = req.body.object_attributes.iid || null;
    const projectID = req.body.project.id || null;
    if (!projectID || !mergeRequestID) {
      res.status(422).send('Event cannot be processed');
      return logger.error('Event cannot be processed');
    }
    gitlabWebhook(projectID, mergeRequestID);
    res.status(200).send('Gitlab code fetched and analysed.');
  }

  if (process.env.SERVICE.match('github')) {
    logger.info('Triggered Github Webhook');
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
