import * as React from 'react';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { RecordSet } from 'Types/collection';

const headerContentTemplate =
    'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/headerContentTemplate';

const dateMenuItems = new RecordSet({
    rawData: [
        { id: 'Today', title: 'Сегодня', value: [new Date(2022, 0, 7)] },
        {
            id: 'Year',
            title: 'В этом году',
            value: [new Date(2022, 0, 1), new Date(2022, 0, 7)],
        },
        {
            id: 'LastYear',
            title: 'В прошлом году',
            value: [new Date(2021, 0, 1), new Date(2021, 0, 30)],
        },
    ],
    keyProperty: 'id',
});

const simpleBasicDateMenuConfig = {
    caption: 'Дата доставки',
    name: 'dateEditorToBasic',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    textValue: '',
    resetValue: null,
    viewMode: 'basic',
    value: null,
    emptyText: 'Весь период',
    editorOptions: {
        closeButtonVisibility: 'hidden',
        dateMenuItems,
        selectionType: 'single',
    },
} as IFilterItem;

const simpleDateMenuConfig = {
    caption: 'Дата доставки',
    name: 'dateEditorTo',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    textValue: '',
    resetValue: null,
    viewMode: 'extended',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        extendedCaption: 'Срок доставки',
        dateMenuItems,
        selectionType: 'single',
    },
} as IFilterItem;

const dateMenuConfig = {
    caption: 'Дата оформления',
    name: 'dateEditorFrom',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        items: dateMenuItems,
        headerContentTemplate,
        extendedCaption: 'Дата оформления',
    },
} as IFilterItem;

const dateMenuBasicConfig = {
    caption: 'Дата оформления',
    name: 'dateEditorFromBasic',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'basic',
    textValue: '',
    value: [new Date(2020, 0, 1), new Date(2022, 0, 1)],
    editorOptions: {
        closeButtonVisibility: 'hidden',
        items: dateMenuItems,
        headerContentTemplate,
        extendedCaption: 'Дата оформления',
    },
} as IFilterItem;

const dateMenuFrequentConfig = {
    caption: 'Срок',
    name: 'dateEditorTerm',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        itemTemplate: 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/ItemTpl',
        items: new RecordSet({
            rawData: [
                { id: 'Today', title: 'Сегодня' },
                {
                    id: 'Week',
                    title: 'На этой неделе',
                },
                {
                    id: 'Month',
                    title: 'В этом месяце',
                    comment: "январь'24",
                },
                {
                    id: 'Year',
                    title: 'В этом году',
                    comment: '2024',
                },
                {
                    id: 'Overdue',
                    title: 'Просроченные',
                    value: false,
                    frequent: true,
                },
            ],
            keyProperty: 'id',
        }),
        editorMode: 'Lite',
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Срок',
    },
} as IFilterItem;

const dateMenuWithoutPeriodConfig = {
    caption: 'Без выбора периода',
    name: 'dateEditorWithoutPeriod',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        items: new RecordSet({
            rawData: [
                { id: 'Today', title: 'Сегодня', value: new Date(2018, 0, 7) },
                {
                    id: 'Week',
                    title: 'На этой неделе',
                    value: [new Date(2018, 0, 1), new Date(2018, 0, 7)],
                },
                {
                    id: 'Month',
                    title: 'В этом месяце',
                    value: [new Date(2018, 0, 1), new Date(2018, 0, 30)],
                },
            ],
            keyProperty: 'id',
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Без выбора периода',
        periodItemVisible: false,
    },
} as IFilterItem;

const DateMenuItemsDemo = React.forwardRef((props, ref) => {
    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <FilterView storeId="dateMenuData" detailPanelWidth="g" />
        </div>
    );
});

DateMenuItemsDemo.getLoadConfig = function () {
    return {
        dateMenuData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                historyId: 'DEMO_FILTER_VIEW_DATE_MENU_ITEMS_HISTORY_ID',
                displayProperty: 'title',
                filterDescription: [
                    simpleBasicDateMenuConfig,
                    simpleDateMenuConfig,
                    dateMenuConfig,
                    dateMenuFrequentConfig,
                    dateMenuWithoutPeriodConfig,
                ],
            },
        },
    };
};

export default DateMenuItemsDemo;
