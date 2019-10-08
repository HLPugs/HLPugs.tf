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
import PlayerSettings from '../entities/PlayerSettings';
import Punishment from '../entities/Punishment';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import FAKE_OFFLINE_STEAMID from '../../../Common/Constants/FakeOfflineSteamid';

const SeedPlayers = async () => {
	consoleLogStatus('SEEDING PLAYERS');
	const playerRepository = new LinqRepository(Player);

	const player = new Player();
	player.steamid = FAKE_OFFLINE_STEAMID;
	player.alias = 'Gabe';
	player.avatarUrl = DebugService.DEFAULT_STEAM_AVATAR;
	player.ip = '127.0.0.1';
	player.settings = new PlayerSettings();

	await playerRepository.create(player);
};

const SeedAnnouncements = async () => {
	consoleLogStatus('SEEDING ANNOUNCEMENTS');

	const announcementRepository = new LinqRepository(Announcement);
	for (let i = 1; i <= 10; i++) {
		const announcement = {
			creatorSteamid: FAKE_OFFLINE_STEAMID,
			messageContent: 'Test Announcement #' + i,
			order: i,
			priority: false,
			region: Region.NorthAmerica,
			timestamp: new Date()
		} as Announcement;

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

		const match = {
			date: new Date(),
			map: 'koth_ashville_rc1',
			matchPlayerData: [matchPlayerData],
			players: [player],
			matchType: Math.random() > 0.5 ? MatchType.PUG : MatchType.MIX,
			winningTeam: Math.random() > 0.5 ? Team.BLU : Math.random() > 0.5 ? Team.RED : Team.NONE,
			logsId: 12345867,
			region: Math.random() > 0.5 ? Region.NorthAmerica : Region.Europe,
			gamemode: Gamemode.Highlander
		} as Match;

		await matchRepository.create(match);
	}
};

const SeedPunishments = async () => {
	consoleLogStatus('SEEDING PUNISHMENTS');
	const playerRepository = new LinqRepository(Player);
	const punishmentRepository = new LinqRepository(Punishment);
	const punishment = new Punishment();
	punishment.creationDate = new Date();
	punishment.expirationDate = new Date(new Date().valueOf() + 999999999);
	punishment.reason = 'You did something stupid';
	const player = await playerRepository
		.getOne()
		.where(p => p.steamid)
		.equal(FAKE_OFFLINE_STEAMID);
	punishment.offender = player;
	punishment.creator = player;
	punishment.punishmentType = PunishmentType.BAN;
	punishment.lastModifiedDate = new Date();
	await punishmentRepository.create(punishment);
};

const Seed = async () => {
	await SeedPlayers();
	await SeedPunishments();
};

createConnection().then(async () => {
	await Seed();
});
