
import { Router } from 'express';
import { LOCALE_ROUTE_PREFIX, truncateAt } from '../utils';
import { maxage } from '../maxage';
import { RootModelBuilder, RootViewModel } from '../view-models/root-view-model';
import * as Rss from 'rss';
import { LocalesNames, LocalesHelper } from '../locales-names';
import * as util from 'util';
import { Sitemap } from 'ournet.links';
import { createQueryApiClient } from '../data/api';
import { NewsEvent } from '@ournet/news-domain';
import { NewsEventStringFields } from '@ournet/api-client';
import { badImplementation } from 'boom';
import { ImageStorageHelper } from '@ournet/images-domain';
import { getImportantEventsIds } from '../view-models/important-view-model';

const route: Router = Router();

export default route;

//latest stories
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/rss/stories.xml`, async (req, res, next) => {

    const root = new RootModelBuilder({ req, res }).build() as RootViewModel;
    const { lang, country, links, __, config, schema, host } = root;
    const cacheTtl = 30;
    maxage(res, cacheTtl);

    const title = util.format(__(LocalesNames.site_title), LocalesHelper.getCountryName(__, country));
    const description = util.format(__(LocalesNames.site_description), LocalesHelper.getInCountryName(__, country));

    const feed = new Rss({
        title,
        description,
        feed_url: schema + '//' + host + links.news.rss.stories({ ul: lang }),
        site_url: schema + '//' + host,
        language: lang,
        pubDate: new Date(),
        ttl: cacheTtl * 60,
        generator: config.name
    });

    const api = createQueryApiClient<{ events: NewsEvent[] }>();

    api.newsEventsLatest('events', { fields: NewsEventStringFields }, { params: { country, lang, limit: 10 } });

    const apiResult = await api.execute();
    if (apiResult.errors) {
        return next(badImplementation(apiResult.errors[0].message));
    }

    const events = apiResult.data && apiResult.data.events || [];

    events.forEach(function (story) {
        feed.item(createFeedItem(links, story, lang, schema, host));
    });

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.xml());
});

//important stories
route.get(`/:ul${LOCALE_ROUTE_PREFIX}?/rss/stories/important.xml`, async (req, res, next) => {

    const root = new RootModelBuilder({ req, res }).build() as RootViewModel;
    const { lang, country, links, __, config, schema, host, currentDate } = root;
    const cacheTtl = 30;

    maxage(res, cacheTtl);

    const title = __(LocalesNames.important_news);
    const description = util.format(__(LocalesNames.most_important_news_in_last_7days_country), LocalesHelper.getCountryName(__, country));

    const feed = new Rss({
        title,
        description,
        feed_url: schema + '//' + host + links.news.rss.stories.important({ ul: lang }),
        site_url: schema + '//' + host,
        language: lang,
        pubDate: new Date(),
        ttl: cacheTtl * 60,
        generator: config.name
    });

    const api = createQueryApiClient<{ events: NewsEvent[] }>();

    const ids = await getImportantEventsIds({ limit: 12, lang, country, currentDate });

    api.newsEventsByIds('events', { fields: NewsEventStringFields }, { ids });

    const apiResult = await api.execute();
    if (apiResult.errors) {
        return next(badImplementation(apiResult.errors[0].message));
    }

    const events = apiResult.data && apiResult.data.events || [];

    events.forEach(function (story) {
        feed.item(createFeedItem(links, story, lang, schema, host));
    });

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.xml());
});

function createFeedItem(links: Sitemap, story: NewsEvent, lang: string, schema: string, host: string) {
    const url = schema + '//' + host + links.news.event(story.slug, story.id, { ul: lang, utm_source: 'rss', utm_medium: 'link', utm_campaign: 'rss' });

    const item = {
        title: story.title,
        description: truncateAt(story.summary, 250),
        url: url,
        guid: 'event-' + story.id,
        date: story.createdAt,
        enclosure: {
            url: ImageStorageHelper.eventUrl(story.imageId, 'large')
        }
    };

    return item;
}