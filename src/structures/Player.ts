/* tslint:disable:variable-name */

import { TFClassesTracker }                           from './TFClassesTracker';
import { Punishment, PunishmentData, PunishmentType } from './Punishment';
import db                                             from '../database/db';
import {
  addRoleQuery, getActivePunishmentsQuery,
  removeRoleQuery,
  setLeagueAdminStatusQuery,
  setStaffRoleQuery,
}                                                     from '../database/queries/player';
import logger                                         from '../modules/logger';
import { Role, StaffRole }                            from './Roles';
import { QueryResult }                                from 'pg';
import { PlayerSetting, PlayerSettings }              from './PlayerSettings';
import { DraftTFClass }                               from './DraftClassList';

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
  get steamid(): string {
    return this._steamid;
  }
  get settings(): PlayerSettings {
    return this._settings;
  }
  get activePunishments(): Map<PunishmentType, PunishmentData> {
    return this._activePunishments;
  }
  private _steamid: string;
  alias: string                     = undefined;
  avatar: string;
  isCaptain: boolean                = false;
  roles: Role[]                     = [];
  staffRole: StaffRole | false      = false;
  isLeagueAdmin: boolean            = false;
  totalWins: number                 = 0;
  losses: number                    = 0;
  pugs: number                      = 0;
  winsByClass: TFClassesTracker     = new TFClassesTracker();
  lossesByClass: TFClassesTracker   = new TFClassesTracker();
  private _settings: PlayerSettings = new PlayerSettings();
  private _activePunishments: Map<PunishmentType, PunishmentData>;

  /**
   * Creates a new Player object.
   * @param {string} steamid - The Player's SteamID
   * @param {URL} avatar - The link to the Player's Steam avatar.
   * @param {string} alias The Player's unique custom alias on the site
   */
  constructor(steamid: string, avatar?: string, alias?: string) {
    this._steamid = steamid;
    this.avatar   = avatar;
    this.alias    = alias;
    this._activePunishments
                  = new Map<PunishmentType, PunishmentData>();
    this._settings = new PlayerSettings();
  }

  /*
   Used as a second constructor method for assigning Player methods when
   calling getPlayer (since methods are stripped from classes when put in a memory store)
   */
  static createPlayer(p: Player) {
    const player              = new Player(p._steamid, p.avatar, p.alias);
    player.winsByClass        = p.winsByClass;
    player.lossesByClass      = p.lossesByClass;
    player.staffRole          = p.staffRole;
    player.roles              = p.roles;
    player.isLeagueAdmin      = p.isLeagueAdmin;
    player._activePunishments = p._activePunishments;
    player._settings          = p._settings;
    return player;
  }

  async updateSetting(setting: PlayerSetting, value: number | string | boolean): Promise<void> {
    const newSettings = this.settings;
    newSettings[setting] = value;
    await db.query(`UPDATE players SET settings = $1 WHERE steamid = $2`, [newSettings, this.steamid]);
    this._settings[setting] = value;
  }

  async addFavoriteClass(tfclass: DraftTFClass): Promise<void> {
    if (this._settings.favoriteClasses.indexOf(tfclass) === -1) {
      const newSettings = this.settings;
      newSettings.favoriteClasses.push(tfclass);
      await db.query(`UPDATE players SET settings = $1 WHERE steamid = $2`, [newSettings, this.steamid]);
      this._settings.favoriteClasses = newSettings.favoriteClasses;
    } else {
      logger.warn(`${this.alias} tried to add ${tfclass} to their favorite classes, but it already is one`);
    }
  }

  async removeFavoriteClass(tfclass: DraftTFClass): Promise<void> {
    if (this._settings.favoriteClasses.indexOf(tfclass) !== -1) {
      const newSettings = this.settings;
      const indexOfTFClass = newSettings.favoriteClasses.indexOf(tfclass);
      newSettings.favoriteClasses.splice(indexOfTFClass, 1);
      await db.query(`UPDATE playerS SET settings = $1 WHERE steamid = $2`, [newSettings, this.steamid]);
    } else {
      logger.warn(`${this.alias} tried to remove ${tfclass} as from their favorite classes,
       but it is already non-existent`);
    }
  }

  /**
   * From the database, retrieves active punishments of this player and updates their session's punishments
   * @returns {Promise<object>} Ban reason, expiration, and creator's SteamID and steam avatar
   */
  async updateActivePunishments(): Promise<void> {
    const res: QueryResult = await db.query(getActivePunishmentsQuery, [this.steamid]);
    const punishments = res.rows;

    // Exclude inactive punishments
    const activePunishments = punishments.filter((x: Punishment) => new Date(x.data.expiration) > new Date());
    activePunishments.forEach((punishment: Punishment) => {
      this._activePunishments.set(punishment.type, punishment.data);
    });
    return;
  }

  async addRole(role: Role): Promise<void> {
    if (this.roles.indexOf(role) !== -1) {
      logger.warn(`${ this.alias } is already ${ role }`);
    } else {
      await db.query(removeRoleQuery, [role, this.steamid]);
      await db.query(addRoleQuery, [role, this.steamid]);
      this.roles.push(role);
    }
  }

  async setStaffRole(role: StaffRole | false): Promise<Player> {
    if (role === this.staffRole) {
      logger.warn(`${ this.alias } is already ${ role }`);
    } else {
      await db.query(setStaffRoleQuery, [role, this.steamid]);
      this.staffRole = role;
    }
    return this;
  }

  async setLeagueAdminStatus(status: boolean) {
    if (this.isLeagueAdmin === status) {
      logger.warn(`${ this.alias }'s league admin status is already ${status}`); '';
    } else {
      await db.query(setLeagueAdminStatusQuery, [status, this.steamid]);
      this.isLeagueAdmin = status;
    }
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
