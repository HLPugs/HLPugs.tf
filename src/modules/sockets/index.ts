import { RequestHandler } from 'express';
import { Server }         from 'http';
import * as socketIo      from 'socket.io';
import { all }            from './all';

export const sockets = (server: Server, sessionConfig: RequestHandler) => {
  const io = socketIo(server);

  io.use((socket, next) => {
    sessionConfig(socket.request, socket.request.res, next);
  });

  all(io);
};
