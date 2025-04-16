import * as React from 'react';
import { IImageItemProps, ImageItem } from 'Controls-Templates/itemTemplates';
import { View, AdditionalItemTemplate } from 'Controls/tile';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Container } from 'Controls/scroll';
import { Button } from 'Controls/buttons';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';

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

const getPreviewItems = (): IData[] => {
    return [
        {
            id: 0,
            image: Images.GREEN,
        },
        {
            id: 1,
            image: Images.BLUE,
        },
        {
            id: 2,
            image: Images.GREEN,
        },
        {
            id: 3,
            image: Images.BLUE,
        },
        {
            id: 4,
            image: Images.GREEN,
        },
        {
            id: 5,
            image: Images.BLUE,
        },

        {
            id: 10,
            image: Images.GREEN,
        },
        {
            id: 11,
            image: Images.BLUE,
        },
        {
            id: 12,
            image: Images.GREEN,
        },
    ];
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
            data: getPreviewItems(),
        });
    }

    render(): JSX.Element {
        return (
            <div
                ref={this.props.forwardedRef}
                className={'controlsDemo__wrapper controlsDemo__width800px'}
            >
                <Container
                    scrollOrientation={'horizontal'}
                    smoothScrolling={true}
                    horizontalScrollMode={'buttons'}
                    data-qa="Controls-Templates-demo_UsingInList-TileHorizontal__scroll"
                    content={
                        <View
                            source={this._viewSource}
                            itemPadding={ITEM_PADDING}
                            itemsContainerPadding={ITEMS_CONTAINER_PADDING}
                            imageProperty={'image'}
                            itemActions={itemActions}
                            tileWidth={'142px'}
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
                            beforeItemsTemplate={(props) => {
                                return (
                                    <AdditionalItemTemplate
                                        {...props}
                                        shadowVisibility={'hidden'}
                                        cursor={'default'}
                                        size={'custom'}
                                    >
                                        <Button
                                            readOnly={false}
                                            icon={'icon-ArrowTimeBackward'}
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
