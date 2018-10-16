
import { Router } from 'express';
import { LOCALE_ROUTE_PREFIX } from '../utils';
import { quotesHandler } from '../controllers/quotes-controller';

const route: Router = Router();

export default route;

// quotes
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/quotes`, (req, res, next) =>
    quotesHandler({ req, res }, next));


