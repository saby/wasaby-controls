import * as React from 'react';
import { IImageItemProps, ImageItem } from 'Controls-Templates/itemTemplates';
import { View } from 'Controls/tile';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
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
    private readonly _viewSource: HierarchicalMemory;

    constructor(props: {}) {
        super(props);
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getPreviewItems(),
        });
    }

    render(): JSX.Element {
        return (
            <div ref={ this.props.forwardedRef } className={'controlsDemo__wrapper'}>
                <View
                    source={this._viewSource}
                    imageProperty={'image'}
                    itemTemplate={(props: IImageItemProps) => {
                        return (
                            <ImageItem
                                {...props}
                                {...this._commonItemsProps}
                                className={
                                    props.className +
                                    this._commonItemsProps.className
                                }
                            />
                        );
                    }}
                />
            </div>
        );
    }
}
