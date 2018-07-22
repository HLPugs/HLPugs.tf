import { Server } from 'socket.io';
import db from '../../../database/db';

export const alias = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('checkAlias', async (alias: string) => {
      const query = {
        text: `SELECT 1 FROM players WHERE LOWER(alias) = LOWER($1)`,
        values: [alias],
      };

      await db.query(query).then(res => socket.emit('aliasStatus', res.rows[0]));
    });

    socket.on('submitAlias', async (alias: string) => {
      const query = {
        text: `SELECT 1 FROM players WHERE LOWER(alias) = LOWER($1)`,
        values: [alias],
      };

      await db.query(query).then(async (res) => {
        if (!res.rows[0]) {
          const query = {
            text: `UPDATE players SET alias = $1 WHERE steamid = $2 AND alias IS NULL RETURNING *`,
            values: [alias, socket.request.session.user.steamid],
          };

          await db.query(query).then((res) => {
            if (res.rows[0]) {
              socket.request.session.user.alias = alias;

              socket.request.session.save();

              const user = {
                loggedIn: true,
                alias: socket.request.session.user.alias,
                avatar: socket.request.session.user.avatar,
                steamid: socket.request.session.user.steamid,
              };

              socket.emit('user', user);
            }
          });
        }
      });
    });
  });
};
