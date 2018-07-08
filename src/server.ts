import * as express from 'express';
import { routing } from './modules';

const app: express.Application = express();

app.use(routing);

app.listen(3001);
