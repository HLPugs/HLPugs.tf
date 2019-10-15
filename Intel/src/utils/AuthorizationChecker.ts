import { Action } from 'routing-controllers';
import Permission from '../../../Common/Enums/Permission';
import PlayerHasPermission from './PlayerHasPermission';
import Logger from '../modules/Logger';
import Player from '../entities/Player';

const authorizationChecker = (action: Action, permission: unknown) => {
	const player: Player = action.request.session.player;
	if (PlayerHasPermission(permission as Permission, player)) {
		return true;
	} else {
		Logger.logWarning(`Player tried executing ${permission} with insufficient permission`, player);
		return false;
	}
};
export default authorizationChecker;
