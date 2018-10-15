
import * as React from 'react';

export type AccentLineProps = {
    type?: 'small' | 'tiny'
}

export default class AccentLine extends React.Component<AccentLineProps> {
    render() {
        const type = this.props.type;

        return (
            <div className={'c-aline' + (type ? ' c-aline--' + type : '')}>
                <div className='c-aline__1'></div>
                <div className='c-aline__2'></div>
                <div className='c-aline__3'></div>
                <div className='c-aline__4'></div>
                <div className='c-aline__5'></div>
                <div className='c-aline__6'></div>
                <div className='c-aline__7'></div>
                <div className='c-aline__8'></div>
                <div className='c-aline__9'></div>
                <div className='c-aline__10'></div>
            </div>
        )
    }
}
