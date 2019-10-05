import SteamID from '../../../Common/Types/SteamID';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { Server } from 'socket.io';
import AddPlayerToDraftTFClassResponse from '../../../Common/Responses/AddPlayerToDraftTFClassResponse';
import RemovePlayerFromDraftTFClassResponse from '../../../Common/Responses/RemovePlayerFromDraftTFClassResponse';
import DraftService from '../services/DraftService';
import PreDraftRequirementViewModel from '../../../Common/ViewModels/PreDraftRequirementViewModel';
import ValidateClass from '../utils/ValidateClass';
import { SiteConfiguration } from '../constants/SiteConfiguration';

export default class DraftEvents {
	private readonly draftService = new DraftService();

	addPlayerToDraftTFClass(io: Server, steamid: SteamID, draftTFClass: DraftTFClass) {
		if (!this.draftService.isPlayerAddedToDraftTFClass(steamid, draftTFClass)) {
			this.draftService.addPlayerToDraftTFClass(steamid, draftTFClass);
			const response = new AddPlayerToDraftTFClassResponse(steamid, draftTFClass);
			io.emit('addPlayerToDraftTFClass', response);
			this.sendNewDraftRequirements(io);
		}
	}

	removePlayerFromAllDraftTFClasses(io: Server, steamid: SteamID) {
		SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
			this.removePlayerFromDraftTFClass(io, steamid, scheme.tf2class);
		});
	}

	removePlayerFromDraftTFClass(io: Server, steamid: SteamID, draftTFClass: DraftTFClass) {
		if (this.draftService.isPlayerAddedToDraftTFClass(steamid, draftTFClass)) {
			this.draftService.removePlayerFromDraftTFClass(steamid, draftTFClass);
			const response = new RemovePlayerFromDraftTFClassResponse(steamid, draftTFClass);
			io.emit('removePlayerFromDraftTFClass', response);
			this.sendNewDraftRequirements(io);
		}
	}

	sendNewDraftRequirements(io: Server) {
		const readyUpPhaseCanStart = this.draftService.checkIfAllDraftRequirementsAreFulfilled();

		if (readyUpPhaseCanStart) {
			this.startReadyUpPhase(io);
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
			draftRequirements.push(playerCountRequirement);
			draftRequirements.push(captainCountRequirement);
			draftRequirements.push(classesRequirement);
			draftRequirements.push(serverRequirement);

			draftRequirements.forEach(x => ValidateClass(x));

			io.emit('sendNewDraftRequirements', draftRequirements);
		}
	}

	startReadyUpPhase(io: Server) {
		const playersAddedToDraft = this.draftService.getAllPlayersAddedToDraft();
		// Emit to all steamid's to ready up
		playersAddedToDraft.forEach(steamid => io.to(steamid).emit('showReadyUpModal'));
		io.emit('startReadyUpPhase');
	}
}
