import { Server }       from 'socket.io';
import * as playerMap   from '../../playerMap';
//import DraftTFClass from '../../../../../common/Models/DraftTFClass';

export const classLists = (io: Server) => {
	io.on('connection', (socket) => {
	socket.on('getDraftTFClassList', (draftTFClass: any) => {
		socket.emit('draftTFClassList', draftTFClass, playerMap.getAllPlayersDraftTFClass(draftTFClass));
	});

	socket.on('addToDraftTFClass', async (tfClass: any) => {
		await playerMap.addPlayerDraftTFClass(socket.request.session.user.steamid, tfClass);
		io.emit('addToDraftTFClass', tfClass, socket.request.session.user.steamid);
	});

	socket.on('removeFromDraftTFClass', async(draftTFClass: any) => {
		await playerMap.removePlayerDraftTFClass(socket.request.session.user.steamid, draftTFClass);
		io.emit('removeFromDraftTFClass', draftTFClass, socket.request.session.user.steamid);
	});
	});
};
