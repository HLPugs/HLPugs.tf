import { Server } from 'socket.io';
import { chat } from './chat';

export const all = (io: Server) => {
  chat(io);
};
