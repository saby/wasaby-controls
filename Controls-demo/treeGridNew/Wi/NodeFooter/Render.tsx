import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IColumnConfig } from 'Controls/grid';
import { View as TreeGridView, INodeFooterConfig } from 'Controls/treeGrid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import MultiNavigationMemory from 'Controls-demo/DemoData/MultiNavigationMemory';

const columns: IColumnConfig[] = [
    { displayProperty: 'title' },
    { displayProperty: 'rating' },
    { displayProperty: 'country' },
];

const nodeFooter: INodeFooterConfig[] = [
    { key: 'node-footer-title', render: <i>Node footer cell</i> },
    { key: 'node-footer-rating', render: <i>Node footer cell</i> },
    { key: 'node-footer-country', render: <i>Node footer cell</i> },
];

/**
 * Конфигурация подала развёрнутого узла в иерархической таблице
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            <TreeGridView storeId="NodeFooterRender" columns={columns} nodeFooter={nodeFooter} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeFooterRender: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new MultiNavigationMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: Flat.getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    deepReload: true,
                    nodeProperty: 'type',
                    expandedItems: [2, 3],
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                            multiNavigation: true,
                        },
                        viewConfig: {
                            buttonView: 'separator',
                            buttonConfig: {
                                buttonPosition: 'start',
                            },
                        },
                    },
                },
            },
        };
    },
});
