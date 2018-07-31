import { TFClassesTracker } from './TFClassesTracker';
import { role, staffRole }  from './roles';
import { punishment }       from './punishment';

/**
 * Describes a player.
 * @typedef player
 * @property {string} steamid - The player'announcements SteamID.
 * @property {URL} avatar - The link to the player'announcements Steam avatar
 * @property {string} alias - The player'announcements unique custom alias on the site.
 * @property {number} pugs - The number of pugs the player has played.
 * @property {number} wins - The number of pugs the player has won.
 * @property {number} losses - The number of pugs the player has lost.
 * @property {boolean} isCaptain - Whether or not the player is qualified to be a captain.
 * @property {TFClassesTracker} winsByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the player has won to each class.
 * @property {TFClassesTracker} lossesByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the player has lost to each class.
 */
export class player {
  steamid: string;
  alias: string          = undefined;
  avatar: URL;
  pugs: number           = 0;
  totalWins: number      = 0;
  losses: number         = 0;
  isCaptain: boolean     = false;
  isLeagueAdmin: boolean = false;
  roles: role[] = [];
  staffRole: staffRole | boolean = false;
  winsByClass: TFClassesTracker;
  lossesByClass: TFClassesTracker;
  punishments: punishment[] = [];

  /**
   * Creates a new player object.
   * @param {string} steamid - The player'announcements SteamID
   * @param {URL} avatar - The link to the player'announcements Steam avatar.
   * @param {string} alias The player'announcements unique custom alias on the site
   */
  constructor(steamid: string, avatar: URL, alias?: string) {
    this.steamid = steamid;
    this.avatar = avatar;
    this.alias = alias || undefined;
    this.winsByClass = new TFClassesTracker();
    this.lossesByClass = new TFClassesTracker();
  }

}
