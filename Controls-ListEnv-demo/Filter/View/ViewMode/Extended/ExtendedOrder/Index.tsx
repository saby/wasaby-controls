import * as React from 'react';
import { IColumn, IHeaderCell, View as GridView } from 'Controls/grid';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { Memory } from 'Types/source';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from 'Controls-ListEnv-demo/Filter/View/ViewMode/Extended/DataFilter';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';

const columns: IColumn[] = [
    {
        displayProperty: 'department',
    },
    {
        displayProperty: 'owner',
    },
    {
        displayProperty: 'salary',
    },
    {
        displayProperty: 'city',
    },
    {
        displayProperty: 'date',
    },
];

const header: IHeaderCell[] = [
    { caption: 'Отдел' },
    { caption: 'Руководитель' },
    { caption: 'Зарплата' },
    { caption: 'Город' },
    { caption: 'Дата' },
];

const textConfig = {
    caption: 'Разработка',
    name: 'isDevelopment',
    editorTemplateName: 'Controls/filterPanelEditors:Boolean',
    resetValue: false,
    textValue: '',
    viewMode: 'extended',
    value: false,
    editorOptions: {
        filterValue: true,
        extendedCaption: 'Разработка',
    },
    extendedOrder: 2,
} as IFilterItem;

const dropdownConfig: IFilterItem = {
    name: 'capitalAllFrequent',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                { id: 0, title: 'Оплачены' },
                { id: 1, title: 'Не оплачены' },
                { id: 2, title: 'Частично оплачены' },
            ],
            keyProperty: 'id',
        }),
        frequentItems: [
            {
                id: 0,
                title: 'Оплачены',
            },
            {
                id: 1,
                title: 'Нет',
            },
            {
                id: 2,
                title: 'Частично',
            },
        ],
        extendedCaption: 'Оплата',
        extendedOrder: 1,
        displayProperty: 'title',
        keyProperty: 'id',
    },
};

const ExtendedOrderDemo = React.forwardRef((_, ref) => {
    return (
        <div ref={ref}>
            <FilterView storeId="extendedData" alignment="left" />
            <GridView
                storeId="extendedData"
                columns={columns}
                header={header}
                className="engine-demo__Widgets_filterList"
            />
        </div>
    );
});

ExtendedOrderDemo.getLoadConfig = () => {
    return {
        extendedData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: sourceData,
                    keyProperty: 'department',
                    filter,
                }),
                root: null,
                historyId: 'ViewMode-Extended__HistoryId',
                keyProperty: 'department',
                displayProperty: 'title',
                filterDescription: [textConfig, dropdownConfig],
            },
        },
    };
};

export default ExtendedOrderDemo;
