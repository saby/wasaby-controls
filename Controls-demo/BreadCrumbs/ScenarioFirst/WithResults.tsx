import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Label } from 'Controls/input';
import { View as ExplorerView } from 'Controls/explorer';
import { lists } from './data';

const { columns, header } = lists[2];

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="demo-BreadCrumbs__example controlsDemo-BreadCrumbs__withTotal">
            <div>
                <Label caption='Со строкой "Итого"' />
            </div>
            <ExplorerView
                storeId="BreadCrumbsScenarioFirst2"
                showActionButton={true}
                rowSeparatorSize="s"
                columns={columns}
                header={header}
                resultsPosition="top"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BreadCrumbsScenarioFirst2: {
                dataFactoryName: 'Controls-demo/BreadCrumbs/ScenarioFirst/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'department',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[2].data,
                    }),
                    root: 21111,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    },
});
