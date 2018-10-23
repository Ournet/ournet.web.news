
import * as React from 'react';
import CommonLayout from '../common-layout';
import { ImageStorageHelper } from '@ournet/images-domain';
import getArticleContent from '../components/news/get-article-content';
import { outReadMoreLink } from '../components/news/out-read-more';
import { startWithUpperCase } from '../../utils';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import moment = require('moment-timezone');
import TopicListItem from '../components/news/topic-list-item';
import { Share } from '../components/share';
import EventListItem from '../components/news/event-list-item';
import SectionHeader from '../components/section-header';
import adAside from '../components/ad-aside';
import { ItemViewModel } from '../../view-models/item-view-model';
import ItemMedia from './item-media';

export default class ItemPage extends React.Component<ItemViewModel> {
    render() {
        const { lang, head, __, links, latestEvents, item, config, articleContent, similarEvents, event } = this.props;

        let imageLargeUrl: string | null = null;
        if (item.imagesIds) {
            imageLargeUrl = ImageStorageHelper.newsUrl(item.imagesIds[0], 'large');
        }

        head.elements.push(<meta key='og_type' property="og:type" content="article" />);
        if (imageLargeUrl) {
            head.elements.push(<meta key='og_image' property="og:image" content={imageLargeUrl} />);
        }
        head.elements.push(<meta key='published_time' property="article:published_time" content={item.createdAt} />);
        head.elements.push(<meta key='publisher' property="article:publisher" content={config.name} />);
        if (item.topics) {
            for (let tag of item.topics) {
                head.elements.push(<meta key={`tag-${tag.id}`} property="article:tag" content={tag.name} />);
            }
        }

        const link = links.news.item(item.id, { ul: lang });

        const paragraphs = articleContent && getArticleContent({ lang, content: articleContent, links, topics: item.topics||[], maxPhrases: 2 })
            || item.summary.split(/\n+/).map((item, index) => <p key={`phrase-s-${index}`}>{item}</p>);

        const createdAt = moment(item.publishedAt).tz(config.timezone).locale(lang);

        return (
            <CommonLayout {...this.props}>
                <main>
                    <div className='o-layout'>
                        <div className='o-layout__item u-4/6@desktop'>
                            <article className='c-event'>
                                <ItemMedia root={this.props} event={event} item={item} />
                                <div className='c-event__body'>
                                    <div className='o-layout o-layout--small'>
                                        <div className='o-layout__item u-1/6@tablet'>
                                        </div>
                                        <div className='o-layout__item u-5/6@tablet'>
                                            <h1 className='c-event__title'><a href={link} title={item.title}>{item.title}</a></h1>
                                            <Share url={head.canonical} align='right' services={config.shareServices} lang={lang} />
                                            <div className='c-event__stats'>
                                                <time dateTime={item.createdAt}>{createdAt.format('lll') + ', '}</time>
                                                {util.format(__(LocalesNames.count_views_format), item.countViews)}
                                            </div>
                                            <div className='c-event__text'>
                                                {paragraphs}
                                            </div>
                                            {outReadMoreLink({ url: item.urlHost + item.urlPath, source: startWithUpperCase(item.sourceId), links, __ })}
                                            <hr />
                                            <ul className='c-event__tags'>
                                                {(item.topics||[]).map(item => <li key={item.id}><TopicListItem links={links} lang={lang} item={item} view='tag' /></li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </article>
                            <div className='c-section'>
                                {similarEvents.length > 0 ?
                                    [<SectionHeader key='sheader' name={__(LocalesNames.related_news)} />,
                                    <div key='layout' className='o-layout'>
                                        {similarEvents.slice(0, 2).map(item => <div key={item.id} className='o-layout__item u-1/2@tablet'><EventListItem root={this.props} item={item} view='zen' /></div>)}
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
                    <script dangerouslySetInnerHTML={{__html:`(function(){var img=new Image();img.src='${links.news.actions.viewItem(item.id,{ul: lang})}';}());`}}></script>
                </main>
            </CommonLayout >
        )
    }
}
