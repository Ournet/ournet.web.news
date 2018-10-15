import { PageViewModel, PageViewModelInput, PageViewModelBuilder } from "./page-view-model";
import { Place, HourlyForecastDataPoint, HourlyForecastDataPointStringFields, NewsEvent, OurnetQueryApi, NewsTopic, NewsTopItem, NewsTopItemStringFields } from "@ournet/api-client";
import { createQueryApiClient } from "../data/api";
import logger from "../logger";
import * as moment from "moment-timezone";


export class NewsViewModelBuilder<T extends NewsViewModel, I extends PageViewModelInput> extends PageViewModelBuilder<T, I> {

    constructor(input: I, api: OurnetQueryApi<T>) {
        super(input, api);

        const model = this.model;
        const { lang, config, __ } = model;

        model.currentDate = moment().tz(config.timezone).locale(lang);
    }

    async build() {
        const apiClient = createQueryApiClient<T>();

        const model = this.model;
        const { country, lang } = model;

        const result = await apiClient
            .placesPlaceById('capital', { fields: 'id name names longitude latitude timezone' },
                { id: model.config.capitalId })
            .execute();

        if (result.errors && result.errors.length) {
            logger.error(result.errors[0]);
        }

        if (result.data && result.data.capital) {
            model.capital = result.data.capital

            const { longitude,
                latitude,
                timezone, } = model.capital;

            this.api.weatherNowPlaceForecast('capitalForecast', { fields: HourlyForecastDataPointStringFields },
                { place: { longitude, latitude, timezone } });
        }

        this.api.newsTrendingTopics('trendingTopics', { fields: NewsTopItemStringFields }, { params: { country, lang, limit: 10, period: '24h' } });

        return super.build();
    }

    protected formatModel(data: T) {
        if (data.capitalForecast) {
            this.model.capitalForecast = data.capitalForecast;
        }
        this.model.trendingTopics = data.trendingTopics || [];

        return super.formatModel(data);
    }
}


export interface NewsViewModel extends PageViewModel {
    capital: Place
    capitalForecast: HourlyForecastDataPoint
    trendingTopics: NewsTopItem[]

    currentDate: moment.Moment

    title: string
    subTitle: string
}
