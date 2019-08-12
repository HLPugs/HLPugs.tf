import { Server }               from 'socket.io';
import { Announcement, Region } from '../../../structures/Announcement';
// @ts-ignore
const defaultRegion: Region = process.env.region;

/* export async function getAnnouncements(region: Region = defaultRegion): Promise<Announcement[]> {
  // Populate in-memory announcements collection
  const query = {
    text: 'SELECT content, priority FROM announcements WHERE region = $1 ORDER BY timestamp DESC',
    values: [region],
  };

  const { rows } = await db.query(query);
  return rows;
}

export const announcements = async (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('loadAnnouncements', async(region: Region = defaultRegion) => {
      const announcementList = await getAnnouncements(region);
      socket.emit('receiveAnnouncements', announcementList);
    });
  });
};
*/