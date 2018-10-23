
import { NewsViewModel, NewsViewModelBuilder } from "./news-view-model";
import { PageViewModelInput } from "./page-view-model";
import { LocalesNames, LocalesHelper } from "../locales-names";
import * as util from 'util';
import { NewsEvent, Quote, NewsEventStringFields, QuoteStringFields } from "@ournet/api-client";

export interface IndexViewModelInput extends PageViewModelInput {

}

export interface IndexViewModel extends NewsViewModel {
    latestEvents: NewsEvent[]
    latestQuotes: Quote[]
}

export class IndexViewModelBuilder extends NewsViewModelBuilder<IndexViewModel, IndexViewModelInput> {

    build() {

        const { lang, links, __, head, country } = this.model;

        head.title = util.format(__(LocalesNames.site_title), LocalesHelper.getCountryName(__, country));
        head.description = util.format(__(LocalesNames.site_description), LocalesHelper.getInCountryName(__, country));

        this.setCanonical(links.news.home({ ul: lang }));

        this.api.newsEventsLatest('latestEvents', { fields: NewsEventStringFields }, { params: { lang, country, limit: 14 } })
            .quotesLatest('latestQuotes', { fields: QuoteStringFields }, { params: { lang, country, limit: 6 } });

        return super.build();
    }

    protected formatModel(data: IndexViewModel) {

        this.model.latestEvents = data.latestEvents || [];
        this.model.latestQuotes = data.latestQuotes || [];

        return super.formatModel(data);
    }
}
