import express, { Router } from 'express';

/**
 * The base controller that defines explicit behavior within all derived controllers
 * @typedef BaseController
 */
export abstract class BaseController {
  router: express.Router = Router();

  constructor() {
    this.initializeRouteBindings();
  }

  /**
  * Used to bind routes to methods
  *
  * Ex: this.router.get('/path', this.method);
  *
  * Note that req, res and next are passed automatically
  */
  abstract initializeRouteBindings(): void;
}
