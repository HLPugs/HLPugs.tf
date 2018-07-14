import * as config from 'config';
import * as crypto from 'crypto';
import * as express from 'express';
import { Server } from 'http';
import * as expressSession from 'express-session';
import * as connect_redis from 'connect-redis';
// tslint:disable-next-line:variable-name
const RedisStore = connect_redis(expressSession);
import * as steam from 'steam-login';
import * as uuid from 'uuid';

import { routing, sockets } from './modules';

const sessionConfig = expressSession({
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

const server = new Server(app);

sockets(server, sessionConfig);

app.use(sessionConfig);

app.use(steam.middleware({
  realm: config.get('app.steam.realm'),
  verify: config.get('app.steam.verify'),
  apiKey: config.get('app.steam.apiKey'),
}));

app.use(routing);

server.listen(3001);
