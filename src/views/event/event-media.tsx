
import * as React from 'react';
import { RootViewModel } from '../../view-models/root-view-model';
import { NewsEvent } from '@ournet/api-client';
import { ImageStorageHelper } from '@ournet/images-domain';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import { truncateAt } from '../../utils';
import { createMediaGalleryModel } from '../../view-models/media-gallery-model';
import galleryResources from '../components/news/gallery-resources';

export type EventMediaProps = {
    root: RootViewModel
    event: NewsEvent
    image?: EventMediaPropsImage
}

export type EventMediaPropsImage = {
    id: string
    masterUrl: string
    largeUrl: string
    host: string
}



export default class EventMedia extends React.Component<EventMediaProps> {
    render() {

        const { root, event } = this.props;
        const { __, config } = root;

        const image = this.props.image || {
            id: event.imageId,
            masterUrl: ImageStorageHelper.eventUrl(event.imageId, 'master'),
            largeUrl: ImageStorageHelper.eventUrl(event.imageId, 'large'),
            host: event.imageHost,
        };

        const mediaTitle = util.format(__(LocalesNames.foto_video_from_event_format), truncateAt(event.title, 70));
        const imageColor = image.id.split(/-/g)[1];

        const galleryModel = createMediaGalleryModel({ event });

        galleryModel.startId = image.id;

        return (
            <a className='c-event-media js-media-dialog' data-gallery={JSON.stringify(galleryModel)} style={{ backgroundColor: `#${imageColor}` }} data-event-id={event.id} href={image.masterUrl} target='_blank' title={mediaTitle}>
                <img className='c-event-media__pic' alt={event.title} src={image.largeUrl} srcSet={`${image.masterUrl} 1200w, ${image.largeUrl} 640w`} />
                <span className='c-event-media__stats'>
                    {event.countImages > 1 && <i className='c-event-media__stats-i'>{event.countImages}<span>{__(LocalesNames.photo)}</span></i>}
                    {event.countVideos > 0 && <i className='c-event-media__stats-v'>{event.countVideos}<span>{__(LocalesNames.video)}</span></i>}
                </span>
                <span className='c-event-media__copy'>© {image.host}</span>
                {event.countVideos > 0 && <i className='c-event-media__vi'></i>}
                {galleryResources(config)}
            </a>
        );

    }
}
