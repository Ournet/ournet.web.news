
import { Router } from 'express';
import { RootModelBuilder, RootViewModel } from '../view-models/root-view-model';
import { maxageRedirect, maxage } from '../maxage';
import { getFavicon, getAppleFavicon } from '../config';

const route: Router = Router();

export default route;

route.get('/url', function (req, res) {
    maxageRedirect(res);
    let url = req.query.url as string;
    if (!url.startsWith('http')) {
        url = 'http://' + url;
    }
    return res.redirect(301, url);
});

route.get('/alt-adsense-ads.html', function (_req, res) {
    maxageRedirect(res);
    return res.redirect(301, 'http://assets.ournetcdn.net/backup-ads/index.html');
});

route.get('/favicon.ico', function (req, res) {
    const model = new RootModelBuilder({ req, res }).build() as RootViewModel;
    maxage(res, 60 * 24 * 14);
    return res.redirect(301, getFavicon(model.config));
});

route.get('/apple-touch-icon.png', function (req, res) {
    const model = new RootModelBuilder({ req, res }).build() as RootViewModel;
    maxage(res, 60 * 24 * 14);
    return res.redirect(301, getAppleFavicon(model.config));
});
