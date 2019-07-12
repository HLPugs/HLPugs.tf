import { Player } from '../structures/Player';
class PlayerService {

  static async getPlayerBySteamid(steamid: string): Promise<Player> {
        // const { rows } = await _connection.query('SELECT * FROM players WHERE steamid = ' + steamid);
        // return rows[0] as Player;
        // this._playerRepository.getPlayerBySteamid(steamid);
    return await new Player('test', 'test', 'test');
  }
}

export default PlayerService;
