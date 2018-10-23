
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { NewsEvent, NewsEventStringFields, Quote, QuoteStringFields, Topic, NewsItem, TopicStringFields, NewsItemStringFields } from "@ournet/api-client";
import { notFound } from "boom";
import { createQueryApiClient } from "../data/api";
import { TopicHelper } from "@ournet/topics-domain";
import * as util from 'util';
import { LocalesNames } from "../locales-names";

export interface TopicViewModelInput extends PageViewModelInput {
    slug: string
}

export interface TopicViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
    topicEvents: NewsEvent[]
    topicNews: NewsItem[]
    topic: Topic
    aboutQuotes: Quote[]
    byQuotes: Quote[]
    displayName: string
    slug: string
}

export class TopicViewModelBuilder extends NewsViewModelBuilder<TopicViewModel, TopicViewModelInput> {

    async build() {

        const { lang, country, __, head, links } = this.model;
        let { slug } = this.input;
        this.model.slug = slug = slug.trim().toLowerCase();
        const id = TopicHelper.formatIdFromSlug(slug, { lang, country });

        const localeApi = createQueryApiClient<{ topic: Topic }>();
        localeApi.topicsTopicById('topic', { fields: TopicStringFields }, { id });

        const apiResult = await this.executeApi(localeApi);

        if (!apiResult.topic) {
            throw notFound(`Not found topic id=${id}`);
        }

        const topic = this.model.topic = apiResult.topic;
        const commonName = topic.commonName || topic.name;

        const displayName = this.model.displayName = commonName + (topic.abbr && topic.abbr.length < 10 ? ` (${topic.abbr})` : '');

        head.title = util.format(__(LocalesNames.page_topic_title), displayName);
        head.description = util.format(__(LocalesNames.topic_description), topic.name);

        this.setCanonical(links.news.topic(slug, { ul: lang }));

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 4 } })
            .newsEventsLatestByTopic('topicEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 4, topicId: topic.id } })
            .newsItemsLatestByTopic('topicNews', { fields: NewsItemStringFields }, { params: { lang, country, limit: 5, topicId: topic.id } })
            .quotesLatestByTopic('aboutQuotes', { fields: QuoteStringFields }, { params: { country, lang, limit: 3, topicId: topic.id } });

        if (topic.type === 'PERSON') {
            this.api.quotesLatestByAuthor('byQuotes', { fields: QuoteStringFields }, { params: { country, lang, limit: 3, authorId: topic.id } })
        }
        return super.build();
    }

    protected formatModel(data: TopicViewModel) {

        this.model.latestEvents = data.latestEvents || [];
        this.model.topicEvents = data.topicEvents || [];
        this.model.topicNews = data.topicNews || [];
        this.model.byQuotes = data.byQuotes || [];
        this.model.aboutQuotes = data.aboutQuotes || [];

        return super.formatModel(data);
    }
}
