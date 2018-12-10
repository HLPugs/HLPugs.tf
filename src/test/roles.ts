import * as chai                    from 'chai';
import * as chaiAsPromised          from 'chai-as-promised';
import 'mocha';
import db                           from '../database/db';
import { addFakePlayer, getPlayer } from '../modules/playerMap';
import { Player }                   from '../structures/Player';
const expect = chai.expect;
const steamid = 'steamid';

let player: Player;

describe('Roles', () => {
  before(async() => {
    await addFakePlayer(steamid, 'EpicGamer');
    chai.use(chaiAsPromised);
    {
      const query = 'DELETE FROM players WHERE steamid = $1';
      await db.query(query, [steamid]);
    }
    const query = 'INSERT INTO players (steamid, avatar) VALUES ($1, \'fakeAvatar\')';
    db.query(query, [steamid]);
    player = await getPlayer(steamid);
  });

  after(async() => {
    const query = 'DELETE FROM players WHERE steamid = $1';
    await db.query(query, [steamid]);
  });

  it('should give a Player a patron role', async () => {
    await player.addRole('patron');
    expect(player.roles).to.contain('patron');
  });

  it('should remove a Player\'s patron role', async () => {
    await player.removeRole('patron');
    expect(player.roles).to.not.contain('patron');
  });

  it('should give a Player the admin role', async() => {
    await player.setStaffRole('admin');
    expect(player.staffRole).to.equal('admin');
  });

  it('should remove a Player\'s staff role', async() => {
    const player = await getPlayer(steamid);
    await player.setStaffRole('developer');
    await player.setStaffRole(false);
    expect(player.staffRole).to.not.equal('admin');
  });

  it('should make the Player a league admin', async() => {
    const player = await getPlayer(steamid);
    await player.setLeagueAdminStatus(true);
    expect(player.isLeagueAdmin).to.equal(true);
  });

});
