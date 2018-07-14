import { Router, Request, Response } from 'express';
import * as config from 'config';
import { steamUser } from '../common/types';
import { loginUser } from './login';
import { getLatestActiveBanInfo } from './sockets/all/punishments';
import { getAvatars } from './helpers';
import * as steam from 'steam-login';

const router: Router = Router();

const frontURL: string = config.get('app.frontURL');

router.get('/', (req: Request, res: Response) => {
  if (req.user && req.user.banned) {
    getLatestActiveBanInfo(req.user.steamid).then(() => res.redirect(frontURL));
  } else {
    res.redirect(frontURL);
  }
});

router.get('/verify', steam.verify(), (req: Request & steamUser, res: Response) => {
  loginUser(req).then((userObject) => {
    req.session.user = userObject;
    getAvatars(req.user.steamid);
    res.redirect('/');
  }).catch(e => console.log(e));
});

router.get('/auth', steam.authenticate(), (req: Request & steamUser, res: Response) => {
  res.redirect(frontURL);
});

router.get('/logout', steam.enforceLogin('/'), (req: Request & steamUser, res: Response) => {
  delete req.session.steamUser;
  req.user = null;
  res.redirect(frontURL);
});

export const routing: Router = router;
