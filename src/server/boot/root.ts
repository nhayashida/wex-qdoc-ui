import bparser from 'body-parser';
import { Request, Response, Router } from 'express';
import explorer from '../controllers/explorer';

const root = async app => {
  const router: Router = app.loopback.Router();
  router.get('/healthy', app.loopback.status());
  router.get('/', (req: Request, res: Response) => res.redirect('/explorer'));
  router.get('/explorer/collections', explorer.collections);
  router.post('/explorer/query', bparser.json(), explorer.query);
  app.use(router);
};

export default root;
