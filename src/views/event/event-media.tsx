
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
}



export default class EventMedia extends React.Component<EventMediaProps> {
    render() {

        const { root, event } = this.props;
        const { __ } = root;

        const imageMasterUrl = ImageStorageHelper.eventUrl(event.imageId, 'master');
        const imageLargeUrl = ImageStorageHelper.eventUrl(event.imageId, 'large');

        const mediaTitle = util.format(__(LocalesNames.foto_video_from_event_format), truncateAt(event.title, 70));
        const imageColor = event.imageId.split(/-/g)[1];

        return (
            <a className='c-event-media js-media-dialog' style={{backgroundColor:`#${imageColor}`}} data-event-id={event.id} href={imageMasterUrl} target='_blank' title={mediaTitle}>
                <span className='c-event-media__stats'>
                    {event.countImages > 1 && <i className='c-event-media__stats-i'>{event.countImages}</i>}
                    {event.countVideos > 0 && <i className='c-event-media__stats-v'>{event.countVideos}</i>}
                </span>
                <span className='c-event-media__copy'>© {event.imageHost}</span>
                {event.countVideos > 0 && <i className='c-event-media__vi'></i>}
                <picture className='c-event-media__pic'>
                    <source srcSet={imageMasterUrl} media="(min-width: 700px)" />
                    <img alt={event.title} src={imageLargeUrl} />
                </picture>
            </a>
        );

    }
}
