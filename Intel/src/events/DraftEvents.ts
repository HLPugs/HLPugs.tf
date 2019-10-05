import SteamID from '../../../Common/Types/SteamID';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { Server, Socket } from 'socket.io';
import AddPlayerToDraftTFClassResponse from '../../../Common/Responses/AddPlayerToDraftTFClassResponse';
import RemovePlayerFromDraftTFClassResponse from '../../../Common/Responses/RemovePlayerFromDraftTFClassResponse';
import DraftService from '../services/DraftService';
import PreDraftRequirementViewModel from '../../../Common/ViewModels/PreDraftRequirementViewModel';
import ValidateClass from '../utils/ValidateClass';

interface AddPlayerToDraftTFClassEventData {
	steamid: SteamID;
	draftTFClass: DraftTFClass;
}

interface RemovePlayerFromDraftTFClassEventData {
	steamid: SteamID;
	draftTFClass: DraftTFClass;
}

export default class DraftEvents {
	private readonly draftService = new DraftService();

	addPlayerToDraftTFClass(io: Server, eventData: AddPlayerToDraftTFClassEventData) {
		if (!this.draftService.isPlayerAddedToDraftTFClass(eventData.steamid, eventData.draftTFClass)) {
			this.draftService.addPlayerToDraftTFClass(eventData.steamid, eventData.draftTFClass);
			const response = new AddPlayerToDraftTFClassResponse(eventData.steamid, eventData.draftTFClass);
			io.emit('addPlayerToDraftTFClass', response);
			this.sendNewDraftRequirements(io);
		}
	}

	removePlayerFromDraftTFClass(io: Server, eventData: RemovePlayerFromDraftTFClassEventData) {
		if (this.draftService.isPlayerAddedToDraftTFClass(eventData.steamid, eventData.draftTFClass)) {
			this.draftService.removePlayerFromDraftTFClass(eventData.steamid, eventData.draftTFClass);
			const response = new RemovePlayerFromDraftTFClassResponse(eventData.steamid, eventData.draftTFClass);
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
