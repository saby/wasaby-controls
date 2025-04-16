import { ICompositeViewConfig, View } from 'Controls/expandedCompositeTree';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import { data } from '../source/data';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as React from 'react';
import { CollectionItem } from 'Controls/expandedCompositeTree';
import { Model } from 'Types/entity';
import TileSamsungTemplate from './TileSamsungTemplate';
import TileAppleTemplate from './TileAppleTemplate';

function getData() {
    return data;
}

function createDefaultConfig(): ICompositeViewConfig {
    return {
        imageProperty: 'image',
        nodesViewMode: 'tile',
        leavesViewMode: 'tile',
        contrastBackground: true,
        itemPadding: {
            // @ts-ignore
            top: 'xs',
            bottom: 'xs',
            left: 'xs',
            right: 'xs',
        },
        roundBorder: {
            tr: 's',
            tl: 's',
            br: 's',
            bl: 's',
        },
    };
}

function createTableConfig(item: CollectionItem<Model<any>>): ICompositeViewConfig {
    const baseConfig = createDefaultConfig();

    const tileWidth =
        item.getDisplayValue() === 'Apple' ? 175 : item.getDisplayValue() === 'Samsung' ? 500 : 200;

    const itemTemplate =
        item.getDisplayValue() === 'Apple'
            ? TileAppleTemplate
            : item.getDisplayValue() === 'Samsung'
            ? TileSamsungTemplate
            : null;

    return {
        ...baseConfig,
        itemTemplate,
        tileWidth,
    };
}

function Demo() {
    const [compositeViewConfig] = React.useState<ICompositeViewConfig>(createDefaultConfig());
    const configCallback = React.useCallback((item) => {
        return createTableConfig(item);
    }, []);

    return (
        <div className="ws-flexbox ws-flex-column engine-demo__Widgets_list controls-background-default controls-padding-xs controlsDemo_fixedWidth600">
            <div className="controls-padding_bottom-xs">
                <SearchInput storeId="CompositeTreeCallbackConfig" contrastBackground={true} />
            </div>
            <View
                storeId={'CompositeTreeCallbackConfig'}
                compositeViewConfig={compositeViewConfig}
                compositeNodesLevel={3}
                compositeViewConfigCallback={configCallback}
            />
        </div>
    );
}

export default Demo;

Demo.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        CompositeTreeCallbackConfig: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                searchParam: 'title',
                displayProperty: 'title',
                source: new ExpandedSource({
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    data: getData(),
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
            },
        },
    };
};
