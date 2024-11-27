import * as React from 'react';
import 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments } from 'Controls/dataFactory';
import { ControlPanel } from './ControlPanel/ControlPanel';
import { TBackgroundStyle } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/BackgroundColorStyle';
import ChangableWidthCell from 'Controls-demo/treeGridNew/ItemOptions/Integration/CellRender/ChangableWidthCell';

function getData() {
    return [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            population: 143420300,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 1,
            number: 2,
            country: 'Канада',
            population: 32805000,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 2,
            number: 3,
            country: 'Соединенные Штаты Америки',
            population: 295734100,
            parent: 7,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 3,
            number: 4,
            country: 'Китай',
            population: 1306313800,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 4,
            number: 5,
            country: 'Бразилия',
            population: 186112800,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 5,
            number: 6,
            country: 'Австралия',
            population: 20090400,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 6,
            number: 7,
            country: 'Индия',
            population: 1080264400,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 7,
            number: 8,
            country: 'Аргентина',
            population: 39537900,
            parent: null,
            'Раздел@': true,
            hasChild: true,
        },
        {
            key: 12,
            country: 'Перемещаемый узел',
            parent: null,
            'Раздел@': null,
            hasChild: false,
        },
    ];
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [firstColumnWidth, setFirstColumnWidth] = React.useState(200);
    const [backgroundColor, setBackgroundColor] = React.useState<TBackgroundStyle>('default');
    const columns = [
        {
            render: <ChangableWidthCell />,
            width: `${firstColumnWidth}px`,
            key: 'country',
            displayProperty: 'country',
            getCellProps: () => ({
                backgroundColorStyle: backgroundColor,
            }),
        },
        {
            width: '100px',
            key: 'key',
            displayProperty: 'key',
            getCellProps: () => ({
                backgroundColorStyle: backgroundColor,
            }),
        },
    ];
    const headers = [
        {
            width: `${firstColumnWidth}px`,
            key: 'countryHeader',
            caption: 'Страна',
        },
        {
            width: '100px',
            key: 'key',
            caption: 'Ключ',
        },
    ];

    return (
        <div
            ref={ref}
            style={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}
            data-qa="controlsDemo_gridReact_ItemOptionsContainer"
        >
            <div
                className={'controlsDemo__wrapper'}
                data-qa="controlsDemo_gridReact_ItemOptionsGrid"
            >
                <TreeGridView
                    storeId="GridOptionsController"
                    columns={columns}
                    header={headers}
                    rowSeparatorSize="s"
                />
            </div>
            <ControlPanel
                columnWidth={firstColumnWidth}
                onColumnWidthChange={setFirstColumnWidth}
                backgroundColor={backgroundColor}
                onBackgroundColorChange={setBackgroundColor}
                data-qa="controlsDemo_gridReact_ItemOptionsPanel"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GridOptionsController: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    expandedItems: [0, 1, 2, 3, 7],
                    displayProperty: 'title',
                    parentProperty: 'parent',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    },
});
