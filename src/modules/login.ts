import { Request } from 'express';
import db from '../database/db';

declare module 'express' {
  export interface Request {
    user: any;
  }
}

/**
 *
 * @param {e.Request} req
 * @returns {Promise<boolean>} true if player is banned
 */
export async function loginUser(req: Request): Promise<boolean> {

  // Arrange data from login
  const steamid = req.user.steamid.toString();
  const avatar = req.user.avatar.medium;
  const ip = req.headers['x-forwarded-for'];

    // Insert player into database, or at the very least, update their IP if possible
  const query1 = {
    text: `INSERT INTO players (steamid) VALUES ($1)
           ON CONFLICT (steamid) DO NOTHING`,
    values: [steamid],
  };

    // Return if they are banned or not after inserting
  const query2 = {
    text: `SELECT banned FROM players WHERE steamid = $1`,
    values: [steamid],
  };

  return await db.query(query1)
      .then(() => db.query(query2))
      .then(rows => rows.rows[0].banned);
}
