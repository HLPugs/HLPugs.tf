import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export default class PreDraftRequirementViewModel {

	constructor(requirementName: string, isFulfilled: boolean) {
		this.requirementName = requirementName;
		this.isFulfilled = isFulfilled;
	}
	@IsString()
	@IsNotEmpty()
	requirementName: string;

	@IsBoolean()
	isFulfilled: boolean;
}
