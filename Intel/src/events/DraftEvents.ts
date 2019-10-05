import SteamID from '../../../Common/Types/SteamID';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { Server, Socket } from 'socket.io';
import AddPlayerToDraftTFClassResponse from '../../../Common/Responses/AddPlayerToDraftTFClassResponse';
import RemovePlayerFromDraftTFClassResponse from '../../../Common/Responses/RemovePlayerFromDraftTFClassResponse';
import DraftService from '../services/DraftService';

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
			const addPlayerToDraftTFClassResponse = new AddPlayerToDraftTFClassResponse(
				eventData.steamid,
				eventData.draftTFClass
			);
			io.emit('addPlayerToDraftTFClass', addPlayerToDraftTFClassResponse);
		}
	}

	removePlayerFromDraftTFClass(io: Server, eventData: RemovePlayerFromDraftTFClassEventData) {
		if (this.draftService.isPlayerAddedToDraftTFClass(eventData.steamid, eventData.draftTFClass)) {
			this.draftService.removePlayerFromDraftTFClass(eventData.steamid, eventData.draftTFClass);
			const removePlayerFromDraftTFClassResponse = new RemovePlayerFromDraftTFClassResponse(
				eventData.steamid,
				eventData.draftTFClass
			);
			io.emit('removePlayerFromDraftTFClass', removePlayerFromDraftTFClassResponse);
		}
	}
}
