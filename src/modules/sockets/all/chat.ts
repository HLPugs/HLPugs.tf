import { Server } from 'socket.io';
import * as uuid from 'uuid';

interface messageObjectType {
  message: string;
  username: string;
  userid: string;
  id: string;
  timestamp: number;
}

let messageHistory: messageObjectType[] = [];

export const chat = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('sendMessage', (message: string) => {
      if (message.length && socket.request.session.steamUser) {
        const messageObject: messageObjectType = {
          message,
          username: socket.request.session.steamUser.username, // Placeholder waiting for names
          userid: socket.request.session.steamUser.steamid,
          id: uuid(),
          timestamp: new Date().getTime(),
        };

        messageHistory.push(messageObject);

        if (messageHistory.length > 100) {
          messageHistory = messageHistory.slice(1);
        }

        io.emit('newMessage', messageObject);
      }
    });

    socket.on('requestMessageHistory', () => {
      socket.emit('messageHistory', messageHistory);
    });
  });
};
