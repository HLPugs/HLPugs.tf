import { store }                          from '../server';
import * as config                        from 'config';
import { DraftTFClass, DraftTFClassList } from '../structures/draftClassList';
import { player }                         from '../structures/player';
import logger                             from './logger';

/**
 * @module playerMap
 * A module that enables the retrieval, setting and deletion of a {@Link player}
 * in a collection referenced by their SteamID
 */

// Declare player map and draft class list
const players = new Map<string, string>();
const draftTFClassLists = new Map<DraftTFClass, string[]>();

// Load the gamemode-specific class configuration
const draftTFClasses: DraftTFClassList[] = config.get('app.configuration.classes');

// Empty out every class in the draft class list
draftTFClasses.map(draftTFClass => draftTFClassLists.set(draftTFClass.name, []));

/**
 * Retrieves a session ID from the map using a SteamID.
 * @param {string} steamid - The player to retrieve.
 * @returns {Promise<player>} - The {@Link player}.
 */
export const getPlayer = (steamid: string): Promise<player> => {
  return new Promise((resolve) => {
    if (!players.has(steamid)) {
      logger.warn(`Player (${steamid}) was requested from the player map but was not found`);
    }
    const sessionid = players.get(steamid);
    store.get(sessionid, (err, session) => {
      if (err) throw err;
      resolve(session.user);
    });
  });
};

/**
 * Adds or updates a session ID in the player map.
 * @param {string} sessionid - The player's sessionid to add (or update if existing).
 * @param {string} steamid - The SteamID that references the session ID.
 */
export const addPlayer = (sessionid: string, steamid: string) => players.set(steamid, sessionid);

/**
 * Removes a player from the player map
 * @param {string} steamid - The SteamID to remove.
*/
export const removePlayer = (steamid: string) => players.delete(steamid);

/**
 * Removes all players from the map
 */
export const removeAllPlayers = () => players.clear();

/**
 * Returns all players as an array of {@Link player}'s
 */
export const getAllPlayers = () => {
  return new Promise(async (resolve) => {
    const playersArr = Array.from(players.keys());
    const newPlayerArr = playersArr.map(steamid => getPlayer(steamid));
    resolve(Promise.all(newPlayerArr));
  });
};

/**
 * Adds a player to a class
 * @param {string} steamid - The SteamID of the player to add
 * @param {string} draftTFClass - The class to be added on
 */
export const addPlayerDraftTFClass = async (steamid: string, draftTFClass: DraftTFClass) => {
  // Ensure player isn't already added up to the class
  if (draftTFClassLists.get(draftTFClass).indexOf(steamid) === -1) {
    draftTFClassLists.get(draftTFClass).push(steamid);
    const player: player = await getPlayer(steamid);
    logger.info(`${player.alias} added to ${draftTFClass}!`);
  }
};

/**
 * Removes a player from a class
 * @param {string} steamid - The SteamID of the player to remove
 * @param {string} draftTFClass - The class to be removed from
 */
export const removePlayerDraftTFClass = async (steamid: string, draftTFClass: DraftTFClass) => {
  logger.info(`removed removed from ${draftTFClass}`);
  const indexOfPlayer = draftTFClassLists
	  .get(draftTFClass)
	  .indexOf(steamid);

  if (indexOfPlayer >= 0) {
    draftTFClassLists
		.get(draftTFClass)
		.splice(indexOfPlayer, 1);

    const player: player = await getPlayer(steamid);
    logger.info(`${player.alias} removed from ${draftTFClass}`);
  }
};

/**
 * Removes a player from all classes
 * @param {string} steamid - The SteamID of the player to be removed from all classes
 */
export const removePlayerAllDraftTFClasses = (steamid: string) => {
  draftTFClasses.map(draftTFClassList => removePlayerDraftTFClass(steamid, draftTFClassList.name));
};

/**
 * Returns every player added to a class
 * @param {DraftTFClass} draftTFClass
 * @returns {string[]} An array of the added players SteamIDs as strings
 */
export const getAllPlayersDraftTFClass = (draftTFClass: DraftTFClass): string[] => {
  return draftTFClassLists.get(draftTFClass);
};
