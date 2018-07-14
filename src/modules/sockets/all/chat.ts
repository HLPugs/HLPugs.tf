import { Server } from 'socket.io';
import * as uuid from 'uuid';

export const chat = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('sendMessage', (message: string) => {
      if (message.length && socket.request.session.steamUser) {
        const messageObject = {
          message,
          username: socket.request.session.steamUser.username, // Placeholder waiting for names
          userid: socket.request.session.steamUser.steamid,
          id: uuid(),
          timestamp: new Date().getTime(),
        };

        io.emit('newMessage', messageObject);
      }
    });
  });
};
