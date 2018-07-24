import * as config from 'config';
import * as uuid   from 'uuid';
import { Server }  from 'socket.io';

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
      if (message.length && socket.request.session.user.alias) {
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
