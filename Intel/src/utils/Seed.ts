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
import { createConnection, getManager } from 'typeorm';
import Announcement from '../entities/Announcement';
import SessionService from '../services/SessionService';
import DebugService from '../services/DebugService';
import { playerService, debugService } from '../services';

const SeedPlayers = async () => {
	consoleLogStatus('SEEDING PLAYERS');
	const playerRepository = new LinqRepository(Player);

	const player = new Player();
	player.steamid = DebugService.FAKE_OFFLINE_STEAMID;
	player.alias = 'Gabe';
	player.avatarUrl = DebugService.DEFAULT_STEAM_AVATAR;
	player.ip = '127.0.0.1';

	debugService.addFakePlayer(DebugService.FAKE_OFFLINE_STEAMID);
	await playerRepository.create(player);
};

const SeedAnnouncements = async () => {
	consoleLogStatus('SEEDING ANNOUNCEMENTS');

	const announcementRepository = new LinqRepository(Announcement);
	for (let i = 1; i <= 10; i++) {
		const announcement: Announcement = {
			creatorSteamid: DebugService.FAKE_OFFLINE_STEAMID,
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

	const matchRepository = new LinqRepository(Match);

	const player = await playerService.getPlayer(DebugService.FAKE_OFFLINE_STEAMID);

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

const t = getManager();
const Seed = async () => {
	await SeedAnnouncements();
	// await SeedPlayers();
	// await SeedMatches();
};

Seed();
