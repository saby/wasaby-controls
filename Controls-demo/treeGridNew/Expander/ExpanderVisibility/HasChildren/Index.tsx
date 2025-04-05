import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IColumnConfig } from 'Controls/grid';

import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';

const { getData } = Gadgets;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
    },
];

/**
 * Конфигурация иерархической таблицы, у которой кнопка разворота узла видима только у узлов с дочерними элементами
 * @param props
 * @param ref
 * @constructor
 */
function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-reverseType-byItemClick';
    return (
        <div className={rootClass} ref={ref}>
            <TreeGridView
                storeId="ExpanderVisibilityHasChildren"
                expanderVisibility="hasChildren"
                columns={columns}
            />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ExpanderVisibilityHasChildren: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'Раздел',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    hasChildrenProperty: 'hasChild',
                    expandedItems: [null],
                },
            },
        };
    },
});
