import * as config from 'config';
import * as uuid from 'uuid';
import { Server } from 'socket.io';
import { ChatWords } from '../../../types/ChatWords';

interface MessageObjectType {
  message: string;
  username: string;
  userid: string;
  id: string;
  timestamp: number;
}

const chatWords = new ChatWords();

const messageHistory: MessageObjectType[] = [];

const cleanWord = (word: string) => {
  const { blacklistWords, whitelistWords } = chatWords;
  let tempWord = word;

  whitelistWords.forEach(whitelistedWord => tempWord = tempWord.replace(new RegExp(whitelistedWord, 'ig'), ''));

  const wordNotClean = blacklistWords.some(blacklistedWord => tempWord.toLowerCase().includes(blacklistedWord));

  return wordNotClean ? '*'.repeat(word.length) : word;
};

export const chat = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('sendMessage', (message: string) => {
      // Make sure session is updated from other sockets' activities
      socket.request.session.reload((err: any) => {
        err ? console.log(err) : null;

        const cleanedMessage = message.split(' ').map(w => cleanWord(w)).join(' ');

        if (Date.now() - socket.request.session.lastMessageSentTimestamp < 1000) return;

        if (cleanedMessage.length && cleanedMessage.length <= 300 && socket.request.session.user.alias) {
          const messageObject: MessageObjectType = {
            message: cleanedMessage,
            username: socket.request.session.user.alias,
            userid: socket.request.session.user.steamid,
            id: uuid(),
            timestamp: new Date().getTime(),
          };

          messageHistory.push(messageObject);

          if (messageHistory.length > 100) {
            messageHistory.shift();
          }

          socket.request.session.lastMessageSentTimestamp = Date.now();
          socket.request.session.save((err: any) => err ? console.log(err) : null);

          io.emit('newMessage', messageObject);
        }
      });
    });

    socket.on('requestMessageHistory', () => {
      socket.emit('messageHistory', messageHistory);
    });

    socket.on('requestCustomEmojis', () => {
      socket.emit('customEmojis', config.get('app.customEmojis'));
    });
  });
};
