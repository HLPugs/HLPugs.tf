import { player } from './player';

/**
 * An object that maps SteamID's as strings to a {@Link player} object.
 * @typedef playerMap
 */
export class playerMap {
  private players: { [steamid: string]: player };

  /**
   * Creates a new empty playerMap.
   */
  constructor() {
    this.players = {};
  }

  /**
   * Adds a new (@link player) to the map.
   * @param {player} player - The player to add (or update if existing).
   * @param {string} steamid - The SteamID to match the player with.
   */
  add(player: player, steamid: string): void {
    this.players[steamid] = player;
  }

  /**
   * Retrieves a player from the map using a class.
   * @param {string} steamid - The player to retrieve.
   * @returns {player} - The player that was found, or false if not any.
   */
  get(steamid: string): player | false {
    if (!(steamid in this.players)) {
	  throw new Error(`Player (${steamid}) was requested from the player map but was not found`);
    }
    return this.players[steamid];
  }
}
