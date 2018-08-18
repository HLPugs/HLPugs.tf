/* tslint:disable:variable-name */

import { TFClassesTracker }                                           from './TFClassesTracker';
import { PunishmentData, PunishmentType } from './Punishment';
import db                                 from '../database/db';
import {
  addRoleQuery,
  removeRoleQuery,
  setLeagueAdminStatusQuery,
  setStaffRoleQuery,
}                                         from '../database/queries/player';
import logger                             from '../modules/logger';
import { Role, StaffRole }                from './Roles';

/**
 * Describes a Player.
 * @typedef Player
 * @property {string} steamid - The p's SteamID.
 * @property {URL} avatar - The link to the p's Steam avatar
 * @property {string} alias - The Player's unique custom alias on the site.
 * @property {number} pugs - The number of pugs the p has played.
 * @property {number} wins - The number of pugs the p has won.
 * @property {number} losses - The number of pugs the p has lost.
 * @property {Role[]} roles - The p's stackable roles
 * @property {boolean} isCaptain - Whether or not the p is qualified to be a captain.
 * @property {TFClassesTracker} winsByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the Player has won to each class.
 * @property {TFClassesTracker} lossesByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the Player has lost to each class.
 */
export class Player {
  get activePunishments(): Map<PunishmentType, PunishmentData> {
    return this._activePunishments;
  }
  steamid: string;
  sessionid: string;
  alias: string                   = undefined;
  avatar: string;
  pugs: number                    = 0;
  totalWins: number               = 0;
  losses: number                  = 0;
  isCaptain: boolean              = false;
  isLeagueAdmin: boolean = false;
  roles: Role[]          = [];
  staffRole: StaffRole | false = false;
  winsByClass: TFClassesTracker;
  lossesByClass: TFClassesTracker;
  private _activePunishments: Map<PunishmentType, PunishmentData>;

  /**
   * Creates a new Player object.
   * @param {string} steamid - The Player's SteamID
   * @param {URL} avatar - The link to the Player's Steam avatar.
   * @param {string} alias The Player's unique custom alias on the site
   */
  constructor(steamid: string, avatar?: string, alias?: string) {
    this.steamid = steamid;
    this.avatar = avatar;
    this.alias = alias || undefined;
    this.winsByClass = new TFClassesTracker();
    this.lossesByClass = new TFClassesTracker();
    this.staffRole = false;
    this.roles = [];
    this.isLeagueAdmin = false;
    this._activePunishments
        = new Map<PunishmentType, PunishmentData>();

  }

  /*
   Used as a second constructor method for assigning Player methods when
   calling getPlayer (since methods are stripped from classes when put in a memory store)
   */
  static createPlayer(p: Player) {
    const player              = new Player(p.steamid, p.avatar, p.alias);
    player.winsByClass        = p.winsByClass;
    player.lossesByClass      = p.lossesByClass;
    player.staffRole          = p.staffRole;
    player.roles              = p.roles;
    player.isLeagueAdmin      = p.isLeagueAdmin;
    player._activePunishments = p._activePunishments;
    return player;
  }

  async addRole(role: Role): Promise<void> {
    if (this.roles.indexOf(role) !== -1) {
      logger.warn(`${this.alias} is already ${role}`);
    } else {
      await db.query(removeRoleQuery, [role, this.steamid]);
      await db.query(addRoleQuery, [role, this.steamid]);
      this.roles.push(role);
    }
  }

  async setStaffRole(role: StaffRole | false): Promise<Player> {
    if (role === this.staffRole) {
      logger.warn(`${this.alias} is already ${role}`);
    } else {
      await db.query(setStaffRoleQuery, [role, this.steamid]);
      this.staffRole = role;
    }
    return this;
  }

  async setLeagueAdminStatus(status: boolean) {
    if (this.isLeagueAdmin === status) {
      logger.warn(`${this.alias}'s league admin status is already ${status}`);
    } else {
      await db.query(setLeagueAdminStatusQuery, [status, this.steamid]);
      this.isLeagueAdmin = status;
    }
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

  async removeRole(role: Role) {
    const indexOfRole = this.roles.indexOf(role);
    if (indexOfRole === -1) {
	  logger.warn(`${this.alias} already doesn't have ${role}`);
    } else {
	  await db.query(removeRoleQuery, [role, this.steamid]);
	  this.roles.splice(indexOfRole, indexOfRole + 1);
    }
  }

  async removeAllRoles() {

  }
}
