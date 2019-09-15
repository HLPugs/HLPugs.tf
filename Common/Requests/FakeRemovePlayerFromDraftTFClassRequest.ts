import { IsNumberString, IsEnum } from 'class-validator';
import SteamID from '../Types/SteamID';
import DraftTFClass from '../Enums/DraftTFClass';

export default class FakeRemovePlayerFromDraftTFClassRequest {
	@IsNumberString()
	steamid: SteamID;

	@IsEnum(DraftTFClass)
	draftTFClass: DraftTFClass;
}