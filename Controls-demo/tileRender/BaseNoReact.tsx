import * as React from 'react';
import { View } from 'Controls/tile';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-demo/tileRender/Base/styles';

import 'Controls/tileRender';
import { LOCAL_MOVE_POSITION, Memory } from 'Types/source';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IItemAction, ISelectionObject } from 'Controls/interface';
import { TItemActionShowType } from 'Controls/itemActions';

import { getDataWithRealImages } from 'Controls-demo/tileRender/Base/data';
import { ItemsEntity } from 'Controls/dragnDrop';
import { Model } from 'Types/entity';
import { useSlice } from 'Controls-DataEnv/context';
import { ITimelineGridSliceState, TimelineGridSlice } from 'Controls-Lists/timelineGrid';
import { View as TreeGrid } from 'Controls/treeGrid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Confirmation } from 'Controls/popup';

import { VerticalItemDemoTile } from 'Controls-demo/tileRender/Base/itemRenders/VerticalItemForTileRenderDemo';
import { HorizontalItemDemoTile } from 'Controls-demo/tileRender/Base/itemRenders/HorizontalItemForTileRenderDemo';
import { ImageItemDemoTile } from 'Controls-demo/tileRender/Base/itemRenders/ImageItemForTileRenderDemo';
import { ListItemDemoTile } from 'Controls-demo/tileRender/Base/itemRenders/ListItemForTileRenderDemo';
import { BackgroundItemDemoTile } from 'Controls-demo/tileRender/Base/itemRenders/BackgroundItemForTileRenderDemo';

function getData() {
    return getDataWithRealImages(100);
}

const itemActions: IItemAction[] = [
    {
        id: '1',
        icon: 'icon-Email',
        title: 'Email',
        showType: TItemActionShowType.MENU,
    },
    {
        id: '3',
        icon: 'icon-Profile',
        title: 'Профиль пользователя',
        showType: TItemActionShowType.MENU,
    },
];

const STORE_ID = 'TileRenderBaseDemo';

const ITEM_RENDER = {
    vertical: {
        component: VerticalItemDemoTile,
        label: 'Vertical Template',
    },
    horizontal: {
        component: HorizontalItemDemoTile,
        label: 'Horizontal Template',
    },
    image: {
        component: ImageItemDemoTile,
        label: 'Image Template',
    },
    list: {
        component: ListItemDemoTile,
        label: 'List Template',
    },
    background: {
        component: BackgroundItemDemoTile,
        label: 'Background Template',
    },
};

function Demo(_: {}, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice<TimelineGridSlice & ITimelineGridSliceState>(STORE_ID);
    const [selectedTemplate, setSelectedTemplate] = React.useState('vertical');
    const items = slice?.state.items;
    const viewRef = React.useRef<TreeGrid>(null);

    const onActionItemClick = React.useCallback((clickedItem, itemModel) => {
        Confirmation.openPopup({
            markerStyle: 'success',
            message: `Опция \"${clickedItem.title}\" записи \"${itemModel.get('title')}\" нажата`,
            type: 'ok',
        });
    }, []);

    const onDragEnd = React.useCallback(
        (entity: ItemsEntity, target: Model, position: LOCAL_MOVE_POSITION) => {
            const selection: ISelectionObject = {
                selected: entity.getItems(),
                excluded: [],
            };
            viewRef?.current?.moveItems(selection, target.getKey(), position);
        },
        []
    );

    const onDragStart = React.useCallback(
        (movedKeys: number[]) => {
            const firstItem = items?.getRecordById(movedKeys[0]);

            return new ItemsEntity({
                items: movedKeys,
                title: firstItem ? `${firstItem.get('title')}` : '',
            });
        },
        [items]
    );

    const currentTemplate = ITEM_RENDER[selectedTemplate].component;

    return (
        <div>
            <div style={{ margin: 20 }}>
                <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                    {Object.entries(ITEM_RENDER).map(([key, { label }]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
            <ScrollContainer style={{ width: '1100px', height: '700px' }}>
                <View
                    ref={viewRef}
                    storeId={STORE_ID}
                    onCustomdragStart={onDragStart}
                    onCustomdragEnd={onDragEnd}
                    imageProperty={'image'}
                    tileWidthProperty={'width'}
                    itemsDragNDrop={true}
                    imageSizeProperty={'imageSize'}
                    itemActionsVisibility={'onhover'}
                    onActionClick={onActionItemClick}
                    itemTemplate={currentTemplate}
                    itemActions={itemActions}
                    itemPadding={{ left: 'l', right: 'm', bottom: 'm', top: 'm' }}
                    roundBorder={{ br: 'm', bl: 'l', tl: 'l', tr: 'l' }}
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            [STORE_ID]: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    navigation: { sourceConfig: { pageSize: 19, hasMore: false }, source: 'page' },
                    keyProperty: 'id',
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});
