import Player from '../entities/Player';
import { LinqRepository } from 'typeorm-linq-repository';
import Match from '../entities/Match';
import PlayerService from '../services/PlayerService';
import MatchType from '../../../Common/Enums/MatchType';
import Team from '../../../Common/Enums/Team';
import MatchPlayerData from '../entities/MatchPlayerData';
import { consoleLogStatus } from './ConsoleColors';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import Region from '../../../Common/Enums/Region';
import Gamemode from '../../../Common/Enums/Gamemode';

const SeedPlayers = async () => {
	const playerRepo = new LinqRepository(Player);

	const player = new Player();
	player.steamid = '76561198119135809';
	player.alias = 'Gabe';
	player.avatarUrl = 'n/a';
	player.ip = '127.0.0.1';

	await playerRepo
		.create(player);
};

const SeedMatches = async () => {
	const playerService = new PlayerService();
	const matchRepo = new LinqRepository(Match);

	const player = await playerService.getPlayer('76561198119135809');
	const player2 = await playerService
	
	for (let i = 0; i < 50; i++) {
		const match = new Match();
		match.map = 'koth_ashville_rc1';
		const matchPlayerData = new MatchPlayerData();
		matchPlayerData.tf2class = (Math.random()*100) > 50 ? DraftTFClass.SOLDIER : DraftTFClass.DEMOMAN;
		matchPlayerData.player = player;
		matchPlayerData.team = Team.RED;
		match.matchPlayerData = [matchPlayerData];
		match.players = [player];
		match.matchType = MatchType.PUG;
		match.winningTeam = Team.BLU;
		match.region = Region.NorthAmerica;
		match.gamemode = Gamemode.Highlander;

		await matchRepo
			.create(match);
	}
}

const clearDatabase = async () => {
	const playerRepo = new LinqRepository(Player);
	const matchRepo = new LinqRepository(Match);

	await playerRepo
		.createQueryBuilder('players')
		.delete()
		.execute();

	await matchRepo
		.createQueryBuilder('matches')
		.delete()
		.execute();
}

const Seed = async () => {
	consoleLogStatus('SEEDING LOCAL DATABASE');
	await clearDatabase();
	await SeedPlayers();
	await SeedMatches();
};

export default Seed;