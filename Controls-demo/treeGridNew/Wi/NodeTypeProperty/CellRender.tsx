import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, View as TreeGridView } from 'Controls/treeGrid';
import { ICellProps, TColspanCallbackResult, useItemData } from 'Controls/grid';
import { Money as MoneyDecorator } from 'Controls/baseDecorator';

import { data } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';

import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

function getData() {
    return data;
}

function CustomCellRender(props: { displayProperty: string }): React.ReactElement | null {
    const { renderValues } = useItemData(['nodeType', props.displayProperty]);
    return renderValues[props.displayProperty] ? (
        <MoneyDecorator
            value={renderValues[props.displayProperty]}
            fontColorStyle={renderValues.nodetype === 'group' ? 'group' : 'default'}
            useGrouping={false}
        />
    ) : null;
}

export const columns: IColumnConfig[] = [
    {
        width: '300px',
        displayProperty: 'title',
        groupNodeConfig: {
            textAlign: 'center',
        },
    },
    {
        width: '100px',
        displayProperty: 'count',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
    },
    {
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
        render: <CustomCellRender displayProperty="price" />,
    },
    {
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
        render: <CustomCellRender displayProperty="price1" />,
    },
    {
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
        render: <CustomCellRender displayProperty="price2" />,
    },
    {
        width: '50px',
        displayProperty: 'tax',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
    },
    {
        width: '100px',
        displayProperty: 'price3',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
                fontSize: 's',
            };
        },
        render: <CustomCellRender displayProperty="price3" />,
    },
];

function colspanCallback(
    item: Model,
    _column: IColumnConfig,
    columnIndex: number
): TColspanCallbackResult {
    if (item.get('nodeType') === 'group' && columnIndex === 0) {
        return 3;
    }
    return 1;
}

/**
 * Конфигурация иерархической таблицы с отображением узлов в виде группы и пользовательским рендером ячеек
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth500 controlsDemo_wrapper-treeGrid-base-treeGridView"
        >
            <TreeGridView
                storeId="NodeTypePropertyBase1"
                rowSeparatorSize="s"
                colspanCallback={colspanCallback}
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
            NodeTypePropertyBase1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [],
                    collapsedItems: [],
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    },
});
