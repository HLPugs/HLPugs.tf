import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket, SocketRequest } from 'socket-controllers';
import ValidateClass from '../../utils/ValidateClass';
import DebugService from '../../services/DebugService';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { SiteConfiguration } from '../../constants/SiteConfiguration';
import FakeLogoutRequest from '../../../../Common/Requests/FakeLogoutRequest';
import FakeAddPlayerToDraftTFClassRequest from '../../../../Common/Requests/FakeAddPlayerToDraftTFClassRequest';
import FakeRemovePlayerFromDraftTFClassRequest from '../../../../Common/Requests/FakeRemovePlayerFromDraftTFClassRequest';
import { playerService, debugService, sessionService, draftService } from '../../services';

@SocketController()
export default class DebugSocketController {

	@OnMessage('fakeLogin')
	async fakeLogin(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
		if (process.env.NODE_ENV === 'dev') {
			if (sessionService.playerExists(DebugService.FAKE_OFFLINE_STEAMID)) {
				await debugService.addFakePlayer(DebugService.FAKE_OFFLINE_STEAMID, socket.request.sessionID);
				const player = await playerService.getPlayer(DebugService.FAKE_OFFLINE_STEAMID);
				socket.request.session.player = player;
				socket.request.session.save();
				const playerViewModel = PlayerViewModel.fromPlayer(player);
				socket.emit('updateCurrentPlayer', playerViewModel);
			} else {
				await debugService.addFakePlayer(DebugService.FAKE_OFFLINE_STEAMID, socket.request.sessionID);
				const player = await playerService.getPlayer(DebugService.FAKE_OFFLINE_STEAMID);
				socket.request.session.player = player;
				socket.request.session.save();
				const playerViewModel = PlayerViewModel.fromPlayer(player);
				socket.emit('updateCurrentPlayer', playerViewModel);
				io.emit('addPlayerToSession', playerViewModel);
			}
		}
	}

	@OnMessage('fakeLogout')
	async fakeLogout(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @MessageBody() body: FakeLogoutRequest) {
		if (process.env.NODE_ENV === 'dev') {
			ValidateClass(body);
			SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
				io.emit('removePlayerFromDraftTFClass', scheme.tf2class, body.steamid);
			});

			sessionService.removePlayer(body.steamid);
			io.emit('removePlayerFromSession', body.steamid);

			const playerViewModel = PlayerViewModel.fromPlayer(await playerService.getPlayer(body.steamid));
			socket.emit('updateCurrentPlayer', ValidateClass(playerViewModel));
			draftService.removePlayerFromAllDraftTFClasses(body.steamid);
			SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
				io.emit('removePlayerFromDraftTFClass', scheme.tf2class, socket.request.session.player.steamid);
			});
		}
	}

	@OnMessage('addFakePlayer')
	async addFakePlayer(@SocketIO() io: Server, @SocketRequest() request: SocketRequestWithPlayer) {
		if (process.env.NODE_ENV === 'dev') {
			const player = await debugService.addFakePlayer();
			const fakePlayerViewModel = PlayerViewModel.fromPlayer(player);

			io.emit('addPlayerToSession', fakePlayerViewModel);
		}
	}

	@OnMessage('fakeAddPlayerToDraftTFClass')
	fakeAddPlayerToDraftTFClass(@SocketIO() io: Server, @MessageBody() body: FakeAddPlayerToDraftTFClassRequest) {
		ValidateClass(body);
		draftService.addPlayerToDraftTFClass(body.steamid, body.draftTFClass);
		io.emit('addPlayerToDraftTFClass', body.draftTFClass, body.steamid);
	}

	@OnMessage('fakeRemovePlayerFromDraftTFClass')
	fakeRemovePlayerToDraftTFClass(@SocketIO() io: Server, @MessageBody() body: FakeRemovePlayerFromDraftTFClassRequest) {
		ValidateClass(body);
		draftService.removePlayerFromDraftTFClass(body.steamid, body.draftTFClass);
		io.emit('removePlayerFromDraftTFClass', body.draftTFClass, body.steamid);
	}
}
