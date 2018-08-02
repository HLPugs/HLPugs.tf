import { Request }              from 'express';
import db                       from '../database/db';
import { getActivePunishments } from './punishments';
import { QueryResult }          from 'pg';
import logger                   from './logger';
import { player }               from '../structures/player';
import { punishment }           from '../structures/punishment';

declare module 'express' {
  export interface Request {
    user: any;
  }
}

/**
 *
 * @param {e.Request} req
 * @returns {Promise<void>} Completes after necessary login data is set in the database and session
 */
export const loginUser = async(req: Request): Promise<void> => {

  // Arrange data from login
  const steamid = req.user.steamid;
  const avatar = req.user.avatar.medium;
  const ip = req.headers['x-forwarded-for'];

  // Assign the player's session as an instance of player
  req.session.user = new player(steamid, avatar);
  req.session.sockets = [];

  // Insert player into database, or at the very least, update their IP
  // TODO Insert / Update IP
  const query = {
    text: `INSERT INTO players (steamid, avatar)
           VALUES ($1, $2)
           ON CONFLICT (steamid) DO UPDATE SET avatar = $2
           RETURNING captain, alias, roles`,
    values: [steamid, avatar],
  };

  // Retrieve alias, captain and roles
  const res: QueryResult = await db.query(query);
  const { alias, captain, roles } = res.rows[0];

  // Only spend time grabbing punishments if user exists
  if (alias !== null) {
    // Set player'announcements session
    req.session.user.alias     = alias;
    req.session.user.roles     = roles;
    req.session.user.isCaptain = captain;

    // Fetch player's punishments
    const punishments = await getActivePunishments(steamid);
    punishments.map((x: punishment) => req.session.user.punishments[x.punishment] = x.data);

    // Log the login
    logger.info(`${alias} logged in`, { steamid });
  }
};
