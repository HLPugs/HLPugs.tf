import { Router, Request, Response } from 'express';
const steam = require('steam-login');

const router: Router = Router();

declare module 'express' {
  export interface Request {
    user: any;
  }
}

router.get('/', (req: Request, res: Response) => {
  res.send('Hi!');
});

router.get('/verify', steam.verify(), (req: Request, res: Response) => {
  // Arrange data from login
  const steamid = req.user.steamid.toString();
  const avatar = req.user.avatar.medium;
  const ip = req.headers['x-forwarded-for'];

  // Insert player into database
  // Add IP to the user's IP list if current ip doesn't exist for this SteamID

  // Check if player is banned

  // Send player to website if they are not banned
  res.redirect('/');
});

router.get('/auth', steam.authenticate(), (req: Request, res: Response) => {
  res.redirect('/');
});

router.get('/logout', steam.enforceLogin('/'), (req: Request, res: Response) => {

});

export const routing: Router = router;
