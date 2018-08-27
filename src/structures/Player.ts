/* tslint:disable:variable-name */

import { TFClassesTracker }                           from './TFClassesTracker';
import { Punishment, PunishmentData, PunishmentType } from './Punishment';
import db                                             from '../database/db';
import {
  addRoleQuery, getActivePunishmentsQuery,
  removeRoleQuery,
  setLeagueAdminStatusQuery,
  setStaffRoleQuery, updateSettingsQuery,
} from '../database/queries/player';
import logger                                         from '../modules/logger';
import { Role, StaffRole }                            from './Roles';
import { QueryResult }                                from 'pg';
import { PlayerSetting, PlayerSettings }              from './PlayerSettings';
import { DraftTFClass }                               from './DraftClassList';

/**
 * Describes a Player.
 * @typedef Player
 * @property {string} steamid- The player's SteamID.
 * @property {string} avatar - The link to the player's Steam avatar
 * @property {string} alias - The Player's unique custom alias on the site.
 * @property {number} pugs - The number of pugs the player has played.
 * @property {number} wins - The number of pugs the player has won.
 * @property {number} losses - The number of pugs the player has lost.
 * @property {Role[]} roles - The player's stackable roles
 * @property {boolean} isCaptain - Whether or not the player is qualified to be a captain.
 * @property {TFClassesTracker} winsByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the player has won to each class.
 * @property {TFClassesTracker} lossesByClass - A {@link TFClassesTracker} object that maps the
 *     amount of pugs the player has lost to each class.
 */
export class Player {

  private steamid: string;
  alias: string                   = undefined;
  avatar: string;
  isCaptain: boolean              = false;
  roles: Role[]                   = [];
  staffRole: StaffRole | false    = false;
  isLeagueAdmin: boolean          = false;
  totalWins: number               = 0;
  losses: number                  = 0;
  pugs: number                    = 0;
  winsByClass: TFClassesTracker   = new TFClassesTracker();
  lossesByClass: TFClassesTracker = new TFClassesTracker();
  private settings: PlayerSettings       = new PlayerSettings();
  private activePunishments: Map<PunishmentType, PunishmentData>;

  /**
   * Creates a new Player object.
   * @param {string} steamid - The Player's SteamID
   * @param {URL} avatar - The link to the Player's Steam avatar.
   * @param {string} alias The Player's unique custom alias on the site
   */
  constructor(steamid: string, avatar?: string, alias?: string) {
    this.steamid = steamid;
    this.avatar   = avatar;
    this.alias    = alias;
    this.activePunishments
                  = new Map<PunishmentType, PunishmentData>();
    this.settings = new PlayerSettings();
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
    player.activePunishments = p.activePunishments;
    player.settings          = p.settings;
    return player;
  }

  /**
   * Updates the user's settings in the database and session based on
   * the {@link PlayerSettings} passed
   * @param {PlayerSettings} settings
   * @return {Promise<void>}
   */
  async updateSettings(settings: PlayerSettings): Promise<void> {
    await db.query(updateSettingsQuery, [settings, this.steamid]);
    this.settings = settings;
  }

  /**
   * In the database and session, updates a player's single {@link PlayerSetting} to equal the value passed
   * @param {PlayerSetting} setting
   * @param {number | string | boolean} value
   * @return {Promise<void>}
   */
  async updateSetting(setting: PlayerSetting, value: number | string | boolean): Promise<void> {
    const newSettings = this.settings;
    newSettings[setting] = value;
    await db.query(`UPDATE players SET settings = $1 WHERE steamid = $2`, [newSettings, this.steamid]);
    this.settings[setting] = value;
  }

  /**
   * Adds a {@link DraftTFClass} to the player's list of favorite classes
   * @param {DraftTFClass} tfclass
   * @return {Promise<void>}
   */
  async addFavoriteClass(tfclass: DraftTFClass): Promise<void> {
    if (this.settings.favoriteClasses.indexOf(tfclass) === -1) {
      const newSettings = this.settings;
      newSettings.favoriteClasses.push(tfclass);
      await db.query(`UPDATE players SET settings = $1 WHERE steamid = $2`, [newSettings, this.steamid]);
      this.settings.favoriteClasses = newSettings.favoriteClasses;
    } else {
      logger.warn(`${this.alias} tried to add ${tfclass} to their favorite classes, but it already is one`);
    }
  }

  /**
   * Removes a {@link DraftTFClass} from the player's list of favorite classes
   * @param {DraftTFClass} tfclass
   * @return {Promise<void>}
   */
  async removeFavoriteClass(tfclass: DraftTFClass): Promise<void> {
    if (this.settings.favoriteClasses.indexOf(tfclass) !== -1) {
      const newSettings = this.settings;
      const indexOfTFClass = newSettings.favoriteClasses.indexOf(tfclass);
      newSettings.favoriteClasses.splice(indexOfTFClass, 1);
      await db.query(`UPDATE players SET settings = $1 WHERE steamid = $2`, [newSettings, this.steamid]);
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
      this.activePunishments.set(punishment.type, punishment.data);
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
      logger.warn(`${ this.alias }'s league admin status is already ${status}`);
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
