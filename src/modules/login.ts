import { Request } from 'express';
import db from '../database/db';
import { getActivePunishments } from './punishments';
import { punishment } from '../common/types';
import { QueryResult } from 'pg';

declare module 'express' {
  export interface Request {
    user: any;
  }
}

/**
 *
 * @param {e.Request} req
 * @returns {Promise<void>} Completes after login data is set in DB and Node
 */
export async function loginUser(req: Request): Promise<void> {

  // Arrange data from login
  const steamid = req.user.steamid;
  const avatar = req.user.avatar.medium;
  const ip = req.headers['x-forwarded-for'];

  // Create template
  req.session.user = {
    steamid,
    avatar,
    captain: false,
    alias: '',
    punishments: {},
    roles: {},
  };

  // Insert player into database, or at the very least, update their IP if possible
  const query1 = {
    text: `INSERT INTO players (steamid, avatar)
           VALUES ($1, $2)
           ON CONFLICT (steamid) DO UPDATE SET avatar = $2
           RETURNING captain, alias, roles`,
    values: [steamid, avatar],
  };

  // Returns alias, captain and roles
  const res: QueryResult = await db.query(query1);
  const { alias, captain, roles } = res.rows[0];

  // If user is new, don't waste time grabbing punishments
  if (alias !== null) {
    req.session.user.alias = alias;
    req.session.user.roles = roles || {};
    req.session.user.captain = captain;
    const punishments = await getActivePunishments(steamid);
    punishments.map((x: punishment) => req.session.user.punishments[x.punishment] = x.data);
  }
}
