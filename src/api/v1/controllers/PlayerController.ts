import { BaseController } from './BaseController';
import PlayerService from '../../../services/PlayerService';
import { Response, Request, NextFunction } from 'express';

export default class PlayerController extends BaseController {

  public initializeRouteBindings() {
    this.router.get('/player/:id', this.getPlayerBySteamid);
  }

  async getPlayerBySteamid(req: Request, res: Response, next: NextFunction): Promise<any> {
    const steamid = req.params.id;
    res.json(await PlayerService.getPlayerBySteamid(steamid));
  }
}
