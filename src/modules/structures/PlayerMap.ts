import {Player} from './Player';

/**
 * An object that maps {@link Player} objects to a {@link TFClass} name.
 * @typedef PlayerMap
 */
export class PlayerMap {
    private items: { [key: string]: Player };

    /**
     * Creates a new empty PlayerMap.
     */
    constructor() {
        this.items = {};
    }

    /**
     * Adds a new player to the map.
     * @param {Player} player - The player to add.
     * @param {string} playerClass - The class to match the player with.
     * @returns {boolean} - Whether or not the player was successfully added to the map.
     */
    add(player: Player, playerClass: string): boolean {
        if(playerClass in this.items) return false;
        this.items[playerClass] = player;
        return true;
    }

    /**
     * Retrieves a player from the map using a class.
     * @param {string} playerClass - The class to retrieve.
     * @returns {Player|false} - The player that was found, or false if not any.
     */
    get(playerClass: string): Player | false {
        if(!(playerClass in this.items)) return false;
        return this.items[playerClass];
    }
}