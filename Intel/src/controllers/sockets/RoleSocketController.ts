import { Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import FindPlayerByAliasRequest from '../../../../Common/Requests/FindPlayerByAliasRequest';
import UpdatePlayerRoleRequest from '../../../../Common/Requests/UpdatePlayerRoleRequest';
import RoleService from '../../services/RoleService';
import ValidateClass from '../../utils/ValidateClass';

@SocketController()
export default class RoleSocketController {
	private readonly roleService = new RoleService();

	@OnMessage('findPlayerByAlias')
	async findPlayerByAlias(@ConnectedSocket() socket: Socket, @MessageBody() payload: FindPlayerByAliasRequest) {
		ValidateClass(payload);
		const viewmodels = await this.roleService.getPlayersByAlias(payload.alias);
		socket.emit('findPlayerByAlias', viewmodels);
	}

	@OnMessage('updatePlayerRole')
	updatePlayerRole(@ConnectedSocket() socket: Socket, @MessageBody() payload: UpdatePlayerRoleRequest) {
		ValidateClass(payload);
		socket.emit('updatePlayerRole');
	}
}
