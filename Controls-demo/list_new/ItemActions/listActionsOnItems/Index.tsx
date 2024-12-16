import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { View as TreeGridView } from 'Controls/treeGrid';
import { TColumns } from 'Controls/gridDisplay';
import { default as TreeData } from 'Controls-ListEnv-demo/OperationsPanel/View/resources/TreeData';
import listActions from './listActions';

const columns: TColumns = [
    {
        displayProperty: 'title',
    },
    {
        displayProperty: 'parent',
    },
];

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref}>
            <TreeGridView
                columns={columns}
                itemActions={listActions}
                storeId="listActionsOnItems"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig() {
        return {
            listActionsOnItems: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'id',
                    nodeProperty: 'parent@',
                    parentProperty: 'parent',
                    source: new HierarchicalMemory({
                        data: TreeData,
                        keyProperty: 'id',
                    }),
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});
