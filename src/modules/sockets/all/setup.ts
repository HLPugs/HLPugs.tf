import { Server } from 'socket.io';
import * as config from 'config';

export const setup = (io: Server) => {
  io.on('connection', (socket) => {
    socket.emit('siteConfiguration', config.get('app.configuration'));

    if (socket.request.session.steamUser) {
      const user = {
        loggedIn: true,
        alias: socket.request.session.steamUser.username,
        avatar: socket.request.session.steamUser.avatar.medium,
        steamid: socket.request.session.steamUser.steamid,
        punishments: socket.request.session.user.punishments,
      };

      socket.emit('user', user);
    } else {
      socket.emit('user', { loggedIn: false });
    }
  });
};
