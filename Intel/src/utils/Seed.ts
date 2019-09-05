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

const SeedPlayers = async () => {
	const playerRepo = new LinqRepository(Player);

	const player = new Player();
	player.steamid = '76561198119135809';
	player.alias = 'Gabe';
	player.avatarUrl = 'n/a';
	player.ip = '127.0.0.1';

	await playerRepo.create(player);
};

const SeedMatches = async () => {
	const playerService = new PlayerService();
	const matchRepository = new LinqRepository(Match);

	const player = await playerService.getPlayer('76561198119135809');

	for (let i = 0; i < 100; i++) {
		const gamemodeClassScheme = GamemodeClassSchemes.get(Gamemode.Highlander);

		// @ts-ignore
		const matchPlayerData: MatchPlayerData = {
			tf2class: gamemodeClassScheme[Math.floor(Math.random() * 9)].tf2class,
			team: Math.floor(Math.random() * 2) === 1 ? Team.RED : Team.BLU,
			wasCaptain: Math.floor(Math.random() * 2) === 1,
			player,
		};

		// @ts-ignore
		const match: Match = {
			date: new Date(),
			map: 'koth_ashville_rc1',
			matchPlayerData: [matchPlayerData],
			players: [player],
			matchType: MatchType.PUG,
			winningTeam:
				Math.random() > 0.5
					? Team.BLU
					: Math.random() > 0.5
						? Team.RED
						: Team.NONE,
			logsId: 12345867,
			region: Region.NorthAmerica,
			gamemode: Gamemode.Highlander
		};

		await matchRepository.create(match);
	}
};

const Seed = async () => {
	consoleLogStatus('SEEDING LOCAL DATABASE');
	await SeedPlayers();
	await SeedMatches();
};

export default Seed;
