import { Controller, Get, Res, UseBefore, Req, CurrentUser } from 'routing-controllers';
import config = require('config');
import { Response } from 'express';
import * as steam from 'steam-login';
import PlayerService from '../services/PlayerService';
import Player from '../entities/Player';

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
	async login(@CurrentUser() player: Player, @Req() req: any, @Res() res: Response): Promise<void> {

		await playerService.updateOrInsertPlayer(player);
		req.session.user = player;

		const isCurrentlySiteBanned = playerService.isCurrentlySiteBanned(player.steamid);

		req.session.sockets = [];
		req.user.loggedIn = !isCurrentlySiteBanned;
		req.user = player;
		req.user.banned = isCurrentlySiteBanned;
		res.redirect('/');
	}

	@Get('/auth')
	@UseBefore(steam.authenticate())
	authenticate(@Res() res: Response): void {
		res.redirect(frontURL);
	}
}