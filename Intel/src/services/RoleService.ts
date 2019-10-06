import PlayerService from './PlayerService';
import PlayerRoleViewModel from '../../../Common/ViewModels/PlayerRoleViewModel';

export default class RoleService {
	private readonly playerService = new PlayerService();

	async getPlayersByAlias(alias: string): Promise<PlayerRoleViewModel[]> {
		const players = await this.playerService.getPlayersByPartialAlias(alias);
		const viewmodels = players.map(x => PlayerRoleViewModel.fromPlayer(x));
		return viewmodels;
	}
}
