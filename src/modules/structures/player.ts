import { TFClassesTracker }            from './TFClassesTracker';
import { role, staffRole }			   from './roles';

/**
 * Describes a player.
 * @typedef Player
 * @property {string} steamid - The player's SteamID.
 * @property {URL} avatar - The link to the player's Steam avatar
 * @property {string} alias - The player's unique custom alias on the site.
 * @property {number} pugs - The number of pugs the player has played.
 * @property {number} wins - The number of pugs the player has won.
 * @property {number} losses - The number of pugs the player has lost.
 * @property {boolean} captain - Whether or not the player is qualified to be a captain.
 * @property {TFClassesTracker} winsByClass - A {@link TFClassesTracker} object that maps the amount of pugs the player
 *     has won to each class.
 * @property {TFClassesTracker} lossesByClass - A {@link TFClassesTracker} object that maps the amount of pugs the
 *     player has lost to each class.
 */
export class Player {
  steamid: string;
  alias: string = null;
  avatar: URL;
  pugs: number = 0;
  totalWins: number = 0;
  losses: number = 0;
  captain: boolean = false;
  roles: role[];
  staffRole: staffRole;
  isLeagueAdmin: boolean = false;
  winsByClass: TFClassesTracker;
  lossesByClass: TFClassesTracker;

	/**
   * Creates a new Player object.
   * @param {string} steamid - The player's SteamID
   * @param {string} avatar - The link to the player's Steam avatar.
   */
  constructor(steamid: string, avatar: URL) {
    this.steamid = steamid;
    this.winsByClass = new TFClassesTracker();
    this.lossesByClass = new TFClassesTracker();
  }

}
