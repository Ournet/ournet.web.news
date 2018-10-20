import { Dictionary, BaseEntity } from "@ournet/domain";
import { Locale } from "./locale";

const DATA: Dictionary<string[]> = require('../irrelevant-topic-ids.json');

export function getIrrelevantTopicIds({ lang, country }: Locale) {
    const key = `${lang}-${country}`;
    return DATA[key] || [];
}

export function filterIrrelevantTopics<T extends BaseEntity>(locale: Locale, topics: T[]) {
    const irrelevantIds = getIrrelevantTopicIds(locale);
    if (irrelevantIds.length === 0) {
        return topics;
    }

    return topics.filter(item => !irrelevantIds.includes(item.id));
}
