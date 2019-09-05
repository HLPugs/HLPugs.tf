import { Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import DraftService from '../../services/DraftService';
import AddToDraftTFClassListDTO from '../../../../Common/DTOs/AddToDraftClassListDTO';
import GetDraftTFClassListDTO from '../../../../Common/DTOs/GetDraftTFClassListDTO';
import RemovePlayerFromDraftTFClassDTO from '../../../../Common/DTOs/RemovePlayerFromDraftTFClassDTO';
import ValidateClass from '../../utils/ValidateClass';

const draftService = new DraftService();

@SocketController()
export default class DraftSocketController {

    @OnMessage('getDraftTFClassList')
    getDraftTFClassList(@ConnectedSocket() socket: Socket, @MessageBody() body: GetDraftTFClassListDTO) {
        ValidateClass(body);
        const players = draftService.getAllPlayersByDraftTFClass(body.draftTFClass);
        socket.emit('draftTFClassList', body.draftTFClass, players);
    }

    @OnMessage('addPlayerToDraftTFClass')
    addToDraftTFClass(@ConnectedSocket() socket: Socket, @SocketIO() io: any, @MessageBody() body: AddToDraftTFClassListDTO) {
        console.log(body.draftTFClass)
        ValidateClass(body);
        console.log(body.draftTFClass)
        const { steamid } = socket.request.session.user;
        console.log(body.draftTFClass)
        draftService.addPlayerToDraftTFClass(steamid, body.draftTFClass);
        console.log(body.draftTFClass)
        socket.emit('addPlayerToDraftTFClass', body.draftTFClass, steamid);
    }

    @OnMessage('removePlayerFromDraftTFClass')
    removePlayerFromDraftTFClass(@ConnectedSocket() socket: Socket, @SocketIO() io: any, @MessageBody() body: RemovePlayerFromDraftTFClassDTO) {
        ValidateClass(body);
        const { steamid } = socket.request.session.user;
        draftService.removePlayerFromDraftTFClass(steamid, body.draftTFClass);
        io.emit('removePlayerFromDraftTFClass', body.draftTFClass, steamid);
    }
}
