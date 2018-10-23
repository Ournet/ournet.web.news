
import * as React from 'react';
import { RootViewModel } from '../../view-models/root-view-model';
import { NewsItem, NewsEvent } from '@ournet/api-client';
import { ImageStorageHelper, ImageHelper } from '@ournet/images-domain';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import { truncateAt } from '../../utils';
import * as moment from 'moment-timezone';
import EventMedia, { EventMediaPropsImage } from '../event/event-media';
import { createMediaGalleryModel } from '../../view-models/media-gallery-model';
import galleryResources from '../components/news/gallery-resources';

export type ItemMediaProps = {
    root: RootViewModel
    item: NewsItem
    event?: NewsEvent
}



export default class ItemMedia extends React.Component<ItemMediaProps> {
    render() {

        const { root, item, event } = this.props;
        const { __, config } = root;

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

        const galleryModel = createMediaGalleryModel({event, item});

        return (
            <a className='c-event-media js-media-dialog' data-gallery={JSON.stringify(galleryModel)} style={{ backgroundColor: `#${imageColor}` }} href={image.masterUrl} target='_blank' title={mediaTitle}>
                <img className='c-event-media__pic' alt={item.title} src={image.largeUrl} srcSet={`${image.masterUrl} 1200w, ${image.largeUrl} 640w`} />
                <span className='c-event-media__copy'>© {image.host}</span>
                {item.videoId && <i className='c-event-media__vi'></i>}
                {galleryResources(config)}
            </a>
        );
    }
}
