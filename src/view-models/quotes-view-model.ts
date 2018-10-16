
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { LocalesNames, LocalesHelper } from "../locales-names";
import * as util from 'util';
import { NewsEvent, Quote, NewsEventStringFields, QuoteStringFields } from "@ournet/api-client";

export interface QuotesViewModelInput extends PageViewModelInput {

}

export interface QuotesViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
    latestQuotes: Quote[]
}

export class QuotesViewModelBuilder extends NewsViewModelBuilder<QuotesViewModel, QuotesViewModelInput> {

    build() {

        const { lang, links, __, head, country } = this.model;

        head.title = __(LocalesNames.latest_quotes_in_media);
        head.description = util.format(__(LocalesNames.latest_quotes_in_media_country_format), LocalesHelper.getCountryName(__, country));

        this.model.title = __(LocalesNames.latest_quotes);

        this.setCanonical(links.news.quotes({ ul: lang }));

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 4 } })
            .quotesLatest('latestQuotes', { fields: QuoteStringFields }, { params: { lang, country, limit: 12 } });

        return super.build();
    }

    protected formatModel(data: QuotesViewModel) {

        this.model.latestEvents = data.latestEvents || [];
        this.model.latestQuotes = data.latestQuotes || [];

        return super.formatModel(data);
    }
}
