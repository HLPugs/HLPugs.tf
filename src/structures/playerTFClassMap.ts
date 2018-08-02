import { player } from './player';

/**
 * An object that maps {@link player} objects to a {@link draftTFClass} name.
 * @typedef playerTFClassMap
 */
export class playerTFClassMap {
  private items: { [key: string]: player };

    /**
     * Creates a new empty playerTFClassMap.
     */
  constructor() {
    this.items = {};
  }

    /**
     * Adds a new (@link player) to the map.
     * @param {player} player - The player to add.
     * @param {string} playerClass - The class to match the player with.
     * @returns {boolean} - Whether or not the player was successfully added to the map.
     */
  add(player: player, playerClass: string): boolean {
    if (playerClass in this.items) return false;
    this.items[playerClass] = player;
    return true;
  }

    /**
     * Retrieves a player from the map using a class.
     * @param {string} playerClass - The class to retrieve.
     * @returns {player|false} - The player that was found, or false if not any.
     */
  get(playerClass: string): player | false {
    if (!(playerClass in this.items)) return false;
    return this.items[playerClass];
  }
}
