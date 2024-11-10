import * as React from 'react';
import ImageViewMode from './ImageViewMode/Index';
import CaptionPosition from './CaptionPosition/Index';
import ImageEffect from './ImageEffect/Index';
import DescriptionLines from './DescriptionLines/Index';
import 'css!DemoStand/Controls-demo';

export default class Index extends React.Component {
    render(): JSX.Element {
        return (
            <div
                ref={this.props.forwardedRef}
                className={'controlsDemo__wrapper controlsDemo__flexColumn'}
            >
                <ImageViewMode />
                <CaptionPosition />
                <ImageEffect />
                <DescriptionLines />
            </div>
        );
    }
}
