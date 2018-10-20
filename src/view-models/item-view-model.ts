
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { NewsItem, NewsItemStringFields, ArticleContent, ArticleContentStringFields, NewsEvent, NewsEventStringFields } from "@ournet/api-client";
import { notFound } from "boom";
import { ArticleContentBuilder } from '@ournet/news-domain';
import { createQueryApiClient, createMutationApiClient } from "../data/api";
import logger from "../logger";
import { filterIrrelevantTopics } from "../irrelevant-topic-ids";

export interface ItemViewModelInput extends PageViewModelInput {
    id: string
}

export interface ItemViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
    similarEvents: NewsEvent[]
    item: NewsItem
    event?: NewsEvent
    articleContent?: ArticleContent
}

export class ItemViewModelBuilder extends NewsViewModelBuilder<ItemViewModel, ItemViewModelInput> {

    async build() {

        const { id } = this.input;

        const localeApi = createQueryApiClient<{ item: NewsItem }>();
        localeApi.newsItemById('item', { fields: NewsItemStringFields }, { id });

        const apiResult = await this.executeApi(localeApi);

        if (!apiResult.item) {
            throw notFound(`Not found event id=${id}`);
        }
        const newsItem = this.model.item = apiResult.item;
        const { lang, links, head, country } = this.model;

        head.title = newsItem.title;
        head.description = newsItem.summary;

        this.setCanonical(links.news.item(newsItem.id, { ul: lang }));

        createMutationApiClient<{ countViews: number }>()
            .newsViewNewsItem('countViews', { id })
            .execute()
            .catch(e => logger.error(e));

        const relevaltTopicsIds = newsItem.topics && filterIrrelevantTopics({ lang, country }, newsItem.topics).map(item => item.id) || [];

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 3 } });
        if (relevaltTopicsIds.length) {
            this.api.newsSimilarEventsByTopics('similarEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 3, topicIds: relevaltTopicsIds.slice(0, 2), exceptId: newsItem.id } });
        }

        if (newsItem.hasContent) {
            this.api.newsArticleContentById('articleContent', { fields: ArticleContentStringFields }, { id: ArticleContentBuilder.createId({ refId: id, refType: 'NEWS' }) });
        }

        if (newsItem.eventId) {
            this.api.newsEventById('event', { fields: NewsEventStringFields }, { id: newsItem.eventId });
        }

        return super.build();
    }

    protected formatModel(data: ItemViewModel) {

        this.model.latestEvents = data.latestEvents || [];
        this.model.similarEvents = data.similarEvents || [];
        this.model.articleContent = data.articleContent;
        this.model.event = data.event;

        if (this.model.event && this.model.event.source.id === this.model.item.id) {
            this.model.redirect = {
                code: 301,
                url: this.model.links.news.event(this.model.event.slug, this.model.event.id, { ul: this.model.lang })
            }
            return this.model;
        }

        return super.formatModel(data);
    }
}
