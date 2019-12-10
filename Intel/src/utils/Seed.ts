import { LinqRepository } from 'typeorm-linq-repository';
import MatchEntity from '../entities/MatchEntity';
import PlayerService from '../services/PlayerService';
import MatchType from '../../../Common/Enums/MatchType';
import Team from '../../../Common/Enums/Team';
import MatchPlayerDataEntity from '../entities/MatchPlayerData';
import { consoleLogStatus } from './ConsoleColors';
import Region from '../../../Common/Enums/Region';
import Gamemode from '../../../Common/Enums/Gamemode';
import GamemodeClassSchemes from '../../../Common/Constants/GamemodeClassSchemes';
import { createConnection, getManager } from 'typeorm';
import AnnouncementEntity from '../entities/AnnouncementEntity';
import SessionService from '../services/SessionService';
import DebugService from '../services/DebugService';
import PlayerSettingsEntity from '../entities/PlayerSettingsEntity';
import PunishmentEntity from '../entities/PunishmentEntity';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import FAKE_OFFLINE_STEAMID from '../../../Common/Constants/FakeOfflineSteamid';
import PlayerEntity from '../entities/PlayerEntity';

const SeedPlayers = async () => {
	consoleLogStatus('SEEDING PLAYERS');
	const playerRepository = new LinqRepository(PlayerEntity);

	const player = new PlayerEntity();
	player.steamid = FAKE_OFFLINE_STEAMID;
	player.alias = 'Gabe';
	player.avatarUrl = DebugService.DEFAULT_STEAM_AVATAR;
	player.ip = '127.0.0.1';
	player.settings = new PlayerSettingsEntity();

	await playerRepository.create(player);
};

const SeedAnnouncements = async () => {
	consoleLogStatus('SEEDING ANNOUNCEMENTS');

	const announcementRepository = new LinqRepository(AnnouncementEntity);
	for (let i = 1; i <= 10; i++) {
		const announcement = {
			creatorSteamid: FAKE_OFFLINE_STEAMID,
			messageContent: 'Test Announcement #' + i,
			order: i,
			priority: false,
			region: Region.NorthAmerica,
			timestamp: new Date()
		} as AnnouncementEntity;

		await announcementRepository.create(announcement);
	}
};

const SeedMatches = async () => {
	consoleLogStatus('SEEDING MATCHES');

	const playerService = new PlayerService();
	const matchRepository = new LinqRepository(MatchEntity);

	const player = await PlayerEntity.getBySteamID(FAKE_OFFLINE_STEAMID);

	const gamemodeClassScheme = GamemodeClassSchemes.get(Gamemode.Highlander);

	for (let i = 0; i < 100; i++) {
		const matchPlayerData: MatchPlayerDataEntity = {
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
		} as MatchEntity;

		await matchRepository.create(match);
	}
};

const SeedPunishments = async () => {
	consoleLogStatus('SEEDING PUNISHMENTS');
	const playerRepository = new LinqRepository(PlayerEntity);
	const punishmentRepository = new LinqRepository(PunishmentEntity);
	const punishment = new PunishmentEntity();
	punishment.creationDate = new Date();
	punishment.expirationDate = new Date(new Date().valueOf() + 999999999);
	punishment.reason = 'You did something stupid';
	const player = await playerRepository
		.getOne()
		.where(p => p.steamid)
		.equal(FAKE_OFFLINE_STEAMID);
	punishment.offender = player;
	punishment.author = player;
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
