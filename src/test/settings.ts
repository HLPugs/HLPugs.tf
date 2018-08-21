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
  });

  it('should have demoman and flex as favorite classes', async() => {
    await player.addFavoriteClass('Demoman');
    await player.addFavoriteClass('Flex');
    expect(player.settings.favoriteClasses).to.equal(['Demoman', 'Flex']);
  });

  it('should change the voicepack to Kegapack', async() => {
    await player.updateSetting('voicepack', 'kegapack');
    expect(player.settings.voicepack).to.equal('kegapack');
  });

  it('should remove demoman and add scout from favorite classes', async() => {
    await player.removeFavoriteClass('Demoman');
    await player.addFavoriteClass('Scout');
    expect(player.settings.favoriteClasses).to.equal(['Flex', 'Scout']);
  });

  it('should disable mention notifications', async() => {
    await player.updateSetting('mentionNotification', false);
    expect(player.settings.isNotifiableByMention).to.equal(false);
  });
});
