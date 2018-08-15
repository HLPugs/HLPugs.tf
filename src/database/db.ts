import { Pool } from 'pg';
import * as config from 'config';
import * as fs from 'fs';

const db = new Pool(config.get('db.postgres'));

/**
 * Loads an SQL query from database/queries. Useful for large queries.
 * @param {string} file - The name of the file
 * @return {string} The query
 */
export const loadSQL = (file: string) => fs
    .readFileSync(`src/database/queries/${file}.sql`)
    .toString();

export default db;
