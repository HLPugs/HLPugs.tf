import {TFClassesTracker} from './TFClassesTracker'
import {Pug} from './Pug'

/**
 * Describes a player.
 * @typedef Player
 * @property {number} id - The player's unique ID.
 * @property {string} alias - The player's custom alias on the site.
 * @property {number} pugs - The number of pugs the player has played.
 * @property {number} wins - The number of pugs the player has won.
 * @property {number} losses - The number of pugs the player has lost.
 * @property {boolean} captain - Whether or not the player is qualified to be a captain.
 * @property {number} [captainRating=5000] - The player's captain rating.
 * @property {number} subsIn - The number of times the player has been subbed in for another player.
 * @property {number} subsOut - The number of times the player has been subbed out for another player.
 * @property {boolean} admin - Whether or not the player is a site admin.
 * @property {boolean} mod - Whether or not the player is a site moderator.
 * @property {boolean} voiceActor - Whether or not the player has produced a voicepack for the site.
 * @property {boolean} patron - Whether or not the player is a Patreon patron.
 * @property {TFClassesTracker} pugsByClass - A {@link TFClassesTracker} object that maps the amount of pugs the player has played to each class.
 * @property {TFClassesTracker} winsByClass - A {@link TFClassesTracker} object that maps the amount of pugs the player has won to each class.
 * @property {TFClassesTracker} lossesByClass - A {@link TFClassesTracker} object that maps the amount of pugs the player has lost to each class.
 * @property {Object} - An object mapping map names to the number of times the player played on the maps.
 * @property {Pug[]} - An array of pugs the player has played in.
 */
export class Player {
    id: number;
    alias: string;
    pugs: number = 0;
    wins: number = 0;
    losses: number = 0;
    captain: boolean = false;
    captainRating: number = 5000;
    subsIn: number = 0;
    subsOut: number = 0;
    admin: boolean = false;
    mod: boolean = false;
    voiceActor: boolean = false;
    patron: boolean = false;
    pugsByClass: TFClassesTracker;
    winsByClass: TFClassesTracker;
    lossesByClass: TFClassesTracker;
    maps: Object;
    pugHistory: Pug[];

    /**
     * Creates a new Player object.
     * @param {number} id - A unique ID.
     * @param {string} alias - The player's custom alias on the site.
     */
    constructor(id: number, alias: string) {
        this.id = id;
        this.alias = alias;
        this.pugsByClass = new TFClassesTracker();
        this.winsByClass = new TFClassesTracker();
        this.lossesByClass = new TFClassesTracker();
    }
}