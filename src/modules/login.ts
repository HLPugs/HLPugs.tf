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
export async function loginUser(req: Request): Promise<Object> {

  // Arrange data from login
  const ip = req.headers['x-forwarded-for'];
  const steamid = req.user.steamid;
  const avatar = req.user.avatar.medium;

  // Insert player into database, or at the very least, update their IP if possible
  const query1 = {
    text: `INSERT INTO players (steamid)
           VALUES ($1)
           ON CONFLICT (steamid) DO NOTHING`,
    values: [steamid],
  };

  // Return whether or not the player signing in is banned after inserting
  const query2 = {
    text: `SELECT username, banned, captain FROM players
           WHERE steamid = $1`,
    values: [steamid],
  };

  // Returns username, and captain and banned status
  const { username, captain, banned } = await db.query(query1)
      .then(() => db.query(query2))
      .then(result => result.rows[0]);

  return { username, banned, avatar, captain };
}
