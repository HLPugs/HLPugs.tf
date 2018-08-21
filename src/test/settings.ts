import * as chai                    from 'chai';
import 'mocha';
import { addFakePlayer, getPlayer } from '../modules/playerMap';
import { Player }                   from '../structures/Player';
import db                           from '../database/db';

const expect = chai.expect;
let player: Player;
const steamid = 'steamid';

describe('settings', () => {
  before(async() => {
    await addFakePlayer(steamid, 'Jabe');
    await db.query('DELETE FROM players WHERE steamid = $1', [steamid]);
    await db.query('INSERT INTO players (steamid, avatar) VALUES ($1, $2)', [steamid, 'avatar']);
    player = await getPlayer(steamid);
  });

  after(async() => {
    await db.query('DELETE FROM players WHERE steamid = $1', [steamid]);
  });

  it('should change the user\'s volume to 100', async() => {
    await player.updateSetting('volume', 100);
    expect(player.settings.volume).to.equal(100);

    const { rows } = await db.query(`SELECT settings->'volume' as volume FROM players WHERE steamid = $1`, [steamid]);
    const { volume } = rows[0];
    expect(volume).to.equal(100);
  });

  it('should change the voicepack to Kegapack', async() => {
    await player.updateSetting('voicepack', 'kegapack');
    expect(player.settings.voicepack).to.equal('kegapack');

    const { rows } = await db.query(`SELECT settings->'voicepack' as vp FROM players WHERE steamid = $1`, [steamid]);
    const { vp } = rows[0];
    expect(vp).to.equal('kegapack');
  });

  it('should disable mention notifications', async() => {
    await player.updateSetting('isNotifiableByMention', false);
    expect(player.settings.isNotifiableByMention).to.equal(false);

    const query = {
      // Postgres enforces returning columns in lower-case
      text: `SELECT settings->'isNotifiableByMention' as isnotifiablebymention FROM players WHERE steamid = $1`,
      values: [steamid],
    };
    const { rows } = await db.query(query);
    const { isnotifiablebymention } = rows[0];
    expect(isnotifiablebymention).to.equal(false);
  });

  it('should have demoman and flex as favorite classes', async() => {
    await player.addFavoriteClass('Demoman');
    await player.addFavoriteClass('Flex');
    expect(player.settings.favoriteClasses).to.deep.equal(['Demoman', 'Flex']);

    const query = {
      text: `SELECT settings->'favoriteClasses' as classes FROM players WHERE steamid = $1`,
      values: [steamid],
    };
    const { rows } = await db.query(query);
    const { classes } = rows[0];
    expect(classes).to.deep.equal(['Demoman', 'Flex']);
  });

  it('should remove demoman and add scout from favorite classes', async() => {
    await player.removeFavoriteClass('Demoman');
    await player.addFavoriteClass('Scout');
    expect(player.settings.favoriteClasses).to.deep.equal(['Flex', 'Scout']);

    const query = {
      text: `SELECT settings->'favoriteClasses' as classes FROM players WHERE steamid = $1`,
      values: [steamid],
    };
    const { rows } = await db.query(query);
    const { classes } = rows[0];
    expect(classes).to.deep.equal(['Flex', 'Scout']);
  });

});
