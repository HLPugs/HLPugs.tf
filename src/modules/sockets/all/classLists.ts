import { Server } from 'socket.io';
import * as playerMap from '../../playerMap';

export const classLists = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('getTfClassList', (tfClass: string) => {
      socket.emit('tfClassList', tfClass, playerMap.getAllPlayersTfClass(tfClass));
    });

    socket.on('addToTfClass', (tfClass: string) => {
      playerMap.addPlayerTfClass(socket.request.session.user.steamid, tfClass);
      io.emit('addToTfClass', tfClass, socket.request.session.user.steamid);
    });

    socket.on('removeFromTfClass', (tfClass: string) => {
      playerMap.removePlayerTfClass(socket.request.session.user.steamid, tfClass);
      io.emit('removeFromTfClass', tfClass, socket.request.session.user.steamid);
    });
  });
};
