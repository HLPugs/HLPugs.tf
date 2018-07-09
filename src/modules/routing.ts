import { Router, Request, Response } from 'express';
const steam = require('steam-login');

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hi!');
});

router.get('/verify', steam.verify(), (req: Request, res: Response) => {
  res.redirect('/');
});

router.get('/auth', steam.authenticate(), (req: Request, res: Response) => {
  res.redirect('/');
});

router.get('/logout', steam.enforceLogin('/'), (req: Request, res: Response) => {

});

export const routing: Router = router;
