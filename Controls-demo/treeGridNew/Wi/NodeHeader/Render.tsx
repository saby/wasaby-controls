import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IColumnConfig } from 'Controls/grid';
import { View as TreeGridView, INodeFooterConfig } from 'Controls/treeGrid';
import { HierarchicalMemory } from 'Types/source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const columns: IColumnConfig[] = [
    { displayProperty: 'title' },
    { displayProperty: 'rating' },
    { displayProperty: 'country' },
];

const nodeHeader: INodeFooterConfig[] = [
    { key: 'node-header-title', render: <i>Node header cell</i> },
    { key: 'node-header-rating', render: <i>Node header cell</i> },
    { key: 'node-header-country', render: <i>Node header cell</i> },
];

/**
 * Конфигурация строки шапки развёрнутого узла в иерархической таблице
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            <TreeGridView storeId="NodeHeaderRender" columns={columns} nodeHeader={nodeHeader} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeHeaderRender: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: Flat.getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            buttonView: 'separator',
                            buttonConfig: {
                                buttonPosition: 'start',
                            },
                        },
                    },
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [2, 3],
                },
            },
        };
    },
});
