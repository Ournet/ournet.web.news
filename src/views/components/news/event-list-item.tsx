
import * as React from 'react';
import { RootViewModel } from '../../../view-models/root-view-model';
import { NewsEvent, NewsTopic } from '@ournet/api-client';
import { ImageStorageHelper, ImageSizeName } from '@ournet/images-domain';
import { truncateAt } from '../../../utils';
import moment = require('moment-timezone');
import { filterIrrelevantTopics } from '../../../irrelevant-topic-ids';
import { Locale } from '../../../locale';

export type EventListItemProps = {
    root: RootViewModel
    view: EventListItemViewName
    item: NewsEvent
    imageSize?: ImageSizeName
}

export type EventListItemViewName = 'main' | 'card' | 'media-left' | 'media-right';

export default class EventListItem extends React.Component<EventListItemProps>{
    render() {
        return getItemView(this.props);
    }
}

function getItemView(props: EventListItemProps) {
    switch (props.view) {
        case 'main': return mainItemView(props);
        case 'card': return cardItemView(props);
        case 'media-left':
        case 'media-right': return mediaItemView(props);
    }
    return null;
}

function mainItemView(props: EventListItemProps) {
    const { item, root } = props;
    const { links, lang, config, country } = root;
    const mainTopic = getMainTopic({ lang, country }, item.topics);
    const createdAt = moment(item.createdAt).tz(config.timezone).locale(lang);
    return (
        <div className='c-event-it c-event-it--main'>
            <a title={item.title} href={links.news.event(item.slug, item.id, { ul: lang })}>
                <span className='c-event-it__media o-lazy' data-src={ImageStorageHelper.eventUrl(item.imageId, 'large')}></span>
                <h2 className='c-event-it__title'>{truncateAt(item.title, 100)}</h2>
            </a>
            <div className='c-event-it__info'>
                <div className='c-event-it__stats'>
                    <time dateTime={item.createdAt}>{createdAt.fromNow(true)}</time>
                </div>
                <a className='c-event-it__topic' title={mainTopic.name} href={links.news.topic(mainTopic.slug, { ul: lang })}>{mainTopic.abbr || truncateAt(mainTopic.name, 30)}</a>
            </div>
            <ul className='c-event-it__items'>
                {item.items.slice(0, 4).map(it => <li key={it.id}><a title={it.title} href={links.news.item(it.id, { ul: lang })}>{truncateAt(it.title, 60)}</a></li>)}
            </ul>
        </div>
    )
}

function cardItemView(props: EventListItemProps) {
    const { item, root, imageSize } = props;
    const { links, lang, config, country } = root;
    const mainTopic = getMainTopic({ lang, country }, item.topics);
    const createdAt = moment(item.createdAt).tz(config.timezone).locale(lang);

    return (
        <div className='c-event-it c-event-it--card'>
            <a title={item.title} href={links.news.event(item.slug, item.id, { ul: lang })}>
                <span className='c-event-it__media o-lazy' data-src={ImageStorageHelper.eventUrl(item.imageId, imageSize || 'medium')}></span>
                <h3 className='c-event-it__title'>{truncateAt(item.title, 80)}</h3>
            </a>
            <div className='c-event-it__info'>
                <div className='c-event-it__stats'>
                    <time dateTime={item.createdAt}>{createdAt.fromNow(true)}</time>
                </div>
                <a className='c-event-it__topic' title={mainTopic.name} href={links.news.topic(mainTopic.slug, { ul: lang })}>{mainTopic.abbr || truncateAt(mainTopic.name, 30)}</a>
            </div>
        </div>
    )
}

function mediaItemView(props: EventListItemProps) {
    const { item, root, imageSize, view } = props;
    const { links, lang, country, config } = root;
    const mainTopic = getMainTopic({ lang, country }, item.topics);
    const link = links.news.event(item.slug, item.id, { ul: lang });
    const createdAt = moment(item.createdAt).tz(config.timezone).locale(lang);

    return (
        <div className={'c-event-it c-event-it--media o-media' + (view === 'media-right' ? ' o-media--reverse' : '')}>
            <div className='o-media__img'>
                <span className='c-event-it__media o-lazy' data-src={ImageStorageHelper.eventUrl(item.imageId, imageSize || 'square')}></span>
            </div>
            <div className='c-event-it__info o-media__body'>
                <a className='c-event-it__title' href={link} title={item.title}>{truncateAt(item.title, 80)}</a>
                <div className='c-event-it__stats'>
                    <time dateTime={item.createdAt}>{createdAt.fromNow(true)}</time>
                    <a className='c-event-it__topic' title={mainTopic.name} href={links.news.topic(mainTopic.slug, { ul: lang })}>{mainTopic.abbr || truncateAt(mainTopic.name, 30)}</a>
                </div>
            </div>
        </div>
    )
}

function getMainTopic(locale: Locale, topics: NewsTopic[]) {
    const relevantTopics = filterIrrelevantTopics(locale, topics);
    return relevantTopics.length > 0 ? relevantTopics[0] : topics[0];
}
