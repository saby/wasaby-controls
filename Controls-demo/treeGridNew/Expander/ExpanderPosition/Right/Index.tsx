import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IColumnConfig } from 'Controls/grid';

import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

const columns: IColumnConfig[] = Flat.getColumns();

/**
 * Конфигурация иерархической таблицы с кнопкой разворота узлов справа
 * @param props
 * @param ref
 * @constructor
 */
function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <TreeGridView
                storeId="ExpanderPositionRight"
                columns={columns}
                expanderPosition="right"
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
            ExpanderPositionRight: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    expandedItems: [null],
                    collapsedItems: [12],
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
