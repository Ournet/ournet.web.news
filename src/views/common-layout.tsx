import * as React from 'react';
import { NewsViewModel } from '../view-models/news-view-model';
import RootLayout from './root-layout';

export default class CommonLayout extends React.Component<NewsViewModel> {
    render() {
        return (
            <RootLayout {...this.props}>
                {this.props.children}
            </RootLayout>
        )
    }
}
