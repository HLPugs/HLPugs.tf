import store from '../modules/store';
import Player from '../entities/Player';
import SteamID from '../../../Common/Types/SteamID';
import SessionID from '../../../Common/Types/SessionID';
import PlayerNotFoundError from '../custom-errors/PlayerNotFoundError';

/**
 * A service that provides methods for the retrieval, insertion
 * and deletion of a Player entity in an in-memory collection
 * referenced by their SteamID
 */

class SessionService {
	private static playerSessionMap = new Map<SteamID, SessionID>();
	/**
	 * Adds or updates a session ID in the Player map.
	 * @param {SessionID} sessionId - The Player's sessionId to add (or update if existing).
	 * @param {SteamID} steamid - The SteamID that references the session ID.
	 */

	upsertPlayer(steamid: SteamID, sessionId: SessionID) {
		SessionService.playerSessionMap.set(steamid, sessionId);
	}

	playerExists(steamid: SteamID): boolean {
		return SessionService.playerSessionMap.has(steamid);
	}

	/**
	 * Retrieves a session ID from the map using a SteamID.
	 * @param {string} steamid - The Player to retrieve.
	 */
	getPlayer(steamid: SteamID): Promise<Player> {
		return new Promise((resolve, reject) => {
			if (SessionService.playerSessionMap.has(steamid)) {
				const sessionId = SessionService.playerSessionMap.get(steamid);
				store.get(sessionId, (err, session) => {
					if (err) throw new Error(err);
					if (!session) {
						reject(new PlayerNotFoundError(steamid));
					} else {
						resolve(session.player);
					}
				});
			} else {
				resolve();
			}
		});
	}

	getPlayerCount(): number {
		return SessionService.playerSessionMap.values.length;
	}

	async updatePlayer(player: Player) {
		if (this.playerExists(player.steamid)) {
			const sessionId = SessionService.playerSessionMap.get(player.steamid);
			this.upsertPlayer(player.steamid, sessionId);
		}
	}

	/**
	 * Returns all logged in players
	 */
	async getAllPlayers(): Promise<Player[]> {
		return new Promise(resolve => {
			const playersArr = Array.from(SessionService.playerSessionMap.keys());
			const newPlayerArr = playersArr.map(steamid => this.getPlayer(steamid));
			resolve(Promise.all(newPlayerArr));
		});
	}

	/**
	 * Removes a player from the session
	 * @param {SteamID} steamid - The SteamID to remove.
	 */
	removePlayer(steamid: SteamID) {
		SessionService.playerSessionMap.delete(steamid);
	}
	/**
	 * Removes all sessions
	 */
	clearSessions() {
		SessionService.playerSessionMap.clear();
	}
}

export default SessionService;
