import ValidateClass from '../../Intel/src/utils/ValidateClass';
import DraftTFClass from '../Enums/DraftTFClass';
import SteamID from '../Types/SteamID';
import { IsEnum, IsNumberString } from 'class-validator';

export default class RemovePlayerFromDraftTFClassResponse {
	constructor(steamid: SteamID, draftTFClass: DraftTFClass) {
		this.draftTFClass = draftTFClass;
		this.steamid = steamid;
		ValidateClass(this);
	}
	@IsEnum(DraftTFClass)
	draftTFClass: DraftTFClass;

	@IsNumberString()
	steamid: SteamID;
}
