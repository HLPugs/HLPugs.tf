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

  it('should give a player a patron role', async () => {
    const player = await getPlayer('EpicGamer');
    await player.addRole('patron');
    expect(player.roles).to.contain('patron');
  });

  it('should remove a player\'s patron role', async () => {
    const player = await getPlayer('EpicGamer');
    await player.removeRole('patron');
    expect(player.roles).to.not.contain('patron');
  });

  it('should give a player the admin role', async() => {
    const player = await getPlayer('EpicGamer');
    await player.addRole('admin');
    expect(player.staffRole).to.equal('admin');
  });

  it('should remove a player\'s staff role', async() => {
    const player = await getPlayer('EpicGamer');
    await player.addRole('admin');
    await player.removeRole('admin');
    expect(player.staffRole).to.not.equal('admin');
  });

  it('should make the player a league admin', async() => {
    const player = await getPlayer('EpicGamer');
    await player.setLeagueAdminStatus(true);
    expect(player.isLeagueAdmin).to.equal(true);
  });

});
