
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { NewsEvent, NewsEventStringFields, ArticleContent, ArticleContentStringFields, Quote, QuoteStringFields } from "@ournet/api-client";
import { notFound } from "boom";
import { ArticleContentBuilder } from '@ournet/news-domain';
import { createQueryApiClient } from "../data/api";

export interface EventViewModelInput extends PageViewModelInput {
    id: string
}

export interface EventViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
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

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 13 } });
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
        this.model.eventContent = data.eventContent;
        this.model.eventQuotes = data.eventQuotes;

        return super.formatModel(data);
    }
}
