
import * as React from 'react';

export type GroupHeaderViewModel = {
    name: string
    link: string
    type?: 'important' | 'popular' | 'new'
}

export default class GroupHeader extends React.Component<GroupHeaderViewModel> {
    render() {
        const { name, link, type } = this.props;
        return (
            <div className={'c-group-h' + (type ? ` c-group-h--${type}` : '')}>
                <h3><a href={link}>{name}</a></h3>
            </div>
        )
    }
}
