import { Request } from 'express';
import UserViewModel from '@hlpugs/common/lib/ViewModels/UserViewModel';

export interface RequestWithUser extends Request {
	user: UserViewModel;
}