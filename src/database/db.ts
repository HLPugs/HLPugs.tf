import { Pool } from 'pg';
import * as config from 'config';

const db = new Pool(config.get('db.postgres'));

export default db;
