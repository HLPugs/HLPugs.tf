import Player from '../entities/Player';
import { LinqRepository } from 'typeorm-linq-repository';

const SeedPlayers = async () => {
	const playerRepo = new LinqRepository(Player);
	const player = new Player();
	player.steamid = '76561198119135809';
	player.alias = 'Gabe';
	player.avatarUrl = 'n/a';
	player.ip = '127.0.0.1';


	await playerRepo
		.createQueryBuilder('players')
		.delete()
		.execute();

	await playerRepo
		.create(player);
};

const Seed = () => {
	SeedPlayers();
};

export default Seed;