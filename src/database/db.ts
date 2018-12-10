import * as config from 'config';
import * as fs from 'fs';
import { Pool } from 'pg';

const db = new Pool(config.get('db.postgres'));

/**
 * Loads an SQL query from this codebase. Useful for large queries.
 * @param {string} file - The path to the file, relative from src/database/queries
 * @return {string} The query
 */
export const loadQuery = (file: string): string => fs
    .readFileSync(`src/database/queries/${file}.sql`)
    .toString();

export default db;
