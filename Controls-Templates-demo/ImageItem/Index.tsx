import * as React from 'react';
import { IImageItemProps, ImageItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IImageItemProps> = {
        className:
            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__squareImage_size',
        cursor: 'pointer',
        roundAngleBL: 'm',
        roundAngleBR: 'm',
        roundAngleTL: 'm',
        roundAngleTR: 'm',
        paddingTop: 'null',
        paddingBottom: 'null',
        paddingLeft: 'null',
        paddingRight: 'null',
    };

    render(): JSX.Element {
        return (
            <div ref={ this.props.forwardedRef } className={'controlsDemo__wrapper controlsDemo__flexRow controlsDemo_widthFit'}>
                <ImageItem
                    {...this._commonItemsProps}
                    imageSrc={Images.GREEN}
                />
                <ImageItem
                    {...this._commonItemsProps}
                    imageSrc={Images.RIVER}
                />
                <ImageItem
                    {...this._commonItemsProps}
                    imageSrc={Images.BLUE}
                />
                <ImageItem {...this._commonItemsProps} imageSrc={Images.GREEN} />
                <ImageItem
                    {...this._commonItemsProps}
                    imageSrc={Images.RIVER}
                />
            </div>
        );
    }
}
