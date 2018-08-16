import { Request }              from 'express';
import db                       from '../database/db';
import { getActivePunishments } from './punishments';
import { QueryResult }          from 'pg';
import logger                   from './logger';
import { Player }               from '../structures/Player';
import { SteamRequest }         from 'steam-login';
import { Punishment }           from '../structures/Punishment';
import { loginUserQuery }       from '../database/queries/player';

/**
 *
 * @param {e.Request} req
 * @returns {Promise<void>} Completes after necessary login data is set in the database and session
 */
export const loginUser = async(req: SteamRequest): Promise<void> => {
  req.session.sockets = [];

  // Arrange data from login
  const steamid = req.user.steamid;
  const avatar  = req.user.avatar.medium;
  const ip      = req.headers['x-forwarded-for'];

  // Assign the Player's session as an instance of Player
  const player = new Player(steamid, avatar);

  // Insert Player into database, or at the very least, update their IP
  // TODO Insert / Update IP

  // Retrieve alias, captain and roles
  const res: QueryResult = await db.query(loginUserQuery, [steamid, avatar]);
  const { alias, isCaptain, roles, staffRole, isLeagueAdmin } = res.rows[0];

  // Only spend time grabbing activePunishments if user exists
  if (alias !== null) {
    // Set Player's session
    player.alias = alias;
    player.updateRoles(roles, staffRole, isLeagueAdmin).catch((e) => {
      throw e;
    });
    player.isCaptain = isCaptain;

    // Fetch player's active punishments
    const punishments = await getActivePunishments(steamid);
    punishments.forEach((punishment: Punishment) => {
      player.activePunishments.set(punishment.type, punishment.data);
    });

    // Log the login
    logger.info(`${alias} logged in`, { steamid });
  }
  req.session.user = player;
};
