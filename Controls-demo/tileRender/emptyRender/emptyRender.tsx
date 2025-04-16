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
    return [];
}

function EmptyRenderComponent() {
    return <div>empty_render</div>;
}

function Demo(_: {}, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const viewRef = React.useRef<TreeGrid>(null);

    return (
        <div>
            <ScrollContainer style={{ width: '1100px', height: '700px' }}>
                <View
                    ref={viewRef}
                    storeId={'TileRenderEmptyDemo'}
                    _isReactView={true}
                    emptyRender={<EmptyRenderComponent />}
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ['TileRenderEmptyDemo']: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: getData(),
                    }),
                },
            },
        };
    },
});
