import { Controller, Get, Res, UseBefore, Req, CurrentUser } from 'routing-controllers';
import config = require('config');
import { Response, Request } from 'express';
import * as steam from 'steam-login';
import PlayerService from '../services/PlayerService';
//import UserViewModel from '../../../Common/ViewModels/UserViewModel';
import Player from '../entities/Player';
import { RequestWithUser } from '../interfaces/RequestWithUser';

const frontURL: string = config.get('app.frontURL');
const playerService = new PlayerService();

@Controller()
export class HomeController {

	@Get('/')
	frontURL(@Res() res: Response): void {
		res.redirect(frontURL);
	}

	@Get('/verify')
	@UseBefore(steam.verify())
	async login(@CurrentUser() player: Player, @Req() req: RequestWithUser, @Res() res: Response): Promise<void> {

		await playerService.updateOrInsertPlayer(player);

		const isCurrentlySiteBanned = await playerService.isCurrentlySiteBanned(player.steamid);

		const userViewModel = {loggedIn: true, isBanned: false};
		
		userViewModel.loggedIn = !isCurrentlySiteBanned;
		userViewModel.isBanned = isCurrentlySiteBanned;

		req.session.sockets = [];
		req.session.user = userViewModel;
		req.user = userViewModel;

		res.redirect('/');
	}

	@Get('/auth')
	@UseBefore(steam.authenticate())
	authenticate(@Res() res: Response): void {
		res.redirect(frontURL);
	}
}