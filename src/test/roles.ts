import * as chai                    from 'chai';
import * as chaiAsPromised          from 'chai-as-promised';
import 'mocha';
import db                           from '../database/db';
import { addFakePlayer, getPlayer } from '../modules/playerMap';
import { Player }                   from '../structures/Player';
const expect = chai.expect;

describe('Roles', () => {
  before(async() => {
    await addFakePlayer('EpicGamer');
    chai.use(chaiAsPromised);
    const query = `INSERT INTO players (steamid, avatar) VALUES ('EpicGamer', 'test')`;
    await db.query(query);
  });

  after(async() => {
    const query = `DELETE FROM players WHERE steamid = 'EpicGamer'`;
    await db.query(query);
  });

  it('should give a Player a patron role', async () => {
    const player = await getPlayer('EpicGamer');
    await player.addRole('patron');
    expect(player.roles).to.contain('patron');
  });

  it('should remove a Player\'s patron role', async () => {
    const player = await getPlayer('EpicGamer');
    await player.removeRole('patron');
    expect(player.roles).to.not.contain('patron');
  });

  it('should give a Player the admin role', async() => {
    const player = await getPlayer('EpicGamer');
    await player.setStaffRole('admin');
    expect(player.staffRole).to.equal('admin');
  });

  it('should remove a Player\'s staff role', async() => {
    const player = await getPlayer('EpicGamer');
    await player.setStaffRole('admin');
    await player.setStaffRole(false);
    expect(player.staffRole).to.not.equal('admin');
  });

  it('should make the Player a league admin', async() => {
    const player = await getPlayer('EpicGamer');
    await player.setLeagueAdminStatus(true);
    expect(player.isLeagueAdmin).to.equal(true);
  });

});
