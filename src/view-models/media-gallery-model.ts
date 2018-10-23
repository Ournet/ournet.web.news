import { NewsItem, NewsEvent } from "@ournet/api-client";
import { ImageStorageHelper } from "@ournet/images-domain";
import { uniqByProperty } from "@ournet/domain";

export type MediaGalleryModel = {
    startId?: string
    items: MediaGalleryModelItem[]
}

export type MediaGalleryModelItem = {
    type: 'image' | 'video'
    id: string
    url: string
}

export function createMediaGalleryModel({ event, item }: { event?: NewsEvent, item?: NewsItem }) {
    const model: MediaGalleryModel = {
        items: []
    };
    if (!event && !item) {
        return model;
    }

    if (event) {
        model.items = (event.imagesIds || []).map(id => ({
            type: 'image',
            id,
            url: ImageStorageHelper.newsUrl(id, 'master'),
        } as MediaGalleryModelItem));

        model.startId = event.imageId;

        const startItem = model.items.find(item => item.id === event.imageId);
        if (startItem) {
            startItem.url = ImageStorageHelper.eventUrl(startItem.id, 'master');
        } else {
            model.items.unshift({
                type: 'image',
                id: event.imageId,
                url: ImageStorageHelper.eventUrl(event.imageId, 'master'),
            });
        }
    }

    if (item && item.imagesIds && item.imagesIds.length) {
        model.items = model.items.concat((item.imagesIds || []).map(id => ({
            type: 'image',
            id,
            url: ImageStorageHelper.newsUrl(id, 'master'),
        } as MediaGalleryModelItem)));

        model.startId = item.imagesIds[0];
    }

    model.items = uniqByProperty(model.items, 'id');

    return model;
}
