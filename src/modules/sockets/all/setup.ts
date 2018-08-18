import * as config      from 'config';
import { Server }       from 'socket.io';
import * as playerMap   from '../../playerMap';
import { DraftTFClass } from '../../../structures/DraftClassList';

export const setup = (io: Server) => {
  io.on('connection', async (socket) => {
    socket.emit('siteConfiguration', config.get('app.configuration'));

    if (socket.request.session.err) {
    	socket.emit('serverError', socket.request.session.err);
	  }

    if (socket.request.session.user) {
      const user = socket.request.session.user;
      user.loggedIn = true;

      socket.emit('user', user);
    } else {
      socket.emit('user', { loggedIn: false });
    }

    socket.on('home', async () => {
      // Send socket all online users' information
      const playerList = await playerMap.getAllPlayers();
      socket.emit('playerData', await playerList);

      // Add new socket to session socket list
      if (socket.request.session.sockets !== undefined) {
        socket.request.session.sockets.push(socket.id);
        socket.request.session.save((e: any) => {
		      if (e) throw e;
        });
        if (socket.request.session.sockets.length === 1) {
          playerMap.addPlayer(socket.request.session.id, socket.request.session.user.steamid);
          io.emit('addPlayerToData', await playerMap.getPlayer(socket.request.session.user.steamid));
        }
      }
    });

    socket.on('disconnect', () => {
      if (!socket.request.session || socket.request.session.sockets === undefined) return;

      socket.request.session.reload((e: any) => {
        if (e !== undefined) throw e;

        const socketIndex = socket.request.session.sockets.indexOf(socket.id);

        if (socketIndex >= 0) {
          socket.request.session.sockets.splice(socketIndex, 1);
          socket.request.session.save((e: Error) => { if (e !== undefined) { throw e; } });

          if (socket.request.session.sockets.length === 0) {
            playerMap.removePlayerAllDraftTFClasses(socket.request.session.user.steamid);

            const draftTFClasses: DraftTFClass[] = config.get('app.configuration.classes');
            draftTFClasses.forEach((draftTFClass) => {
              io.emit('removeFromDraftTFClass', draftTFClass, socket.request.session.user.steamid);
            });

            playerMap.removePlayer(socket.request.session.user.steamid);
            io.emit('removePlayerFromData', socket.request.session.user.steamid);
          }
        }
      });
    });
  });
};
