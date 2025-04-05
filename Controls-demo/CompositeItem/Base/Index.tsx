import { ICompositeViewConfig, View } from 'Controls/expandedCompositeTree';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import { data } from '../source/data';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as React from 'react';

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

function Demo() {
    const [compositeViewConfig] = React.useState<ICompositeViewConfig>(createDefaultConfig());

    return (
        <div className="ws-flexbox ws-flex-column engine-demo__Widgets_list controls-background-default controls-padding-xs tw-w-full">
            <div className="controls-padding_bottom-xs">
                <SearchInput storeId="CompositeTreeBase" contrastBackground={true} />
            </div>
            <View
                storeId={'CompositeTreeBase'}
                compositeViewConfig={compositeViewConfig}
                compositeNodesLevel={3}
            />
        </div>
    );
}

export default Demo;

Demo.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        CompositeTreeBase: {
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
