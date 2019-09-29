import SteamID from '../Types/SteamID';
import { IsString, IsNotEmpty } from 'class-validator';

export default class GetPlayerSettingsRequest {
	@IsString()
	@IsNotEmpty()
	steamid: SteamID;
}