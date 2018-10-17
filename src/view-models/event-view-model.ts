
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { NewsEvent, NewsEventStringFields, ArticleContent, ArticleContentStringFields } from "@ournet/api-client";
import { notFound } from "boom";
import { ArticleContentBuilder } from '@ournet/news-domain';

export interface EventViewModelInput extends PageViewModelInput {
    id: string
}

export interface EventViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
    event: NewsEvent
    eventContent: ArticleContent
}

export class EventViewModelBuilder extends NewsViewModelBuilder<EventViewModel, EventViewModelInput> {

    build() {

        const { lang, country } = this.model;
        const { id } = this.input;

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 13 } })
            .newsEventById('event', { fields: NewsEventStringFields }, { id })
            .newsArticleContentById('eventContent', { fields: ArticleContentStringFields }, { id: ArticleContentBuilder.createId({ refId: id, refType: 'EVENT' }) });

        return super.build();
    }

    protected formatModel(data: EventViewModel) {
        if (!data.event) {
            throw notFound(`Not found event id=${this.input.id}`);
        }
        this.model.event = data.event;
        this.model.latestEvents = data.latestEvents || [];
        this.model.eventContent = data.eventContent;

        const { lang, links, head, event } = this.model;

        head.title = event.title;
        head.description = event.summary;

        this.setCanonical(links.news.event(event.slug, event.id, { ul: lang }));

        return super.formatModel(data);
    }
}
