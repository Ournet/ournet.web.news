
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
import EventNewsItems from './event-news-items';
import QuoteListItem from '../components/news/quote-list-item';
import GroupHeader from '../components/group-header';
import EventListItem from '../components/news/event-list-item';
import SectionHeader from '../components/section-header';
import adAside from '../components/ad-aside';

export default class EventPage extends React.Component<EventViewModel> {
    render() {
        const { lang, head, __, links, latestEvents, event, config, eventContent, eventQuotes, similarEvents } = this.props;

        const imageLargeUrl = ImageStorageHelper.eventUrl(event.imageId, 'large');

        head.elements.push(<meta key='og_type' property="og:type" content="article" />);
        head.elements.push(<meta key='og_image' property="og:image" content={imageLargeUrl} />);
        head.elements.push(<meta key='published_time' property="article:published_time" content={event.createdAt} />);
        head.elements.push(<meta key='publisher' property="article:publisher" content={config.name} />);
        for (let tag of event.topics) {
            head.elements.push(<meta key={`tag-${tag.id}`} property="article:tag" content={tag.name} />);
        }

        const link = links.news.story(event.slug, event.id, { ul: lang });

        const paragraphs = eventContent && getArticleContent({ lang, content: eventContent, links, topics: event.topics, maxPhrases: 3 })
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
                                            {eventQuotes && <div className='c-event_quotes'>{eventQuotes.map(item => <QuoteListItem key={item.id} item={item} root={this.props} view='card' />)}</div>}
                                            <hr />
                                            <EventNewsItems root={this.props} event={event} />
                                            <hr />
                                            <ul className='c-event__tags'>
                                                {event.topics.map(item => <li key={item.id}><TopicListItem links={links} lang={lang} item={item} view='tag' /></li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </article>
                            <div className='c-section'>
                                {similarEvents.length > 0 ?
                                    [<SectionHeader key='sheader' name={__(LocalesNames.related_news)} />,
                                    <div key='slayout' className='o-layout'>
                                        {similarEvents.slice(0, 2).map(item => <div key={item.id} className='o-layout__item u-1/2@mobile'><EventListItem root={this.props} item={item} view='card' /></div>)}
                                    </div>] : null
                                }
                            </div>
                        </div>
                        <div className='o-layout__item u-2/6@desktop'>
                            {adAside()}
                            <div className='c-section'>
                                <SectionHeader name={__(LocalesNames.latest_events)} link={links.news.home({ ul: lang })} />
                                <ul className='o-list-bare'>
                                    {latestEvents.map(item => <li key={item.id} className='o-list-bare__item'><EventListItem root={this.props} item={item} view='media-left' /></li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <script dangerouslySetInnerHTML={{__html:`(function(){var img=new Image();img.src='${links.news.actions.viewStory(event.id,{ul: lang})}';}());`}}></script>
                </main>
            </CommonLayout >
        )
    }
}
