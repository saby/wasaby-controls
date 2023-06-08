import * as React from 'react';
import { IImageItemProps, ImageItem } from 'Controls-Templates/itemTemplates';
import { View, AdditionalItemTemplate } from 'Controls/tile';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Container } from 'Controls/scroll';
import { Button } from 'Controls/buttons';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';

const itemActions: IItemAction[] = [
    {
        id: 1,
        icon: 'icon-Email',
        title: 'Email',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'Профиль пользователя',
        showType: TItemActionShowType.MENU,
    },
];

const ITEM_PADDING = {
    left: 'm',
    right: 'm',
};
const ITEMS_CONTAINER_PADDING = {
    left: 'xs',
    right: 'xs',
};

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IImageItemProps> = {
        cursor: 'pointer',
        roundAngleBL: 'm',
        roundAngleBR: 'm',
        roundAngleTL: 'm',
        roundAngleTR: 'm',
        imageProportion: '1:1',
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
            <div className={'controlsDemo__wrapper controlsDemo__width800px'}>
                <Container
                    scrollOrientation={'horizontal'}
                    smoothScrolling={true}
                    horizontalScrollMode={'buttons'}
                    content={
                        <View
                            source={this._viewSource}
                            itemPadding={ITEM_PADDING}
                            itemsContainerPadding={ITEMS_CONTAINER_PADDING}
                            imageProperty={'image'}
                            itemActions={itemActions}
                            tileWidth={'calc(25% - 2 * var(--offset_xs));'}
                            usingCustomItemTemplates={true}
                            orientation={'horizontal'}
                            afterItemsTemplate={(props) => {
                                return (
                                    <AdditionalItemTemplate
                                        {...props}
                                        shadowVisibility={'hidden'}
                                        cursor={'default'}
                                        size={'custom'}
                                    >
                                        <Button
                                            readOnly={false}
                                            icon={'icon-ArrowTimeForward'}
                                            iconSize={'s'}
                                            caption={'Все'}
                                            captionPosition={'start'}
                                            fontSize={'xl'}
                                            inlineHeight={'2xl'}
                                            buttonStyle={'default'}
                                            viewMode={'filled'}
                                            tooltip={'Показать все'}
                                            onClick={() => {
                                                alert();
                                            }}
                                        />
                                    </AdditionalItemTemplate>
                                );
                            }}
                            itemTemplate={(props) => {
                                return (
                                    <ImageItem
                                        {...props}
                                        actionsPosition={'bottomRight'}
                                        {...this._commonItemsProps}
                                    />
                                );
                            }}
                        />
                    }
                />
            </div>
        );
    }
}
