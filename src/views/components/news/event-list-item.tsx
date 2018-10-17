
import * as React from 'react';
import { RootViewModel } from '../../../view-models/root-view-model';
import { NewsEvent } from '@ournet/api-client';
import { ImageStorageHelper, ImageSizeName } from '@ournet/images-domain';
import { truncateAt } from '../../../utils';
import moment = require('moment-timezone');

export type EventListItemProps = {
    root: RootViewModel
    view: EventListItemViewName
    item: NewsEvent
    imageSize?: ImageSizeName
}

export type EventListItemViewName = 'main' | 'card';

export default class EventListItem extends React.Component<EventListItemProps>{
    render() {
        return getItemView(this.props);
    }
}

function getItemView(props: EventListItemProps) {
    switch (props.view) {
        case 'main': return mainItemView(props);
        case 'card': return cardItemView(props);
    }
    return null;
}

function mainItemView(props: EventListItemProps) {
    const { item, root } = props;
    const { links, lang, config, __ } = root;
    const mainTopic = item.topics[0];
    const createdAt = moment(item.createdAt).tz(config.timezone).locale(lang);
    return (
        <div className='c-event-it c-event-it--main'>
            <a title={item.title} href={links.news.event(item.slug, item.id, { ul: lang })}>
                <span className='c-event-it__media'>
                    <img src={ImageStorageHelper.eventUrl(item.imageId, 'large')} alt={item.title} />
                </span>
                <h2 className='c-event-it__title'>{truncateAt(item.title, 100)}</h2>
            </a>
            <div className='c-event-it__info'>
                <div className='c-event-it__stats'>
                    <time dateTime={item.createdAt}>{createdAt.fromNow(true)}</time>
                </div>
                <a className='c-event-it__topic' title={mainTopic.name} href={links.news.topic(mainTopic.slug, { ul: lang })}>#{mainTopic.abbr || truncateAt(mainTopic.name, 30)}</a>
            </div>
            <ul className='c-event-it__items'>
                {item.items.slice(0, 4).map(it => <li key={it.id}><a title={it.title} href={links.news.item(it.id, { ul: lang })}>{truncateAt(it.title, 60)}</a></li>)}
            </ul>
        </div>
    )
}

function cardItemView(props: EventListItemProps) {
    const { item, root, imageSize } = props;
    const { links, lang, config, __ } = root;
    const mainTopic = item.topics[0];
    const createdAt = moment(item.createdAt).tz(config.timezone).locale(lang);

    return (
        <div className='c-event-it c-event-it--card'>
            <a title={item.title} href={links.news.event(item.slug, item.id, { ul: lang })}>
                <div className='c-event-it__media'>
                    <img src={ImageStorageHelper.eventUrl(item.imageId, imageSize || 'medium')} alt={item.title} />
                </div>
                <h3 className='c-event-it__title'>{truncateAt(item.title, 80)}</h3>
            </a>
            <div className='c-event-it__info'>
                <div className='c-event-it__stats'>
                    <time dateTime={item.createdAt}>{createdAt.fromNow(true)}</time>
                </div>
                <a className='c-event-it__topic' title={mainTopic.name} href={links.news.topic(mainTopic.slug, { ul: lang })}>#{mainTopic.abbr || truncateAt(mainTopic.name, 30)}</a>
            </div>
        </div>
    )
}