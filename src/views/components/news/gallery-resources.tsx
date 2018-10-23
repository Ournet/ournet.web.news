import * as React from 'react';
import env from '../../../env';
import { AppConfig } from '../../../config';


export default function galleryResources(config: AppConfig) {
    const resources: JSX.Element[] = [];

    if (env.isProduction) {
        resources.push(<script key='gr-1' async={true} src={`//assets.ournetcdn.net/ournet/js/news/gallery-${config.assets.js.gallery}.js`} />);
        resources.push(<link key='gr-2' type="text/css" rel="stylesheet" href={`//assets.ournetcdn.net/ournet/js/news/gallery-${config.assets.js.gallery}.js`}/>);
    } else {
        resources.push(<script key='gr-1' async={true} src='http://localhost:8080/js/news/gallery.js' />);
        resources.push(<link key='gr-2' type="text/css" rel="stylesheet" href='http://localhost:8080/css/news/gallery.css'/>);
    }

    return resources;
}