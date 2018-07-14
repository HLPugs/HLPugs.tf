import { Server } from 'socket.io';
import { chat } from './chat';
import { setup } from './setup';

export const all = (io: Server) => {
  chat(io);
  setup(io);
};
