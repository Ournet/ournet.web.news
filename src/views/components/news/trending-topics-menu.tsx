
import * as React from 'react';
import { Sitemap } from 'ournet.links';
import { TrendingTopic } from '../../../view-models/news-view-model';
import { TopicHelper } from '@ournet/topics-domain';

export type TrendingTopicsMenuPorps = {
    lang: string
    links: Sitemap
    topics: TrendingTopic[]
}

export default class TrendingTopicsList extends React.Component<TrendingTopicsMenuPorps> {
    render() {
        const { links, topics, lang } = this.props;
        return (
            <div className='c-trend-menu'>
                <ul className='c-trend-menu__l'>
                    <li className='c-trend-menu__trend'></li>
                    {topics.map(item => <li className='c-trend-menu__i' key={item.id}><a title={item.name} href={links.news.topic(TopicHelper.parseSlugFromId(item.id), { ul: lang })}>{item.abbr || item.name}</a></li>)}
                </ul>
            </div>
        );
    }
}
