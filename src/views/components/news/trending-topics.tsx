
import * as React from 'react';
import { Sitemap } from 'ournet.links';
import { TrendingTopic } from '../../../view-models/news-view-model';
import { TopicHelper } from '@ournet/topics-domain';

export type TrendingTopicsPorps = {
    lang: string
    links: Sitemap
    topics: TrendingTopic[]
}

export default class TrendingTopics extends React.Component<TrendingTopicsPorps> {
    render() {
        const { links, topics, lang } = this.props;
        return (
            <div className='c-trend-topics'>
                {topics.map(item => <li key={item.id}><a title={item.name} href={links.news.topic(TopicHelper.parseSlugFromId(item.id), { ul: lang })}>{item.abbr || item.name}</a></li>)}
            </div>
        );
    }
}
