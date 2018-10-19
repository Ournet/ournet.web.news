
import * as React from 'react';
import { Sitemap } from 'ournet.links';
import { I18nFn } from '../../../locale';
import * as util from 'util';
import { LocalesNames } from '../../../locales-names';

export type OutReadMoreProps = {
    url: string
    links: Sitemap
    __: I18nFn
    source: string
}

export function outReadMoreLink(props: OutReadMoreProps) {
    const { links, url, __, source } = props;
    return (
        <div className='c-out'><a target='_blank' rel='nofollow noindex' href={links.news.url({url})}>{util.format(__(LocalesNames.read_more_on_source), source)} ›</a></div>
    )
}
