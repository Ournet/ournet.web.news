
import * as React from 'react';
import { RootViewModel } from '../../view-models/root-view-model';
import { NewsItem, NewsEvent } from '@ournet/api-client';
import { ImageStorageHelper } from '@ournet/images-domain';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import { truncateAt } from '../../utils';

export type ItemMediaProps = {
    root: RootViewModel
    item: NewsItem
    event?: NewsEvent
}



export default class ItemMedia extends React.Component<ItemMediaProps> {
    render() {

        const { root, item } = this.props;
        const { __ } = root;

        if(!item.imagesIds){
            return null;
        }

        const imageId = item.imagesIds[0];

        const imageMasterUrl = ImageStorageHelper.newsUrl(imageId, 'master');
        const imageLargeUrl = ImageStorageHelper.newsUrl(imageId, 'large');

        const mediaTitle = util.format(__(LocalesNames.foto_video_from_event_format), truncateAt(item.title, 70));
        const imageColor = imageId.split(/-/g)[1];

        return (
            <a className='c-event-media js-media-dialog' style={{ backgroundColor: `#${imageColor}` }} href={imageMasterUrl} target='_blank' title={mediaTitle}>
                <picture className='c-event-media__pic'>
                    <source srcSet={imageMasterUrl} media="(min-width: 700px)" />
                    <img alt={item.title} src={imageLargeUrl} />
                </picture>
                <span className='c-event-media__copy'>© {item.urlHost}</span>
                {item.videoId && <i className='c-event-media__vi'></i>}
            </a>
        );

    }
}
