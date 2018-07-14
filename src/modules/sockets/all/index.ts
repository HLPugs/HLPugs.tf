import { Server } from 'socket.io';
import { chat } from './chat';
import { punishments } from './punishments';

export const all = (io: Server) => {
  chat(io);
  punishments(io);
};
