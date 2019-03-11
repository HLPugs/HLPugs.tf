import 'mocha';
import { Announcement } from '../entities/Announcement/announcement';
import { createTypeormConn } from '../utils/createTypeormConn';

describe('createAnnouncement', async () => {
  await createTypeormConn();
});

it('should create an announcement', () => {
  const announcement = new Announcement();
  announcement.message = 'Test announcement';
  announcement.creator = '91291283';
  announcement.region = 'na';

  Announcement.createAnnouncement(announcement);

});
