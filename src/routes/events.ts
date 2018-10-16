
import { Router } from 'express';
import { LOCALE_ROUTE_PREFIX } from '../utils';
import { importantHandler } from '../controllers/events-controller';

const route: Router = Router();

export default route;

// important
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/important`, (req, res, next) =>
    importantHandler({ req, res }, next));


