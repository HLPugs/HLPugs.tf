import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hi!');
});

router.get('/authenticate', (req: Request, res: Response) => {
  res.send('Auths!');
});

export const routing: Router = router;