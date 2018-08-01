import { store }  from '../server';
import { player } from '../structures/player';
import * as config from 'config';
import { resolve } from 'url';

/**
 * @module playerMap
 * A module that enables the retrieval, setting and deletion of a {@Link player}
 * in a collection referenced by their SteamID
 */

const players = new Map<string, string>();

/**
 * Retrieves a session ID from the map using a class.
 * @param {string} steamid - The player to retrieve.
 * @returns {string} - The player that was found, or false if not any.
 */
export const getPlayer = (steamid: string) => {
  return new Promise((resolve) => {
    if (!players.has(steamid)) {
      throw new Error(`Player (${steamid}) was requested from the player map but was not found`);
    }
    const sessionid = players.get(steamid);
    store.get(sessionid, (err, session) => {
      if (err) {
        throw err;
      }

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

// Begin TFClass items

interface TfClassLists {
  [prop: string]: string[];
}

interface TfClass {
  name: string;
  amountPerTeam: number;
}

const tfClassLists: TfClassLists = {};

const tfClasses: TfClass[] = config.get('app.configuration.classes');

for (const tfClass of tfClasses) {
  tfClassLists[tfClass.name] = [];
}

export const addPlayerTfClass = (steamid: string, tfClass: string) => {
  if (tfClassLists[tfClass].indexOf(steamid) === -1) {
    tfClassLists[tfClass].push(steamid);
  }
};

export const removePlayerTfClass = (steamid: string, tfClass: string) => {
  const indexOfPlayer = tfClassLists[tfClass].indexOf(steamid);

  if (indexOfPlayer >= 0) {
    tfClassLists[tfClass].splice(indexOfPlayer, 1);
  }
};

export const removePlayerAllTfClasses = (steamid: string) => {
  for (const tfClass of tfClasses) {
    removePlayerTfClass(steamid, tfClass.name);
  }
};

export const getAllPlayersTfClass = (tfClass: string) => {
  return tfClassLists[tfClass];
};
