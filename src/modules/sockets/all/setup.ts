import * as config from 'config';
import { Server }  from 'socket.io';

export const setup = (io: Server) => {
  io.on('connection', (socket) => {

    // Add new socket to session socket list
    if (socket.request.session.sockets !== undefined) {
      socket.request.session.sockets.push(socket.id);
      socket.request.session.save((err: any) => console.log(err));
    }

    socket.emit('siteConfiguration', config.get('app.configuration'));
    
    if (socket.request.session.err) {
    	socket.emit('serverError', socket.request.session.err)
	}

    if (socket.request.session.user) {
      const user = {
        loggedIn: true,
        alias: socket.request.session.user.alias,
        avatar: socket.request.session.user.avatar,
        steamid: socket.request.session.user.steamid,
        punishments: socket.request.session.user.punishments,
      };
      
      socket.emit('user', user);
    } else {
      socket.emit('user', { loggedIn: false });
    }

    socket.on('disconnect', () => {
      if (socket.request.session.sockets !== undefined) {
        const socketIndex = socket.request.session.sockets.indexOf(socket.id);

        if (socketIndex > -1) {
          socket.request.session.sockets.splice(socketIndex, 1);
          socket.request.session.save((err: any) => console.log(err));

          if (socket.request.session.sockets.length === 0) {
            // TODO: remove user from all class lists and other items since they are no longer here
          }
        }
      }
    });
  });
};
