import Player from '../entities/Player';
import { LinqRepository } from 'typeorm-linq-repository';
import { consoleLogStatus } from './ConsoleColors';

const SeedPlayers = async () => {
	const playerRepo = new LinqRepository(Player);

	const player = new Player();
	player.steamid = '76561198119135809';
	player.alias = 'Gabe';
	player.avatarUrl = 'n/a';
	player.ip = '127.0.0.1';

	await playerRepo.create(player);
};

const Seed = async () => {
	consoleLogStatus('SEEDING OFFLINE DATA');
	await SeedPlayers();
};

export default Seed;
