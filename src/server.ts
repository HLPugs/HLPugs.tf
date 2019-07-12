import * as dotenv                       from 'dotenv';
dotenv.config();

import * as config                       from 'config';
import * as crypto                       from 'crypto';
import * as express                      from 'express';
import * as expressSession               from 'express-session';
import * as steam                        from 'steam-login';
import * as uuid                         from 'uuid';
import { Server }                        from 'http';
import { routing, sockets } from './modules';
import { store }                         from './modules/store';
import { BaseController } from './api/v1/controllers/BaseController';
import { controllers } from './api/v1/controllers/index';
import { logResponseTime } from './middleware/logResponseTime';
import { handleApiErrors } from './middleware/handleApiErrors';

const apiPrefix: string = config.get('app.apiPrefix');

const sessionConfig = expressSession({
  store,
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

// npm run test fails without this setTimeout. It is unknown why this is.
sockets(server, sessionConfig);

app
.use(sessionConfig, routing)
.use(apiPrefix, logResponseTime, handleApiErrors)
.use(steam.middleware({
  realm: config.get('app.steam.realm'),
  verify: config.get('app.steam.verify'),
  apiKey: config.get('app.steam.apiKey'),
}));

controllers.forEach((controller: BaseController) => {
  app.use(apiPrefix, controller.router);
});

server.listen(3001);
