import { IsString, IsNotEmpty } from 'class-validator';

export default class FindPlayerByAliasRequest {
	@IsString()
	@IsNotEmpty()
	alias: string;
}