
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { LocalesNames, LocalesHelper } from "../locales-names";
import * as util from 'util';
import { NewsEvent, Quote, NewsEventStringFields, QuoteStringFields } from "@ournet/api-client";
import { createQueryApiClient } from "../data/api";
import { Dictionary, uniq } from "@ournet/domain";
import { executeApi } from "./async-view-model";
import { Moment } from "moment-timezone";

export interface ImportantViewModelInput extends PageViewModelInput {

}

export interface ImportantViewModel extends NewsViewModel {
    importantEvents: NewsEvent[]
    latestQuotes: Quote[]
}

export class ImportantViewModelBuilder extends NewsViewModelBuilder<ImportantViewModel, ImportantViewModelInput> {

    async build() {

        const { lang, links, __, head, country, currentDate } = this.model;

        head.title = __(LocalesNames.important_news);
        head.description = util.format(__(LocalesNames.most_important_news_in_last_7days_country), LocalesHelper.getCountryName(__, country));

        this.setCanonical(links.news.important({ ul: lang }));

        const ids = await getImportantEventsIds({ limit: 12, lang, country, currentDate });

        this.api.newsEventsByIds('importantEvents', { fields: NewsEventStringFields }, { ids })
            .quotesLatest('latestQuotes', { fields: QuoteStringFields }, { params: { lang, country, limit: 6 } });

        return super.build();
    }

    protected formatModel(data: ImportantViewModel) {

        this.model.importantEvents = (data.importantEvents || []).sort((a, b) => {
            const aDate = a.createdAt.substr(0, 10);
            const bDate = b.createdAt.substr(0, 10);
            if (aDate === bDate) {
                return b.countNews - a.countNews;
            }
            if (aDate < bDate) {
                return 1;
            }
            return -1;
        });

        this.model.latestQuotes = data.latestQuotes || [];

        return super.formatModel(data);
    }
}

export async function getImportantEventsIds(data: { limit: number, lang: string, country: string, currentDate: Moment }) {
    const { lang, country, currentDate, limit } = data;
    const api = createQueryApiClient<Dictionary<NewsEvent[]>>();

    const maxDate = currentDate.clone().add(1, 'day');
    const minDate = currentDate.clone();

    const countDays = 7;
    for (let i = 0; i < countDays; i++) {
        api.newsEventsLatest(`day${i}`, { fields: 'id countNews' }, { params: { limit: 100, lang, country, maxDate: maxDate.format('YYYY-MM-DD'), minDate: minDate.format('YYYY-MM-DD') } })
        maxDate.add(-1, 'day');
        minDate.add(-1, 'day');
    }

    const result = await executeApi(api);

    const allEvents: NewsEvent[] = Object.keys(result).reduce<NewsEvent[]>((list, key) => list.concat(result[key]), []);

    const mostPopularIds = uniq(allEvents.sort((a, b) => b.countNews - a.countNews).map(item => item.id)).slice(0, limit);

    return mostPopularIds;
} 
