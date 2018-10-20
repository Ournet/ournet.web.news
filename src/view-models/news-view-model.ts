import { PageViewModel, PageViewModelInput, PageViewModelBuilder } from "./page-view-model";
import {
    Place,
    HourlyForecastDataPoint,
    HourlyForecastDataPointStringFields,
    OurnetQueryApi,
    NewsTopItem,
    TopicStringFields,
    NewsTopItemStringFields,
    Topic,
} from "@ournet/api-client";

import { createQueryApiClient } from "../data/api";
import logger from "../logger";
import * as moment from "moment-timezone";
import { filterIrrelevantTopics } from "../irrelevant-topic-ids";


export class NewsViewModelBuilder<T extends NewsViewModel, I extends PageViewModelInput> extends PageViewModelBuilder<T, I> {

    constructor(input: I, api: OurnetQueryApi<T>) {
        super(input, api);

        const model = this.model;
        const { lang, config, __ } = model;

        model.currentDate = moment().tz(config.timezone).locale(lang);
    }

    async build() {
        const apiClient = createQueryApiClient<{ capital: Place, trendingTopics: NewsTopItem[] }>();

        const model = this.model;
        const { country, lang } = model;

        const result = await apiClient
            .placesPlaceById('capital', { fields: 'id name names longitude latitude timezone' },
                { id: model.config.capitalId })
            .newsTrendingTopics('trendingTopics', { fields: NewsTopItemStringFields }, { params: { country, lang, limit: 20, period: '24h' } })
            .execute();

        if (result.errors && result.errors.length) {
            logger.error(result.errors[0]);
        }

        if (result.data) {
            if (result.data.capital) {
                model.capital = result.data.capital;

                const { longitude,
                    latitude,
                    timezone, } = model.capital;

                this.api.weatherNowPlaceForecast('capitalForecast', { fields: HourlyForecastDataPointStringFields },
                    { place: { longitude, latitude, timezone } });
            }

            const trendingTopTopics = filterIrrelevantTopics({ lang, country }, result.data.trendingTopics || []).slice(0, 12);

            if (trendingTopTopics.length) {
                this.api.topicsTopicsByIds('trendingTopics', { fields: TopicStringFields },
                    { ids: trendingTopTopics.map(item => item.id) });
            }
        }

        return super.build();
    }

    protected formatModel(data: T) {
        if (data.capitalForecast) {
            this.model.capitalForecast = data.capitalForecast;
        }

        this.model.trendingTopics = data.trendingTopics || [];
        // for (const topic of this.model.trendingTopics) {
        //     const top = this.model.trendingTopTopics.find(item => item.id === topic.id);
        //     if (top) {
        //         topic.count = top.count;
        //     }
        // }

        return super.formatModel(data);
    }
}


export interface NewsViewModel extends PageViewModel {
    capital: Place
    capitalForecast: HourlyForecastDataPoint
    trendingTopics: TrendingTopic[]
    // trendingTopTopics: NewsTopItem[]

    currentDate: moment.Moment

    title: string
    subTitle: string
}

export interface TrendingTopic extends Topic {
    count: number
}
