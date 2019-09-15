import { IsEnum } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';

export default class AddPlayerToDraftTFClassRequest {
    @IsEnum(DraftTFClass)
    draftTFClass: DraftTFClass;
}
