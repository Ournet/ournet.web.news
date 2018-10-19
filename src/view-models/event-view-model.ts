
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { NewsEvent, NewsEventStringFields, ArticleContent, ArticleContentStringFields, Quote, QuoteStringFields } from "@ournet/api-client";
import { notFound } from "boom";
import { ArticleContentBuilder } from '@ournet/news-domain';
import { createQueryApiClient, createMutationApiClient } from "../data/api";
import logger from "../logger";
import { getIrrelevantTopicIds } from "../irrelevant-topic-ids";

export interface EventViewModelInput extends PageViewModelInput {
    id: string
}

export interface EventViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
    similarEvents: NewsEvent[]
    event: NewsEvent
    eventContent?: ArticleContent
    eventQuotes?: Quote[]
}

export class EventViewModelBuilder extends NewsViewModelBuilder<EventViewModel, EventViewModelInput> {

    async build() {

        const { id } = this.input;

        const localeApi = createQueryApiClient<{ event: NewsEvent }>();
        localeApi.newsEventById('event', { fields: NewsEventStringFields }, { id });

        const apiResult = await this.executeApi(localeApi);

        if (!apiResult.event) {
            throw notFound(`Not found event id=${id}`);
        }
        const event = this.model.event = apiResult.event;
        const { lang, links, head, country } = this.model;

        head.title = event.title;
        head.description = event.summary;

        this.setCanonical(links.news.event(event.slug, event.id, { ul: lang }));

        createMutationApiClient<{ countViews: number }>()
            .newsViewNewsEvent('countViews', { id })
            .execute()
            .catch(e => logger.error(e));

        const irrelevantTopicIds = getIrrelevantTopicIds({ lang, country });
        const relevaltTopicsIds = event.topics.filter(topic => !irrelevantTopicIds.includes(topic.id)).map(item => item.id);

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 3 } })
            .newsSimilarEventsByTopics('similarEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 3, topicIds: relevaltTopicsIds.slice(0, 2), exceptId: event.id } });

        if (event.hasContent) {
            this.api.newsArticleContentById('eventContent', { fields: ArticleContentStringFields }, { id: ArticleContentBuilder.createId({ refId: id, refType: 'EVENT' }) });
        }
        if (event.quotesIds && event.quotesIds.length) {
            this.api.quotesQuotesByIds('eventQuotes', { fields: QuoteStringFields }, { ids: event.quotesIds });
        }
        return super.build();
    }

    protected formatModel(data: EventViewModel) {

        this.model.latestEvents = data.latestEvents || [];
        this.model.similarEvents = data.similarEvents || [];
        this.model.eventContent = data.eventContent;
        this.model.eventQuotes = data.eventQuotes;

        return super.formatModel(data);
    }
}
