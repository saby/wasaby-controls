import * as React from 'react';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';
import { View as OperationsPanelConnectedComponent } from 'Controls-ListEnv/operationsPanelConnected';
import { View as TreeGridView } from 'Controls/treeGrid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

function getData() {
    return Flat.getDataWithLongChildrenTitles();
}

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const gridRef = React.useRef<TreeGridView>(null);

    const columns: IColumn[] = React.useMemo(() => {
        return [
            {
                displayProperty: 'title',
                width: '',
            },
        ];
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <OperationsPanelConnectedComponent storeId="MoverBase" />
            <TreeGridView ref={gridRef} name="treeGrid" storeId="MoverBase" columns={columns} />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MoverBase: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        data: getData(),
                        useMemoryFilter: true,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'visible',
                    listActions: 'Controls-ListEnv-demo/WI/Mover/Base/listActions',
                    operationsPanelVisible: true,
                },
            },
        };
    },
});
