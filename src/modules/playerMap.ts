import { store }  from '../server';
import { player } from '../structures/player';

/**
 * @module playerMap
 * A module that enables the retrieval, setting and deletion of a {@Link player}
 * in a collection referenced by their SteamID
 */

export const players = new Map<string, string>();

/**
 * Retrieves a session ID from the map using a class.
 * @param {string} steamid - The player to retrieve.
 * @returns {string} - The player that was found, or false if not any.
 */
export const getPlayer = async(steamid: string) => {
  if (!players.has(steamid)) {
    throw new Error(`Player (${steamid}) was requested from the player map but was not found`);
  }
  const sessionid = players.get(steamid);
  store.get(sessionid, (session, err) => {
    if (err) {
	  throw err;
    }
    return session;
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
  const playersArr = Array.from(players.keys());
  const newPlayerArr: player[] = [];
  playersArr.map(session => store.get(session, (err, session): void => {
    newPlayerArr.push(session.user);
  	},
  ));
  return newPlayerArr;
};
