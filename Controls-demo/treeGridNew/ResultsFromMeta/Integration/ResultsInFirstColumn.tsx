import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { View as TreeGridView } from 'Controls/treeGrid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;
const header: IHeaderCell[] = Flat.getHeader();
const columns: IColumn[] = Flat.getColumns();

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <TreeGridView
                storeId="ResultsInFirstColumnStore"
                header={header}
                columns={columns}
                resultsPosition="top"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsInFirstColumnStore: {
                dataFactoryName:
                    'Controls-demo/treeGridNew/ResultsFromMeta/Integration/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
