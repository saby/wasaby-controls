import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { View } from 'Controls/treeTile';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';

function getData() {
    const items = Gadgets.getPreviewItems();
    items.splice(0, 0, items.pop());
    return items;
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <View
                storeId={'nodesAfterLeaf'}
                tileMode="static"
                tileHeight={200}
                nodesHeight={200}
                tileScalingMode="none"
                itemTemplate={'Controls/tile:PreviewTemplate'}
                imageProperty="image"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            nodesAfterLeaf: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    },
});
