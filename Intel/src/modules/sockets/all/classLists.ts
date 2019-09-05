import { Server } from 'socket.io';
import DraftService from '../../../services/DraftService';
import DraftTFClass from '../../../../../Common/Enums/DraftTFClass';

const draftService = new DraftService();

export const classLists = (io: Server) => {
	io.on('connection', socket => {
		socket.on('getDraftTFClassList', (draftTFClass: DraftTFClass) => {
			socket.emit('draftTFClassList', draftTFClass, draftService.getAllPlayersByDraftTFClass(draftTFClass));
		});

		socket.on('addToDraftTFClass', async (tfClass: DraftTFClass) => {
			await draftService.addPlayerToDraftTFClass(socket.request.session.user.steamid, tfClass);
			io.emit('addToDraftTFClass', tfClass, socket.request.session.user.steamid);
		});
	});
};
