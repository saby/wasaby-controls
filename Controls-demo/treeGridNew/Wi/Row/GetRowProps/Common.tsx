import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView, IRowProps } from 'Controls/treeGrid';
import { IColumnConfig } from 'Controls/grid';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

const columns: IColumnConfig[] = Flat.getColumns();

function getRowProps(): IRowProps {
    return {
        cursor: 'default',
        hoverBackgroundStyle: 'transparent',
        expanderIcon: 'hiddenNode'
    };
}

/**
 * Конфигурация строк иерархической таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <TreeGridView
                storeId="ItemTemplateNoClickable"
                columns={columns}
                getRowProps={getRowProps}
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
            ItemTemplateNoClickable: {
                dataFactoryName: 'Controls/dataFactory:List',
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
