import { steamUser } from '../common/types';
import { loginUser } from './login';
import { getLatestActiveBanInfo } from './sockets/all/punishments';
import { getAvatars } from './helpers';
import { Router, Request, Response } from 'express';
import * as steam from 'steam-login';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  if (req.user && req.user.banned) {
    getLatestActiveBanInfo(req.user.steamid).then(() => res.send('Hi'));
  } else {
    res.send('Hi!');
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
  res.redirect('/');
});

router.get('/logout', steam.enforceLogin('/'), (req: Request & steamUser, res: Response) => {
  delete req.session.steamUser;
  req.user = null;
  res.redirect('/');
});

export const routing: Router = router;
