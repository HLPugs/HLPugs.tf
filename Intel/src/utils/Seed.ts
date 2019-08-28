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
import GamemodeSchemes from '../../../Common/Constants/GamemodeSchemes';

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
	const matchRepo = new LinqRepository(Match);

	const player = await playerService.getPlayer('76561198119135809');

	for (let i = 0; i < 50; i++) {
		const match = new Match();
		match.map = 'koth_ashville_rc1';
		const matchPlayerData = new MatchPlayerData();
		const gamemodeClassScheme = GamemodeSchemes.get(Gamemode.Highlander);
		const randClass = Math.floor(Math.random() * 9);
		matchPlayerData.tf2class = gamemodeClassScheme[randClass].tf2class;
		matchPlayerData.player = player;
		matchPlayerData.team = Team.RED;
		matchPlayerData.wasCaptain = true;
		match.matchPlayerData = [matchPlayerData];
		match.players = [player];
		match.matchType = MatchType.PUG;
		match.winningTeam =
			Math.random() > 0.5
				? Team.BLU
				: Math.random() > 0.5
				? Team.RED
				: Team.NONE;
		match.logsId = 12345867;
		match.region = Region.NorthAmerica;
		match.gamemode = Gamemode.Highlander;

		await matchRepo.create(match);
	}
};

const Seed = async () => {
	consoleLogStatus('SEEDING LOCAL DATABASE');
	await SeedPlayers();
	await SeedMatches();
};

export default Seed;
