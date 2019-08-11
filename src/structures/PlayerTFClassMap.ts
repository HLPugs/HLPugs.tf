import Player from "../entities/Player";

/**
 * An object that maps {@link Player} objects to a {@link DraftTFClass} name.
 * @typedef PlayerTFClassMap
 */
export class PlayerTFClassMap {
  private items: { [key: string]: Player };

	/**
     * Creates a new empty PlayerTFClassMap.
     */
  constructor() {
	  this.items = {};
  }

	/**
     * Adds a new (@link Player) to the map.
     * @param {Player} player - The Player to add.
     * @param {string} playerClass - The class to match the Player with.
     * @returns {boolean} - Whether or not the Player was successfully added to the map.
     */
  add(player: Player, playerClass: string): boolean {
	  if (playerClass in this.items) return false;
	  this.items[playerClass] = player;
	  return true;
  }

	/**
     * Retrieves a Player from the map using a class.
     * @param {string} playerClass - The class to retrieve.
     * @returns {Player|false} - The Player that was found, or false if not any.
     */
  get(playerClass: string): Player | false {
	  if (!(playerClass in this.items)) return false;
	  return this.items[playerClass];
  }
}
