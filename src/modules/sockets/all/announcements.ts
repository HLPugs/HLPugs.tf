import { Server }                             from 'socket.io';
import { Announcement, Region } from '../../../structures/announcement';
import db                                     from '../../../database/db';
import { QueryResult }                        from 'pg';

const defaultRegion = process.env.region;

export async function getAnnouncements(region?: Region | string): Promise<Announcement[]> {
  // Populate in-memory announcements collection
  const query = {
    text: `SELECT content, priority FROM announcements WHERE region = $1 ORDER BY timestamp DESC`,
    values: [defaultRegion],
  };

  const res: QueryResult = await db.query(query);
  return res.rows;
}

export const announcements = async (io: Server) => {

  io.on('connection', (socket) => {
    socket.on('loadAnnouncements', async(customRegion: Region) => {
      const region = customRegion !== undefined ? customRegion : defaultRegion;
      const announcementList = await getAnnouncements(region);
      socket.emit('receiveAnnouncements', announcementList);
    });
  });
};
