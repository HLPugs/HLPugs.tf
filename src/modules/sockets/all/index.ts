import { Server } from 'socket.io';
import { chat } from './chat';
import { setup } from './setup';
import { alias } from './alias';
import { classLists } from './classLists';

export const all = (io: Server) => {
  chat(io);
  setup(io);
  alias(io);
  classLists(io);
};
