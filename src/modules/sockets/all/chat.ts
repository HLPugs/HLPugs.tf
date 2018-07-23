import { Server } from 'socket.io';
import * as config from 'config';
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
    socket.on('sendMessage', async (message: string) => {
      // Make sure session is updated from other sockets' activities
      await socket.request.session.reload((err: any) => console.log(err));

      if (Date.now() - socket.request.session.lastMessageSentTimestamp < 1000) return;

      if (message.length && message.length <= 300 && socket.request.session.user.alias) {
        const messageObject: messageObjectType = {
          message,
          username: socket.request.session.user.alias, // Placeholder waiting for names
          userid: socket.request.session.user.steamid,
          id: uuid(),
          timestamp: new Date().getTime(),
        };

        messageHistory.push(messageObject);

        if (messageHistory.length > 100) {
          messageHistory = messageHistory.slice(1);
        }

        socket.request.session.lastMessageSentTimestamp = Date.now();
        socket.request.session.save((err: any) => console.log(err));

        io.emit('newMessage', messageObject);
      }
    });

    socket.on('requestMessageHistory', () => {
      socket.emit('messageHistory', messageHistory);
    });

    socket.on('requestCustomEmojis', () => {
      socket.emit('customEmojis', config.get('app.customEmojis'));
    });
  });
};
