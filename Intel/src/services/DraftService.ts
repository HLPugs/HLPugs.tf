import SessionService from '../services/SessionService';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import SteamID from '../../../Common/Types/SteamID';
import { SiteConfiguration } from '../constants/SiteConfiguration';
import PlayerService from './PlayerService';
import Player from '../entities/Player';

const playerService = new PlayerService();

const DraftTFClassLists = new Map<DraftTFClass, SteamID[]>();
SiteConfiguration.gamemodeClassSchemes.forEach(scheme => DraftTFClassLists.set(scheme.tf2class, []));

class DraftService {
	isPlayerAddedToDraftTFClass(steamid: SteamID, draftTFClass: DraftTFClass): boolean {
		return DraftTFClassLists.get(draftTFClass).indexOf(steamid) !== -1;
	}

	checkIfAllDraftRequirementsAreFulfilled(): boolean {
		return (
			this.checkIfCaptainCountRequirementIsFulfilled() &&
			this.checkIfClassesRequirementIsFulfilled() &&
			this.checkIfPlayerCountRequirementIsFulfilled() &&
			this.checkIfServerRequirementIsFulfilled()
		);
	}

	checkIfPlayerCountRequirementIsFulfilled(): boolean {
		const totalPlayersNeeded =
			SiteConfiguration.gamemodeClassSchemes.map(x => x.numberPerTeam).reduce((a, b) => a + b) * 2;
		return this.getAllPlayersAddedToDraft().length >= totalPlayersNeeded;
	}

	checkIfCaptainCountRequirementIsFulfilled(): boolean {
		// need captain logic implemented first
		return false;
	}

	checkIfClassesRequirementIsFulfilled(): boolean {
		// implement algorithm independent of gamemode
		return false;
	}

	checkIfServerRequirementIsFulfilled(): boolean {
		// check servers when we get to that point
		return false;
	}

	getAllPlayersAddedToDraft(): SteamID[] {
		const players: SteamID[] = [];
		SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
			players.push(...this.getAllPlayersByDraftTFClass(scheme.tf2class));
		});
		const uniqueSteamIDs = [...new Set(players)];
		return uniqueSteamIDs;
	}

	/**
	 * Adds a Player to a class
	 * @param {string} steamid - The SteamID of the Player to add
	 * @param {string} draftTFClass - The class to be added on
	 */
	addPlayerToDraftTFClass(steamid: SteamID, draftTFClass: DraftTFClass) {
		if (!this.isPlayerAddedToDraftTFClass(steamid, draftTFClass)) {
			DraftTFClassLists.get(draftTFClass).push(steamid);
			const player = playerService.getPlayer(steamid);
			// logger.info(`${player.alias} added to ${draftTFClass}!`);
		}
	}

	/**
	 * Removes a Player from a class
	 * @param {string} steamid - The SteamID of the Player to remove
	 * @param {string} draftTFClass - The class to be removed from
	 */
	removePlayerFromDraftTFClass(steamid: SteamID, draftTFClass: DraftTFClass) {
		const indexOfPlayer = DraftTFClassLists.get(draftTFClass).indexOf(steamid);

		if (indexOfPlayer >= 0) {
			DraftTFClassLists.get(draftTFClass).splice(indexOfPlayer, 1);

			const player = playerService.getPlayer(steamid);
			// logger.info(`${player.alias} removed from ${draftTFClass}`);
		}
	}

	/**
	 * Removes a Player from all classes
	 * @param {string} steamid - The SteamID of the Player to be removed from all classes
	 */
	removePlayerFromAllDraftTFClasses(steamid: SteamID) {
		SiteConfiguration.gamemodeClassSchemes.forEach(scheme =>
			this.removePlayerFromDraftTFClass(steamid, scheme.tf2class)
		);
	}

	/**
	 * Returns every Player added to the DraftTFClass specified
	 * @param {DraftTFClass} draftTFClass
	 * @returns {string[]} An array of the added players SteamIDs as strings
	 */
	getAllPlayersByDraftTFClass(draftTFClass: DraftTFClass): SteamID[] {
		return DraftTFClassLists.get(draftTFClass);
	}
}

export default DraftService;
