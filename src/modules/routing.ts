import { Router, Request, Response } from 'express';
import { loginUser } from './login';
import * as steam from 'steam-login';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hi!');
});

router.get('/verify', steam.verify(), (req: Request, res: Response) => {
  loginUser(req).then((banned) => {
    banned ? res.redirect('logout?banned=true') : res.redirect('/');
  }).catch(e => console.log(e));
});

router.get('/auth', steam.authenticate(), (req: Request, res: Response) => {
  res.redirect('/');
});

router.get('/logout', steam.enforceLogin('/'), (req: Request, res: Response) => {
  delete req.session.steamUser;
  req.user = null;
  res.redirect('/');
});

export const routing: Router = router;
