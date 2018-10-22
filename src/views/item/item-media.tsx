
import * as React from 'react';
import { RootViewModel } from '../../view-models/root-view-model';
import { NewsItem, NewsEvent } from '@ournet/api-client';
import { ImageStorageHelper, ImageHelper } from '@ournet/images-domain';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import { truncateAt } from '../../utils';
import * as moment from 'moment-timezone';
import EventMedia, { EventMediaPropsImage } from '../event/event-media';

export type ItemMediaProps = {
    root: RootViewModel
    item: NewsItem
    event?: NewsEvent
}



export default class ItemMedia extends React.Component<ItemMediaProps> {
    render() {

        const { root, item, event } = this.props;
        const { __ } = root;

        if (!item.imagesIds && !event) {
            return null;
        }

        let image: EventMediaPropsImage | undefined;
        if (item.imagesIds && item.imagesIds.length) {
            const imageId = item.imagesIds[0];
            const imageMasterUrl = ImageStorageHelper.newsUrl(imageId, 'master');
            const imageLargeUrl = ImageStorageHelper.newsUrl(imageId, 'large');
            image = {
                id: imageId,
                host: item.urlHost,
                masterUrl: imageMasterUrl,
                largeUrl: imageLargeUrl,
            };
        }

        if (event) {
            return <EventMedia event={event} image={image} root={root} />;
        }

        if(!image){
            return null;
        }

        const mediaTitle = util.format(__(LocalesNames.foto_video_from_event_format), truncateAt(item.title, 70));
        const imageColor = image.id.split(/-/g)[1];

        return (
            <a className='c-event-media js-media-dialog' style={{ backgroundColor: `#${imageColor}` }} href={image.masterUrl} target='_blank' title={mediaTitle}>
                <picture className='c-event-media__pic'>
                    <source srcSet={image.masterUrl} media="(min-width: 700px)" />
                    <img alt={item.title} src={image.largeUrl} />
                </picture>
                <span className='c-event-media__copy'>© {image.host}</span>
                {item.videoId && <i className='c-event-media__vi'></i>}
            </a>
        );
    }
}
