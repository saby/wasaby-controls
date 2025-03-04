import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView, ExpanderConnectedComponent } from 'Controls/treeGrid';
import { IColumnConfig, useItemData } from 'Controls/grid';

import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

function CustomRenderWithExpander(): React.ReactElement {
    const {
        renderValues: { title },
    } = useItemData(['title']);
    return (
        <>
            <span>{title}</span>
            <ExpanderConnectedComponent />
        </>
    );
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
        render: <CustomRenderWithExpander />,
    },
    {
        displayProperty: 'rating',
    },
    {
        displayProperty: 'country',
    },
];

/**
 * Конфигурация иерархической таблицы с пользовательским размещением кнопки разворота узла
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <TreeGridView
                storeId="ExpanderPositionCustom"
                columns={columns}
                expanderIcon="emptyNode"
                expanderPosition="custom"
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
            ExpanderPositionCustom: {
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
