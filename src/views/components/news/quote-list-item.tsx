
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
    const link = links.news.quote(item.id, { ul: lang });

    return (
        <div className='c-quote-it c-quote-it--card'>
            <a className='c-quote-it__text' title={author.name + ': ' + truncateAt(item.text, 80)} href={link}><i>“</i> {truncateAt(item.text, maxLength || 100)}</a>
            <div className='c-quote-it__media'>
                <img className='c-quote-it__icon' src={entipicUrl(author.name, 'a', lang, country)} alt={author.name} />
                <div className='c-quote-it__body'>
                    <a className='c-quote-it__name' title={author.name} href={links.news.topic(author.slug, { ul: lang })}>{author.name}</a>, 
                    <time dateTime={createdAt.toISOString()}> {createdAt.fromNow(true)}</time>
                    <div className='c-quote-it__ctx'>{truncateAt(item.source.title, 60)}</div>
                </div>
            </div>
        </div>
    )
}
