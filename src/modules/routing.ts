import { Router, Request, Response } from 'express';
import * as config                   from 'config';
import * as steam                    from 'steam-login';
import { loginUser }                 from './login';
import { handleError }               from './errorHandler';
import { SteamUser }                 from '../structures/SteamUser';

const router: Router = Router();

const frontURL: string = config.get('app.frontURL');

router.get('/', (req: Request, res: Response) => {
  res.redirect(frontURL);
});

router.get('/verify', steam.verify(), (req: Request & SteamUser, res: Response) => {
  console.log(req.session);
  loginUser(req)
      .then(() => res.redirect('/'))
      .catch(e => handleError(e, req.session.steamid));
});

router.get('/auth', steam.authenticate(), (req: Request & SteamUser, res: Response) => {
  res.redirect(frontURL);
});

export const routing: Router = router;
