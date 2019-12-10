import PlayerService from './PlayerService';
import PlayerRoleViewModel from '../../../Common/ViewModels/PlayerRoleViewModel';
import Player from '../../../Common/Models/Player';

export default class RoleService {
	private readonly playerService = new PlayerService();

	async getPlayersByAlias(alias: string): Promise<PlayerRoleViewModel[]> {
		const players = await this.playerService.getPlayersByPartialAlias(alias);
		const viewmodels = players.map(player => Player.toPlayerRoleViewModel(player));
		return viewmodels;
	}
}
