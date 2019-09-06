import Player from '../entities/Player';
import { LinqRepository } from 'typeorm-linq-repository';
import { consoleLogStatus } from './ConsoleColors';

const SeedPlayers = async () => {
	const playerRepository = new LinqRepository(Player);

	const player = new Player();
	player.steamid = '76561198119135809';
	player.alias = 'Gabe';
	player.avatarUrl =
		'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ba/bae002cf4909ff02182fccb3cefef10e3fdb8e8f_full.jpg';
	player.ip = '127.0.0.1';

	await playerRepository.create(player);
};

const Seed = async () => {
	consoleLogStatus('SEEDING OFFLINE DATA');
	await SeedPlayers();
};

export default Seed;
