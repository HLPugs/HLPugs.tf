import * as express from 'express';
import { postToDiscord, routing } from './modules';

const app: express.Application = express();

app.use(routing);

app.listen(3001, () => {
  postToDiscord(`Node server listening on port 3001`, 'site-status');
});
