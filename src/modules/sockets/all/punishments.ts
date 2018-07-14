import { Server } from 'socket.io';
import db from '../../../database/db';
import { getAvatars } from '../../helpers';

export const punishments = (io: Server) => {
  io.on('connection', (socket) => {

  });

};

/**
 * Retrieves the most recent active ban of a player
 * @param {string} steamid The player to request the ban information from
 * @returns {Promise<void>} Callback when data is ready
 */
export async function getLatestActiveBanInfo(steamid: string): Promise<object> {

  // Retrieve reason, creator's SteamID and expiration from the most recent active ban in database
  const query = {
    text: `SELECT reason, creator, expiration FROM punishments
           WHERE steamid = $1 AND punishment = 'ban' AND expiration > NOW ()
           ORDER BY issued_on DESC
           LIMIT 1`,
    values: [steamid],
  };

  const { reason, expiration, creator } = await db.query(query)
      .then(result => result.rows[0]);

  // Retrieve the avatar of the player who issued the ban
  const { avatar }: any = await getAvatars(steamid)
      .catch((e) => { throw new Error(e); }); // Crash until we implement a proper logging system

  return { reason, expiration, creator, avatar };
}
