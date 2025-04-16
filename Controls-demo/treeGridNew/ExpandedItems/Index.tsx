import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IColumnConfig } from 'Controls/grid';

import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';

const { getData } = Gadgets;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
    },
];

/**
 * Пример разворачивания узла при инициализации иерархической таблицы
 * @param props
 * @param ref
 * @constructor
 */
function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className={`${props.className} controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-expandedItems`}
        >
            <TreeGridView storeId="ExpandedItems" columns={columns} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ExpandedItems: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    expandedItems: [1],
                },
            },
        };
    },
});
