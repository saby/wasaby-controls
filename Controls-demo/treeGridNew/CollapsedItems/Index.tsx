import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IColumnConfig } from 'Controls/grid';

import ExpandedSource from '../DemoHelpers/ExpandedSource';

function getData() {
    return [
        {
            key: 1,
            title: 'Node',
            Раздел: null,
            'Раздел@': true,
            Раздел$: null,
            hasChild: true,
        },
        {
            key: 11,
            title: 'Node',
            Раздел: 1,
            'Раздел@': true,
            Раздел$: null,
        },
        {
            key: 111,
            title: 'Leaf',
            Раздел: 11,
            'Раздел@': null,
            Раздел$: null,
        },
        {
            key: 12,
            title: 'Hidden node',
            Раздел: 1,
            'Раздел@': false,
            Раздел$: true,
            hasChild: false,
        },
        {
            key: 13,
            title: 'Leaf',
            Раздел: 1,
            'Раздел@': null,
            Раздел$: null,
        },
        {
            key: 2,
            title: 'Node 2',
            Раздел: null,
            'Раздел@': true,
            Раздел$: null,
            hasChild: true,
        },
        {
            key: 21,
            title: 'Leaf 21',
            Раздел: 2,
            'Раздел@': null,
            Раздел$: null,
        },
        {
            key: 3,
            title: 'Node 3',
            Раздел: null,
            'Раздел@': true,
            Раздел$: null,
            hasChild: false,
        },
        {
            key: 31,
            title: 'Leaf 31',
            Раздел: 3,
            'Раздел@': null,
            Раздел$: null,
        },
    ];
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
    },
];

/**
 * Пример сворачивания узла при инициализации иерархической таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-expandedItems"
        >
            <TreeGridView storeId="CollapsedItems" columns={columns} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            CollapsedItems: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'Раздел',
                    }),
                    collapsedItems: [1],
                    expandedItems: [null],
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    },
});
