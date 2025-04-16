import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, IRowProps, View as TreeGridView } from 'Controls/treeGrid';
import { ICellProps, TColspanCallbackResult } from 'Controls/grid';

import { data } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';

import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

function getData() {
    return data;
}

export const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
        width: '300px',
        groupNodeConfig: {
            textAlign: 'right',
            iconStyle: 'secondary',
            textTransform: 'uppercase',
        },
    },
    {
        displayProperty: 'count',
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
    },
    {
        displayProperty: 'price',
        displayType: 'money',
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
        groupNodeConfig: {
            textVisible: false,
        },
    },
    {
        displayProperty: 'price1',
        displayType: 'money',
        width: '100px',
        getCellProps(item: Model): ICellProps {
            return {
                halign: 'right',
                fontColorStyle: item.get?.('groupNode') === 'group' ? 'group' : 'default',
            };
        },
    },
    {
        displayProperty: 'price2',
        displayType: 'money',
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
    },
    {
        displayProperty: 'tax',
        width: '50px',
        getCellProps(item: Model): ICellProps {
            return {
                halign: 'right',
                fontColorStyle: item.get?.('groupNode') === 'group' ? 'group' : 'default',
            };
        },
    },
    {
        displayProperty: 'price3',
        displayType: 'money',
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
                fontSize: 's',
            };
        },
    },
];

function colspanCallback(
    item: Model,
    _column: IColumnConfig,
    columnIndex: number
): TColspanCallbackResult {
    if (item.get('nodeType') === 'group' && columnIndex === 0) {
        return 2;
    }
    return 1;
}

function getRowProps(item: Model): IRowProps {
    return {
        hoverBackgroundStyle: item.get('groupNode') === 'group' ? 'transparent' : 'default',
    };
}

/**
 * Конфигурация иерархической таблицы с отображением узлов в виде группы
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
                storeId="NodeTypePropertyAlignedByColumn0"
                rowSeparatorSize="s"
                colspanCallback={colspanCallback}
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
            NodeTypePropertyAlignedByColumn0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    expandedItems: [null],
                    collapsedItems: [],
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    },
});
