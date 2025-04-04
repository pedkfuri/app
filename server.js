import express from 'express';
import cors from 'cors';
import { gitlabWebhook, githubWebhook } from './webhook.js';
import { logger } from './logger.js';
import { PORT, HOSTNAME, SERVICE } from './constants.js';

export const httpServer = express();

httpServer.use(express.json(), cors());

/**
 * Starts an HTTP server and listens on the specified port.
 *
 * @returns {void} - Logs a message when the server starts.
 */
export function createHttpServer() {
  httpServer.listen(PORT, () => {
    logger.info(`HTTP Server started @ ${HOSTNAME}:${PORT}`);
  });
}

httpServer.get('/', (req, res) => {
  res.send('HTTP Server running');
});

httpServer.post('/webhook', (req, res) => {
  if (SERVICE.match('gitlab')) {
    logger.info('Triggered Gitlab Webhook');
    if (!req.body || !req.body.object_attributes || !req.body.project || !req.body.object_attributes.iid || !req.body.project.id) {
      res.status(422).send('Event cannot be processed');
      return logger.error('Event cannot be processed');
    } else {
      const projectID = req.body.project.id;
      const mergeRequestID = req.body.object_attributes.iid;

      gitlabWebhook(projectID, mergeRequestID);
      res.status(200).send('Gitlab code fetched and analysed.');
    }
  }

  if (SERVICE.match('github')) {
    logger.info('Triggered Github Webhook');
    
    if (!req.body || !req.body.pull_request || !req.body.number) {
      res.status(422).send('Event cannot be processed');
      return logger.error('Event cannot be processed');
    } else {
      if (req.body.pull_request.state !== 'open') return logger.error('PR in unprocessable state');
      const prNumber = req.body.number;
      githubWebhook(prNumber);
      res.status(200).send('Webhook event processed.');
    }
  }
});

httpServer.use((req, res) => {
  res.status(404);
});
