import * as express from 'express';

const app: express.Application = express();

import { routing } from './modules';

app.use(routing);

app.listen(3001);