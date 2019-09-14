import Player from '../entities/Player';
import { LinqRepository } from 'typeorm-linq-repository';
import Match from '../entities/Match';
import PlayerService from '../services/PlayerService';
import MatchType from '../../../Common/Enums/MatchType';
import Team from '../../../Common/Enums/Team';
import MatchPlayerData from '../entities/MatchPlayerData';
import { consoleLogStatus } from './ConsoleColors';
import Region from '../../../Common/Enums/Region';
import Gamemode from '../../../Common/Enums/Gamemode';
import GamemodeClassSchemes from '../../../Common/Constants/GamemodeClassSchemes';
import { createConnection } from 'typeorm';
import Announcement from '../entities/Announcement';
import SessionService from '../services/SessionService';

export const FAKE_OFFLINE_STEAMID = '76561198119135809';
export const DEFAULT_STEAM_AVATAR =
	'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';

const SeedPlayers = async () => {
	const sessionService = new SessionService();
	consoleLogStatus('SEEDING PLAYERS');
	const playerRepository = new LinqRepository(Player);

	const player = new Player();
	player.steamid = FAKE_OFFLINE_STEAMID;
	player.alias = 'Gabe';
	player.avatarUrl = DEFAULT_STEAM_AVATAR;
	player.ip = '127.0.0.1';

	sessionService.addFakePlayer(FAKE_OFFLINE_STEAMID);
	await playerRepository.create(player);
};

const SeedAnnouncements = async () => {
	consoleLogStatus('SEEDING ANNOUNCEMENTS');

	const announcementRepository = new LinqRepository(Announcement);
	for (let i = 1; i <= 10; i++) {
		const announcement: Announcement = {
			creatorSteamid: FAKE_OFFLINE_STEAMID,
			messageContent: 'Test Announcement #' + i,
			order: i,
			priority: false,
			region: Region.NorthAmerica,
			timestamp: new Date()
		};

		await announcementRepository.create(announcement);
	}
};

const SeedMatches = async () => {
	consoleLogStatus('SEEDING MATCHES');

	const playerService = new PlayerService();
	const matchRepository = new LinqRepository(Match);

	const player = await playerService.getPlayer(FAKE_OFFLINE_STEAMID);

	const gamemodeClassScheme = GamemodeClassSchemes.get(Gamemode.Highlander);

	for (let i = 0; i < 100; i++) {
		const matchPlayerData: MatchPlayerData = {
			tf2class: gamemodeClassScheme[Math.floor(Math.random() * 9)].tf2class,
			team: Math.floor(Math.random() * 2) === 1 ? Team.RED : Team.BLU,
			wasCaptain: Math.floor(Math.random() * 2) === 1,
			player
		};

		const match: Match = {
			date: new Date(),
			map: 'koth_ashville_rc1',
			matchPlayerData: [matchPlayerData],
			players: [player],
			matchType: Math.random() > 0.5 ? MatchType.PUG : MatchType.MIX,
			winningTeam: Math.random() > 0.5 ? Team.BLU : Math.random() > 0.5 ? Team.RED : Team.NONE,
			logsId: 12345867,
			region: Math.random() > 0.5 ? Region.NorthAmerica : Region.Europe,
			gamemode: Gamemode.Highlander
		};

		await matchRepository.create(match);
	}
};

const Seed = async () => {
	await SeedAnnouncements();
	await SeedPlayers();
	await SeedMatches();
};

createConnection()
	.then(async () => {
		await Seed();
	})
	.then(() => {
		consoleLogStatus('Finished seeding database');
	});
