// import logger from './logger';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import store from '../modules/store';
import Player from '../entities/Player';
import PlayerNotFoundError from '../custom-errors/PlayerNotFoundError';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { SiteConfiguration } from '../constants/SiteConfiguration';


// this collection maps a SteamID to a session ID
const PlayerSessionMap = new Map<string, string>();

/**
 * A service that provides methods for the retrieval, insertion
 * and deletion of a Player entity in an in-memory collection
 * referenced by their SteamID
 */

class SessionService {
    /**
     * Adds or updates a session ID in the Player map.
     * @param {string} sessionId - The Player's sessionId to add (or update if existing).
     * @param {string} steamid - The SteamID that references the session ID.
     */
    addPlayer(sessionId: string, steamid: string) {
        PlayerSessionMap.set(steamid, sessionId)
    }

    /**
     * Retrieves a session ID from the map using a SteamID.
     * @param {string} steamid - The Player to retrieve.
     */
    getPlayer(steamid: string): Promise<Player> {
        return new Promise((resolve, reject) => {
            if (!PlayerSessionMap.has(steamid)) {
                throw new PlayerNotFoundError(steamid);
            } else {
                const sessionId = PlayerSessionMap.get(steamid);
                store.get(sessionId, (err, session) => {
                    if (err) throw err;
                    if (!session.player) {
                        reject(new PlayerNotFoundError(steamid));
                    } else {
                        resolve(session.player);
                    }
                })
            }
        })
    }

    /**
 * Returns all logged in players
 */
    async getAllPlayers(): Promise<Player[]> {
        return new Promise(resolve => {
            const playersArr = Array.from(PlayerSessionMap.keys());
            const newPlayerArr = playersArr.map(steamid => this.getPlayer(steamid));
            resolve(Promise.all(newPlayerArr));
        })
    };

    /**
     * Removes a Player from the Player map
     * @param {string} steamid - The SteamID to remove.
     */
    removePlayer(steamid: string) {
        PlayerSessionMap.delete(steamid);
    }
    /**
     * Removes all players from the map
     */
    removeAllPlayers() {
        PlayerSessionMap.clear();
    }

    /**
     *  Adds a fake session to the Player map. ( FOR DEBUGGING USE ONLY )
     * @param {string} steamid - The fake SteamID to add
     * @param {string} alias - The site alias of the player
     * @return {Promise<void>} - Resolves once the Player is successfully added
     */

    addFakePlayer(steamid: string, alias?: string): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            return new Promise((resolve, reject) => {
                const fakeSess = {
                    cookie: {
                        expires: '2000000000',
                        originalMaxAge: 999999999
                    }
                };
                const fakeRequest = {
                    sessionID: crypto
                        .createHash('sha256')
                        .update(uuid.v1())
                        .update(crypto.randomBytes(256))
                        .digest('hex')
                };

                // @ts-ignore
                const fakeSession = store.createSession(fakeRequest, fakeSess);
                const fakePlayer = new Player();
                fakePlayer.steamid = steamid;
                fakePlayer.alias = '';
                fakeSession.user = fakePlayer;
                store.set(fakeSession.id, fakeSession, err => {
                    if (err) reject(err);
                    this.addPlayer(fakeSession.id, steamid);
                    resolve();
                });
            });
        }
    }
}

export default SessionService;
