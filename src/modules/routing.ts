import { Router, Request, Response } from 'express';
import * as config                   from 'config';
import { steamUser }                 from '../common/types';
import * as steam                    from 'steam-login';
import { loginUser }                 from './login';
import { handleError }               from './errorHandler';

const router: Router = Router();

const frontURL: string = config.get('app.frontURL');

router.get('/', (req: Request, res: Response) => {
  res.redirect(frontURL);
});

router.get('/verify', steam.verify(), (req: Request & steamUser, res: Response) => {
  loginUser(req)
      .then(() => res.redirect('/'))
      .catch(e => handleError(e, req.session.steamid));
});

router.get('/auth', steam.authenticate(), (req: Request & steamUser, res: Response) => {
  res.redirect(frontURL);
});

router.get('/logout', steam.enforceLogin('/'), (req: Request & steamUser, res: Response) => {
  delete req.session.steamUser;
  delete req.session.user;
  req.user = null;
  res.redirect(frontURL);
});

export const routing: Router = router;
