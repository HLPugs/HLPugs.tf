import * as config from 'config';
import * as crypto from 'crypto';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as connect_redis from 'connect-redis';
// tslint:disable-next-line:variable-name
const RedisStore = connect_redis(expressSession);
const steam = require('steam-login');
import * as uuid from 'uuid';

import { routing } from './modules';

const sessionConfig = expressSession({
  store: new RedisStore(config.get('redis')),
  genid(req) {
    return crypto.createHash('sha256')
        .update(uuid.v1())
        .update(crypto.randomBytes(256))
        .digest('hex');
  },
  resave: false,
  saveUninitialized: false,
  secret: config.get('app.secret'),
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 14,
  },
});

const app: express.Application = express();

app.use(sessionConfig);

app.use(steam.middleware({
  realm: config.get('app.steam.realm'),
  verify: config.get('app.steam.verify'),
  apiKey: config.get('app.steam.apiKey'),
}));

app.use(routing);

app.listen(3001);
