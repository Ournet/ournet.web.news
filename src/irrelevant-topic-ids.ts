import { Dictionary } from "@ournet/domain";

const DATA: Dictionary<string[]> = require('../irrelevant-topic-ids.json');

export function getIrrelevantTopicIds({ lang, country }: { lang: string, country: string }) {
    const key = `${lang}-${country}`;
    return DATA[key] || [];
}
