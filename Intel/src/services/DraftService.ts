import SessionService from '../services/SessionService';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { SiteConfiguration } from '../constants/SiteConfiguration';

const sessionService = new SessionService();

const DraftTFClassLists = new Map<DraftTFClass, string[]>();
SiteConfiguration.gamemodeClassSchemes.forEach(scheme =>
    DraftTFClassLists.set(scheme.tf2class, [])
);

class DraftService {

    /**
     * Adds a Player to a class
     * @param {string} steamid - The SteamID of the Player to add
     * @param {string} draftTFClass - The class to be added on
     */
    addPlayerToDraftTFClass(steamid: string, draftTFClass: DraftTFClass) {
        // Ensure Player isn't already added up to the class
        if (DraftTFClassLists.get(draftTFClass).indexOf(steamid) === -1) {
            DraftTFClassLists.get(draftTFClass).push(steamid);
            const player = sessionService.getPlayer(steamid);
            // logger.info(`${player.alias} added to ${draftTFClass}!`);
        }
    };

    /**
     * Removes a Player from a class
     * @param {string} steamid - The SteamID of the Player to remove
     * @param {string} draftTFClass - The class to be removed from
     */
    removePlayerFromDraftTFClass(steamid: string, draftTFClass: DraftTFClass) {
        const indexOfPlayer = DraftTFClassLists.get(draftTFClass).indexOf(steamid);

        if (indexOfPlayer >= 0) {
            DraftTFClassLists.get(draftTFClass).splice(indexOfPlayer, 1);

            const player = sessionService.getPlayer(steamid);
            // logger.info(`${player.alias} removed from ${draftTFClass}`);
        }
    };

    /**
     * Removes a Player from all classes
     * @param {string} steamid - The SteamID of the Player to be removed from all classes
     */
    removePlayerFromAllDraftTFClasses(steamid: string) {
        SiteConfiguration.gamemodeClassSchemes.forEach(scheme =>
            this.removePlayerFromDraftTFClass(steamid, scheme.tf2class)
        );
    };

    /**
     * Returns every Player added to the DraftTFClass specified
     * @param {DraftTFClass} draftTFClass
     * @returns {string[]} An array of the added players SteamIDs as strings
     */
    getAllPlayersByDraftTFClass(draftTFClass: DraftTFClass): string[] {
        return DraftTFClassLists.get(draftTFClass);
    };
}

export default DraftService;
