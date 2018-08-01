import db         from '../../../database/db';
import { Server } from 'socket.io';
import logger     from '../../logger';

export const alias = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('checkAlias', async (alias: string) => {
      const res = await db.query('SELECT 1 FROM players WHERE LOWER(alias) = LOWER($1)', [alias]);
      socket.emit('aliasStatus', res.rows[0]);
    });

    socket.on('submitAlias', async (alias: string) => {
      const aliasRules = new RegExp('^[a-zA-Z0-9_]{2,17}$');
      if (!aliasRules.test(alias)) return; // Exits function if alias didn't pass Regex check

      const res = await db.query('SELECT 1 FROM players WHERE LOWER(alias) = LOWER($1)', [alias]);
      if (res.rows[0]) return; // Exits function if alias was taken

      const query = {
        text: `UPDATE players SET alias = $1 WHERE steamid = $2 AND alias IS NULL RETURNING *`,
        values: [alias, socket.request.session.user.steamid],
      };

      const res2 = await db.query(query);
      if (!res2.rows[0]) return; // Exits function if alias didn't update in the database
      socket.request.session.user.alias = alias;
      socket.request.session.save((err: any) => err ? console.log(err) : null);

      const user = {
        loggedIn: true,
        alias: socket.request.session.user.alias,
        avatar: socket.request.session.user.avatar,
        steamid: socket.request.session.user.steamid,
      };

      socket.emit('user', user);

      // Log account creation
      logger.log(
        'info',
        `${alias} created an account`,
        { steamid: socket.request.session.user.steamid },
      );
    });
  });
};
