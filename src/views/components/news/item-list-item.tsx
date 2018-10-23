
import * as React from 'react';
import { RootViewModel } from '../../../view-models/root-view-model';
import { NewsItem } from '@ournet/api-client';
import { truncateAt } from '../../../utils';
import moment = require('moment-timezone');

export type ItemListItemProps = {
    root: RootViewModel
    view: ItemListItemViewName
    item: NewsItem
}

export type ItemListItemViewName = 'tline';

export default class NewsItemListItem extends React.Component<ItemListItemProps>{
    render() {
        return getItemView(this.props);
    }
}

function getItemView(props: ItemListItemProps) {
    switch (props.view) {
        case 'tline': return timeLineItemView(props);
    }
    return null;
}

function timeLineItemView(props: ItemListItemProps) {
    const { item, root } = props;
    const { links, lang, config } = root;
    const createdAt = moment(item.publishedAt).tz(config.timezone).locale(lang);

    return (
        <div className='c-item-it c-item-it--tline'>
            <time dateTime={createdAt.toISOString()}>{createdAt.format('ll')}</time>
            <a title={item.title} href={links.news.item(item.id, { ul: lang })}>{truncateAt(item.title, 80)}</a>
        </div>
    )
}
