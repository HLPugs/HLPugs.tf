import SteamID from '../Types/SteamID';
import { IsNumberString, IsEnum } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';

export default class FakeAddPlayerToDraftTFClassRequest {
	@IsNumberString()
	steamid: SteamID;

	@IsEnum(DraftTFClass)
	draftTFClass: DraftTFClass;
}