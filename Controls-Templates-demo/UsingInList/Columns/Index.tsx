import * as React from 'react';
import {
    IVerticalItemProps,
    VerticalItem,
} from 'Controls-Templates/itemTemplates';
import { ItemsView } from 'Controls/columns';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';
import { delimitProps } from 'UICore/Jsx';

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
    private readonly _items: RecordSet;

    constructor(props: {}) {
        super(props);
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: Gadgets.getRichItems(),
        });
    }

    render(): JSX.Element {
        return (
            <div className={'controlsDemo__wrapper controlsDemo_fixedWidth400'}>
                <ItemsView
                    items={this._items}
                    columnsCount={3}
                    itemTemplate={(props) => {
                        const { userAttrs, clearProps } = delimitProps(props);
                        return (
                            <VerticalItem
                                {...clearProps}
                                {...this._commonItemsProps}
                                style={userAttrs.style}
                                imageSrc={props.item.contents.get('image')}
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
