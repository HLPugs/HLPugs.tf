import { Request } from 'express';
import UserViewModel from '../../../Common/ViewModels/UserViewModel';

export interface RequestWithUser extends Request {
	user: UserViewModel;
}