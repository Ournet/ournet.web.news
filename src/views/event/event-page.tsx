
import * as React from 'react';
import CommonLayout from '../common-layout';
import { EventViewModel } from '../../view-models/event-view-model';
import { ImageStorageHelper } from '@ournet/images-domain';
import EventMedia from './event-media';
import getArticleContent from '../components/news/get-article-content';
import { outReadMoreLink } from '../components/news/out-read-more';
import { startWithUpperCase } from '../../utils';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import moment = require('moment-timezone');
import TopicListItem from '../components/news/topic-list-item';
import { Share } from '../components/share';

export default class EventPage extends React.Component<EventViewModel> {
    render() {
        const { lang, head, __, links, latestEvents, event, config, eventContent } = this.props;

        const imageLargeUrl = ImageStorageHelper.eventUrl(event.imageId, 'large');

        head.elements.push(<meta key='og_type' property="og:type" content="article" />);
        head.elements.push(<meta key='og_image' property="og:image" content={imageLargeUrl} />);
        head.elements.push(<meta key='published_time' property="article:published_time" content={event.createdAt} />);
        head.elements.push(<meta key='publisher' property="article:publisher" content={config.name} />);
        for (let tag of event.topics) {
            head.elements.push(<meta key={`tag-${tag.id}`} property="article:tag" content={tag.name} />);
        }

        const link = links.news.event(event.slug, event.id, { ul: lang });

        const paragraphs = eventContent && getArticleContent({ lang, content: eventContent, links, topics: event.topics, maxPhrases: 2 })
            || event.summary.split(/\n+/).map((item, index) => <p key={`phrase-s-${index}`}>{item}</p>);

        const createdAt = moment(event.createdAt).tz(config.timezone).locale(lang);

        return (
            <CommonLayout {...this.props}>
                <main>
                    <div className='o-layout'>
                        <div className='o-layout__item u-4/6@desktop'>
                            <article className='c-event'>
                                <EventMedia root={this.props} event={event} />
                                <div className='c-event__body'>
                                    <div className='o-layout o-layout--small'>
                                        <div className='o-layout__item u-1/6@tablet'>
                                        </div>
                                        <div className='o-layout__item u-5/6@tablet'>
                                            <h1 className='c-event__title'><a href={link} title={event.title}>{event.title}</a></h1>
                                            <Share url={head.canonical} align='right' services={config.shareServices} lang={lang} />
                                            <div className='c-event__stats'>
                                                <time dateTime={event.createdAt}>{createdAt.format('lll')}</time>
                                                {', ' + util.format(__(LocalesNames.news_count), event.countNews) + ', '}
                                                {util.format(__(LocalesNames.count_views_format), event.countViews)}
                                            </div>
                                            <div className='c-event__text'>
                                                {paragraphs}
                                            </div>
                                            {outReadMoreLink({ url: event.source.host + event.source.path, source: startWithUpperCase(event.source.sourceId), links, __ })}
                                            <ul className='c-event__tags'>
                                                {event.topics.map(item => <li key={item.id}><TopicListItem links={links} lang={lang} item={item} view='tag' /></li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <div className='o-layout__item u-2/6@desktop'>

                        </div>
                    </div>
                </main>
            </CommonLayout >
        )
    }
}
