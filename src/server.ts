import * as config          from 'config';
import * as crypto          from 'crypto';
import * as connect_redis   from 'connect-redis';
import * as express         from 'express';
import * as expressSession  from 'express-session';
import * as steam           from 'steam-login';
import * as uuid            from 'uuid';
import { Server }           from 'http';
import { routing, sockets, handleError } from './modules';

const RedisStore = connect_redis(expressSession);

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

// Error handling middleware
// tslint:disable-next-line:max-line-length
app.use(async (e: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  await handleError(e);
  next(e);
});

process.on('uncaughtException', (e) => {
  	// TODO Pass relevant data to handleError
  	handleError(e);
  	process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  throw reason;
});

server.listen(3001);
