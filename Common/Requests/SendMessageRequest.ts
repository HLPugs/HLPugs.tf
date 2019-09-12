import { IsString, MinLength, MaxLength } from 'class-validator';

export default class SendMessageRequest {
	@IsString()
	@MinLength(1)
	@MaxLength(300)
	messageContent: string;
}
