import * as chai                    from 'chai';
import * as chaiAsPromised          from 'chai-as-promised';
import 'mocha';
import db                           from '../database/db';
import { addFakePlayer, getPlayer } from '../modules/playerMap';
const expect = chai.expect;
addFakePlayer('EpicGamer');

describe('Roles', () => {
  before(async() => {
    chai.use(chaiAsPromised);
    const query = `INSERT INTO players (steamid, avatar) VALUES ('EpicGamer', 'test') ON CONFLICT DO NOTHING`;
    db.query(query);
  });

  it('should give a Player a patron role', async () => {
    const player = await getPlayer('EpicGamer');
    await player.addRoles(['patron']);
    expect(player.roles).to.contain('patron');
  });

  it('should remove a Player\'s patron role', async () => {
    const player = await getPlayer('EpicGamer');
    await player.removeRole('patron');
    expect(player.roles).to.not.contain('patron');
  });

  it('should give a Player the admin role', async() => {
    const player = await getPlayer('EpicGamer');
    await player.addRoles(['admin']);
    expect(player.staffRole).to.equal('admin');
  });

  it('should remove a Player\'s staff role', async() => {
    const player = await getPlayer('EpicGamer');
    await player.addRoles(['admin']);
    await player.removeRole('admin');
    expect(player.staffRole).to.not.equal('admin');
  });

  it('should make the Player a league admin', async() => {
    const player = await getPlayer('EpicGamer');
    await player.setLeagueAdminStatus(true);
    expect(player.isLeagueAdmin).to.equal(true);
  });

});
