import db from '../database/db';
import { QueryResult } from 'pg';
import logger from './logger';
import { Player } from '../structures/Player';
import { SteamRequest } from 'steam-login';
import { loginUserQuery } from '../database/queries/player';
import { PlayerSettings } from '../structures/PlayerSettings';

// This import is used to let the tests know that session exists on the SteamRequest.
// Ignore is utilized since it's an unused import.
// @ts-ignore
import * as session from 'express-session';

/**
 *
 * @param {e.Request} req
 * @returns {Promise<void>} Completes after necessary login data is set
 * in the database and the logged in user's session
 */
export const loginUser = async (req: SteamRequest): Promise<void> => {
  req.session.sockets = [];

  const steamid = req.user.steamid;
  const avatar = req.user.avatar.medium;

  const player = new Player(steamid, avatar);

  // TODO Insert / Update IP

  const {
    rows: [{ alias, iscaptain, roles, staffrole, isleagueadmin, settings }],
  } = await db.query(loginUserQuery, [steamid, avatar]);
  // PostgreSQL forces lowercase table names

  if (alias) {
    await player.updateActivePunishments();
    player.roles = roles;
    player.staffRole = staffrole;
    player.isLeagueAdmin = isleagueadmin;
    player.alias = alias;
    player.isCaptain = iscaptain;
    if (settings) {
      if (PlayerSettings.matchesStructure(settings)) {
        this.settings = settings;
      } else {
        const updatedSettings = PlayerSettings.fromObject(settings);
        await player.updateSettings(settings);
        this.settings = updatedSettings;
      }
    }
    logger.info(`${alias} logged in`, { steamid });
  }

  req.session.user = player;
};
