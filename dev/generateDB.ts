import { Pool } from 'pg';
import * as config from 'config';
import * as minify from 'pg-minify';
import * as fs from 'fs';

const db = new Pool(config.get('db.postgres'));

const schemaQuery = minify(fs.readFileSync('./schema.sql', 'utf8'));

db.query(schemaQuery);
