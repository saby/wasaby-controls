import * as React from 'react';
import {
    IVerticalItemProps,
    VerticalItem,
} from 'Controls-Templates/itemTemplates';
import { View } from 'Controls/tile';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { delimitProps } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IVerticalItemProps> = {
        roundAngleBL: 's',
        roundAngleBR: 's',
        roundAngleTL: 's',
        roundAngleTR: 's',
        cursor: 'pointer',
        captionFontSize: 'xl',
        captionFontWeight: 'bold',
        descriptionFontSize: 'm',
        descriptionFontColorStyle: 'unaccented',
        shadowVisibility: 'visible',
        paddingTop: 's',
        paddingBottom: 's',
        paddingLeft: 's',
        paddingRight: 's',
        captionLines: 1,
        descriptionLines: 3,
        imageViewMode: 'circle',
        imagePosition: 'top',
        imageEffect: 'border',
    };
    private readonly _viewSource: HierarchicalMemory;

    constructor(props: {}) {
        super(props);
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getRichItems(),
        });
    }

    render(): JSX.Element {
        return (
            <div className={'controlsDemo__wrapper'}>
                <View
                    source={this._viewSource}
                    imageProperty={'image'}
                    tileSize={'s'}
                    itemTemplate={(props) => {
                        const { userAttrs, clearProps } = delimitProps(props);
                        return (
                            <VerticalItem
                                {...clearProps}
                                {...this._commonItemsProps}
                                style={userAttrs.style}
                                caption={props.item.contents.get('title')}
                                description={props.item.contents.get(
                                    'description'
                                )}
                            />
                        );
                    }}
                />
            </div>
        );
    }
}
