import { Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket, SocketRooms } from 'socket-controllers';
import FindPlayerByAliasRequest from '../../../../Common/Requests/FindPlayerByAliasRequest';
import UpdatePlayerRolesRequest from '../../../../Common/Requests/UpdatePlayerRoleRequest';
import RoleService from '../../services/RoleService';
import ValidateClass from '../../utils/ValidateClass';
import PlayerEvents from '../../events/PlayerEvents';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';

@SocketController()
export default class RoleSocketController {
	private readonly playerEvents = new PlayerEvents();

	private readonly roleService = new RoleService();

	@OnMessage('findPlayerByAlias')
	async findPlayerByAlias(@ConnectedSocket() socket: Socket, @MessageBody() payload: FindPlayerByAliasRequest) {
		ValidateClass(payload);
		const viewmodels = await this.roleService.getPlayersByAlias(payload.alias);
		socket.emit('findPlayerByAlias', viewmodels);
	}

	@OnMessage('updatePlayerRoles')
	async updatePlayerRoles(
		@ConnectedSocket() socket: SocketWithPlayer,
		@MessageBody() payload: UpdatePlayerRolesRequest
	) {
		ValidateClass(payload);
		const { steamid } = socket.request.session.player;
		await this.playerEvents.updateRoles(steamid, payload.roles);
		await this.playerEvents.updatePermissionGroup(steamid, payload.permissionGroup);
	}
}
