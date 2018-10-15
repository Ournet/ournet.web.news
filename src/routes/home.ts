
import { Router } from 'express';
import { indexHandler } from '../controllers/index-controller';
import { maxage } from '../maxage';
import { RootModelBuilder, RootViewModel } from '../view-models/root-view-model';
import { LocalesNames } from '../locales-names';
import { LOCALE_ROUTE_PREFIX } from '../utils';

const route: Router = Router();

export default route;

//index
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?`, (req, res, next) =>
    indexHandler({ req, res }, next));


route.get('/manifest.json', function (req, res) {

    const model = new RootModelBuilder({ req, res }).build() as RootViewModel;
    const { config, __ } = model;

    const manifest = {
        name: config.name,
        short_name: __(LocalesNames.horoscope),
        // start_url: '/',
        display: 'standalone',
        gcm_sender_id: '482941778795'
    };

    maxage(res, 60 * 24 * 7);

    res.send(manifest);
});
