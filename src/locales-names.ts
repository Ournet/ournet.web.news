import { I18nFn } from "./locale";

export enum LocalesNames {
    site_title = "site_title",
    site_description = "site_description",
    language_ro = "language_ro",
    country_md = "country_md",
    in_country_md = "in_country_md",
    country_ro = "country_ro",
    in_country_ro = "in_country_ro",
    news = "news",
    weather = "weather",
    opinia = "opinia",
    exchange = "exchange",
    home = "home",
    search_text = "search_text",
    exchange_rates = "exchange_rates",
    contact = "contact",
    international = "international",
    share_on_format = "share_on_format",
    views = "views",
    images = "images",
    photo = "photo",
    related_news = "related_news",
    ads = "ads",
    latest_news = "latest_news",
    page_topic_title = "page_topic_title",
    topic_description = "topic_description",
    events = "events",
    topic_title = "topic_title",
    topic_latest_news = "topic_latest_news",
    quotes = "quotes",
    "24_hrs" = "24_hrs",
    trending = "trending",
    search_result = "search_result",
    more_events = "more_events",
    page_topic_quotes_title = "page_topic_quotes_title",
    page_topic_events_title = "page_topic_events_title",
    more_quotes = "more_quotes",
    quotes_by_author = "quotes_by_author",
    news_count = "news_count",
    video = "video",
    category_title = "category_title",
    news_sources = "news_sources",
    popular_news = "popular_news",
    latest_quotes_in_media = "latest_quotes_in_media",
    latest_quotes_in_media_country_format = "latest_quotes_in_media_country_format",
    latest_quotes = "latest_quotes",
    info = "info",
    useful = "useful",
    popular = "popular",
    important = "important",
    video_news = "video_news",
    read_more_on_source = "read_more_on_source",
    quotes_about = "quotes_about",
    important_news = "important_news",
    latest_events = "latest_events",
    latest_events_from_country = "latest_events_from_country",
    events_from_country = "events_from_country",
    more = "more",
    horoscope = "horoscope"
}

export class LocalesHelper {
    static getCountryName(__: I18nFn, countryCode: string) {
        return __(`country_${countryCode}`);
    }

    static getInCountryName(__: I18nFn, countryCode: string) {
        return __(`in_country_${countryCode}`);
    }

    static getLanguageName(__: I18nFn, languageCode: string) {
        return __(`language_${languageCode}`);
    }

    static getProjectName(__: I18nFn, project: string) {
        return __(project);
    }
}
