import * as config from 'config';
import * as express from 'express';
const steam = require('steam-login');

import { routing } from './modules';

const app: express.Application = express();

app.use(steam.middleware({
  realm: config.get('app.steam.realm'),
  verify: config.get('app.steam.verify'),
  apiKey: config.get('app.steam.apiKey'),
}));

app.use(routing);

app.listen(3001);
