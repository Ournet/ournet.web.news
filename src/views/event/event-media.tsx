
import * as React from 'react';
import { RootViewModel } from '../../view-models/root-view-model';
import { NewsEvent } from '@ournet/api-client';
import { ImageStorageHelper } from '@ournet/images-domain';
import * as util from 'util';
import { LocalesNames } from '../../locales-names';
import { truncateAt } from '../../utils';

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
        const { __ } = root;

        const image = this.props.image || {
            id: event.imageId,
            masterUrl: ImageStorageHelper.eventUrl(event.imageId, 'master'),
            largeUrl: ImageStorageHelper.eventUrl(event.imageId, 'large'),
            host: event.imageHost,
        };

        const mediaTitle = util.format(__(LocalesNames.foto_video_from_event_format), truncateAt(event.title, 70));
        const imageColor = image.id.split(/-/g)[1];

        return (
            <a className='c-event-media js-media-dialog' style={{ backgroundColor: `#${imageColor}` }} data-event-id={event.id} href={image.masterUrl} target='_blank' title={mediaTitle}>
                <picture className='c-event-media__pic'>
                    <source srcSet={image.masterUrl} media="(min-width: 700px)" />
                    <img alt={event.title} src={image.largeUrl} />
                </picture>
                <span className='c-event-media__stats'>
                    {event.countImages > 1 && <i className='c-event-media__stats-i'>{event.countImages}<span>{__(LocalesNames.photo)}</span></i>}
                    {event.countVideos > 0 && <i className='c-event-media__stats-v'>{event.countVideos}<span>{__(LocalesNames.video)}</span></i>}
                </span>
                <span className='c-event-media__copy'>© {image.host}</span>
                {event.countVideos > 0 && <i className='c-event-media__vi'></i>}
            </a>
        );

    }
}
