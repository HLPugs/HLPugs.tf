/* tslint:disable:variable-name */

import { TFClassesTracker }                                       from './TFClassesTracker';
import { Role, StaffRole }                                        from './Roles';
import { PunishmentData, PunishmentType }                         from './Punishment';
import db                                                         from '../database/db';
import { addRoleQuery }                                           from '../database/queries/roles';

/**
 * Describes a Player.
 * @typedef Player
 * @property {string} steamid - The player's SteamID.
 * @property {URL} avatar - The link to the player's Steam avatar
 * @property {string} alias - The Player's unique custom alias on the site.
 * @property {number} pugs - The number of pugs the player has played.
 * @property {number} wins - The number of pugs the player has won.
 * @property {number} losses - The number of pugs the player has lost.
 * @property {Role[]} roles - The player's stackable roles
 * @property {boolean} isCaptain - Whether or not the player is qualified to be a captain.
 * @property {TFClassesTracker} winsByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the Player has won to each class.
 * @property {TFClassesTracker} lossesByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the Player has lost to each class.
 */
export class Player {
  get isLeagueAdmin(): boolean {
    return this._isLeagueAdmin;
  }

  get staffRole(): StaffRole | false {
    return this._staffRole;
  }
  get roles(): Role[] {
    return this._roles;
  }

  steamid: string;
  alias: string                   = undefined;
  avatar: string;
  pugs: number                    = 0;
  totalWins: number               = 0;
  losses: number                  = 0;
  isCaptain: boolean              = false;
  private _isLeagueAdmin: boolean = false;
  private _roles: Role[]          = [];
  private _staffRole: StaffRole | false;
  winsByClass: TFClassesTracker;
  lossesByClass: TFClassesTracker;
  activePunishments: Map<PunishmentType, PunishmentData>;

  /**
   * Creates a new Player object.
   * @param {string} steamid - The Player's SteamID
   * @param {URL} avatar - The link to the Player'announcements Steam avatar.
   * @param {string} alias The Player's unique custom alias on the site
   */
  constructor(steamid: string, avatar: string, alias?: string) {
    this.steamid = steamid;
    this.avatar = avatar;
    this.alias = alias || undefined;
    this.winsByClass = new TFClassesTracker();
    this.lossesByClass = new TFClassesTracker();
    this.activePunishments
        = new Map<PunishmentType, PunishmentData>();
  }

  static async addRole(role: Role | StaffRole) {
    const query = {
      text: addRoleQuery,
      value: role,
    };

    db.query(query);
  }

  async updateRoles(roles: Role[], staffRole: StaffRole, isLeagueAdmin: boolean) {
//    const staffRoles = ['mod', 'admin', 'headAdmin'];
//    const staffRole = roles.filter(x => staffRoles.find(roles));
//
//    const query = {
//      text: ``,
//    };
    return;
  }

  async removeRole(role: Role | StaffRole) {

  }

  async setLeagueAdminStatus(status: boolean) {

  }

  async removeAllRoles() {

  }

}
