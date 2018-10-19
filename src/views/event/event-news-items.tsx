
import * as React from 'react';
import { RootViewModel } from '../../view-models/root-view-model';
import { NewsEvent } from '@ournet/api-client';
import { ImageStorageHelper } from '@ournet/images-domain';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import { truncateAt, startWithUpperCase } from '../../utils';

export type EventNewsItemsProps = {
    root: RootViewModel
    event: NewsEvent
}



export default class EventNewsItems extends React.Component<EventNewsItemsProps> {
    render() {

        const { root, event } = this.props;
        const { __, links, lang } = root;

        return (
            <ul className='c-event__items'>
                {event.items.map(item => <li key={item.id}><span>{startWithUpperCase(item.sourceId)}</span>: <a title={item.title} href={links.news.item(item.id, { ul: lang })}>{truncateAt(item.title, 100)}</a></li>)}
            </ul>
        );

    }
}
