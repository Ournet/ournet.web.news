
import { Router, Response } from 'express';
import { LOCALE_ROUTE_PREFIX } from '../utils';
import { maxage } from '../maxage';
import { createMutationApiClient } from '../data/api';
import logger from '../logger';

const route: Router = Router();

export default route;

route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/actions/view_story/:id`, async (req, res) => {
    const id = req.params.id as string;

    maxage(res, 0);

    createMutationApiClient<{ countViews: number }>()
        .newsViewNewsEvent('countViews', { id })
        .execute()
        .catch(e => logger.error(e))
        .then(() => sendPixel(res));
});

route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/actions/view_item/:id`, async (req, res) => {
    const id = req.params.id as string;

    maxage(res, 0);

    createMutationApiClient<{ countViews: number }>()
        .newsViewNewsItem('countViews', { id })
        .execute()
        .catch(e => logger.error(e))
        .then(() => sendPixel(res));
});

function sendPixel(res: Response) {
    const img = new Buffer('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.set('Content-Type', 'image/gif');
    res.set('Content-Length', img.length.toString());
    res.send(img);
}
