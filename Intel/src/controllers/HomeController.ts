import { Controller, Get, Res, UseBefore, Req, CurrentUser } from 'routing-controllers';
import config = require('config');
import { Response } from 'express';
import * as steam from 'steam-login';
import PlayerService from '../services/PlayerService';
import PlayerViewModel from '../../../Common/ViewModels/PlayerViewModel';
import Player from '../entities/Player';
import { RequestWithUser as RequestWithPlayer } from '../interfaces/RequestWithUser';
import ValidateClass from '../utils/ValidateClass';

const frontURL: string = config.get('app.frontURL');

@Controller()
export class HomeController {
	private readonly playerService = new PlayerService();

	@Get('/')
	frontURL(@Res() res: Response): void {
		res.redirect(frontURL);
	}

	@Get('/verify')
	@UseBefore(steam.verify())
	async login(@CurrentUser() player: Player, @Req() req: RequestWithPlayer, @Res() res: Response): Promise<void> {
		await this.playerService.updateOrInsertPlayer(player);

		const isCurrentlySiteBanned = await this.playerService.isCurrentlySiteBanned(player.steamid);
		req.session.sockets = [];

		const playerViewModel = PlayerViewModel.fromPlayer(player);
		playerViewModel.isLoggedIn = !isCurrentlySiteBanned;
		playerViewModel.isBanned = isCurrentlySiteBanned;
		ValidateClass(playerViewModel);
		req.player = playerViewModel;
		req.session.player = playerViewModel;

		res.redirect('/');
	}

	@Get('/auth')
	@UseBefore(steam.authenticate())
	authenticate(@Res() res: Response): void {
		res.redirect(frontURL);
	}
}
