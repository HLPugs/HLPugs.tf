import db                                      from '../database/db';
import { QueryResult }                         from 'pg';
import logger                                  from './logger';
import { Player }                              from '../structures/Player';
import { SteamRequest }                        from 'steam-login';
import { loginUserQuery } from '../database/queries/player';
import { PlayerSettings }                      from '../structures/PlayerSettings';
import * as session from 'express-session';

/**
 *
 * @param {e.Request} req
 * @returns {Promise<void>} Completes after necessary login data is set
 * in the database and the logged in user's session
 */
export const loginUser = async(req: SteamRequest): Promise<void> => {
  req.session.sockets = [];

  const steamid = req.user.steamid;
  const avatar  = req.user.avatar.medium;

  const player = new Player(steamid, avatar);

  // TODO Insert / Update IP

  const res: QueryResult = await db.query(loginUserQuery, [steamid, avatar]);
  const { alias, isCaptain, roles, staffRole, isLeagueAdmin, settings } = res.rows[0];

  // Only spend time retrieving more information from database if user exists
  if (alias) {
    await player.updateActivePunishments();
    player.roles = roles;
    player.staffRole = staffRole;
    player.isLeagueAdmin = isLeagueAdmin;
    player.alias = alias;
    player.isCaptain = isCaptain;
    if (settings) {
      if (PlayerSettings.matchesStructure(settings)) {
        this.settings = settings;
      } else {
        const updatedSettings = PlayerSettings.fromObject(settings);
        await player.updateSettings(settings);
        this.settings = updatedSettings;
      }
    }
    console.log(JSON.stringify(player));
    logger.info(`${alias} logged in`, { steamid });
  }

  req.session.user = player;
};
