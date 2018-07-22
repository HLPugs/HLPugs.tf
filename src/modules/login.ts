import { Request } from 'express';
import db from '../database/db';
import { getActivePunishments } from './punishments';
import { player, punishment } from '../common/types';

declare module 'express' {
  export interface Request {
    user: any;
  }
}

/**
 *
 * @param {e.Request} req
 * @returns {Promise<void>} Returns once all necessary login queries have completed
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
ON CONFLICT (steamid) DO UPDATE SET avatar = $2 returning captain, alias, roles`,
    values: [steamid, avatar],
  };

  // Returns alias, captain and roles
  const { alias, captain, roles }: player = await db.query(query1)
      .then(res => res.rows[0]);

  if (alias !== null) {
    req.session.user.alias = alias;
    req.session.user.roles = roles || {};
    req.session.user.captain = captain;
    await getActivePunishments(steamid)
      .then((data: punishment[]) => {
        data.map((x: punishment) => req.session.user.punishments[x.punishment] = x.data);
      });
  }
}
