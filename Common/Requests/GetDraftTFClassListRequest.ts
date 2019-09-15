import { IsEnum } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';

export default class GetDraftTFClassListRequest {
    @IsEnum(DraftTFClass)
    draftTFClass: DraftTFClass;
}
