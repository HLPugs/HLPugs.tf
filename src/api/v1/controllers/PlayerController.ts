import { BaseController } from './BaseController';
import PlayerService from '../../../services/PlayerService';
import { Response, Request, NextFunction } from 'express';

export default class PlayerController extends BaseController {

  public initializeRouteBindings() {
	  this.router.get('/player/:id', this.getPlayerProfile);
	  this.router.get('/player/:id/matches', this.getPlayersMatches);
  }

  async getPlayerProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
	  const steamid = req.params.id;
	  const player = await PlayerService.getPlayerBySteamid(steamid);
	  res.json(player);
  }

  async getPlayersMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
	  const { id: steamid } = req.params;
	  const { pageSize, currentPage } = req.query;
	  const matches = await PlayerService.getMatchesForProfile(steamid, parseInt(pageSize), parseInt(currentPage));
	  res.json(matches);
  }
}
