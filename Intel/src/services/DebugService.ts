import SessionService from './SessionService';
import store from '../modules/store';

import SteamID from '../../../Common/Types/SteamID';
import SessionID from '../../../Common/Types/SessionID';
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import Player from '../entities/Player';
import PlayerService from './PlayerService';
import PlayerSettings from '../entities/PlayerSettings';

export default class DebugService {
	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();
	static DEFAULT_STEAM_AVATAR =
		'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
	/**
	 *  Adds a fake session to the player session map. ( FOR DEBUGGING USE ONLY )
	 * @param {string} steamid - The fake SteamID to add
	 * @param {string} alias - The site alias of the player
	 * @return {Promise<void>} - Resolves once the Player is successfully added
	 */

	async addFakePlayer(steamid?: SteamID, sessionId?: SessionID): Promise<Player> {
		if (process.env.NODE_ENV !== 'production') {
			return new Promise(async (resolve, reject) => {
				const fakeSess = {
					cookie: {
						expires: '2000000000',
						originalMaxAge: 999999999
					}
				};
				const fakeRequest = {
					sessionID: sessionId
						? sessionId
						: crypto
								.createHash('sha256')
								.update(uuid.v1())
								.update(crypto.randomBytes(256))
								.digest('hex')
				};

				const fakePlayerCount = this.sessionService.getPlayerCount();

				// @ts-ignore
				const fakeSession = store.createSession(fakeRequest, fakeSess);
				const fakePlayer = new Player();
				fakePlayer.steamid = steamid ? steamid : fakePlayerCount.toString();
				fakePlayer.alias = `FakePlayer${fakePlayerCount + 1}`;
				fakePlayer.avatarUrl = DebugService.DEFAULT_STEAM_AVATAR;
				fakePlayer.ip = '127.0.0.1';
				fakePlayer.settings = new PlayerSettings();
				await this.playerService.upsertPlayer(fakePlayer);
				fakeSession.player = await this.playerService.getPlayer(fakePlayer.steamid);
				store.set(sessionId ? sessionId : fakeSession.id, fakeSession, async err => {
					if (err) reject(err);
					this.sessionService.associateSteamidWithSessionid(fakePlayer.steamid, fakeSession.id);
					resolve(fakePlayer);
				});
			});
		}
	}
}
