import SteamID from '../Types/SteamID';
import { IsNumberString } from 'class-validator';

export default class FakeAddPlayerToAllDraftTFClassesRequest {
	@IsNumberString()
	steamid: SteamID;
}
