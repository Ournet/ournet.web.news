
import * as React from 'react';
import { RootViewModel } from '../../../view-models/root-view-model';
import { Quote } from '@ournet/api-client';
import { truncateAt, entipicUrl } from '../../../utils';
import moment = require('moment-timezone');

export type QuoteListItemProps = {
    root: RootViewModel
    view: QuoteListItemViewName
    item: Quote
    maxLength?: number
}

export type QuoteListItemViewName = 'card';

export default class QuoteListItem extends React.Component<QuoteListItemProps>{
    render() {
        return getItemView(this.props);
    }
}

function getItemView(props: QuoteListItemProps) {
    switch (props.view) {
        case 'card': return cardItemView(props);
    }
    return null;
}

function cardItemView(props: QuoteListItemProps) {
    const { item, root, maxLength } = props;
    const { links, lang, config, __, country } = root;
    const createdAt = moment(item.createdAt).tz(config.timezone).locale(lang);
    const author = item.author;

    return (
        <div className='c-quote-it c-quote-it--card'>
            <div className='c-quote-it__text' tabIndex={0}><i>“</i> {truncateAt(item.text, maxLength || 500)}</div>
            <div className='c-quote-it__media'>
                <div className='c-quote-it__icon o-lazy' data-src={entipicUrl(author.name, 'a', lang, country)}></div>
                <div className='c-quote-it__body'>
                    <a className='c-quote-it__name' title={author.name} href={links.news.topic(author.slug, { ul: lang })}>{author.name}</a>, 
                    <time dateTime={createdAt.toISOString()}> {createdAt.fromNow(true)}</time>
                    <div className='c-quote-it__ctx'>{truncateAt(item.source.title, 60)}</div>
                </div>
            </div>
        </div>
    )
}
