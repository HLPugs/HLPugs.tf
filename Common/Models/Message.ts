import { IsString, MinLength, IsDate, IsUUID, MaxLength } from 'class-validator';
import SteamID from '../Types/SteamID';
import * as uuid from 'uuid';
import SendMessageRequest from '../Requests/SendMessageRequest';
import ValidateClass from '../../Intel/src/utils/ValidateClass';
import Player from './Player';

export default class Message {
	@IsString()
	@IsUUID('4')
	id: string;

	@IsString()
	@MinLength(1)
	@MaxLength(300)
	messageContent: string;

	@IsString()
	@MinLength(2)
	username: string;

	@IsDate()
	timestamp: number;

	@IsString()
	authorSteamid: SteamID;

	static fromRequest(request: SendMessageRequest, player: Player) {
		return ValidateClass<Message>({
			id: uuid(),
			username: player.alias,
			messageContent: request.messageContent,
			authorSteamid: player.steamid,
			timestamp: new Date().getTime()
		});
	}
}
