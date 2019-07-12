import * as config                        from 'config';
import logger                             from './logger';
import * as crypto                        from 'crypto';
import * as uuid                          from 'uuid';
import { DraftTFClass, DraftTFClassList } from '../structures/DraftClassList';
import { Player }                         from '../structures/Player';
import { store }                          from './store';

/**
 * @module playerMap
 * A module that enables the retrieval, setting and deletion of a {@link Player}
 * in a collection referenced by their SteamID
 */

// this collection maps a SteamID to a session ID
const players = new Map<string, string>();

const draftTFClassLists = new Map<DraftTFClass, string[]>();

const draftTFClasses: DraftTFClassList[] = config.get('app.configuration.classes');

// Empty out every class in the draft class list
draftTFClasses.forEach(draftTFClass => draftTFClassLists.set(draftTFClass.name, []));

/**
 * Retrieves a session ID from the map using a SteamID.
 * @param {string} steamid - The Player to retrieve.
 * @returns {Promise<Player>} - The {@Link Player}.
 */
export const getPlayer = (steamid: string): Promise<Player> => {
  return new Promise((resolve) => {
    if (!players.has(steamid)) {
      logger.warn(`Player (${steamid}) was requested from the player map but was not found`);
    }
    const sessionid = players.get(steamid);
    store.get(sessionid, (err, session) => {
      if (err) throw err;
      /* When a class is put in a memory store, it is stripped of its methods.
         An instance variable is created to gain access to Player's methods*/
      const player = Player.createPlayer(session.user);
      session ? resolve(player) : resolve(null);
    });
  });
};

/**
 * Adds or updates a session ID in the Player map.
 * @param {string} sessionid - The Player's sessionid to add (or update if existing).
 * @param {string} steamid - The SteamID that references the session ID.
 */
export const addPlayer = (sessionid: string, steamid: string) => players.set(steamid, sessionid);

/**
 *  Adds a fake session to the Player map. ( FOR DEBUGGING USE ONLY )
 * @param {string} steamid - The fake SteamID to add
 * @param {string} alias - The site alias of the player
 * @return {Promise<void>} - Resolves once the Player is successfully added
 */

export function addFakePlayer(steamid: string, alias?: string): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    return new Promise(((resolve, reject) => {
      const fakeSess = {
        cookie: {
          expires: '2000000000',
          originalMaxAge: 999999999,
        },
      };
      const fakeRequest = {
        sessionID: crypto.createHash('sha256')
          .update(uuid.v1())
          .update(crypto.randomBytes(256))
          .digest('hex'),
      };

    // @ts-ignore
      const fakeSession = store.createSession(fakeRequest, fakeSess);
      fakeSession.user = new Player(steamid, '',  alias);
      store.set(fakeSession.id, fakeSession, (err) => {
        if (err) reject(err);
        addPlayer(fakeSession.id, steamid);
        resolve();
      });
    }));
  }
}

/**
 * Removes a Player from the Player map
 * @param {string} steamid - The SteamID to remove.
*/
export const removePlayer = (steamid: string) => players.delete(steamid);

/**
 * Removes all players from the map
 */
export const removeAllPlayers = () => players.clear();

/**
 * Returns all players as an array of {@Link Player}'s
 */
export const getAllPlayers = () => {
  return new Promise(async (resolve) => {
    const playersArr = Array.from(players.keys());
    const newPlayerArr = playersArr.map(steamid => getPlayer(steamid));
    resolve(Promise.all(newPlayerArr));
  });
};

/**
 * Adds a Player to a class
 * @param {string} steamid - The SteamID of the Player to add
 * @param {string} draftTFClass - The class to be added on
 */
export const addPlayerDraftTFClass = async (steamid: string, draftTFClass: DraftTFClass) => {
  // Ensure Player isn't already added up to the class
  if (draftTFClassLists.get(draftTFClass).indexOf(steamid) === -1) {
    draftTFClassLists.get(draftTFClass).push(steamid);
    const player: Player = await getPlayer(steamid);
    logger.info(`${player.alias} added to ${draftTFClass}!`);
  }
};

/**
 * Removes a Player from a class
 * @param {string} steamid - The SteamID of the Player to remove
 * @param {string} draftTFClass - The class to be removed from
 */
export const removePlayerDraftTFClass = async (steamid: string, draftTFClass: DraftTFClass) => {
  const indexOfPlayer = draftTFClassLists
    .get(draftTFClass)
    .indexOf(steamid);

  if (indexOfPlayer >= 0) {
    draftTFClassLists
    .get(draftTFClass)
    .splice(indexOfPlayer, 1);

    const player: Player = await getPlayer(steamid);
    logger.info(`${player.alias} removed from ${draftTFClass}`);
  }
};

/**
 * Removes a Player from all classes
 * @param {string} steamid - The SteamID of the Player to be removed from all classes
 */
export const removePlayerAllDraftTFClasses = (steamid: string) => {
  draftTFClasses.forEach(draftTFClassList => removePlayerDraftTFClass(steamid, draftTFClassList.name));
};

/**
 * Returns every Player added to a class
 * @param {DraftTFClass} draftTFClass
 * @returns {string[]} An array of the added players SteamIDs as strings
 */
export const getAllPlayersDraftTFClass = (draftTFClass: DraftTFClass): string[] => {
  return draftTFClassLists.get(draftTFClass);
};
