import SteamID from '../../../Common/Types/SteamID';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import AddPlayerToDraftTFClassResponse from '../../../Common/Responses/AddPlayerToDraftTFClassResponse';
import RemovePlayerFromDraftTFClassResponse from '../../../Common/Responses/RemovePlayerFromDraftTFClassResponse';
import DraftService from '../services/DraftService';
import PreDraftRequirementViewModel from '../../../Common/ViewModels/PreDraftRequirementViewModel';
import ValidateClass from '../utils/ValidateClass';
import { SiteConfiguration } from '../constants/SiteConfiguration';
import { io } from '../server';
import Logger from '../modules/Logger';
import DraftState from '../../../Common/Enums/DraftState';
export default class DraftEvents {
	private readonly draftService = new DraftService();

	private currentPhase: DraftState = DraftState.WAITING_FOR_REQUIREMENTS;

	addPlayerToDraftTFClass(steamid: SteamID, draftTFClass: DraftTFClass) {
		if (!this.draftService.isPlayerAddedToDraftTFClass(steamid, draftTFClass)) {
			this.draftService.addPlayerToDraftTFClass(steamid, draftTFClass);
			const response = new AddPlayerToDraftTFClassResponse(steamid, draftTFClass);
			io.emit('addPlayerToDraftTFClass', response);
			Logger.logInfo(`Added to ${draftTFClass}`, { steamid });
			this.sendPreDraftRequirements();
		}
	}

	removePlayerFromAllDraftTFClasses(steamid: SteamID) {
		Logger.logInfo('Attempting to remove player from all draft classes', { steamid });
		SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
			this.removePlayerFromDraftTFClass(steamid, scheme.tf2class);
		});
	}

	removePlayerFromDraftTFClass(steamid: SteamID, draftTFClass: DraftTFClass) {
		if (this.draftService.isPlayerAddedToDraftTFClass(steamid, draftTFClass)) {
			this.draftService.removePlayerFromDraftTFClass(steamid, draftTFClass);
			const response = new RemovePlayerFromDraftTFClassResponse(steamid, draftTFClass);
			io.emit('removePlayerFromDraftTFClass', response);
			Logger.logInfo(`Removed from ${draftTFClass}`, { steamid });
			this.sendPreDraftRequirements();
		}
	}

	sendPreDraftRequirements() {
		Logger.logDebug('Attempting to send new pre draft requirements');
		if (this.currentPhase === DraftState.WAITING_FOR_REQUIREMENTS) {
			const readyUpPhaseCanStart = this.draftService.checkIfAllDraftRequirementsAreFulfilled();

			if (readyUpPhaseCanStart) {
				this.startReadyUpPhase();
			} else {
				const draftRequirements: PreDraftRequirementViewModel[] = [];
				const captainCountRequirement = new PreDraftRequirementViewModel(
					'Captains',
					this.draftService.checkIfCaptainCountRequirementIsFulfilled()
				);
				const playerCountRequirement = new PreDraftRequirementViewModel(
					'Players',
					this.draftService.checkIfPlayerCountRequirementIsFulfilled()
				);
				const classesRequirement = new PreDraftRequirementViewModel(
					'Classes',
					this.draftService.checkIfClassesRequirementIsFulfilled()
				);
				const serverRequirement = new PreDraftRequirementViewModel(
					'Server',
					this.draftService.checkIfServerRequirementIsFulfilled()
				);
				draftRequirements.push(captainCountRequirement);
				draftRequirements.push(playerCountRequirement);
				draftRequirements.push(classesRequirement);
				draftRequirements.push(serverRequirement);

				draftRequirements.forEach(x => ValidateClass(x));

				io.emit('getPreDraftRequirements', draftRequirements);
			}
		}
	}

	startReadyUpPhase() {
		this.currentPhase === DraftState.READY_UP;
		const playersAddedToDraft = this.draftService.getAllPlayersAddedToDraft();
		// Emit to all steamid's to ready up
		playersAddedToDraft.forEach(steamid => io.to(steamid).emit('showReadyUpModal'));
		io.emit('startReadyUpPhase');
	}
}
