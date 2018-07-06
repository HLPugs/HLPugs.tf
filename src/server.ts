import * as express from 'express';
import { postToDiscord, routing } from './modules';

const app: express.Application = express();

app.use(routing);

app.listen(3001, () => {
  console.log('Test');
  postToDiscord(`Node server listening on port 3001`, 'site-status');
});
