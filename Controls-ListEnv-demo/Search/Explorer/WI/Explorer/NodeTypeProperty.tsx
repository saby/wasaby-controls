import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, IRowProps } from 'Controls/treeGrid';
import { View as ExplorerView } from 'Controls/explorer';
import { ICellProps, TColspanCallbackResult } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Input as SearchInputConected } from 'Controls-ListEnv/searchConnected';
import { IItemAction } from 'Controls/interface';

import { data } from 'Controls-ListEnv-demo/Search/Explorer/NodeTypeProperty/data/NodeTypePropertyData';

import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

function getData() {
    return data;
}

export const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
        width: '300px',
        groupNodeConfig: {
            textAlign: 'center',
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
        return 3;
    }
    return 1;
}

function getRowProps(item: Model): IRowProps {
    return {
        hoverBackgroundStyle: item.get('groupNode') === 'group' ? 'transparent' : 'default',
    };
}

const itemActions: IItemAction[] = [
    {
        id: 0,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'delete pls',
        showType: 0,
    },
];

/**
 * Конфигурация иерархической таблицы с отображением узлов в виде группы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const explorerRef = React.useRef<ExplorerView>(null);
    const onActionClick = React.useCallback(
        (action: IItemAction, item: Model) => {
            switch (action.id) {
                case 'delete':
                    explorerRef.current?.removeItems({
                        selected: [item.getKey()],
                        excluded: [],
                    });
            }
        },
        [explorerRef]
    );
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <SearchInputConected storeId="NodeTypePropertyDeepReload" />
            <ScrollContainer className="controlsDemo__height150">
                <ExplorerView
                    storeId="NodeTypePropertyDeepReload"
                    searchNavigationMode="expand"
                    className="demo-Explorer ControlsDemo-Explorer"
                    stickyGroup={false}
                    itemActions={itemActions}
                    onActionClick={onActionClick}
                    colspanCallback={colspanCallback}
                    columns={columns}
                    getRowProps={getRowProps}
                />
            </ScrollContainer>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyDeepReload: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                        useMemoryFilter: true,
                    }),
                    root: null,
                    viewMode: 'table',
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    searchParam: 'title',
                    minSearchLength: 3,
                    expandedItems: [1, 2, 3],
                    deepReload: true,
                    searchNavigationMode: 'expand',
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    },
});
