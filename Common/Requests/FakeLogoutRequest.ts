import { IsNumberString } from 'class-validator';

export default class FakeLogoutRequest {
	@IsNumberString()
	steamid: string;
}
