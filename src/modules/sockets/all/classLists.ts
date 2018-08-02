import { Server }       from 'socket.io';
import { DraftTFClass } from '../../../structures/draftClassList';
import * as playerMap   from '../../playerMap';

export const classLists = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('getDraftTFClassList', (draftTFClass: DraftTFClass) => {
      socket.emit('draftTFClassList', draftTFClass, playerMap.getAllPlayersDraftTFClass(draftTFClass));
    });

    socket.on('addToDraftTFClass', async (tfClass: DraftTFClass) => {
      await playerMap.addPlayerDraftTFClass(socket.request.session.user.steamid, tfClass);
      io.emit('addToDraftTFClass', tfClass, socket.request.session.user.steamid);
    });

    socket.on('removeFromDraftTFClass', async(draftTFClass: DraftTFClass) => {
      await playerMap.removePlayerDraftTFClass(socket.request.session.user.steamid, draftTFClass);
      io.emit('removeFromDraftTFClass', draftTFClass, socket.request.session.user.steamid);
    });
  });
};
