import { Request } from 'express';
import PlayerViewModel from '../../../Common/ViewModels/PlayerViewModel';

export interface RequestWithUser extends Request {
	player: PlayerViewModel;
}
